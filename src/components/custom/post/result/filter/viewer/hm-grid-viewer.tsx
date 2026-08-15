import { FilterQuery, CandidateDto, PollDto, ValueOperator } from "@/lib/Api";
import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import { valueOperatorToInlineString } from "@/lib/utils";
import { CellSubProperty } from "@/lib/vote-query";
import { HiveMimeConditionViewer, splitValues } from "../hm-condition-viewer";

interface HiveMimeFilterConditionGridValueViewerProps {
    currentItem: FilterQuery;
    candidate: CandidateDto;
    poll: PollDto;
}

export const HiveMimeFilterConditionGridValueViewer = observer(({ currentItem, candidate, poll }: HiveMimeFilterConditionGridValueViewerProps) => {
    const { t } = useTranslation();

    const subValue = currentItem.subProperty ?? CellSubProperty;
    const operator = currentItem.valueOperator ?? ValueOperator.Equals;
    const values = splitValues(currentItem.value);

    return (
        <HiveMimeConditionViewer
            pollName={poll.title}
            name={candidate.name}
            subValue={t(`posts:filter.gridSub${subValue}`)}
            operator={valueOperatorToInlineString(operator)}
            negated={currentItem.isNegated}
            values={values}
        />
    );
});
