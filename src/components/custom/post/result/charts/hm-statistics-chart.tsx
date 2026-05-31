import { AnimatedBackground } from "@/components/custom/utility/hm-animated-background";
import { HiveMimeHoverCard } from "@/components/custom/utility/hm-hover-card";
import { CandidateSumResultDtoPollResultDto, PollDto } from "@/lib/Api";
import { useTranslation } from "react-i18next";
import { HiveMimeViewCandidate } from "../../hm-candidate";

export interface SumChartProps {
  data: CandidateSumResultDtoPollResultDto;
  poll: PollDto;
  showPercentage?: boolean;
  showVotes?: boolean;
}

export function SumChart(props: SumChartProps) {
  const { t } = useTranslation();
  const totalVotes = props.data?.candidates!.reduce((sum, d) => sum + d.totalScore!, 0);

  if (!props.data)
    return (
      <div>
        Loading...
      </div>
    );

  return (
    <div className="flex flex-col gap-2">
      {props.data.candidates!.map((d, i) => {
        const percentage = totalVotes > 0 ? (d.totalScore! / totalVotes) * 100 : 0;
        const candidate = props.poll.candidates!.find(c => c.id === d.id);

        return (
          <HiveMimeHoverCard key={i}
            className="p-2 rounded-md relative overflow-hidden"
          >
            <AnimatedBackground />
            <div className="flex flex-col gap-0 relative">
              <div className="relative flex flex-row gap-2 items-center">
                <HiveMimeViewCandidate candidate={candidate!} />

                <div className="flex flex-col items-end text-muted-foreground ml-auto">
                  {props.showPercentage && `${Number(percentage.toFixed(2))}%`}
                  {props.showVotes && (
                    <div className="text-muted-foreground">
                      {t("posts:result.votes", { count: d.totalScore })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </HiveMimeHoverCard>
        );
      })}
    </div>
  );
}
