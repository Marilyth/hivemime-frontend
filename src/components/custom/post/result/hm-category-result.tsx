import { useQuery } from "@tanstack/react-query";
import { HiveMimePollResultProps as HiveMimePollCandidateResultProps } from "./hm-poll-result";
import { api } from "@/lib/contexts";
import { HiveMimeHoverCard } from "../../utility/hm-hover-card";
import { HiveMimeViewCandidate } from "../hm-candidate";
import { numberToColorHex } from "@/lib/colors";
import { AnimatedBackground, ColorSegment } from "../../utility/hm-animated-background";
import { useTranslation } from "react-i18next";
import { HiveMimeCategoryTag } from "../vote/category/hm-category-poll-vote-category";


export function HiveMimeCategoryResult(props: HiveMimePollCandidateResultProps) {
  const { t } = useTranslation();
  const data = useQuery({
    queryKey: ["poll-result", props.poll.id, props.filter],
    queryFn: async () => {
      const r = await api.api.postDistributionResultList({ pollId: props.poll.id!, filter: props.filter });
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

  return (
    <div className="flex flex-col gap-2">
      {props.poll.candidates!.map((c, i) => {
        const resultCandidate = data.data!.candidates!.find(rc => rc.id === c.id);
        const winningDistribution = resultCandidate?.distribution?.reduce((prev, current) => (prev.voteCount! >= current.voteCount!) ? prev : current)
        const category = winningDistribution ? props.poll.categories!.find(cat => cat.value === winningDistribution?.value) : null;

        function getColorSegments() {
          let currentStart = 0;
          const stepSize = 1 / props.poll.categories!.length;
          
          const segments: ColorSegment[] = [];

          for (const category of props.poll.categories!) {
            const distribution = resultCandidate?.distribution?.find(dist => dist.value === category.value);
            const ratio = distribution ? distribution.voteCount! / resultCandidate!.voteCount! : 0;
            const hexRatio = Math.round(64 + ratio * 100).toString(16).padStart(2, "0");

            segments.push(
            {
              color: numberToColorHex(category.color!) + "15",
              startAt: currentStart
            },
            {
              color: numberToColorHex(category.color!) + hexRatio,
              startAt: currentStart + (stepSize * ratio),
            },
            {
              color: numberToColorHex(category.color!) + "15",
              startAt: currentStart + (stepSize * ratio),
            },
            {
              color: "transparent",
              startAt: currentStart + stepSize,
            });

            currentStart += stepSize;
          }

          return segments;
        }

        return (
          <HiveMimeHoverCard key={i}
            className="p-2 rounded-md relative overflow-hidden"
          >
            <AnimatedBackground colorSegments={getColorSegments()} />
            <div className="flex flex-col gap-0 relative">
              <div className="relative flex flex-row gap-2 items-center">
                <HiveMimeViewCandidate candidate={c!} />
                
                <div className="flex flex-col items-end text-muted-foreground ml-auto">
                  {category && <HiveMimeCategoryTag category={category} />}

                  <div className="text-muted-foreground">
                    {t("posts:result.votes", { count: resultCandidate?.voteCount ?? 0 })}
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
