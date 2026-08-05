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

export class DateSelection {
  dates: { date: Date, value: number }[] = [];
  currentDate: Date = new Date();
  maxDates: number;
  currentScope: CalendarScope = CalendarScope.Day;
  maxScope: CalendarScope;
  animation: Animation = Animation.ZoomIn;

  constructor(maxScope: CalendarScope, maxDates: number) {
    this.maxDates = maxDates;
    this.maxScope = maxScope;
    makeAutoObservable(this);
  }

  public get bounds() {
    const dates = Object.groupBy(this.dates, d => this.getIdentifier(d.date));

    let min = Infinity;
    let max = -Infinity;

    for (const yearDates of Object.values(dates)) {
      const value = yearDates!.reduce((sum, d) => sum + d.value, 0);

      min = Math.min(min, value);
      max = Math.max(max, value);
    }

    return { min, max };
  }

  public get headerText() {
    switch (this.currentScope) {
      case CalendarScope.Year:
        const startYear = this.currentDate.getFullYear() - (this.currentDate.getFullYear() % 25);
        return `${startYear} - ${startYear + 24}`;
      case CalendarScope.Month:
        return this.currentDate.toLocaleString("default", { year: "numeric" });
      case CalendarScope.Day:
        return this.currentDate.toLocaleString("default", { month: "long", year: "numeric" });
      case CalendarScope.Hour:
        return this.currentDate.toLocaleString("default", { month: "short", day: "numeric", year: "numeric" });
      case CalendarScope.FifteenMinutes:
      case CalendarScope.FiveMinutes:
      case CalendarScope.Minute:
        return this.currentDate.toLocaleString("default", { month: "short", day: "numeric", year: "numeric", hour: "numeric" });
    }
  }

  confirm() {
    if (this.currentScope > this.maxScope) {
      this.drill(-1);
      return;
    }

    // Select the date if we are at the max scope.
    const scopedDate = this.getScopedDate(this.currentDate);
    const index = this.dates.findIndex(d => d.date.getTime() === scopedDate.getTime());

    if (index === -1) {
      this.dates.push({ date: scopedDate, value: 1 });
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
    let newScope = Math.min(Math.max(this.currentScope + delta, this.maxScope), CalendarScope.Year);

    if (newScope <= CalendarScope.FifteenMinutes)
      newScope = this.maxScope;

    if (newScope !== this.currentScope) {
      this.animation = delta > 0 ? Animation.ZoomOut : Animation.ZoomIn;
      this.currentScope = newScope;
    }
  }

  sumRange(start: Date, end: Date): number {
    return this.dates
      .filter(d => d.date >= start && d.date <= end)
      .reduce((sum, d) => sum + d.value, 0);
  }

  getIdentifier(date: Date): string {
    const keyParts = [date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes()];
    keyParts.splice(keyParts.length - (Math.max(0, this.currentScope - 2)));

    return keyParts.join("-");
  }

  private getScopedDate(date: Date): Date {
    switch (this.currentScope) {
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
}
