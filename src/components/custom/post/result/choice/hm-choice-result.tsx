import { AnimatedBackground } from "@/components/custom/utility/hm-animated-background";
import { HiveMimeHoverCard } from "@/components/custom/utility/hm-hover-card";
import { PollResultDto } from "@/lib/Api";


export interface HiveMimeChoiceResultProps {
    pollResult: PollResultDto;
}

export function HiveMimeChoiceResult(props: HiveMimeChoiceResultProps) {
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
                            <span className="font-medium">{candidate.name}</span>
                            <span className="text-sm text-muted-foreground ml-auto">
                                {Number(percentage.toFixed(2))}%
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
