import { useQuery } from "@tanstack/react-query";
import { HiveMimePollResultProps } from "./hm-poll-result";
import { api } from "@/lib/contexts";
import { DatePicker } from "../../utility/date-picker";
import { CalendarScope, DateSelection, Variant } from "../../utility/date-selection";
import { fromGMT } from "@/lib/gmt";

export function HiveMimeDateResult(props: HiveMimePollResultProps) {
  const data = useQuery({
    queryKey: ["poll-result", props.poll.id, JSON.stringify(props.filter)],
    queryFn: async () => {
      const r = await api.api.postDateResultCreate(props.filter!, { pollId: props.poll.id! });
      return r.data;
    },
    staleTime: 0
  });

  if (!data.data)
    return (
      <div>
        Loading...
      </div>
    );

  return (
    <div className="flex flex-col gap-2">
      {props.poll.candidates!.map((candidate, i) => {
        const resultCandidate = data.data!.candidates!.find(rc => rc.id === candidate.id);

        const dateSelection = new DateSelection(
          props.poll.stepValue as CalendarScope,
          props.poll.maxVotesPerCandidate!,
          props.poll.dateFilterQuery,
          resultCandidate?.distribution?.map(d => ({ date: fromGMT(d.timestamp!), value: d.voteCount! })) ?? [],
          Variant.Result
        );

        return (
          <DatePicker
            key={i}
            dateSelection={dateSelection}
          />
        );
      })}
    </div>
  );
}
