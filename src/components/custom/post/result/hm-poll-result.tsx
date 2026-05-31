"use client";

import { PollDto, PollType } from "@/lib/Api";
import { HiveMimePollTypeIcon } from "../../utility/hm-poll-type-icon";
import { observer } from "mobx-react-lite";
import { ReactNode } from "react";
import { AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { getReferenceId } from "@/lib/utils";
import { HiveMimeChoiceResult } from "./choice/hm-choice-result";

export interface HiveMimePollResultProps {
  poll: PollDto;
  filter?: string;
}

export const HiveMimePollResult = observer(({ poll, filter }: HiveMimePollResultProps) => {
  const pollMapping: { [key in PollType]: ReactNode } =
  {
    [PollType.Choice]: <HiveMimeChoiceResult poll={poll} filter={filter} />,
    [PollType.Score]: <span>Score result not implemented yet</span>,
    [PollType.Rank]: <span>Rank result not implemented yet</span>,
    [PollType.Category]: <span>Category result not implemented yet</span>,
  };

  return (
    <AccordionItem value={getReferenceId(poll)} className="border-b last:border-b-0">
      <AccordionTrigger className="bg-popover rounded-none p-2">
        <div className="flex flex-row gap-4 font-bold items-center">
          <HiveMimePollTypeIcon answerType={poll.pollType!} className="text-honey-brown w-6 h-6 self-start" />
          <span className="text-muted-foreground font-bold">
            {poll.title}
          </span>
        </div>
      </AccordionTrigger>
      <AccordionContent className="p-4 flex flex-col gap-2" >
          {poll.description && <span className="text-muted-foreground">{poll.description}</span>}
          {pollMapping[poll.pollType!]} 
      </AccordionContent>
    </AccordionItem>
  );
});
