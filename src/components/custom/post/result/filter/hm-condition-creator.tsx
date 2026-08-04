import { HiveMimeMultiStep, HiveMimeStep } from "@/components/custom/utility/hm-multistep-ui";
import { PollType, PostDto, VoteQuery } from "@/lib/Api";
import { createVoteQuery, resolveCandidate } from "@/lib/vote-query";
import { observer } from "mobx-react-lite";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { HiveMimeFilterConditionChoiceValuePicker } from "./choice/hm-choice-value-picker";
import { HiveMimeFilterConditionCandidatePicker } from "./hm-candidate-picker";
import { HiveMimeFilterConditionScoreValuePicker } from "./score/hm-score-value-picker";
import { HiveMimeFilterConditionRankValuePicker } from "./rank/hm-rank-value-picker";
import { HiveMimeFilterConditionCategoryValuePicker } from "./category/hm-category-value-picker";
import { HiveMimeFilterConditionDrawValuePicker } from "./draw/hm-draw-value-picker";


interface HiveMimeVoteQueryDialogProps {
    post: PostDto;
    currentItem?: VoteQuery | null;
    onFinished: (result: VoteQuery | null) => void;
}

export const HiveMimeFilterConditionCreator = observer(({ post, currentItem = null, onFinished }: HiveMimeVoteQueryDialogProps) => {
    const { t } = useTranslation();
    const item = useMemo(() => currentItem ?? createVoteQuery(), [currentItem]);
    const { poll, candidate } = resolveCandidate(post, item.candidateId);

    const pollMapping: {
        [key in PollType]: React.ReactElement;
    } = {
        [PollType.Choice]: <HiveMimeFilterConditionChoiceValuePicker currentItem={item} candidate={candidate!} poll={poll!} />,
        [PollType.Score]: <HiveMimeFilterConditionScoreValuePicker currentItem={item} candidate={candidate!} poll={poll!} />,
        [PollType.Rank]: <HiveMimeFilterConditionRankValuePicker currentItem={item} candidate={candidate!} poll={poll!} />,
        [PollType.Category]: <HiveMimeFilterConditionCategoryValuePicker currentItem={item} candidate={candidate!} poll={poll!} />,
        [PollType.Draw]: <HiveMimeFilterConditionDrawValuePicker currentItem={item} candidate={candidate!} poll={poll!} />,
        [PollType.Date]: <div>ToDo</div>,
    };

    return (
        <div>
            <HiveMimeMultiStep canCancel onCancelled={() => onFinished(null)} onFinished={() => onFinished(item)} showProgress={true}>
                <HiveMimeStep canContinue={candidate != null}>
                    <HiveMimeFilterConditionCandidatePicker currentItem={item} post={post} />
                </HiveMimeStep>
                <HiveMimeStep canContinue={true}>
                    <div>
                        <div className="text-sm text-muted-foreground mb-4">
                            {t("posts:filter.adjustCondition", { pollTitle: poll?.title, candidateName: candidate?.name })}
                        </div>
                        {poll?.pollType && pollMapping[poll.pollType]}
                    </div>
                </HiveMimeStep>
            </HiveMimeMultiStep>
        </div>
    );
});
