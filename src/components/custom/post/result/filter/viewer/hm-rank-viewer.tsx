import { hiveMimeRankIcon } from "@/components/custom/utility/hm-rank-icon";
import { CandidateDto, PollDto, FilterQuery } from "@/lib/Api";
import { valueOperatorToInlineString } from "@/lib/utils";
import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import { HiveMimeConditionViewer } from "../hm-condition-viewer";

interface HiveMimeFilterConditionRankValueViewerProps {
    currentItem: FilterQuery;
    candidate: CandidateDto;
    poll: PollDto;
}

export const HiveMimeFilterConditionRankValueViewer = observer(({ currentItem, poll, candidate }: HiveMimeFilterConditionRankValueViewerProps) => {
    const { t } = useTranslation();

    const values = currentItem.value == null
        ? [t("posts:filter.unranked")]
        : [hiveMimeRankIcon(Number(poll.maxValue! - Number(currentItem.value)) + 1)];

    return (
        <HiveMimeConditionViewer
            pollName={poll.title}
            name={candidate.name}
            operator={valueOperatorToInlineString(currentItem.valueOperator!)}
            negated={currentItem.isNegated}
            values={values}
        />
    );
});
