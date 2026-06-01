import { useQuery } from "@tanstack/react-query";
import { HiveMimePollResultProps as HiveMimePollCandidateResultProps } from "./hm-poll-result";
import { api } from "@/lib/contexts";
import { HiveMimeHoverCard } from "../../utility/hm-hover-card";
import { mutedColors } from "@/lib/colors";
import { HiveMimeViewCandidate } from "../hm-candidate";
import { AnimatedBackground } from "../../utility/hm-animated-background";
import { useTranslation } from "react-i18next";


export function HiveMimeChoiceResult(props: HiveMimePollCandidateResultProps) {
  const { t } = useTranslation();
  const data = useQuery({
    queryKey: ["poll-result", props.poll.id, props.filter],
    queryFn: async () => {
      const r = await api.api.postSumResultList({ pollId: props.poll.id!, filter: props.filter });
      return r.data;
    },
    staleTime: 1000 * 60 * 5
  });

  if (!data.data)
    return (
      <div>
        Loading...
      </div>
    );

  const totalVotes = data.data.candidates!.reduce((sum, d) => sum + d.voteCount!, 0);

  return (
    <div className="flex flex-col gap-2">
      {data.data.candidates!.map((d, i) => {
        const ratio = totalVotes > 0 ? (d.voteCount! / totalVotes) : 0;
        const candidate = props.poll.candidates!.find(c => c.id === d.id);

        return (
          <HiveMimeHoverCard key={i}
            className="p-2 rounded-md relative overflow-hidden"
          >
            <AnimatedBackground colorSegments={[
              { color: mutedColors.honeyBrown + "77", startAt: 0 },
              { color: mutedColors.honeyBrown + "20", startAt: ratio }
            ]} />
            <div className="flex flex-col gap-0 relative">
              <div className="relative flex flex-row gap-2 items-center">
                <HiveMimeViewCandidate candidate={candidate!} />

                <div className="flex flex-col items-end text-muted-foreground ml-auto">
                  {Number(ratio.toFixed(2))}%
                  <div className="text-muted-foreground">
                    {t("posts:result.votes", { count: d.voteCount })}
                  </div>
                </div>
              </div>
            </div>
          </HiveMimeHoverCard>
        );
      })}
    </div>
  );
}
