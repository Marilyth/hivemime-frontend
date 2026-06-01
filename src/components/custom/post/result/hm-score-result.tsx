import { useQuery } from "@tanstack/react-query";
import { HiveMimePollResultProps as HiveMimePollCandidateResultProps } from "./hm-poll-result";
import { api } from "@/lib/contexts";
import { HiveMimeHoverCard } from "../../utility/hm-hover-card";
import { HiveMimeViewCandidate } from "../hm-candidate";
import { mutedColors } from "@/lib/colors";
import { AnimatedBackground } from "../../utility/hm-animated-background";
import { useTranslation } from "react-i18next";

export function HiveMimeScoreResult(props: HiveMimePollCandidateResultProps) {
  const { t } = useTranslation();
  const data = useQuery({
    queryKey: ["poll-result", props.poll.id, props.filter],
    queryFn: async () => {
      const r = await api.api.postStatisticsResultList({ pollId: props.poll.id!, filter: props.filter });
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
  const range = props.poll.maxValue! - props.poll.minValue!;

  return (
    <div className="flex flex-col gap-2">
      {data.data.candidates!.map((d, i) => {
        const candidate = props.poll.candidates!.find(c => c.id === d.id);
        const minRatio = (d.min! - props.poll.minValue!) / range;
        const q1Ratio = (d.q1! - props.poll.minValue!) / range;
        const medianRatio = (d.median! - props.poll.minValue!) / range;
        const q3Ratio = (d.q3! - props.poll.minValue!) / range;
        const maxRatio = (d.max! - props.poll.minValue!) / range;

        return (
          <HiveMimeHoverCard key={i}
            className="p-2 rounded-md relative overflow-hidden"
          >
            <AnimatedBackground colorSegments={[
              { color: "transparent", startAt: minRatio },
              { color: mutedColors.honeyBrown + "00", startAt: minRatio },
              { color: mutedColors.honeyBrown + "33", startAt: q1Ratio },
              { color: mutedColors.honeyBrown + "77", startAt: medianRatio },
              { color: mutedColors.honeyBrown + "77", startAt: medianRatio, tickProps: { } },
              { color: mutedColors.honeyBrown + "33", startAt: q3Ratio },
              { color: mutedColors.honeyBrown + "00", startAt: maxRatio }
            ]} />
            <div className="flex flex-col gap-0 relative">
              <div className="relative flex flex-row gap-2 items-center">
                <HiveMimeViewCandidate candidate={candidate!} />

                <div className="flex flex-col items-end text-muted-foreground ml-auto">
                  {d.median}
                  
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
