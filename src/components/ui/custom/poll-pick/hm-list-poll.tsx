"use client";

import { ListPollDto, PollAnswerType } from "@/lib/Api";
import { HiveMimePickSingleChoicePoll } from "./hm-pick-single-choice-poll";
import { ReactNode } from "react";
import { HiveMimePollTypeIcon } from "../hm-poll-type-icon";

export type HiveMimeListPollProps =   {
  poll: ListPollDto;
}

export function HiveMimeListPoll({ poll }: HiveMimeListPollProps) {
  const pollMapping: { [key in PollAnswerType]: ReactNode } = {
      [PollAnswerType.SingleChoice]: <HiveMimePickSingleChoicePoll poll={poll} />,
      [PollAnswerType.MultipleChoice]: <span>ToDo</span>,
      [PollAnswerType.Ranking]: <span>ToDo</span>,
      [PollAnswerType.Categorization]: <span>ToDo</span>,
    };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row items-center gap-2">
        <div className="flex flex-1 flex-col gap-2">
            <span className="text-honey-brown">{poll.title}</span>
            <span className="text-muted-foreground">{poll.description}</span>
        </div>
        <HiveMimePollTypeIcon answerType={poll.pollType!} className="text-gray-500" />
      </div>
        
      {pollMapping[poll.pollType!]}
    </div>
  );
}
