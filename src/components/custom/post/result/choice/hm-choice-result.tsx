import { AnimatedBackground } from "@/components/custom/utility/hm-animated-background";
import { HiveMimeHoverCard } from "@/components/custom/utility/hm-hover-card";
import { PollResultDto } from "@/lib/Api";
import { useTranslation } from "react-i18next";
import { HiveMimeViewCandidate } from "../../hm-candidate";


export interface HiveMimeChoiceResultProps {
    pollResult: PollResultDto;
}

export function HiveMimeChoiceResult(props: HiveMimeChoiceResultProps) {
  const { t } = useTranslation();
  const totalScore = props.pollResult!.candidates!.reduce((sum, candidate) => sum + candidate.voterAmount!, 0);

  return (
    <div className="flex flex-col gap-2">
        {props.pollResult?.candidates!.map((candidate, index) => {
            const percentage = totalScore > 0 ? (candidate.voterAmount! / totalScore) * 100 : 0;
            return (
                <HiveMimeHoverCard 
                    key={candidate.id} 
                    className="p-2 rounded-md relative overflow-hidden"
                >
                    <AnimatedBackground percentage={percentage} />
                    <div className="flex flex-col gap-0 relative">
                        <div className="relative flex flex-row gap-2 items-center">
                            <HiveMimeViewCandidate candidate={candidate} />

                            <div className="flex flex-col items-end text-muted-foreground ml-auto">
                                {Number(percentage.toFixed(2))}%
                                <div className="text-muted-foreground">
                                    {t("posts:result.votes", { count: candidate.voterAmount })}
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
