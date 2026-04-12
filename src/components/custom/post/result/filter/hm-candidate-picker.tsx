import { HiveMimeHoverCard } from "@/components/custom/utility/hm-hover-card";
import { useHiveMimeStep } from "@/components/custom/utility/hm-multistep-ui";
import { HiveMimePollTypeIcon } from "@/components/custom/utility/hm-poll-type-icon";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CandidateDto, PollDto, PostDto } from "@/lib/Api";
import { VoteQuery } from "@/lib/query-builder";
import { getReferenceId } from "@/lib/utils";
import { observer } from "mobx-react-lite";


interface HiveMimeFilterConditionCandidatePickerProps {
    post: PostDto;
    currentItem: VoteQuery;
}

export const HiveMimeFilterConditionCandidatePicker = observer(({ post, currentItem }: HiveMimeFilterConditionCandidatePickerProps) => {
    const stepContext = useHiveMimeStep();

    function onCandidatePicked(poll: PollDto, candidate: CandidateDto) {
        // If a new candidate was picked, reset the value.
        if (currentItem.candidate?.id != candidate.id){
            currentItem.candidate = candidate;
            currentItem.poll = poll;
            currentItem.value = null;
            currentItem.valueOperator = null;
            currentItem.isNegated = false;
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
                        <AccordionTrigger className="bg-popover rounded-none p-2">
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
