import { AnimatedBackground } from "@/components/custom/utility/hm-animated-background";
import { HiveMimeHoverCard } from "@/components/custom/utility/hm-hover-card";
import { CandidateDto, PollDto, PollResultDto } from "@/lib/Api";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { HiveMimeDistributionResult, HiveMimeDistributionResultTypeProps } from "../hm-candidate-distribution";
import { HiveMimeViewCandidate } from "../../hm-candidate";


export interface HiveMimeScoreResultProps {
    pollResult: PollResultDto;
    poll: PollDto;
}

export function HiveMimeScoreResult(props: HiveMimeScoreResultProps) {
  const { t } = useTranslation();
  const span = props.poll.maxValue! - props.poll.minValue!;
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateDto | null>(null);

  return (
    <div className="flex flex-col gap-2">
        <HiveMimeDistributionResult
            poll={props.poll}
            candidate={selectedCandidate!}
            onClose={() => setSelectedCandidate(null)}
        />

        <span className="text-sm text-informational">
            {t("posts:result.distributionHint")}
        </span>
        {props.pollResult?.candidates!.map((candidate, index) => {
            const candidateValue = candidate.voterAmount! > 0 ? candidate.averageScore! : 0;
            const relativeValue = candidateValue - props.poll.minValue!;
            const percentage = (relativeValue / span) * 100;

            return (
                <HiveMimeHoverCard 
                    key={candidate.id} 
                    className="rounded-md relative overflow-hidden"
                    onClick={() => setSelectedCandidate(candidate)} 
                >
                    <AnimatedBackground percentage={percentage} />
                    <div className="flex flex-col gap-0 relative">
                        <div className="flex flex-row gap-2 items-center">
                            <HiveMimeViewCandidate candidate={candidate} />

                            <div className="flex flex-col items-end text-muted-foreground ml-auto">
                                {Number(candidateValue.toFixed(2))}
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

export function HiveMimeScoreDistributionResult(props: HiveMimeDistributionResultTypeProps) {
  const { t } = useTranslation();
  const totalVotes = props.candidateResult.reduce((sum, candidate) => sum + candidate.score!, 0);
  const span = props.poll.maxValue! - props.poll.minValue!;
  const stepSize = Math.ceil((span + 1) / 10.0);

  return (
    <div className="flex flex-col gap-2">
        {Array.from({ length: 10 }, (_, i) => {
            const stepStart = props.poll.minValue! + i * stepSize;
            const stepScore = props.candidateResult.find(candidate => candidate.value === stepStart)?.score ?? 0;
            const percentage = totalVotes > 0 ? (stepScore / totalVotes) * 100 : 0;

            return (
                <HiveMimeHoverCard 
                    key={stepStart} 
                    className="p-2 rounded-md relative overflow-hidden"
                >
                    <AnimatedBackground percentage={percentage} />
                    <div className="flex flex-col gap-0 relative">
                        <div className="relative flex flex-row gap-2 items-center">
                            <span className="font-medium">{t("posts:result.scoreRange", { start: stepStart, end: stepStart + stepSize - 1 })}</span>

                            <div className="flex flex-col items-end text-muted-foreground ml-auto text-sm">
                                {Number(percentage.toFixed(2))}%
                                <div className="text-muted-foreground">
                                    {t("posts:result.votes", { count: stepScore })}
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