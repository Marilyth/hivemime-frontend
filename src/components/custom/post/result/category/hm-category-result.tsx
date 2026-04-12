import { AnimatedBackground } from "@/components/custom/utility/hm-animated-background";
import { HiveMimeHoverCard } from "@/components/custom/utility/hm-hover-card";
import { hiveMimeRankIcon } from "@/components/custom/utility/hm-rank-icon";
import { CandidateDto, PollDto, PollResultDto } from "@/lib/Api";
import { HiveMimeCategoryTag } from "../../vote/category/hm-category-poll-vote-category";
import { numberToColorHex } from "@/lib/colors";
import { HiveMimeDistributionResult, HiveMimeDistributionResultTypeProps } from "../hm-candidate-distribution";
import { useState } from "react";


export interface HiveMimeCategoryResultProps {
    pollResult: PollResultDto;
    poll: PollDto;
}

export function HiveMimeCategoryResult(props: HiveMimeCategoryResultProps) {
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateDto | null>(null);

  return (
    <div className="flex flex-col gap-2">
        <HiveMimeDistributionResult
            poll={props.poll}
            candidate={selectedCandidate!}
            onClose={() => setSelectedCandidate(null)}
        />
        <span className="text-sm text-informational">
            You can see the <span className="text-honey-brown">vote distribution</span> of a candidate <span className="text-honey-brown">by clicking</span> on it.
        </span>
        {props.pollResult?.candidates!.toSorted((a, b) => {
            if (a.majorityVote == null && b.majorityVote == null) return 0;
            if (a.majorityVote == null) return 1;
            if (b.majorityVote == null) return -1;
            
            // Order by category first, and ratio as tiebreaker.
            const voteDiff = a.majorityVote - b.majorityVote;
            if (voteDiff !== 0) return voteDiff;

            return b.majorityRatio! - a.majorityRatio!;
        }).map((candidate, index) => {
            const category = props.poll.categories!.find(category => category.value === candidate.majorityVote);

            return (
                <HiveMimeHoverCard 
                    key={candidate.id} 
                    className="p-2 rounded-md relative overflow-hidden"
                    onClick={() => setSelectedCandidate(candidate)}
                >
                    {category &&
                        <AnimatedBackground percentage={candidate.majorityRatio! * 100}
                            colorStart={numberToColorHex(category!.color!)+"77"}
                            colorEnd={numberToColorHex(category!.color!)+"20"} />
                    }
                    <div className="flex flex-col gap-0 relative">
                        <div className="relative flex flex-row gap-2 items-center">
                            <span className="font-medium">{candidate.name}</span>
                            <span className="text-sm text-muted-foreground ml-auto">
                                {category && <HiveMimeCategoryTag category={category} />}
                            </span>
                        </div>
                        <div className="text-muted-foreground">
                            {candidate.voterAmount} votes
                        </div>
                    </div>
                </HiveMimeHoverCard>
            );
        })}
    </div>
  );
}

export function HiveMimeCategoryDistributionResult(props: HiveMimeDistributionResultTypeProps) {
  const totalVotes = props.candidateResult.reduce((sum, candidate) => sum + candidate.score!, 0);
  const span = props.poll.maxValue! - props.poll.minValue! + 1;

  return (
    <div className="flex flex-col gap-2">
        {Array.from({ length: span }, (_, i) => {
            const bucketValue = i + 1;
            const category = props.poll.categories!.find(category => category.value === bucketValue);
            const bucketScore = props.candidateResult.find(candidate => candidate.value === bucketValue)?.score ?? 0;
            const percentage = totalVotes > 0 ? (bucketScore / totalVotes) * 100 : 0;

            return (
                <HiveMimeHoverCard 
                    key={bucketValue} 
                    className="p-2 rounded-md relative overflow-hidden"
                >
                    {category &&
                        <AnimatedBackground percentage={percentage}
                            colorStart={numberToColorHex(category!.color!)+"77"}
                            colorEnd={numberToColorHex(category!.color!)+"20"} />
                    }
                    <div className="flex flex-col gap-0 relative">
                        <div className="relative flex flex-row gap-2 items-center">
                            <HiveMimeCategoryTag category={category!} />
                            <span className="text-sm text-muted-foreground ml-auto">
                                {Number(percentage.toFixed(2))}%
                            </span>
                        </div>
                        <div className="flex flex-row gap-2 items-center text-sm text-muted-foreground">
                            {bucketScore} votes
                        </div>
                    </div>
                </HiveMimeHoverCard>
            );
        })}
    </div>
  );
}