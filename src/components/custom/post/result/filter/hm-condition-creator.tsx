import { HiveMimeMultiStep, HiveMimeStep } from "@/components/custom/utility/hm-multistep-ui";
import { PollType, PostDto } from "@/lib/Api";
import { VoteQuery } from "@/lib/query-builder";
import { observer } from "mobx-react-lite";
import { useMemo } from "react";
import { HiveMimeFilterConditionChoiceValuePicker } from "./choice/hm-choice-value-picker";
import { HiveMimeFilterConditionCandidatePicker } from "./hm-candidate-picker";
import { HiveMimeFilterConditionScoreValuePicker } from "./score/hm-score-value-picker";
import { HiveMimeFilterConditionRankValuePicker } from "./rank/hm-rank-value-picker";
import { HiveMimeFilterConditionCategoryValuePicker } from "./category/hm-category-value-picker";


interface HiveMimeVoteQueryDialogProps {
    post: PostDto;
    currentItem?: VoteQuery | null;
    onFinished: (result: VoteQuery | null) => void;
}

export const HiveMimeFilterConditionCreator = observer(({ post, currentItem = null, onFinished }: HiveMimeVoteQueryDialogProps) => {
    const item = useMemo(() => currentItem ?? new VoteQuery(), [currentItem]);

    const pollMapping: {
        [key in PollType]: React.ReactElement;
    } = {
        [PollType.Choice]: <HiveMimeFilterConditionChoiceValuePicker currentItem={item} />,
        [PollType.Score]: <HiveMimeFilterConditionScoreValuePicker currentItem={item} poll={item.poll!} />,
        [PollType.Rank]: <HiveMimeFilterConditionRankValuePicker currentItem={item} poll={item.poll!} />,
        [PollType.Category]: <HiveMimeFilterConditionCategoryValuePicker currentItem={item} poll={item.poll!} />,
    };

    return (
        <div>
            <HiveMimeMultiStep canCancel onCancelled={() => onFinished(null)} onFinished={() => onFinished(item)} showProgress={true}>
                <HiveMimeStep canContinue={item.candidate != null}>
                    <HiveMimeFilterConditionCandidatePicker currentItem={item} post={post} />
                </HiveMimeStep>
                <HiveMimeStep canContinue={item.value != null}>
                    <div>
                        <div className="text-sm text-muted-foreground mb-4">
                            Adjust the condition for <span className="font-bold">{item?.poll?.title}</span>: <span className="font-bold">{item?.candidate?.name}</span>.
                        </div>
                        {item.poll?.pollType && pollMapping[item.poll.pollType]}
                    </div>
                </HiveMimeStep>
            </HiveMimeMultiStep>
        </div>
    );
});
