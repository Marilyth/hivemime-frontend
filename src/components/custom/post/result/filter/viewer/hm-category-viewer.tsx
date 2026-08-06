import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import { HiveMimeCategoryTag } from "../../../vote/category/hm-category-poll-vote-category";
import { CandidateDto, PollDto, ValueOperator, FilterQuery } from "@/lib/Api";
import { valueOperatorToInlineString } from "@/lib/utils";
import { HiveMimeConditionViewer } from "../hm-condition-viewer";

interface HiveMimeFilterConditionCategoryValueViewerProps {
    currentItem: FilterQuery;
    candidate: CandidateDto;
    poll: PollDto;
}

export const HiveMimeFilterConditionCategoryValueViewer = observer(({ currentItem, candidate, poll }: HiveMimeFilterConditionCategoryValueViewerProps) => {
    const { t } = useTranslation();

    const values = currentItem.value == null
        ? [t("posts:filter.uncategorized")]
        : [<HiveMimeCategoryTag key="category" category={poll.categories!.find(c => c.id === currentItem.value)!} />];

    return (
        <HiveMimeConditionViewer
            pollName={poll.title}
            name={candidate.name}
            operator={valueOperatorToInlineString(ValueOperator.Equals)}
            negated={currentItem.isNegated}
            values={values}
        />
    );
});
