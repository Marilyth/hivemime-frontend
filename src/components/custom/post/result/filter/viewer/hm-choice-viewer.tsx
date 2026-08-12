import { CandidateDto, PollDto, ValueOperator, FilterQuery } from "@/lib/Api";
import { valueOperatorToInlineString } from "@/lib/utils";
import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import { HiveMimeConditionViewer } from "../hm-condition-viewer";

interface HiveMimeFilterConditionChoiceValueViewerProps {
    currentItem: FilterQuery;
    candidate: CandidateDto;
    poll: PollDto;
}

export const HiveMimeFilterConditionChoiceValueViewer = observer(({ currentItem, candidate, poll }: HiveMimeFilterConditionChoiceValueViewerProps) => {
    const { t } = useTranslation();

    return (
        <HiveMimeConditionViewer
            pollName={poll.title}
            name={candidate.name}
            negated={currentItem.isNegated}
            operator={valueOperatorToInlineString(ValueOperator.Equals)}
            values={[t("enums:selection.selected")]}
        />
    );
});
