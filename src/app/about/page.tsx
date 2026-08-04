"use client";

import { useMemo } from "react";
import { CalendarScope, DatePicker, DateSelection, Variant } from "@/components/custom/utility/date-picker";

export default function Page() {
  const dateSelection = useMemo(() => {
    const selection = new DateSelection(CalendarScope.FifteenMinutes, 30);
    selection.currentScope = CalendarScope.Year;
    selection.dates = [
      { date: new Date(2030, 0, 1), value: 0.5 },
      { date: new Date(2031, 0, 1), value: 0.8 },
      { date: new Date(2032, 0, 1), value: 0.3 },
      { date: new Date(2033, 0, 1), value: 0.9 },
    ];
    return selection;
  }, []);

  return (
    <div>
      <DatePicker dateSelection={dateSelection} variant={Variant.View} />
    </div>
  );
}
