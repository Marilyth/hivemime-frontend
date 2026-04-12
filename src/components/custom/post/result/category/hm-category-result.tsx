import { AnimatedBackground } from "@/components/custom/utility/hm-animated-background";
import { HiveMimeHoverCard } from "@/components/custom/utility/hm-hover-card";
import { hiveMimeRankIcon } from "@/components/custom/utility/hm-rank-icon";
import { PollDto, PollResultDto } from "@/lib/Api";
import { HiveMimeCategoryTag } from "../../vote/category/hm-category-poll-vote-category";
import { numberToColorHex } from "@/lib/colors";


export interface HiveMimeCategoryResultProps {
    pollResult: PollResultDto;
    poll: PollDto;
}

export function HiveMimeCategoryResult(props: HiveMimeCategoryResultProps) {
  return (
    <div>
        {props.pollResult?.candidates!.toSorted((a, b) => {
            if (a.majorityRatio == null) return 1;
            if (b.majorityRatio == null) return -1;
            return b.majorityRatio - a.majorityRatio;
        }).map((candidate, index) => {
            const category = props.poll.categories!.find(category => category.value === candidate.majorityVote);

            return (
                <HiveMimeHoverCard 
                    key={candidate.id} 
                    className="p-2 mb-2 rounded-md relative overflow-hidden"
                >
                    {category &&
                        <AnimatedBackground percentage={candidate.majorityRatio! * 100}
                            colorStart={numberToColorHex(category!.color!)+"77"}
                            colorEnd={numberToColorHex(category!.color!)+"20"} />
                    }
                    <div className="relative flex flex-row gap-2 items-center">
                        <span className="font-medium">{candidate.name}</span>
                        <span className="text-sm text-muted-foreground ml-auto">
                            {category && <HiveMimeCategoryTag category={category} />}
                        </span>
                    </div>
                </HiveMimeHoverCard>
            );
        })}
    </div>
  );
}