import { AnimatedBackground } from "@/components/custom/utility/hm-animated-background";
import { HiveMimeHoverCard } from "@/components/custom/utility/hm-hover-card";
import { PollDto, PollResultDto } from "@/lib/Api";


export interface HiveMimeScoreResultProps {
    pollResult: PollResultDto;
    poll: PollDto;
}

export function HiveMimeScoreResult(props: HiveMimeScoreResultProps) {
  const span = props.poll.maxValue! - props.poll.minValue!;

  return (
    <div>
        {props.pollResult?.candidates!.map((candidate, index) => {
            const candidateValue = candidate.voterAmount! > 0 ? candidate.averageScore! : 0;
            const relativeValue = candidateValue - props.poll.minValue!;
            const percentage = (relativeValue / span) * 100;

            return (
                <HiveMimeHoverCard 
                    key={candidate.id} 
                    className="p-2 mb-2 rounded-md relative overflow-hidden"
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