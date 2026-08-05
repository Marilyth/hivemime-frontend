import { observer } from "mobx-react-lite";
import { Button } from "@/components/ui/button";
import { mixColors, mutedColors } from "@/lib/colors";
import { AnimatePresence, motion } from "framer-motion";
import { eachDayOfInterval, endOfMonth, endOfWeek, startOfMonth, startOfWeek } from "date-fns";
import { CalendarScope, DateSelection, Animation } from "./date-selection";

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

export const DatePicker = observer(({ dateSelection, variant, startColor, endColor, ...props }: DatePickerProps) => {
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

  return (
    <div className="bg-card border rounded-md flex flex-col p-2 w-80">
      <div className="flex justify-between items-center p-2 border-b">
        <Button variant="ghost" onClick={() => dateSelection.slide(-1)}>&lt;</Button>
        <Button variant="ghost" onClick={() => dateSelection.drill(1)}>{dateSelection.headerText}</Button>
        <Button variant="ghost" onClick={() => dateSelection.slide(1)}>&gt;</Button>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <CalendarMotion
          key={`${dateSelection.currentDate.getTime()}-${dateSelection.currentScope}`}
          dateSelection={dateSelection}>
          {scopeMapping[dateSelection.currentScope]}
        </CalendarMotion>
      </AnimatePresence>
    </div>
  );
});

const CalendarMotion = observer(({ dateSelection, children }: { dateSelection: DateSelection; children: React.ReactNode }) => {
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
      {children}
    </motion.div>
  );
});

const YearPicker = ({ dateSelection, variant, startColor, endColor }: DatePickerProps) => {
  const startYear = dateSelection.currentDate.getFullYear() - (dateSelection.currentDate.getFullYear() % 25);
  const yearsPerPage = 25;

  function onClick(value: number) {
    dateSelection.currentDate.setFullYear(value);
    dateSelection.confirm();
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
    dateSelection.confirm();
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
    dateSelection.confirm();
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
    dateSelection.confirm();
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
    dateSelection.confirm();
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