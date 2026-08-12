"use client";

import { useMemo } from "react";
import { DatePicker } from "@/components/custom/utility/date-picker";
import { CalendarScope, DateSelection, Variant } from "@/components/custom/utility/date-selection";
import { HiveMimePostResultFilter } from "@/components/custom/post/result/filter/hm-post-result-filter";
import { createFilterQueryGroup } from "@/lib/vote-query";
import { FilterQueryBase, PollDto, PollType, PostDto } from "@/lib/Api";

export default function Page() {
  const { dateSelection, post, poll, onAddCondition } = useMemo(() => {
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

    const dateQuery = createFilterQueryGroup();
    const candidate = { name: "Date" };
    const poll: PollDto = {
      title: "Date",
      pollType: PollType.Date,
      stepValue: CalendarScope.FiveMinutes,
      candidates: [candidate],
      dateFilterQuery: dateQuery,
    };
    const post: PostDto = { polls: [poll] };

    const selection = new DateSelection(CalendarScope.FiveMinutes, 30, dateQuery, dates, Variant.Result);
    selection.currentScope = CalendarScope.Year;

    return {
      dateSelection: selection,
      post,
      poll,
      onAddCondition: (result: FilterQueryBase) => dateQuery.children!.push(result),
    };
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <DatePicker dateSelection={dateSelection} />
      <HiveMimePostResultFilter
        post={post}
        builder={poll.dateFilterQuery!}
        onAddCondition={onAddCondition}
        lockedPoll={poll}
        lockedCandidate={poll.candidates![0]}
      />
    </div>
  );
}
