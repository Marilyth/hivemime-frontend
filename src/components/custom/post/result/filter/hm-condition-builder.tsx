import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { BooleanOperator, CandidateDto, FilterQuery, FilterQueryBase, PollDto, PostDto } from "@/lib/Api";
import { createFilterQuery, expandInsideOperators } from "@/lib/vote-query";
import { getReferenceId } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { SelectItem } from "@/components/ui/select";
import { SelectChip, NegationChip } from "./builder/hm-builder-chip";
import { editorMapping } from "./builder/hm-builder-editors";
import { SendHorizonal } from "lucide-react";

interface HiveMimeFilterConditionOverflowBuilderProps {
    post: PostDto;
    onAddCondition: (result: FilterQueryBase) => void;
    lockedPoll?: PollDto;
    lockedCandidate?: CandidateDto;
}

export const HiveMimeFilterConditionOverflowBuilder = observer(({ post, onAddCondition, lockedPoll, lockedCandidate }: HiveMimeFilterConditionOverflowBuilderProps) => {
    const { t } = useTranslation();
    const [draft] = useState<FilterQuery>(() => createFilterQuery());
    const [selectedPoll, setSelectedPoll] = useState<PollDto | null>(lockedPoll ?? null);
    const [selectedCandidate, setSelectedCandidate] = useState<CandidateDto | null>(lockedCandidate ?? null);
    const [valid, setValid] = useState(false);
    const [resetKey, setResetKey] = useState(0);
    const [isActive, setIsActive] = useState(false);

    const availablePolls = post.polls ?? [];
    const hidePoll = lockedPoll != null || availablePolls.length === 1;
    const hideCandidate = lockedCandidate != null || (selectedPoll != null && (selectedPoll.candidates?.length ?? 0) === 1);

    useEffect(() => {
        resetBuilder();
    }, []);

    function clearDraftFields() {
        draft.property = null;
        draft.value = null;
        draft.valueOperator = undefined;
        setValid(false);
    }

    function resetBuilder() {
        if (lockedPoll == null)
            setSelectedPoll(null);
        if (lockedCandidate == null)
            setSelectedCandidate(null);

        clearDraftFields();
        setIsActive(false);

        if (lockedPoll && lockedCandidate) {
            const pollOrder = post.polls!.indexOf(lockedPoll);
            const candidateOrder = lockedPoll.candidates!.indexOf(lockedCandidate);
            draft.property = lockedCandidate.id ?? `${pollOrder}:${candidateOrder}`;
        } else if (!lockedPoll && availablePolls.length === 1) {
            handlePollPicked(availablePolls[0]);
        }
    }

    function handlePollPicked(poll: PollDto) {
        setSelectedPoll(poll);
        setSelectedCandidate(null);
        clearDraftFields();

        if (poll.candidates?.length === 1)
            handleCandidatePicked(poll.candidates[0], poll);
    }

    function handleCandidatePicked(candidate: CandidateDto, poll = selectedPoll) {
        setSelectedCandidate(candidate);
        draft.value = null;
        draft.valueOperator = undefined;
        setValid(false);

        const pollOrder = post.polls!.findIndex(p => p === poll);
        const candidateOrder = poll!.candidates!.findIndex(c => c === candidate);
        draft.property = candidate.id ?? `${pollOrder}:${candidateOrder}`;
    }

    function commit() {
        if (!valid)
            return;

        onAddCondition(expandInsideOperators({ ...draft, leftOperator: BooleanOperator.And }));

        resetBuilder();
        setResetKey(key => key + 1);
    }

    const Editor = selectedPoll ? editorMapping[selectedPoll.pollType!] : null;

    return (
        <div
            className="flex flex-wrap items-center gap-1 overflow-x-auto border rounded-md p-2"
            onClick={() => setIsActive(true)}
        >
            <NegationChip currentItem={draft} />
            {!hidePoll && (
                <SelectChip
                    autoOpen={isActive}
                    value={selectedPoll?.title ?? undefined}
                    onValueChange={(value) => {
                        const poll = availablePolls.find(p => p.title === value);
                        if (poll)
                            handlePollPicked(poll);
                    }}
                    lockedClassName="text-muted-purple"
                    placeholder={t("posts:filter.selectPoll")}
                    disabled={lockedPoll != null}
                >
                    {availablePolls.map(poll => (
                        <SelectItem key={getReferenceId(poll)} value={poll.title ?? ""}>{poll.title}</SelectItem>
                    ))}
                </SelectChip>
            )}

            {selectedPoll && !hideCandidate && (
                <SelectChip
                    autoOpen={isActive}
                    value={selectedCandidate?.name ?? undefined}
                    onValueChange={(value) => {
                        const candidate = selectedPoll.candidates!.find(c => c.name === value);
                        if (candidate)
                            handleCandidatePicked(candidate);
                    }}
                    lockedClassName="text-honey-brown"
                    placeholder={t("posts:filter.selectCandidate")}
                    disabled={lockedCandidate != null}
                >
                    {selectedPoll.candidates!.map(candidate => (
                        <SelectItem key={getReferenceId(candidate)} value={candidate.name ?? ""}>{candidate.name}</SelectItem>
                    ))}
                </SelectChip>
            )}

            {selectedCandidate && selectedPoll && Editor && (
                <Editor
                    key={`${getReferenceId(selectedCandidate)}-${resetKey}`}
                    currentItem={draft}
                    poll={selectedPoll}
                    candidate={selectedCandidate}
                    onValidChange={setValid}
                    isActive={isActive}
                />
            )}

            <Button type="button" variant="ghost" onClick={commit} disabled={!valid} className="ml-auto shrink-0 h-9 w-9 p-0">
                <SendHorizonal className="h-4 w-4" />
            </Button>
        </div>
    );
});
