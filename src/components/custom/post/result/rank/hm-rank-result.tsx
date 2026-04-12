import { AnimatedBackground } from "@/components/custom/utility/hm-animated-background";
import { HiveMimeHoverCard } from "@/components/custom/utility/hm-hover-card";
import { hiveMimeRankIcon } from "@/components/custom/utility/hm-rank-icon";
import { CandidateDto, PollDto, PollResultDto } from "@/lib/Api";
import { HiveMimeDistributionResult, HiveMimeDistributionResultTypeProps } from "../hm-candidate-distribution";
import { useState } from "react";


export interface HiveMimeRankResultProps {
    pollResult: PollResultDto;
    poll: PollDto;
}

export function HiveMimeRankResult(props: HiveMimeRankResultProps) {
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateDto | null>(null);

  return (
    <div className="flex flex-col gap-2">
        <HiveMimeDistributionResult
            poll={props.poll}
            candidate={selectedCandidate!}
            onClose={() => setSelectedCandidate(null)}
        />

        {props.pollResult?.candidates!.toSorted((a, b) => b.averageScore! - a.averageScore!).map((candidate, index) => {
            const candidateValue = candidate.voterAmount! > 0 ? candidate.averageScore! : 0;
            const percentage = (candidateValue / props.poll.maxValue!) * 100;

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
                            {hiveMimeRankIcon(index + 1)}
                        </span>
                    </div>
                </HiveMimeHoverCard>
            );
        })}
    </div>
  );
}

export function HiveMimeRankDistributionResult(props: HiveMimeDistributionResultTypeProps) {
  const totalVotes = props.candidateResult.reduce((sum, candidate) => sum + candidate.score!, 0);
  const span = props.poll.maxValue! - props.poll.minValue! + 1;

  return (
    <div className="flex flex-col gap-2">
        {Array.from({ length: span }, (_, i) => {
            const bucketValue = props.poll.maxValue! - i;
            const bucketScore = props.candidateResult.find(candidate => candidate.value === bucketValue)?.score ?? 0;
            const percentage = totalVotes > 0 ? (bucketScore / totalVotes) * 100 : 0;

            return (
                <HiveMimeHoverCard 
                    key={bucketValue} 
                    className="p-2 rounded-md relative overflow-hidden"
                >
                    <AnimatedBackground percentage={percentage} />
                    <div className="relative flex flex-row gap-2 items-center">
                        {hiveMimeRankIcon(i + 1)}
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