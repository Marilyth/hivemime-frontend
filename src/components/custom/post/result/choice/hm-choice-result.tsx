import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { HiveMimePollResultProps as HiveMimePollCandidateResultProps } from "../hm-poll-result";
import { api } from "@/lib/contexts";
import { SumChart } from "../charts/hm-sum-chart";


export function HiveMimeChoiceResult(props: HiveMimePollCandidateResultProps) {
  const data = useQuery({
    queryKey: ["poll-result", props.poll.id, props.filter],
    queryFn: async () => {
      const r = await api.api.postSumResultList({ pollId: props.poll.id!, filter: props.filter });
      return r.data;
    },
    staleTime: 1000 * 60 * 5
  });

  return (
    <SumChart data={data.data!} poll={props.poll} showPercentage showVotes />
  );
}
