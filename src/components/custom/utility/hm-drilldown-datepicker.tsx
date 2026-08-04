"use client";

import * as React from "react";
import {
  addDays,
  addHours,
  addMinutes,
  addMonths,
  addYears,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  endOfYear,
  isToday,
  startOfMonth,
  startOfWeek,
  startOfYear,
} from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { makeAutoObservable, observable } from "mobx";
import { observer } from "mobx-react-lite";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";

import { mixColors, mutedColors } from "@/lib/colors";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export enum DrilldownStep {
  Minute,
  FiveMinutes,
  FifteenMinutes,
  Hour,
  Day,
  Month,
  Year
}

export enum DrilldownScope {
  Year,
  Month,
  Day,
  Hour,
  Minute,
}

export enum Variant {
  Edit = "edit",
  Result = "result",
}

const DEFAULT_START_COLOR = mutedColors.gray + "BB";
const DEFAULT_END_COLOR = mutedColors.red + "BB";

interface DateValue {
  date: Date;
  value: number;
}

export class DateSelection {
  dates = observable.map<number, DateValue>();
  onDatesCount = 0;
  maxOnDates: number;

  constructor(maxOnDates: number) {
    this.maxOnDates = maxOnDates;
    makeAutoObservable(this);
  }

  setValue(date: Date, value: number) {
    const key = date.getTime();
    const existing = this.dates.get(key)?.value ?? 0;

    if (existing > 0 && value === 0)
      this.onDatesCount--;
    else if (existing === 0 && value > 0)
      this.onDatesCount++;

    this.dates.set(key, { date: new Date(key), value });
  }

  getValue(date: Date): number {
    return this.dates.get(date.getTime())?.value ?? 0;
  }

  sumInRange(start: Date, end: Date): number {
    const startTime = start.getTime();
    const endTime = end.getTime();
    let sum = 0;

    for (const { date, value } of this.dates.values()) {
      const time = date.getTime();
      if (time >= startTime && time <= endTime)
        sum += value;
    }

    return sum;
  }

  hasSelectionInRange(start: Date, end: Date): boolean {
    const startTime = start.getTime();
    const endTime = end.getTime();

    for (const { date, value } of this.dates.values()) {
      const time = date.getTime();
      if (value === 1 && time >= startTime && time <= endTime)
        return true;
    }

    return false;
  }

  public get bounds() {
    let min = Infinity;
    let max = -Infinity;

    for (const { value } of this.dates.values()) {
      if (value < min && value > 0)
        min = value;
      if (value > max)
        max = value;
    }

    if (min === Infinity)
      return { min: 0, max: 0 };

    return { min, max };
  }
}

interface GridItem {
  key: string | number;
  label: string;
  onSelect: () => void;
  className?: string;
  style?: React.CSSProperties;
  onHover?: (e: React.MouseEvent) => void;
  onHoverEnd?: () => void;
}

export interface HiveMimeDrilldownDatePickerProps {
  initialDate?: Date;
  step?: DrilldownStep;
  initialScope?: DrilldownScope;
  variant?: Variant;
  dateSelection: DateSelection;
  startColor?: string;
  endColor?: string;
  className?: string;
  classNames?: {
    header?: string;
    caption?: string;
    navButton?: string;
    grid?: string;
    cell?: string;
    cellSelected?: string;
  };
}

const YEAR_PAGE_SIZE = 25;
const WEEKDAY_LABELS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

function scopesForStep(step: DrilldownStep): DrilldownScope[] {
  if (step === DrilldownStep.Year)
    return [DrilldownScope.Year];
  if (step === DrilldownStep.Month)
    return [DrilldownScope.Year, DrilldownScope.Month];
  if (step === DrilldownStep.Day)
    return [DrilldownScope.Year, DrilldownScope.Month, DrilldownScope.Day];
  if (step === DrilldownStep.Hour)
    return [DrilldownScope.Year, DrilldownScope.Month, DrilldownScope.Day, DrilldownScope.Hour];

  return [
    DrilldownScope.Year,
    DrilldownScope.Month,
    DrilldownScope.Day,
    DrilldownScope.Hour,
    DrilldownScope.Minute,
  ];
}

const monthLabels = () =>
  [...Array(12).keys()].map((i) =>
    new Date(2000, i, 1).toLocaleString("default", { month: "short" })
  );

export const HiveMimeDrilldownDatePicker = observer(function HiveMimeDrilldownDatePicker({
  initialDate,
  step = DrilldownStep.Day,
  initialScope = DrilldownScope.Day,
  variant = Variant.Edit,
  dateSelection,
  startColor = DEFAULT_START_COLOR,
  endColor = DEFAULT_END_COLOR,
  className,
  classNames,
}: HiveMimeDrilldownDatePickerProps) {
  const { t } = useTranslation();

  const reachableScopes = scopesForStep(step);
  const finestScope = reachableScopes[reachableScopes.length - 1];
  const seed = initialDate ?? new Date();

  const [scope, setScope] = React.useState<DrilldownScope>(Math.min(initialScope, finestScope));
  const [tooltip, setTooltip] = React.useState<{ title: string; value: number; x: number; y: number } | null>(null);

  const [focus, setFocus] = React.useState(() => ({
    year: seed.getFullYear(),
    month: seed.getMonth(),
    day: seed.getDate(),
    hour: seed.getHours(),
    minute: seed.getMinutes(),
  }));
  const [animation, setAnimation] = React.useState<{ type: "zoom" | "slide"; direction: 1 | -1 }>({
    type: "zoom",
    direction: 1,
  });
  const [yearPageStart, setYearPageStart] = React.useState(
    () => Math.floor(seed.getFullYear() / YEAR_PAGE_SIZE) * YEAR_PAGE_SIZE
  );

  const pendingNav = React.useRef<(() => void) | null>(null);

  React.useLayoutEffect(() => {
    const action = pendingNav.current;
    if (!action)
      return;
    pendingNav.current = null;
    action();
  }, [animation]);

  const viewKey = () => {
    if (scope === DrilldownScope.Year)
      return `year-${yearPageStart}`;
    if (scope === DrilldownScope.Month)
      return `month-${focus.year}`;
    if (scope === DrilldownScope.Day)
      return `day-${focus.year}-${focus.month}`;
    if (scope === DrilldownScope.Hour)
      return `hour-${focus.year}-${focus.month}-${focus.day}`;
    return `minute-${focus.year}-${focus.month}-${focus.day}-${focus.hour}`;
  };

  const isFinest = (scopeValue: DrilldownScope) => scopeValue === finestScope;

  function toggleDate(date: Date) {
    if (variant !== Variant.Edit)
      return;
    const current = dateSelection.getValue(date);
    dateSelection.setValue(date, current === 1 ? 0 : 1);
  }

  function handleSelect(scopeValue: DrilldownScope, index: number) {
    if (scopeValue === DrilldownScope.Year) {
      setFocus((f) => ({ ...f, year: index }));
      if (isFinest(DrilldownScope.Year))
        toggleDate(new Date(index, 0, 1));
      else
        drillInto(DrilldownScope.Month);
    } else if (scopeValue === DrilldownScope.Month) {
      setFocus((f) => ({ ...f, month: index }));
      if (isFinest(DrilldownScope.Month))
        toggleDate(new Date(focus.year, index, 1));
      else
        drillInto(DrilldownScope.Day);
    } else if (scopeValue === DrilldownScope.Day) {
      setFocus((f) => ({ ...f, day: index }));
      if (isFinest(DrilldownScope.Day))
        toggleDate(new Date(focus.year, focus.month, index));
      else
        drillInto(DrilldownScope.Hour);
    } else if (scopeValue === DrilldownScope.Hour) {
      setFocus((f) => ({ ...f, hour: index }));
      if (isFinest(DrilldownScope.Hour))
        toggleDate(new Date(focus.year, focus.month, focus.day, index));
      else
        drillInto(DrilldownScope.Minute);
    } else if (scopeValue === DrilldownScope.Minute) {
      setFocus((f) => ({ ...f, minute: index }));
      toggleDate(new Date(focus.year, focus.month, focus.day, focus.hour, index));
    }
  }

  function drillInto(next: DrilldownScope) {
    setAnimation({ type: "zoom", direction: 1 });
    pendingNav.current = () => setScope(next);
  }

  function goUp() {
    const currentIndex = scope;
    if (currentIndex <= 0)
      return;

    setAnimation({ type: "zoom", direction: -1 });
    pendingNav.current = () => setScope(currentIndex - 1);
  }

  function navigateParent(delta: 1 | -1) {
    setAnimation({ type: "slide", direction: delta });

    if (scope === DrilldownScope.Year) {
      pendingNav.current = () => {
        setYearPageStart((start) => start + delta * YEAR_PAGE_SIZE);
        setFocus((f) => ({ ...f, year: f.year + delta * YEAR_PAGE_SIZE }));
      };
    } else if (scope === DrilldownScope.Month) {
      pendingNav.current = () =>
        setFocus((f) => {
          const next = addYears(new Date(f.year, f.month, 1), delta);
          return { ...f, year: next.getFullYear(), month: next.getMonth() };
        });
    } else if (scope === DrilldownScope.Day) {
      pendingNav.current = () =>
        setFocus((f) => {
          const next = addMonths(new Date(f.year, f.month, 1), delta);
          return { ...f, year: next.getFullYear(), month: next.getMonth() };
        });
    } else if (scope === DrilldownScope.Hour) {
      pendingNav.current = () =>
        setFocus((f) => {
          const next = addDays(new Date(f.year, f.month, f.day), delta);
          return { ...f, year: next.getFullYear(), month: next.getMonth(), day: next.getDate() };
        });
    } else if (scope === DrilldownScope.Minute) {
      pendingNav.current = () =>
        setFocus((f) => {
          const next = addHours(new Date(f.year, f.month, f.day, f.hour), delta);
          return { ...f, year: next.getFullYear(), month: next.getMonth(), day: next.getDate(), hour: next.getHours() };
        });
    }
  }

  function formatScopeValue(): string {
    if (scope === DrilldownScope.Year || scope === DrilldownScope.Month)
      return focus.year.toString();

    const dayString = new Date(focus.year, focus.month, focus.day).toLocaleString("default", {
      month: scope === DrilldownScope.Day ? "long" : "short",
      day: scope === DrilldownScope.Day ? undefined : "numeric",
      year: "numeric",
    });

    if (scope === DrilldownScope.Minute)
      return `${dayString}, ${focus.hour.toString().padStart(2, "0")}:00`;

    return dayString;
  }

  function scopeHover(start: Date, end: Date, title: string) {
    if (!dateSelection || variant !== Variant.Result)
      return { onHover: undefined, onHoverEnd: undefined };

    return {
      onHover: (e: React.MouseEvent) => {
        const value = dateSelection.sumInRange(start, end);
        if (value <= 0) {
          setTooltip(null);
          return;
        }
        setTooltip({ title, value, x: e.clientX, y: e.clientY });
      },
      onHoverEnd: () => setTooltip(null),
    };
  }

  function bucketKey(scopeValue: DrilldownScope, date: Date): number {
    if (scopeValue === DrilldownScope.Year)
      return new Date(date.getFullYear(), 0, 1).getTime();
    if (scopeValue === DrilldownScope.Month)
      return new Date(date.getFullYear(), date.getMonth(), 1).getTime();
    if (scopeValue === DrilldownScope.Day)
      return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
    if (scopeValue === DrilldownScope.Hour)
      return new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours()).getTime();
    return new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes()).getTime();
  }

  function scopeScale(scopeValue: DrilldownScope): { min: number; max: number } {
    if (!dateSelection)
      return { min: 0, max: 0 };

    const groups = new Map<number, number>();
    for (const { date, value } of dateSelection.dates.values()) {
      if (value <= 0)
        continue;
      const key = bucketKey(scopeValue, date);
      groups.set(key, (groups.get(key) ?? 0) + value);
    }

    let min = Infinity;
    let max = -Infinity;
    for (const v of groups.values()) {
      if (v < min)
        min = v;
      if (v > max)
        max = v;
    }

    if (min === Infinity)
      return { min: 0, max: 0 };

    return { min, max };
  }

  function gradientStyle(value: number, min: number, max: number): React.CSSProperties | undefined {
    if (value <= 0)
      return undefined;

    const span = max - min;
    const ratio = span <= 0
      ? 1
      : Math.max(0, Math.min(1, (value - min) / span));

    return { background: mixColors(startColor, endColor, ratio) };
  }

  function rangeValue(start: Date, end: Date): number {
    return dateSelection ? dateSelection.sumInRange(start, end) : 0;
  }

  function renderHeader(value: string, onClickUp?: () => void) {
    return (
      <>
        <div className={cn("flex items-center justify-between gap-1", classNames?.header)}>
          <Button
            variant="ghost"
            size="sm"
            className={cn("size-8 p-0 select-none", classNames?.navButton)}
            onClick={() => navigateParent(-1)}
          >
            <ChevronLeftIcon />
          </Button>

          {onClickUp ? (
            <Button
              variant="ghost"
              className={cn("h-auto flex-1 rounded-md px-1 text-sm font-medium select-none hover:text-honey-brown", classNames?.caption)}
              onClick={onClickUp}
            >
              {value}
            </Button>
          ) : (
            <div className={cn("flex-1 text-center text-sm font-medium select-none", classNames?.caption)}>
              {value}
            </div>
          )}

          <Button
            variant="ghost"
            size="sm"
            className={cn("size-8 p-0 select-none", classNames?.navButton)}
            onClick={() => navigateParent(1)}
          >
            <ChevronRightIcon />
          </Button>
        </div>

        <div className="mt-2 text-center text-xs text-muted-foreground select-none">
          {t(`a11y:select${DrilldownScope[scope]}`)}
        </div>
      </>
    );
  }

  function renderCell(item: GridItem) {
    return (
      <Button
        variant="ghost"
        className={cn(
          "h-9 flex-1 min-w-0 p-0 text-sm font-normal select-none",
          item.className,
          classNames?.cell
        )}
        style={item.style}
        onClick={item.onSelect}
        onMouseEnter={item.onHover}
        onMouseLeave={item.onHoverEnd}
      >
        {item.label}
      </Button>
    );
  }

  function renderGrid(items: GridItem[]) {
    return (
      <>
        {items.map((item) => (
          <div key={item.key} className="flex">
            {renderCell(item)}
          </div>
        ))}
      </>
    );
  }

  function renderGradientLegend(min: number, max: number) {
    const span = max - min;
    if (span <= 0)
      return null;

    return (
      <div
        className="relative mt-3 h-3 w-full rounded-sm"
        style={{ background: `linear-gradient(to right, ${startColor}, ${endColor})` }}
      >
        {tooltip && (
          <div
            className="absolute top-0 h-full w-0.5 -translate-x-1/2 bg-foreground"
            style={{ left: `${(Math.max(0, Math.min(1, (tooltip.value - min) / span))) * 100}%` }}
          />
        )}
      </div>
    );
  }

  function renderSimpleScope(items: GridItem[], gridClassName: string, min: number, max: number) {
    return (
      <div>
        {renderHeader(formatScopeValue(), scope === DrilldownScope.Year ? undefined : goUp)}
        <div className={cn(gridClassName, classNames?.grid)}>{renderGrid(items)}</div>
        {renderGradientLegend(min, max)}
      </div>
    );
  }

  function renderYearView() {
    const { min, max } = scopeScale(DrilldownScope.Year);

    const items: GridItem[] = [...Array(YEAR_PAGE_SIZE).keys()].map((i) => {
      const year = yearPageStart + i;
      const start = startOfYear(new Date(year, 0, 1));
      const end = endOfYear(new Date(year, 0, 1));
      return {
        key: year,
        label: year.toString(),
        onSelect: () => handleSelect(DrilldownScope.Year, year),
        style: gradientStyle(rangeValue(start, end), min, max),
        ...scopeHover(start, end, year.toString()),
      };
    });

    return renderSimpleScope(items, "mt-3 grid grid-cols-5 gap-1", min, max);
  }

  function renderMonthView() {
    const { min, max } = scopeScale(DrilldownScope.Month);

    const items: GridItem[] = monthLabels().map((label, month) => {
      const start = new Date(focus.year, month, 1);
      const end = endOfMonth(start);
      const title = start.toLocaleString("default", { month: "long", year: "numeric" });
      return {
        key: month,
        label,
        onSelect: () => handleSelect(DrilldownScope.Month, month),
        style: gradientStyle(rangeValue(start, end), min, max),
        ...scopeHover(start, end, title),
      };
    });

    return renderSimpleScope(items, "mt-3 grid grid-cols-3 gap-1", min, max);
  }

  function renderHourView() {
    const { min, max } = scopeScale(DrilldownScope.Hour);

    const items: GridItem[] = [...Array(24).keys()].map((hour) => {
      const start = new Date(focus.year, focus.month, focus.day, hour);
      const end = addHours(start, 1);
      const title = `${formatScopeValue()}, ${hour.toString().padStart(2, "0")}:00`;
      return {
        key: hour,
        label: hour.toString().padStart(2, "0"),
        onSelect: () => handleSelect(DrilldownScope.Hour, hour),
        style: gradientStyle(rangeValue(start, end), min, max),
        ...scopeHover(start, end, title),
      };
    });

    return renderSimpleScope(items, "mt-3 grid grid-cols-6 gap-1", min, max);
  }

  function renderMinuteView() {
    const minutes = [...Array(60).keys()].filter((m) => m % 15 === 0 || (m % 5 === 0 && step === 1) || step === 0);
    const { min, max } = scopeScale(DrilldownScope.Minute);

    const items: GridItem[] = minutes.map((minute) => {
      const start = new Date(focus.year, focus.month, focus.day, focus.hour, minute);
      const end = addMinutes(start, 1);
      const title = `${formatScopeValue()}, ${focus.hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
      return {
        key: minute,
        label: minute.toString().padStart(2, "0"),
        onSelect: () => handleSelect(DrilldownScope.Minute, minute),
        style: gradientStyle(rangeValue(start, end), min, max),
        ...scopeHover(start, end, title),
      };
    });

    return renderSimpleScope(
      items,
      cn("mt-3 grid gap-1", step === 2 ? "grid-cols-4" : step === 1 ? "grid-cols-6" : "grid-cols-10"),
      min,
      max
    );
  }

  function renderDayView() {
    const monthStart = startOfMonth(new Date(focus.year, focus.month, 1));
    const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 });
    const gridEnd = endOfWeek(endOfMonth(monthStart), { weekStartsOn: 1 });
    const days = eachDayOfInterval({ start: gridStart, end: gridEnd });

    const { min, max } = scopeScale(DrilldownScope.Day);

    const items: GridItem[] = days.map((day) => {
      const outside = day.getMonth() !== focus.month;
      const dayValue = dateSelection.getValue(day);
      const title = day.toLocaleString("default", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

      return {
        key: day.getTime(),
        label: day.getDate().toString(),
        onSelect: () => outside ? undefined : handleSelect(DrilldownScope.Day, day.getDate()),
        className: cn(
          outside && "text-muted-foreground opacity-0",
          !outside && isToday(day) && "bg-accent"
        ),
        style: !outside ? gradientStyle(dayValue, min, max) : undefined,
        ...scopeHover(day, day, title),
      };
    });

    return (
      <div>
        {renderHeader(formatScopeValue(), goUp)}
        <div className="mt-3">
          <div className="flex">
            {WEEKDAY_LABELS.map((label) => (
              <div key={label} className="flex-1 text-center text-[0.8rem] font-normal text-muted-foreground select-none">
                {label}
              </div>
            ))}
          </div>
          <div className={cn("mt-2 grid grid-cols-7 gap-1", classNames?.grid)}>{renderGrid(items)}</div>
        </div>

        {renderGradientLegend(min, max)}
      </div>
    );
  }

  const renderCurrentScope = () => {
    if (scope === DrilldownScope.Year)
      return renderYearView();
    if (scope === DrilldownScope.Month)
      return renderMonthView();
    if (scope === DrilldownScope.Hour)
      return renderHourView();
    if (scope === DrilldownScope.Minute)
      return renderMinuteView();
    return renderDayView();
  };

  return (
    <div className={cn("bg-background rounded-md border p-3 shadow-xs", className)}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={viewKey()}
          initial={
            animation.type === "zoom"
              ? { opacity: 0, scale: animation.direction === 1 ? 0.9 : 1.1 }
              : { opacity: 0, x: animation.direction * 24 }
          }
          animate={{ opacity: 1, scale: 1, x: 0 }}
          exit={
            animation.type === "zoom"
              ? { opacity: 0, scale: animation.direction === 1 ? 1.1 : 0.9 }
              : { opacity: 0, x: animation.direction * -24 }
          }
          transition={{ duration: 0.1 }}
        >
          {renderCurrentScope()}
        </motion.div>
      </AnimatePresence>

      {variant === Variant.Result && tooltip && createPortal(
        <div
          className="fixed z-50 whitespace-nowrap rounded-md border bg-card p-2 pointer-events-none"
          style={{ left: tooltip.x, top: tooltip.y, transform: "translate(0.5rem, 0.5rem)" }}
        >
          <div className="text-xs text-muted-foreground">
            {tooltip.title}
          </div>
          <div>Value: {tooltip.value.toFixed(4)}</div>
        </div>,
        document.body
      )}
    </div>
  );
});
