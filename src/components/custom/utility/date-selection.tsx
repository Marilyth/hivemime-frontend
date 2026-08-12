import { FilterQuery, FilterQueryGroup, SubProperty, ValueOperator } from "@/lib/Api";
import { QuadBoolean } from "@/lib/quad-bool";
import { lowerBound } from "@/lib/utils";
import { QueryEvaluation, queryToBalancedAST } from "@/lib/vote-query";
import { makeAutoObservable } from "mobx";

export enum CalendarScope {
  Minute,
  FiveMinutes,
  FifteenMinutes,
  Hour,
  Day,
  Month,
  Year
}

export enum Animation {
  SlideLeft,
  SlideRight,
  ZoomIn,
  ZoomOut
}

export enum Variant {
  Edit = "edit",
  Result = "result"
}

export class DateSelection {
  // Note that this must be ordered at all times.
  dates: { date: Date, value: number }[] = [];

  currentDate: Date = new Date();
  maxDates: number;
  currentScope: CalendarScope = CalendarScope.Day;
  minScope: CalendarScope;
  animation: Animation = Animation.ZoomIn;
  variant: Variant;
  filter?: FilterQueryGroup | FilterQuery | undefined | null;

  private validityCache: Map<string, boolean> = new Map();
  private cachedFilterSignature: string | null = null;
  private evaluationTree: QueryEvaluation | undefined;

  constructor(minScope: CalendarScope,
    maxDates: number,
    filter?: FilterQueryGroup | FilterQuery | undefined | null,
    initialDates: { date: Date, value: number }[] = [],
    variant: Variant = Variant.Edit) {
    this.maxDates = maxDates;
    this.minScope = minScope;
    this.variant = variant;
    this.filter = filter;
    this.dates = initialDates.toSorted((a, b) => a.date.getTime() - b.date.getTime());
    this.currentScope = Math.max(this.minScope, CalendarScope.Day);
    
    makeAutoObservable(this);
  }

  public get yearBounds() {
    return this.getBoundsForScope(CalendarScope.Year);
  }

  public get monthBounds() {
    return this.getBoundsForScope(CalendarScope.Month);
  }

  public get dayBounds() {
    return this.getBoundsForScope(CalendarScope.Day);
  }

  public get hourBounds() {
    return this.getBoundsForScope(CalendarScope.Hour);
  }

  public get fifteenMinuteBounds() {
    return this.getBoundsForScope(CalendarScope.FifteenMinutes);
  }

  public get fiveMinuteBounds() {
    return this.getBoundsForScope(CalendarScope.FiveMinutes);
  }

  public get minuteBounds() {
    return this.getBoundsForScope(CalendarScope.Minute);
  }

  public get currentScopeBounds() {
    return this.getBoundsForScope(this.currentScope);
  }

  public get activeCount() {
    return this.dates.filter(d => d.value > 0).length;
  }

  public get headerText() {
    switch (this.currentScope) {
      case CalendarScope.Year:
        const startYear = this.currentDate.getFullYear() - (this.currentDate.getFullYear() % 25);
        return `${startYear} - ${startYear + 24}`;
      case CalendarScope.Month:
        return this.getScopedDateLocale(this.currentDate, CalendarScope.Year);
      case CalendarScope.Day:
        return this.getScopedDateLocale(this.currentDate, CalendarScope.Month);
      case CalendarScope.Hour:
        return this.getScopedDateLocale(this.currentDate, CalendarScope.Day);
      case CalendarScope.FifteenMinutes:
      case CalendarScope.FiveMinutes:
      case CalendarScope.Minute:
        return this.getScopedDateLocale(this.currentDate, CalendarScope.Hour);
    }
  }

  confirm() {
    if (this.currentScope > this.minScope) {
      this.drill(-1);
      return;
    }

    // In result view, values cannot be added to the dates.
    if (this.variant === Variant.Result)
      return;

    // Select the date if we are at the max scope.
    const scopedDate = this.getScopedDate(this.currentDate, this.currentScope);
    const index = this.dates.findIndex(d => d.date.getTime() === scopedDate.getTime());

    if (index === -1) {
      if (this.activeCount >= this.maxDates)
        return;

      const insertIndex = lowerBound(this.dates, { date: scopedDate, value: 0 }, (a, b) => a.date.getTime() - b.date.getTime());
      this.dates.splice(insertIndex, 0, { date: scopedDate, value: 1 });
    } else {
      this.dates.splice(index, 1);
    }
  }

  slide(delta: number) {
    this.animation = delta > 0 ? Animation.SlideLeft : Animation.SlideRight;

    switch (this.currentScope) {
      case CalendarScope.Year:
        this.currentDate = new Date(this.currentDate.setFullYear(this.currentDate.getFullYear() + 25 * delta));
        break;
      case CalendarScope.Month:
        this.currentDate = new Date(this.currentDate.setFullYear(this.currentDate.getFullYear() + delta));
        break;
      case CalendarScope.Day:
        this.currentDate = new Date(this.currentDate.setMonth(this.currentDate.getMonth() + delta));
        break;
      case CalendarScope.Hour:
        this.currentDate = new Date(this.currentDate.setDate(this.currentDate.getDate() + delta));
        break;
      case CalendarScope.FifteenMinutes:
      case CalendarScope.FiveMinutes:
      case CalendarScope.Minute:
        this.currentDate = new Date(this.currentDate.setHours(this.currentDate.getHours() + delta));
        break;
    }
  }

  drill(delta: number) {
    let newScope = Math.min(Math.max(this.currentScope + delta, this.minScope), CalendarScope.Year);

    if (newScope <= CalendarScope.FifteenMinutes)
      newScope = delta > 0 ? CalendarScope.Hour : this.minScope;

    if (newScope !== this.currentScope) {
      this.animation = delta > 0 ? Animation.ZoomOut : Animation.ZoomIn;
      this.currentScope = newScope;
    }
  }

  private get filterSignature(): string {
    return this.filter ? JSON.stringify(this.filter) : "";
  }

  private ensureFilterCache(): void {
    const signature = this.filterSignature;

    if (signature === this.cachedFilterSignature)
      return;

    const copiedAST = queryToBalancedAST(JSON.parse(JSON.stringify(this.filter!)));
    this.evaluationTree = new QueryEvaluation(copiedAST);
    this.validityCache.clear();
    this.cachedFilterSignature = signature;
  }

  isRangeValid(date: Date, scope: CalendarScope): boolean {
    if (!this.filter)
      return true;

    this.ensureFilterCache();

    const key = `${date.getTime()}:${scope}`;
    const cached = this.validityCache.get(key);

    if (cached !== undefined)
      return cached;

    const {start, end} = this.getScopedDateRange(date, scope);

    const state = this.evaluationTree!.getDeepEvaluationState((filter) => {
      console.log("Miss");
      const operator = filter.valueOperator!;
      const numValue: number = Number(filter.value!);
      const subvalue: SubProperty = filter.subProperty ?? SubProperty.Date;
      let currentValue: number = 0;

      switch(subvalue) {
        case SubProperty.Date:
          const dateValue = new Date(numValue);

          switch(operator){
            case ValueOperator.Equals:
              return dateValue >= start && dateValue <= end ? QuadBoolean.Partially : QuadBoolean.No;
            case ValueOperator.GreaterEquals:
              return start >= dateValue ? QuadBoolean.Yes : end >= dateValue ? QuadBoolean.Partially : QuadBoolean.No;
            case ValueOperator.Greater:
              return start > dateValue ? QuadBoolean.Yes : end > dateValue ? QuadBoolean.Partially : QuadBoolean.No;
            case ValueOperator.LessEquals:
              return end <= dateValue ? QuadBoolean.Yes : start <= dateValue ? QuadBoolean.Partially : QuadBoolean.No;
            case ValueOperator.Less:
              return end < dateValue ? QuadBoolean.Yes : start < dateValue ? QuadBoolean.Partially : QuadBoolean.No;
          }
        case SubProperty.Month:
          if (scope > CalendarScope.Month)
            return QuadBoolean.Partially;

          currentValue = date.getMonth() + 1;
          break;
        case SubProperty.DayOfMonth:
          // Days over 28 need to drill down to be sure.
          if (scope > CalendarScope.Day)
            return numValue >= 28 ? QuadBoolean.Maybe : QuadBoolean.Partially;
          
          currentValue = date.getDate();
          break;
        case SubProperty.DayOfWeek:
          // Day of week should always drill down since it highly depends on other conditions.
          if (scope > CalendarScope.Day)
            return QuadBoolean.Maybe;
          
          currentValue = date.getDay();
          break;
        case SubProperty.Hour:
          if (scope > CalendarScope.Hour)
            return QuadBoolean.Partially;
          
          currentValue = date.getHours();
          break;
        case SubProperty.Minute:
          if (scope > CalendarScope.FifteenMinutes)
            return QuadBoolean.Partially;
          
          currentValue = date.getMinutes();
          break;
      }

      switch(operator){
        case ValueOperator.Equals:
          return currentValue === numValue ? QuadBoolean.Yes : QuadBoolean.No;
        case ValueOperator.GreaterEquals:
          return currentValue >= numValue ? QuadBoolean.Yes : QuadBoolean.No;
        case ValueOperator.Greater:
          return currentValue > numValue ? QuadBoolean.Yes : QuadBoolean.No;
        case ValueOperator.LessEquals:
          return currentValue <= numValue ? QuadBoolean.Yes : QuadBoolean.No;
        case ValueOperator.Less:
          return currentValue < numValue ? QuadBoolean.Yes : QuadBoolean.No;
      }
    });

    if (state !== QuadBoolean.Maybe || scope === CalendarScope.Minute) {
      const result = state === QuadBoolean.Yes || state === QuadBoolean.Partially;
      this.validityCache.set(key, result);
      return result;
    }

    let runningDate = start;
    while (runningDate <= end) {
      runningDate = this.incrementDate(runningDate, scope - 1, 1);

      if (this.isRangeValid(runningDate, scope - 1)) {
        this.validityCache.set(key, true);
        return true;
      }
    }

    this.validityCache.set(key, false);
    return false;
  }

  sumScopedRange(date: Date, scope: CalendarScope): number {
    const { start, end } = this.getScopedDateRange(date, scope);
    
    const startIndex = lowerBound(this.dates, { date: start, value: 0 }, (a, b) => a.date.getTime() - b.date.getTime());
    let sum = 0;

    for (let i = startIndex; i < this.dates.length && this.dates[i].date <= end; i++)
      sum += this.dates[i].value;

    return sum;
  }

  getScopedDateLocale(date: Date, scope: CalendarScope): string {
    date = this.getScopedDate(date, scope);

    switch (scope) {
      case CalendarScope.Year:
        return date.toLocaleString("default", { year: "numeric" });
      case CalendarScope.Month:
        return date.toLocaleString("default", { month: "long", year: "numeric" });
      case CalendarScope.Day:
        return date.toLocaleString("default", { month: "short", day: "numeric", year: "numeric" });
      case CalendarScope.Hour:
        return date.toLocaleString("default", { month: "short", day: "numeric", year: "numeric", hour: "numeric" });
      case CalendarScope.FifteenMinutes:
      case CalendarScope.FiveMinutes:
      case CalendarScope.Minute:
        return date.toLocaleString("default", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "numeric" });
    }
  }

  getScopedDate(date: Date, scope: CalendarScope): Date {
    switch (scope) {
      case CalendarScope.Year:
        return new Date(date.getFullYear(), 0, 1);
      case CalendarScope.Month:
        return new Date(date.getFullYear(), date.getMonth(), 1);
      case CalendarScope.Day:
        return new Date(date.getFullYear(), date.getMonth(), date.getDate());
      case CalendarScope.Hour:
        return new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours());
      case CalendarScope.FifteenMinutes:
        const minutes = Math.floor(date.getMinutes() / 15) * 15;
        return new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), minutes);
      case CalendarScope.FiveMinutes:
        const fiveMinuteBlock = Math.floor(date.getMinutes() / 5) * 5;
        return new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), fiveMinuteBlock);
      case CalendarScope.Minute:
        return new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes());
    }
  }

  private getScopedDateRange(date: Date, scope: CalendarScope): { start: Date, end: Date } {
    const start = this.getScopedDate(date, scope);
    const end = this.getScopedDate(date, scope);

    switch (scope) {
      case CalendarScope.Year:
        end.setFullYear(end.getFullYear() + 1);
        break;
      case CalendarScope.Month:
        end.setMonth(end.getMonth() + 1);
        break;
      case CalendarScope.Day:
        end.setDate(end.getDate() + 1);
        break;
      case CalendarScope.Hour:
        end.setHours(end.getHours() + 1);
        break;
      case CalendarScope.FifteenMinutes:
        end.setMinutes(end.getMinutes() + 15);
        break;
      case CalendarScope.FiveMinutes:
        end.setMinutes(end.getMinutes() + 5);
        break;
      case CalendarScope.Minute:
        end.setMinutes(end.getMinutes() + 1);
        break;
    }

    end.setMilliseconds(end.getMilliseconds() - 1);

    return { start: start, end: end };
  }

  private getBoundsForScope(scope: CalendarScope): { min: number, max: number } {
    const dates = Object.groupBy(this.dates, d => this.getScopedDateLocale(d.date, scope));

    let min = Infinity;
    let max = -Infinity;

    for (const yearDates of Object.values(dates)) {
      const value = yearDates!.reduce((sum, d) => sum + d.value, 0);

      min = Math.min(min, value);
      max = Math.max(max, value);
    }

    return { min, max };
  }

  private incrementDate(date: Date, scope: CalendarScope, delta: number) {
    const newDate = new Date(date.getTime());

    switch (scope) {
      case CalendarScope.Year:
        newDate.setFullYear(date.getFullYear() + delta);
        break;
      case CalendarScope.Month:
        newDate.setMonth(date.getMonth() + delta);
        break;
      case CalendarScope.Day:
        newDate.setDate(date.getDate() + delta);
        break;
      case CalendarScope.Hour:
        newDate.setHours(date.getHours() + delta);
        break;
      case CalendarScope.FifteenMinutes:
        newDate.setMinutes(date.getMinutes() + 15 * delta);
        break;
      case CalendarScope.FiveMinutes:
        newDate.setMinutes(date.getMinutes() + 5 * delta);
        break;
      case CalendarScope.Minute:
        newDate.setMinutes(date.getMinutes() + delta);
        break;
    }

    return newDate;
  }
}
