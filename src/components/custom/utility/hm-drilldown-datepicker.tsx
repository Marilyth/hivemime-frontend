"use client";

import * as React from "react";
import {
  addDays,
  addHours,
  addMonths,
  addYears,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  isSameDay,
  isToday,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

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

interface GridItem {
  key: string | number;
  label: string;
  isSelected: boolean;
  onSelect: () => void;
  className?: string;
}

export interface HiveMimeDrilldownDatePickerProps {
  value?: Date | null;
  initialDate?: Date;
  onChange?: (date: Date) => void;
  step?: DrilldownStep;
  initialScope?: DrilldownScope;
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

export function HiveMimeDrilldownDatePicker({
  value,
  initialDate,
  onChange,
  step = DrilldownStep.Day,
  initialScope = DrilldownScope.Day,
  className,
  classNames,
}: HiveMimeDrilldownDatePickerProps) {
  const { t } = useTranslation();

  const reachableScopes = scopesForStep(step);
  const finestScope = reachableScopes[reachableScopes.length - 1];
  const seed = value ?? initialDate ?? new Date();

  const [internalValue, setInternalValue] = React.useState<Date>(seed);
  const [scope, setScope] = React.useState<DrilldownScope>(Math.min(initialScope, finestScope));

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

  const selected = value ?? internalValue;

  React.useEffect(() => {
    if (value) {
      setFocus({
        year: value.getFullYear(),
        month: value.getMonth(),
        day: value.getDate(),
        hour: value.getHours(),
        minute: value.getMinutes(),
      });
    }
  }, [value]);

  const isSelectedPart = (hour?: number, minute?: number) =>
    focus.year === selected.getFullYear() &&
    focus.month === selected.getMonth() &&
    focus.day === selected.getDate() &&
    (hour === undefined || hour === selected.getHours()) &&
    (minute === undefined || minute === selected.getMinutes());

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

  function handleSelect(scopeValue: DrilldownScope, index: number) {
    if (scopeValue === DrilldownScope.Year) {
      setFocus((f) => ({ ...f, year: index }));
      if (isFinest(DrilldownScope.Year))
        commit({ year: index, month: 0, day: 1, hour: 0, minute: 0 });
      else
        drillInto(DrilldownScope.Month);
    } else if (scopeValue === DrilldownScope.Month) {
      setFocus((f) => ({ ...f, month: index }));
      if (isFinest(DrilldownScope.Month))
        commit({ year: focus.year, month: index, day: 1, hour: 0, minute: 0 });
      else
        drillInto(DrilldownScope.Day);
    } else if (scopeValue === DrilldownScope.Day) {
      setFocus((f) => ({ ...f, day: index }));
      if (isFinest(DrilldownScope.Day))
        commit({ ...focus, day: index, hour: 0, minute: 0 });
      else
        drillInto(DrilldownScope.Hour);
    } else if (scopeValue === DrilldownScope.Hour) {
      setFocus((f) => ({ ...f, hour: index }));
      if (isFinest(DrilldownScope.Hour))
        commit({ ...focus, hour: index, minute: 0 });
      else
        drillInto(DrilldownScope.Minute);
    } else if (scopeValue === DrilldownScope.Minute) {
      setFocus((f) => ({ ...f, minute: index }));
      commit({ ...focus, minute: index });
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

  function commit(dateParts: { year: number; month: number; day: number; hour: number; minute?: number }) {
    const date = new Date(dateParts.year, dateParts.month, dateParts.day, dateParts.hour, dateParts.minute ?? 0, 0, 0);
    setInternalValue(date);
    onChange?.(date);
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

  function renderCell(label: string, isSelected: boolean, onClick: () => void, extraClass?: string) {
    return (
      <Button
        variant="ghost"
        className={cn(
          "h-9 flex-1 min-w-0 p-0 text-sm font-normal select-none",
          isSelected && cn("bg-primary text-primary-foreground", classNames?.cellSelected),
          extraClass,
          classNames?.cell
        )}
        onClick={onClick}
      >
        {label}
      </Button>
    );
  }

  function renderGrid(items: GridItem[]) {
    return (
      <>
        {items.map((item) => (
          <div key={item.key} className="flex">
            {renderCell(item.label, item.isSelected, item.onSelect, item.className)}
          </div>
        ))}
      </>
    );
  }

  function renderSimpleScope(items: GridItem[], gridClassName: string) {
    return (
      <div>
        {renderHeader(formatScopeValue(), scope === DrilldownScope.Year ? undefined : goUp)}
        <div className={cn(gridClassName, classNames?.grid)}>{renderGrid(items)}</div>
      </div>
    );
  }

  function renderYearView() {
    const items: GridItem[] = [...Array(YEAR_PAGE_SIZE).keys()].map((i) => {
      const year = yearPageStart + i;
      return { key: year, label: year.toString(), isSelected: year === selected.getFullYear(), onSelect: () => handleSelect(DrilldownScope.Year, year) };
    });

    return renderSimpleScope(items, "mt-3 grid grid-cols-5 gap-1");
  }

  function renderMonthView() {
    const items: GridItem[] = monthLabels().map((label, month) => ({
      key: month,
      label,
      isSelected: focus.year === selected.getFullYear() && month === selected.getMonth(),
      onSelect: () => handleSelect(DrilldownScope.Month, month),
    }));

    return renderSimpleScope(items, "mt-3 grid grid-cols-3 gap-1");
  }

  function renderHourView() {
    const items: GridItem[] = [...Array(24).keys()].map((hour) => ({
      key: hour,
      label: hour.toString().padStart(2, "0"),
      isSelected: isSelectedPart(hour),
      onSelect: () => handleSelect(DrilldownScope.Hour, hour),
    }));

    return renderSimpleScope(items, "mt-3 grid grid-cols-6 gap-1");
  }

  function renderMinuteView() {
    const minutes = [...Array(60).keys()].filter((m) => m % 15 === 0 || (m % 5 === 0 && step === 1) || step === 0);
    const items: GridItem[] = minutes.map((minute) => ({
      key: minute,
      label: minute.toString().padStart(2, "0"),
      isSelected: isSelectedPart(focus.hour, minute),
      onSelect: () => handleSelect(DrilldownScope.Minute, minute),
    }));

    return renderSimpleScope(
      items,
      cn("mt-3 grid gap-1", step === 2 ? "grid-cols-4" : step === 1 ? "grid-cols-6" : "grid-cols-10")
    );
  }

  function renderDayView() {
    const monthStart = startOfMonth(new Date(focus.year, focus.month, 1));
    const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 });
    const gridEnd = endOfWeek(endOfMonth(monthStart), { weekStartsOn: 1 });
    const days = eachDayOfInterval({ start: gridStart, end: gridEnd });

    const items: GridItem[] = days.map((day) => {
      const outside = day.getMonth() !== focus.month;
      const isSelectedDay = isSameDay(day, selected);

      return {
        key: day.getTime(),
        label: day.getDate().toString(),
        isSelected: isSelectedDay,
        onSelect: () => outside ? undefined : handleSelect(DrilldownScope.Day, day.getDate()),
        className: cn(
          outside && "text-muted-foreground opacity-0",
          !outside && isToday(day) && "bg-accent",
          isSelectedDay && "bg-primary text-primary-foreground"
        ),
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
    </div>
  );
}
