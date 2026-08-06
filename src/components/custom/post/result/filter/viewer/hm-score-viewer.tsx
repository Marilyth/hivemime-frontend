import { CandidateDto, PollDto, FilterQuery } from "@/lib/Api";
import { valueOperatorToInlineString } from "@/lib/utils";
import { observer } from "mobx-react-lite";
import { HiveMimeConditionViewer, splitValues } from "../hm-condition-viewer";

interface HiveMimeFilterConditionScoreValueViewerProps {
    currentItem: FilterQuery;
    candidate: CandidateDto;
    poll: PollDto;
}

export const HiveMimeFilterConditionScoreValueViewer = observer(({ currentItem, candidate, poll }: HiveMimeFilterConditionScoreValueViewerProps) => {
    return (
        <HiveMimeConditionViewer
            pollName={poll.title}
            name={candidate.name}
            operator={valueOperatorToInlineString(currentItem.valueOperator!)}
            negated={currentItem.isNegated}
            values={splitValues(currentItem.value)}
        />
    );
});
