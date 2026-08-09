"use client";

import { useMemo } from "react";
import { DatePicker } from "@/components/custom/utility/date-picker";
import { CalendarScope, DateSelection, Variant } from "@/components/custom/utility/date-selection";
import { createFilterQuery, createFilterQueryGroup } from "@/lib/vote-query";
import { BooleanOperator, ValueOperator } from "@/lib/Api";
import { DateSubValue } from "@/components/custom/post/result/filter/builder/hm-builder-date";

export default function Page() {
  const dateSelection = useMemo(() => {
    const dates: { date: Date, value: number }[] = [];
    for (let i = 0; i < 3000; i++) {
      const date = new Date();
      const randomYear = Math.floor(Math.random() * 10) - 5; // Random year offset between -2 and +2
      const randomMonth = Math.floor(Math.random() * 12); // Random month between 0 and 11
      const randomDay = Math.floor(Math.random() * 31) + 1; // Random day between 1 and 28
      const randomHour = Math.floor(Math.random() * 24); // Random hour between 0 and 23
      const randomMinute = Math.floor(Math.random() * 60); // Random minute between 0 and 59

      date.setFullYear(date.getFullYear() + randomYear);
      date.setMonth(randomMonth);
      date.setDate(randomDay);
      date.setHours(randomHour);
      date.setMinutes(randomMinute);

      dates.push({ date, value: Math.floor(Math.random() * 100) });
    }

    const group = createFilterQueryGroup();
    const filterA = createFilterQuery();
    const filterB = createFilterQuery();
    group.children!.push(filterA, filterB);

    filterA.property = DateSubValue.DayOfWeek;
    filterA.valueOperator = ValueOperator.Equals;
    filterA.value = "0";

    filterB.property = DateSubValue.DayOfWeek;
    filterB.valueOperator = ValueOperator.Equals;
    filterB.leftOperator = BooleanOperator.Or;
    filterB.value = "3";

    const selection = new DateSelection(CalendarScope.FiveMinutes, 30, group, dates, Variant.Result);
    selection.currentScope = CalendarScope.Year;
    return selection;
  }, []);

  return (
    <div>
      <DatePicker dateSelection={dateSelection} />
    </div>
  );
}
