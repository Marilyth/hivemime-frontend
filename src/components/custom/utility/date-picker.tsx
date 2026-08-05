import { observer } from "mobx-react-lite";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { mixColors, mutedColors } from "@/lib/colors";
import { AnimatePresence, motion } from "framer-motion";
import { eachDayOfInterval, endOfMonth, endOfWeek, startOfMonth, startOfWeek } from "date-fns";
import { CalendarScope, DateSelection, Animation } from "./date-selection";
import { useTranslation } from "react-i18next";

const DEFAULT_START_COLOR = mutedColors.gray + "BB";
const DEFAULT_END_COLOR = mutedColors.red + "BB";


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

interface PickerProps extends DatePickerProps {
  date: Date;
}

export const DatePicker = observer(({ dateSelection, variant, startColor, endColor, ...props }: DatePickerProps) => {
  const { t } = useTranslation();
  startColor ??= DEFAULT_START_COLOR;
  endColor ??= DEFAULT_END_COLOR;

  return (
    <div className="bg-card border rounded-md flex flex-col p-2 w-80">
      <div className="flex justify-between items-center p-2 border-b mb-4">
        <Button variant="ghost" onClick={() => dateSelection.slide(-1)}>&lt;</Button>
        <Button variant="ghost" onClick={() => dateSelection.drill(1)}>{dateSelection.headerText}</Button>
        <Button variant="ghost" onClick={() => dateSelection.slide(1)}>&gt;</Button>
      </div>

      <span className="text-center text-sm text-muted-foreground">{t(`enums:calendarScopeSelection.${CalendarScope[dateSelection.currentScope]}`)}</span>

      <AnimatePresence mode="wait" initial={false}>
        <CalendarMotion
          key={`${dateSelection.currentDate.getTime()}-${dateSelection.currentScope}`}
          dateSelection={dateSelection}
          variant={variant}
          startColor={startColor}
          endColor={endColor}
        />
      </AnimatePresence>
    </div>
  );
});

const CalendarMotion = observer(({ dateSelection, variant, startColor, endColor }: DatePickerProps) => {
  const [snapshot] = useState(() => ({ date: dateSelection.currentDate, scope: dateSelection.currentScope }));

  const scopeMapping: { [key in CalendarScope]: React.ReactElement } = {
    [CalendarScope.Year]: <YearPicker dateSelection={dateSelection} variant={variant} startColor={startColor} endColor={endColor} date={snapshot.date} />,
    [CalendarScope.Month]: <MonthPicker dateSelection={dateSelection} variant={variant} startColor={startColor} endColor={endColor} date={snapshot.date} />,
    [CalendarScope.Day]: <DayPicker dateSelection={dateSelection} variant={variant} startColor={startColor} endColor={endColor} date={snapshot.date} />,
    [CalendarScope.Hour]: <HourPicker dateSelection={dateSelection} variant={variant} startColor={startColor} endColor={endColor} date={snapshot.date} />,
    [CalendarScope.Minute]: <MinutePicker dateSelection={dateSelection} variant={variant} startColor={startColor} endColor={endColor} date={snapshot.date} />,
    [CalendarScope.FiveMinutes]: <FiveMinutesPicker dateSelection={dateSelection} variant={variant} startColor={startColor} endColor={endColor} date={snapshot.date} />,
    [CalendarScope.FifteenMinutes]: <FifteenMinutesPicker dateSelection={dateSelection} variant={variant} startColor={startColor} endColor={endColor} date={snapshot.date} />,
  };

  function getInitialAnimation() {
    switch (dateSelection.animation) {
      case Animation.SlideLeft:
        return { opacity: 0, x: 20 };
      case Animation.SlideRight:
        return { opacity: 0, x: -20 };
      case Animation.ZoomIn:
        return { opacity: 0, scale: 0.9 };
      case Animation.ZoomOut:
        return { opacity: 0, scale: 1.1 };
    }
  }

  function getExitAnimation() {
    switch (dateSelection.animation) {
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

  return (
    <motion.div
      initial={getInitialAnimation()}
      animate={{ opacity: 1, scale: 1, x: 0 }}
      exit={getExitAnimation()}
      transition={{ duration: 0.2 }}>
      {scopeMapping[snapshot.scope]}
    </motion.div>
  );
});

const YearPicker = observer(({ dateSelection, variant, startColor, endColor, date }: PickerProps) => {
  const startYear = date.getFullYear() - (date.getFullYear() % 25);
  const yearsPerPage = 25;

  function onClick(value: number) {
    dateSelection.currentDate.setFullYear(value);
    dateSelection.confirm();
  }

  return (
    <div className="mt-3 grid grid-cols-5 gap-1">
      {Array.from({ length: yearsPerPage }, (_, i) => {
        const mapDate = new Date(startYear + i, 0, 1);

        const year = startYear + i;
        const value = dateSelection.sumScopedRange(mapDate, CalendarScope.Year);
        const bounds = dateSelection.yearBounds;
        const ratio = bounds.min == bounds.max ? 1 : (value - bounds.min) / (bounds.max - bounds.min);
        const mixedColor = value > 0 ? mixColors(startColor!, endColor!, ratio) : "transparent";

        return (
          <Button variant="ghost" key={year} onClick={() => onClick(year)} style={{ backgroundColor: mixedColor }}>
            {year}
          </Button>
        );
      })}
    </div>
  );
});

const MonthPicker = observer(({ dateSelection, variant, startColor, endColor, date }: PickerProps) => {
  const monthLabels = () => [...Array(12).keys()].map((i) =>
    new Date(2000, i, 1).toLocaleString("default", { month: "short" })
  );

  function onClick(value: number) {
    dateSelection.currentDate.setMonth(value);
    dateSelection.confirm();
  }

  return (
    <div className="mt-3 grid grid-cols-3 gap-1">
      {monthLabels().map((month, index) => {
        const mapDate = new Date(date.getFullYear(), index, 1);

        const value = dateSelection.sumScopedRange(mapDate, CalendarScope.Month);
        const bounds = dateSelection.monthBounds;
        const ratio = bounds.min == bounds.max ? 1 : (value - bounds.min) / (bounds.max - bounds.min);
        const mixedColor = value > 0 ? mixColors(startColor!, endColor!, ratio) : "transparent";

        return (
          <Button variant="ghost" key={month} onClick={() => onClick(index)} style={{ backgroundColor: mixedColor }}>
            {month}
          </Button>
        );
      })}
    </div>
  );
});

const DayPicker = observer(({ dateSelection, variant, startColor, endColor, date }: PickerProps) => {
  const monthStart = startOfMonth(new Date(date.getFullYear(), date.getMonth(), 1));
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
    dateSelection.confirm();
  }

  return (
    <div className="mt-3 grid grid-cols-7 gap-1">
      {weekdayLabels().map((day) => (
        <div key={day} className="text-center text-informational text-sm">{day}</div>
      ))}
      {days.map((day) => {
        const isOutside = day.getMonth() !== date.getMonth();

        const value = dateSelection.sumScopedRange(day, CalendarScope.Day);
        const bounds = dateSelection.dayBounds;
        const ratio = bounds.min == bounds.max ? 1 : (value - bounds.min) / (bounds.max - bounds.min);
        const mixedColor = value > 0 ? mixColors(startColor!, endColor!, ratio) : "transparent";

        return (
          <Button variant="ghost" key={day.toISOString()} className={`${isOutside ? "opacity-20" : ""}`} onClick={() => onClick(day)} style={{ backgroundColor: mixedColor }}>
            {day.getDate()}
          </Button>
        )
      })}
    </div>
  );
});

const HourPicker = observer(({ dateSelection, variant, startColor, endColor, date }: PickerProps) => {
  const hourLabels = () => [...Array(24).keys()].map((i) =>
    new Date(2000, 0, 0, i).toLocaleString("default", { hour: "numeric" })
  );

  function onClick(value: number) {
    dateSelection.currentDate.setHours(value);
    dateSelection.confirm();
  }

  return (
    <div className="mt-3 grid grid-flow-col grid-rows-12 gap-1">
      {hourLabels().map((hour, i) => {
        const mapDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), i);

        const value = dateSelection.sumScopedRange(mapDate, CalendarScope.Hour);
        const bounds = dateSelection.hourBounds;
        const ratio = bounds.min == bounds.max ? 1 : (value - bounds.min) / (bounds.max - bounds.min);
        const mixedColor = value > 0 ? mixColors(startColor!, endColor!, ratio) : "transparent";

        return (
          <Button key={i} variant="ghost" onClick={() => onClick(i)} style={{ backgroundColor: mixedColor }}>
            {hour}
          </Button>
        );
      })}
    </div>
  );
});

const FifteenMinutesPicker = observer(({ dateSelection, variant, startColor, endColor, date }: PickerProps) => {
  function onClick(value: number) {
    dateSelection.currentDate.setMinutes(value);
    dateSelection.confirm();
  }

  return (
    <div className={`mt-3 grid grid-cols-4 gap-1`}>
      {Array.from({ length: 60 / 15 }, (_, i) => i * 15).map((minute) => {
        const mapDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), minute);

        const value = dateSelection.sumScopedRange(mapDate, CalendarScope.FifteenMinutes);
        const bounds = dateSelection.fifteenMinuteBounds;
        const ratio = bounds.min == bounds.max ? 1 : (value - bounds.min) / (bounds.max - bounds.min);
        const mixedColor = value > 0 ? mixColors(startColor!, endColor!, ratio) : "transparent";

        return (
          <Button key={minute} variant="ghost" onClick={() => onClick(minute)} style={{ backgroundColor: mixedColor }}>
            {minute.toString().padStart(2, "0")}
          </Button>
        );
      })}
    </div>
  );
});


const FiveMinutesPicker = observer(({ dateSelection, variant, startColor, endColor, date }: PickerProps) => {
  function onClick(value: number) {
    dateSelection.currentDate.setMinutes(value);
    dateSelection.confirm();
  }

  return (
    <div className={`mt-3 grid grid-cols-6 gap-1`}>
      {Array.from({ length: 60 / 5 }, (_, i) => i * 5).map((minute) => {
        const mapDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), minute);

        const value = dateSelection.sumScopedRange(mapDate, CalendarScope.FiveMinutes);
        const bounds = dateSelection.fiveMinuteBounds;
        const ratio = bounds.min == bounds.max ? 1 : (value - bounds.min) / (bounds.max - bounds.min);
        const mixedColor = value > 0 ? mixColors(startColor!, endColor!, ratio) : "transparent";

        return (
          <Button key={minute} variant="ghost" onClick={() => onClick(minute)} style={{ backgroundColor: mixedColor }}>
            {minute.toString().padStart(2, "0")}
          </Button>
        );
      })}
    </div>
  );
});

const MinutePicker = observer(({ dateSelection, variant, startColor, endColor, date }: PickerProps) => {
  function onClick(value: number) {
    dateSelection.currentDate.setMinutes(value);
    dateSelection.confirm();
  }

  return (
    <div className={`mt-3 grid grid-cols-10 gap-1`}>
      {Array.from({ length: 60 }, (_, i) => i).map((minute) => {
        const mapDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), minute);

        const value = dateSelection.sumScopedRange(mapDate, CalendarScope.Minute);
        const bounds = dateSelection.minuteBounds;
        const ratio = bounds.min == bounds.max ? 1 : (value - bounds.min) / (bounds.max - bounds.min);
        const mixedColor = value > 0 ? mixColors(startColor!, endColor!, ratio) : "transparent";

        return (
          <Button key={minute} variant="ghost" onClick={() => onClick(minute)} style={{ backgroundColor: mixedColor }}>
            {minute.toString().padStart(2, "0")}
          </Button>
        );
      })}
    </div>
  );
});