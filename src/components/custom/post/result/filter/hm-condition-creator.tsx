import { HiveMimeMultiStep, HiveMimeStep } from "@/components/custom/utility/hm-multistep-ui";
import { CandidateDto, PollDto, PollType, PostDto, FilterQuery } from "@/lib/Api";
import { createFilterQuery } from "@/lib/vote-query";
import { observer } from "mobx-react-lite";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { HiveMimeFilterConditionChoiceValuePicker } from "./choice/hm-choice-value-picker";
import { HiveMimeFilterConditionPollPicker } from "./hm-poll-picker";
import { HiveMimeFilterConditionCandidatePicker } from "./hm-candidate-picker";
import { HiveMimeFilterConditionScoreValuePicker } from "./score/hm-score-value-picker";
import { HiveMimeFilterConditionRankValuePicker } from "./rank/hm-rank-value-picker";
import { HiveMimeFilterConditionCategoryValuePicker } from "./category/hm-category-value-picker";
import { HiveMimeFilterConditionDrawValuePicker } from "./draw/hm-draw-value-picker";
import { HiveMimeFilterConditionDateValuePicker } from "./date/hm-date-value-picker";


interface HiveMimeFilterQueryDialogProps {
    post: PostDto;
    currentItem?: FilterQuery | null;
    poll?: PollDto;
    candidate?: CandidateDto;
    onFinished: (result: FilterQuery | null) => void;
}

export const HiveMimeFilterConditionCreator = observer(({ post, currentItem = null, poll, candidate, onFinished }: HiveMimeFilterQueryDialogProps) => {
    const { t } = useTranslation();
    const [item] = useState(() => currentItem ?? createFilterQuery());
    const [selectedPoll, setSelectedPoll] = useState<PollDto | null>(poll ?? null);
    const [selectedCandidate, setSelectedCandidate] = useState<CandidateDto | null>(candidate ?? null);

    const valuePoll = poll ?? selectedPoll;
    const valueCandidate = candidate ?? selectedCandidate;

    const needsPoll = poll == null;
    const needsCandidate = candidate == null;

    if (!needsCandidate && item.property == null){
        handleCandidatePicked(candidate);
    }

    function handlePollPicked(poll: PollDto) {
        setSelectedPoll(poll);

        if (poll.candidates?.length === 1) {
            handleCandidatePicked(poll.candidates[0], poll);
        } else {
            setSelectedCandidate(null);
        }
    }

    function handleCandidatePicked(candidate: CandidateDto, poll?: PollDto) {
        const targetPoll = poll ?? valuePoll;

        const pollOrder = (post.polls!).findIndex(p => p === targetPoll);
        const candidateOrder = (targetPoll!.candidates!).findIndex(c => c === candidate);
        
        item.property = candidate.id ?? `${pollOrder}:${candidateOrder}`;
        item.value = null;
        item.valueOperator = undefined;
        item.isNegated = false;
        setSelectedCandidate(candidate);
    }

    const pollMapping: {
        [key in PollType]: React.ReactElement;
    } = {
        [PollType.Choice]: <HiveMimeFilterConditionChoiceValuePicker currentItem={item} candidate={valueCandidate!} poll={valuePoll!} />,
        [PollType.Score]: <HiveMimeFilterConditionScoreValuePicker currentItem={item} candidate={valueCandidate!} poll={valuePoll!} />,
        [PollType.Rank]: <HiveMimeFilterConditionRankValuePicker currentItem={item} candidate={valueCandidate!} poll={valuePoll!} />,
        [PollType.Category]: <HiveMimeFilterConditionCategoryValuePicker currentItem={item} candidate={valueCandidate!} poll={valuePoll!} />,
        [PollType.Draw]: <HiveMimeFilterConditionDrawValuePicker currentItem={item} candidate={valueCandidate!} poll={valuePoll!} />,
        [PollType.Date]: <HiveMimeFilterConditionDateValuePicker currentItem={item} candidate={valueCandidate!} poll={valuePoll!} />,
    };

    const showCandidateStep = needsCandidate && valuePoll != null && valuePoll.candidates!.length > 1;

    return (
        <div>
            <HiveMimeMultiStep canCancel onCancelled={() => onFinished(null)} onFinished={() => onFinished(item)} showProgress={true}>
                {needsPoll &&
                    <HiveMimeStep canContinue={selectedPoll != null}>
                        <HiveMimeFilterConditionPollPicker post={post} onPollPicked={handlePollPicked} />
                    </HiveMimeStep>
                }
                {showCandidateStep &&
                    <HiveMimeStep canContinue={selectedCandidate != null}>
                        <HiveMimeFilterConditionCandidatePicker poll={valuePoll!} onCandidatePicked={handleCandidatePicked} />
                    </HiveMimeStep>
                }
                <HiveMimeStep canContinue={valueCandidate != null}>
                    <div>
                        <div className="text-sm text-muted-foreground mb-4">
                            {t("posts:filter.adjustCondition", { pollTitle: valuePoll?.title, candidateName: valueCandidate?.name })}
                        </div>
                        {valuePoll?.pollType && pollMapping[valuePoll.pollType]}
                    </div>
                </HiveMimeStep>
            </HiveMimeMultiStep>
        </div>
    );
});
