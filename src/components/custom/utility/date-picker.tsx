import { observer } from "mobx-react-lite";
import { makeAutoObservable, reaction } from "mobx";
import { Button } from "@/components/ui/button";
import { mixColors, mutedColors } from "@/lib/colors";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { eachDayOfInterval, endOfMonth, endOfWeek, startOfMonth, startOfWeek } from "date-fns";

const DEFAULT_START_COLOR = mutedColors.gray + "BB";
const DEFAULT_END_COLOR = mutedColors.red + "BB";

export enum CalendarScope {
  Minute,
  FiveMinutes,
  FifteenMinutes,
  Hour,
  Day,
  Month,
  Year
}

export class DateSelection {
  dates: { date: Date, value: number }[] = [];
  currentDate: Date = new Date();
  maxDates: number;
  currentScope: CalendarScope = CalendarScope.Day;
  maxScope: CalendarScope;

  constructor(maxScope: CalendarScope, maxDates: number) {
    this.maxDates = maxDates;
    this.maxScope = maxScope;
    makeAutoObservable(this);
  }

  toggle(date: Date) {
    const index = this.dates.findIndex(d => d.date.getTime() === date.getTime());

    if (index === -1) {
      this.dates.push({ date, value: 1 });
    } else {
      this.dates.splice(index, 1);
    }
  }

  sumRange(start: Date, end: Date): number {
    return this.dates
      .filter(d => d.date >= start && d.date <= end)
      .reduce((sum, d) => sum + d.value, 0);
  }

  getIdentifier(date: Date): string {
    const keyParts = [date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes()];
    keyParts.splice(keyParts.length - this.currentScope);

    return keyParts.join("-");
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
}

export enum Variant {
  View = "view",
  Edit = "edit",
  Result = "result"
}

export interface DatePickerProps {
  dateSelection: DateSelection;
  variant: Variant;
  startColor?: string;
  endColor?: string;
}

enum Animation {
  SlideLeft,
  SlideRight,
  ZoomIn,
  ZoomOut
}

export const DatePicker = observer(({ dateSelection, variant, startColor, endColor, ...props }: DatePickerProps) => {
  const animation = useRef(Animation.ZoomIn);
  const setAnimation = (newAnimation: Animation) => {
    animation.current = newAnimation;
  };

  startColor ??= DEFAULT_START_COLOR;
  endColor ??= DEFAULT_END_COLOR;

  const scopeMapping: { [key in CalendarScope]: React.ReactElement } = {
    [CalendarScope.Year]: <YearPicker dateSelection={dateSelection} variant={variant} startColor={startColor} endColor={endColor} />,
    [CalendarScope.Month]: <MonthPicker dateSelection={dateSelection} variant={variant} startColor={startColor} endColor={endColor} />,
    [CalendarScope.Day]: <DayPicker dateSelection={dateSelection} variant={variant} startColor={startColor} endColor={endColor} />,
    [CalendarScope.Hour]: <HourPicker dateSelection={dateSelection} variant={variant} startColor={startColor} endColor={endColor} />,
    [CalendarScope.Minute]: <MinutePicker dateSelection={dateSelection} variant={variant} startColor={startColor} endColor={endColor} />,
    [CalendarScope.FiveMinutes]: <MinutePicker dateSelection={dateSelection} variant={variant} startColor={startColor} endColor={endColor} />,
    [CalendarScope.FifteenMinutes]: <MinutePicker dateSelection={dateSelection} variant={variant} startColor={startColor} endColor={endColor} />,
  };

  function getInitialAnimation() {
    switch (animation.current) {
      case Animation.SlideLeft:
        return { opacity: 0, x: 20 };
      case Animation.SlideRight:
        return { opacity: 0, x: -20 };
      case Animation.ZoomIn:
        return { opacity: 0, scale: 0.8 };
      case Animation.ZoomOut:
        return { opacity: 0, scale: 1.2 };
    }
  }

  function getAnimateAnimation() {
    switch (animation.current) {
      case Animation.SlideLeft:
      case Animation.SlideRight:
        return { opacity: 1, x: 0 };
      case Animation.ZoomIn:
      case Animation.ZoomOut:
        return { opacity: 1, scale: 1 };
    }
  }

  function getExitAnimation() {
    switch (animation.current) {
      case Animation.SlideLeft:
        return { opacity: 0, x: -20 };
      case Animation.SlideRight:
        return { opacity: 0, x: 20 };
      case Animation.ZoomIn:
        return { opacity: 0, scale: 1.1 };
      case Animation.ZoomOut:
        return { opacity: 0, scale: 0.9 };
    }
  }

  useEffect(() => {
    const dispose = reaction(
      () => ({
        scope: dateSelection.currentScope,
        date: dateSelection.currentDate.getTime(),
      }),
      (newSelection, oldSelection) => {
        console.log("Date selection changed:", newSelection, oldSelection);
        if (newSelection.scope > oldSelection.scope) {
          setAnimation(Animation.ZoomIn);
        } else if (newSelection.scope < oldSelection.scope) {
          setAnimation(Animation.ZoomOut);
        } else if (newSelection.date > oldSelection.date) {
          setAnimation(Animation.SlideLeft);
        } else if (newSelection.date < oldSelection.date) {
          setAnimation(Animation.SlideRight);
        }
      }
    );

    return dispose;
  }, [dateSelection]);

  return (
    <div className="bg-card border rounded-md flex flex-col p-2 w-80">
      <CalendarHeader dateSelection={dateSelection} variant={variant} />

      <AnimatePresence mode="wait" initial={false}>
        <motion.div 
          key={`$${dateSelection.currentDate.getTime()}-${dateSelection.currentScope}`}
          initial={getInitialAnimation()}
          animate={getAnimateAnimation()}
          exit={getExitAnimation()}
          transition={{ duration: 0.2 }}>
          {scopeMapping[dateSelection.currentScope]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
});

const CalendarHeader = observer(({ dateSelection, variant }: DatePickerProps) => {
  const currentDate = dateSelection.currentDate;

  function onNext(delta: number) {
    switch (dateSelection.currentScope) {
      case CalendarScope.Year:
        dateSelection.currentDate = new Date(currentDate.setFullYear(currentDate.getFullYear() + 25 * delta));
        break;
      case CalendarScope.Month:
        dateSelection.currentDate = new Date(currentDate.setFullYear(currentDate.getFullYear() + delta));
        break;
      case CalendarScope.Day:
        dateSelection.currentDate = new Date(currentDate.setMonth(currentDate.getMonth() + delta));
        break;
      case CalendarScope.Hour:
        dateSelection.currentDate = new Date(currentDate.setDate(currentDate.getDate() + delta));
        break;
      case CalendarScope.Minute || CalendarScope.FiveMinutes || CalendarScope.FifteenMinutes:
        dateSelection.currentDate = new Date(currentDate.setHours(currentDate.getHours() + delta));
        break;
    }
  }

  function goUpScope() {
    dateSelection.currentScope = Math.min(dateSelection.currentScope + 1, CalendarScope.Year);
  }

  return (
    <div className="flex justify-between items-center p-2 border-b">
      <Button variant="ghost" onClick={() => onNext(-1)}>&lt;</Button>
      <Button variant="ghost" onClick={() => goUpScope()}>{dateSelection.currentDate.toDateString()}</Button>
      <Button variant="ghost" onClick={() => onNext(1)}>&gt;</Button>
    </div>
  );
});

const YearPicker = ({ dateSelection, variant, startColor, endColor }: DatePickerProps) => {
  const startYear = dateSelection.currentDate.getFullYear();
  const yearsPerPage = 25;

  function onClick(value: number) {
    dateSelection.currentDate.setFullYear(value);
    if (dateSelection.maxScope < CalendarScope.Year) {
      dateSelection.currentScope = CalendarScope.Month;
    } else {
      dateSelection.toggle(new Date(value, 0, 1));
    }
  }

  return (
    <div className="mt-3 grid grid-cols-5 gap-1">
      {Array.from({ length: yearsPerPage }, (_, i) => {
        const year = startYear + i;
        const value = dateSelection.sumRange(new Date(year, 0, 1), new Date(year, 11, 31, 23, 59, 59));
        const ratio = dateSelection.bounds.min == dateSelection.bounds.max ? 1 : (value - dateSelection.bounds.min) / (dateSelection.bounds.max - dateSelection.bounds.min);
        const mixedColor = value > 0 ? mixColors(startColor!, endColor!, ratio) : "transparent";

        return (
          <Button variant="ghost" key={year} onClick={() => onClick(year)} style={{ backgroundColor: mixedColor }}>
            {year}
          </Button>
        );
      })}
    </div>
  );
};

const MonthPicker = ({ dateSelection, variant, startColor, endColor }: DatePickerProps) => {
  const monthLabels = () => [...Array(12).keys()].map((i) =>
    new Date(2000, i, 1).toLocaleString("default", { month: "short" })
  );

  function onClick(value: number) {
    dateSelection.currentDate.setMonth(value);

    if (dateSelection.maxScope < CalendarScope.Month) {
      dateSelection.currentScope = CalendarScope.Day;
    } else {
      dateSelection.toggle(new Date(dateSelection.currentDate.getFullYear(), value, 1));
    }
  }

  return (
    <div className="mt-3 grid grid-cols-3 gap-1">
      {monthLabels().map((month, index) => {
        const value = dateSelection.sumRange(new Date(dateSelection.currentDate.getFullYear(), index, 1), new Date(dateSelection.currentDate.getFullYear(), index, 31, 23, 59, 59));
        const ratio = dateSelection.bounds.min == dateSelection.bounds.max ? 1 : (value - dateSelection.bounds.min) / (dateSelection.bounds.max - dateSelection.bounds.min);
        const mixedColor = value > 0 ? mixColors(startColor!, endColor!, ratio) : "transparent";

        return (
          <Button variant="ghost" key={month} onClick={() => onClick(index)} style={{ backgroundColor: mixedColor }}>
            {month}
          </Button>
        );
      })}
    </div>
  );
};

const DayPicker = ({ dateSelection, variant, startColor, endColor }: DatePickerProps) => {
  const monthStart = startOfMonth(new Date(dateSelection.currentDate.getFullYear(), dateSelection.currentDate.getMonth(), 1));
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const gridEnd = endOfWeek(endOfMonth(monthStart), { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: gridStart, end: gridEnd });
      
  const weekdayLabels = () => [...Array(7).keys()].map((i) =>
    new Date(2000, 0, i + 3).toLocaleString("default", { weekday: "short" })
  );

  function onClick(day: Date) {
    dateSelection.currentDate.setFullYear(day.getFullYear());
    dateSelection.currentDate.setMonth(day.getMonth());
    dateSelection.currentDate.setDate(day.getDate());

    if (dateSelection.maxScope < CalendarScope.Day) {
      dateSelection.currentScope = CalendarScope.Hour;
    } else {
      dateSelection.toggle(new Date(day.getFullYear(), day.getMonth(), day.getDate()));
    }
  }

  return (
    <div className="mt-3 grid grid-cols-7 gap-1">
      {weekdayLabels().map((day) => (
        <div key={day} className="text-center text-informational text-sm">{day}</div>
      ))}
      {days.map((day) => {
        const isOutside = day.getMonth() !== dateSelection.currentDate.getMonth();
        const value = dateSelection.sumRange(new Date(day.getFullYear(), day.getMonth(), day.getDate()), new Date(day.getFullYear(), day.getMonth(), day.getDate(), 23, 59, 59));
        const ratio = dateSelection.bounds.min == dateSelection.bounds.max ? 1 : (value - dateSelection.bounds.min) / (dateSelection.bounds.max - dateSelection.bounds.min);
        const mixedColor = value > 0 ? mixColors(startColor!, endColor!, ratio) : "transparent";

        return (
          <Button variant="ghost" key={day.toISOString()} className={`${isOutside ? "opacity-20" : ""}`} onClick={() => onClick(day)} style={{ backgroundColor: mixedColor }}>
            {day.getDate()}
          </Button>
        )
      })}
    </div>
  );
};

const HourPicker = ({ dateSelection, variant, startColor, endColor }: DatePickerProps) => {
  function onClick(value: number) {
    dateSelection.currentDate.setHours(value);

    if (dateSelection.maxScope < CalendarScope.Hour) {
      dateSelection.currentScope = dateSelection.maxScope;
    } else {
      dateSelection.toggle(new Date(dateSelection.currentDate.getFullYear(), dateSelection.currentDate.getMonth(), dateSelection.currentDate.getDate(), value));
    }
  }

  return (
    <div className="mt-3 grid grid-cols-6 gap-1">
      {[...Array(24).keys()].map((hour) => {
        const value = dateSelection.sumRange(new Date(dateSelection.currentDate.getFullYear(), dateSelection.currentDate.getMonth(), dateSelection.currentDate.getDate(), hour), new Date(dateSelection.currentDate.getFullYear(), dateSelection.currentDate.getMonth(), dateSelection.currentDate.getDate(), hour, 59, 59));
        const ratio = dateSelection.bounds.min == dateSelection.bounds.max ? 1 : (value - dateSelection.bounds.min) / (dateSelection.bounds.max - dateSelection.bounds.min);
        const mixedColor = value > 0 ? mixColors(startColor!, endColor!, ratio) : "transparent";

        return (
          <Button key={hour} variant="ghost" onClick={() => onClick(hour)} style={{ backgroundColor: mixedColor }}>
            {hour}
          </Button>
        );
      })}
    </div>
  );
};

const MinutePicker = ({ dateSelection, variant, startColor, endColor }: DatePickerProps) => {
  const cols = dateSelection.maxScope === CalendarScope.Minute ? "grid-cols-10" : dateSelection.maxScope === CalendarScope.FifteenMinutes ? "grid-cols-4" : "grid-cols-6";
  const minutes = Array.from({ length: 60 / (dateSelection.maxScope === CalendarScope.Minute ? 1 : dateSelection.maxScope === CalendarScope.FiveMinutes ? 5 : 15) },
    (_, i) => i * (dateSelection.maxScope === CalendarScope.Minute ? 1 : dateSelection.maxScope === CalendarScope.FiveMinutes ? 5 : 15));

  function onClick(value: number) {
    dateSelection.currentDate.setMinutes(value);
    dateSelection.toggle(new Date(dateSelection.currentDate.getFullYear(), dateSelection.currentDate.getMonth(), dateSelection.currentDate.getDate(), dateSelection.currentDate.getHours(), value));
  }

  return (
    <div className={`mt-3 grid ${cols} gap-1`}>
      {minutes.map((minute) => {
        const value = dateSelection.sumRange(new Date(dateSelection.currentDate.getFullYear(), dateSelection.currentDate.getMonth(), dateSelection.currentDate.getDate(), dateSelection.currentDate.getHours(), minute), new Date(dateSelection.currentDate.getFullYear(), dateSelection.currentDate.getMonth(), dateSelection.currentDate.getDate(), dateSelection.currentDate.getHours(), minute, 59));
        const ratio = dateSelection.bounds.min == dateSelection.bounds.max ? 1 : (value - dateSelection.bounds.min) / (dateSelection.bounds.max - dateSelection.bounds.min);
        const mixedColor = value > 0 ? mixColors(startColor!, endColor!, ratio) : "transparent";

        return (
          <Button key={minute} variant="ghost" onClick={() => onClick(minute)} style={{ backgroundColor: mixedColor }}>
            {minute.toString().padStart(2, "0")}
          </Button>
        );
      })}
    </div>
  );
};