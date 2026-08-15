import { FilterQuery, CandidateDto, PollDto } from "@/lib/Api";
import { observer } from "mobx-react-lite";
import { valueOperatorToInlineString } from "@/lib/utils";
import { InsideOperator } from "@/lib/vote-query";
import { HiveMimeConditionViewer, splitValues } from "../hm-condition-viewer";

interface HiveMimeFilterConditionGridValueViewerProps {
    currentItem: FilterQuery;
    candidate: CandidateDto;
    poll: PollDto;
}

export const HiveMimeFilterConditionGridValueViewer = observer(({ currentItem, candidate, poll }: HiveMimeFilterConditionGridValueViewerProps) => {
    const operator = currentItem.valueOperator ?? InsideOperator;

    return (
        <HiveMimeConditionViewer
            pollName={poll.title}
            name={candidate.name}
            negated={currentItem.isNegated}
            operator={valueOperatorToInlineString(operator)}
            values={splitValues(currentItem.value)}
        />
    );
});
