import { AnimatedBackground } from "@/components/custom/utility/hm-animated-background";
import { HiveMimeHoverCard } from "@/components/custom/utility/hm-hover-card";
import { hiveMimeRankIcon } from "@/components/custom/utility/hm-rank-icon";
import { PollDto, PollResultDto } from "@/lib/Api";


export interface HiveMimeRankResultProps {
    pollResult: PollResultDto;
    poll: PollDto;
}

export function HiveMimeRankResult(props: HiveMimeRankResultProps) {
  return (
    <div>
        {props.pollResult?.candidates!.toSorted((a, b) => b.averageScore! - a.averageScore!).map((candidate, index) => {
            const candidateValue = candidate.voterAmount! > 0 ? candidate.averageScore! : 0;
            const percentage = (candidateValue / props.poll.maxValue!) * 100;

            return (
                <HiveMimeHoverCard 
                    key={candidate.id} 
                    className="p-2 mb-2 rounded-md relative overflow-hidden"
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