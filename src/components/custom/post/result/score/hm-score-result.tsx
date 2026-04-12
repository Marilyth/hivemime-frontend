import { AnimatedBackground } from "@/components/custom/utility/hm-animated-background";
import { HiveMimeHoverCard } from "@/components/custom/utility/hm-hover-card";
import { CandidateDto, PollDto, PollResultDto } from "@/lib/Api";
import { useState } from "react";
import { HiveMimeDistributionResult, HiveMimeDistributionResultTypeProps } from "../hm-candidate-distribution";


export interface HiveMimeScoreResultProps {
    pollResult: PollResultDto;
    poll: PollDto;
}

export function HiveMimeScoreResult(props: HiveMimeScoreResultProps) {
  const span = props.poll.maxValue! - props.poll.minValue!;
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateDto | null>(null);

  return (
    <div className="flex flex-col gap-2">
        <HiveMimeDistributionResult
            poll={props.poll}
            candidate={selectedCandidate!}
            onClose={() => setSelectedCandidate(null)}
        />

        {props.pollResult?.candidates!.map((candidate, index) => {
            const candidateValue = candidate.voterAmount! > 0 ? candidate.averageScore! : 0;
            const relativeValue = candidateValue - props.poll.minValue!;
            const percentage = (relativeValue / span) * 100;

            return (
                <HiveMimeHoverCard 
                    key={candidate.id} 
                    className="p-2 rounded-md relative overflow-hidden"
                    onClick={() => setSelectedCandidate(candidate)}
                >
                    <AnimatedBackground percentage={percentage} />
                    <div className="relative flex flex-row gap-2 items-center">
                        <span className="font-medium">{candidate.name}</span>
                        <span className="text-sm text-muted-foreground ml-auto">
                            {Number(candidateValue.toFixed(2))}
                        </span>
                    </div>
                </HiveMimeHoverCard>
            );
        })}
    </div>
  );
}

export function HiveMimeScoreDistributionResult(props: HiveMimeDistributionResultTypeProps) {
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
                    <div className="relative flex flex-row gap-2 items-center">
                        <span className="font-medium">{stepStart} - {stepStart + stepSize - 1}</span>
                        <span className="text-sm text-muted-foreground ml-auto">
                            {Number(percentage.toFixed(2))}%
                        </span>
                    </div>
                </HiveMimeHoverCard>
            );
        })}
    </div>
  );
}