import { FilterQuery, ValueOperator, CandidateDto, PollDto } from "@/lib/Api";
import { observer } from "mobx-react-lite";
import { valueOperatorToInlineString } from "@/lib/utils";
import { HiveMimeConditionViewer, splitValues } from "../hm-condition-viewer";

interface HiveMimeFilterConditionDrawValueViewerProps {
    currentItem: FilterQuery;
    candidate: CandidateDto;
    poll: PollDto;
}

export const HiveMimeFilterConditionDrawValueViewer = observer(({ currentItem, candidate, poll }: HiveMimeFilterConditionDrawValueViewerProps) => {
    const operator = (currentItem.valueOperator ?? ValueOperator.Inside) as ValueOperator;

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
