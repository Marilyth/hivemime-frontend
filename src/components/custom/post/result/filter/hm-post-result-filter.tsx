import { observer } from "mobx-react-lite";
import { PollCandidateDto, PollDto, PollType, PostDto } from "@/lib/Api";
import { ValueOperator, VoteQuery, VoteQueryGroup } from "@/lib/query-builder";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { HiveMimeMultiStep, HiveMimeStep, useHiveMimeStep } from "@/components/custom/utility/hm-multistep-ui";
import { getReferenceId } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState, useMemo, useEffect } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HiveMimeHoverCard } from "@/components/custom/utility/hm-hover-card";
import { HiveMimePollTypeIcon } from "@/components/custom/utility/hm-poll-type-icon";
import { Plus } from "lucide-react";
import { HiveMimeInlineSelectTrigger } from "@/components/custom/utility/hm-inline-select";
import { Select, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";


interface HiveMimePostResultFilterProps {
    post: PostDto;
    builder: VoteQueryGroup;
    isOpen: boolean;
    onFinished: () => void;
}

interface HiveMimeVoteQueryGroupBuilderProps {
    builder: VoteQueryGroup;
}

interface HiveMimeVoteQueryBuilderProps {
    currentItem: VoteQuery;
}

interface HiveMimeFilterDialogCandidatePickerProps {
    post: PostDto;
    currentItem: VoteQuery;
}

interface HiveMimeVoteQueryDialogProps {
    post: PostDto;
    currentItem?: VoteQuery;
    onFinished: (query: VoteQuery | null) => void;
}

export const HiveMimePostResultFilter = observer(({ post, builder, isOpen, onFinished }: HiveMimePostResultFilterProps) => {
    const [showCreator, setShowCreator] = useState(false);

    function handleFinished(newQuery: VoteQuery | null) {
        if (newQuery) {
            builder.children.push(newQuery);
        }

        setShowCreator(false);
    }

    return (
        <Dialog open={isOpen} onOpenChange={onFinished}>
            <DialogContent>
                {showCreator ?
                    <div className="flex flex-col">
                        <span className="text-lg font-semibold">
                            Create condition
                        </span>

                        <HiveMimeFilterCreator post={post} onFinished={handleFinished} />
                    </div> :
                    <div className="flex flex-col">
                        <span className="text-lg font-semibold">
                            Filter votes
                        </span>

                        <span className="text-sm text-muted-foreground mb-4">
                            Add conditions to filter out votes you don't want to see.
                        </span>

                        {builder.children.length > 0 &&
                        <div className="bg-muted border rounded py-2 mb-2">
                            <HiveMimeVoteQueryGroupBuilder builder={builder} />
                        </div>}
                        <Button variant="outline" onClick={() => setShowCreator(true)}>
                            <Plus />
                            Add condition
                        </Button>
                    </div>
                }
            </DialogContent>
        </Dialog>
    );
});

export const HiveMimeVoteQueryGroupBuilder = observer(({ builder }: HiveMimeVoteQueryGroupBuilderProps) => {
    return (
        <div className="flex flex-col gap-2 border-l pl-2">
            {builder.children.map((item, index) =>
                item instanceof VoteQueryGroup ?
                    <HiveMimeVoteQueryGroupBuilder key={index} builder={item as VoteQueryGroup} /> :
                    <HiveMimeVoteQueryBuilder key={index} currentItem={item as VoteQuery} />
            )}
        </div>
    );
});

const HiveMimeVoteQueryBuilder = observer(({ currentItem }: HiveMimeVoteQueryBuilderProps) => {
    return (
        <div className="flex flex-row gap-2">
            {currentItem.toString()}
        </div>
    );
});

export const HiveMimeFilterCreator = observer(({ post, currentItem, onFinished }: HiveMimeVoteQueryDialogProps) => {
    const item = useMemo(() => currentItem ?? new VoteQuery(), [currentItem]);

    const pollMapping: { [key in PollType]: React.ReactElement } = {
        [PollType.Choice]: <HiveMimeFilterDialogCandidateChoiceValuePicker currentItem={item} post={post} />,
        [PollType.Score]: <span>Todo</span>,
        [PollType.Rank]: <span>Todo</span>,
        [PollType.Category]: <span>Todo</span>,
    };

    return (
        <div>
            <HiveMimeMultiStep canCancel onCancelled={() => onFinished(null)} onFinished={() => onFinished(item)}>
                <HiveMimeStep canContinue={item.candidate != null}>
                    <HiveMimeFilterDialogCandidatePicker currentItem={item} post={post} />
                </HiveMimeStep>
                <HiveMimeStep canContinue={item.value != null}>
                    {item.poll?.pollType && pollMapping[item.poll.pollType]}
                </HiveMimeStep>
            </HiveMimeMultiStep>
        </div>
    );
});

export const HiveMimeFilterDialogCandidatePicker = observer(({ post, currentItem }: HiveMimeFilterDialogCandidatePickerProps) => {
    const stepContext = useHiveMimeStep();

    function onCandidatePicked(poll: PollDto, candidate: PollCandidateDto) {
        // Todo: Replace with ID.
        // If a new candidate was picked, reset the value.
        if (currentItem.candidate?.name != candidate.name){
            currentItem.candidate = candidate;
            currentItem.poll = poll;
            currentItem.value = null;
            currentItem.valueOperator = null;
        }

        stepContext.next();
    }

    return (
        <div className="flex-col gap-2">
            <div className="text-sm text-muted-foreground mb-4">
                Pick a candidate to create a condition for.
            </div>

            <div className="border rounded">
                <Accordion type="single" collapsible>
                {post.polls!.map((poll) => (
                    <AccordionItem key={getReferenceId(poll)} value={getReferenceId(poll)} className="border-b last:border-b-0">
                        <AccordionTrigger className="bg-popover p-2">
                            <div className="flex flex-row gap-4 font-bold items-center">
                                <HiveMimePollTypeIcon answerType={poll.pollType!} className="text-honey-brown w-6 h-6 self-start" />
                                <span className="text-muted-foreground font-bold">
                                    {poll.title}
                                </span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent>
                            <div className="flex flex-col gap-2 p-2">
                                {poll.candidates!.map((candidate) => (
                                    <HiveMimeHoverCard key={getReferenceId(candidate)} onClick={() => onCandidatePicked(poll, candidate)} className="hover:text-honey-brown ">
                                        {candidate.name}
                                    </HiveMimeHoverCard>
                                ))}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                ))}
                </Accordion>
            </div>
        </div>
    );
});

export const HiveMimeFilterDialogCandidateChoiceValuePicker = observer(({ post, currentItem }: HiveMimeFilterDialogCandidatePickerProps) => {
    useEffect(() => {
        currentItem.valueOperator = ValueOperator.Equals;

        if (currentItem.value == null)
            currentItem.value = 1;
    }, [currentItem]);

    function setValue(value: number) {
        currentItem.value = value;
    }

    return (
        <div className="flex-col gap-2">
            <div className="text-sm text-muted-foreground mb-4">
                Adjust the condition for <span className="font-bold">{currentItem.poll?.title}</span>: <span className="font-bold">{currentItem.candidate?.name}</span>.
            </div>

            <span className="text-sm text-muted-foreground mb-4">
                <span className="font-bold">{currentItem.candidate?.name}</span> was
                <Select
                    value={currentItem.value === 1 ? "1" : "0"}
                    onValueChange={(value) => setValue(Number(value))}
                >
                    <HiveMimeInlineSelectTrigger>
                        <SelectValue />
                    </HiveMimeInlineSelectTrigger>
                    <SelectContent>
                        <SelectItem value="1">selected</SelectItem>
                        <SelectItem value="0">not selected</SelectItem>
                    </SelectContent>
                </Select>
            </span>
        </div>
    );
});