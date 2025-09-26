"use client";

import { Edit3 } from "lucide-react"
import { Button } from "../../button";
import { CreatePollDto, PollAnswerType } from "@/lib/Api";
import { InputWithLabel } from "../labelled-input";
import { observer } from "mobx-react-lite";
import { Separator } from "../../separator";
import { HiveMimeCreatePollTypePicker } from "./hm-create-pick-poll-type";
import React, { ReactNode } from "react";
import { HiveMimeCreateSingleChoicePoll } from "./hm-create-single-choice-poll";
import { HiveMimePollTypeIcon } from "../hm-poll-type-icon";

export interface HiveMimeCreatePollProps {
  poll: CreatePollDto;
}

export const HiveMimeCreatePoll = observer(({ poll }: HiveMimeCreatePollProps) => {
  const pollMapping: { [key in PollAnswerType]: ReactNode } = {
    [PollAnswerType.SingleChoice]: <HiveMimeCreateSingleChoicePoll poll={poll} />,
    [PollAnswerType.MultipleChoice]: <span>ToDo</span>,
    [PollAnswerType.Ranking]: <span>ToDo</span>,
    [PollAnswerType.Categorization]: <span>ToDo</span>,
  };

  return (
    <div>
      { poll.answerType == undefined &&
        <HiveMimeCreatePollTypePicker poll={poll} /> ||
        <div className="flex flex-col gap-2">

          <div className="flex flex-row gap-2">
            <InputWithLabel label="Question" placeholder="My poll's title" value={poll.title!}
              onChange={(e) => poll.title = e.target.value} />
          </div>

          <InputWithLabel label="Description" placeholder="My poll's description" value={poll.description!}
            onChange={(e) => poll.description = e.target.value} />
          
          <div className="flex flex-row items-center mt-8">
            <Separator className="flex-1" />
            <Button variant="link" className="border-1 cursor-pointer text-honey-brown" onClick={() => poll.answerType = undefined}>
              <HiveMimePollTypeIcon answerType={poll.answerType!} />
              {PollAnswerType[poll.answerType!]}
            </Button>
            <Separator className="flex-1" />
          </div>

          {pollMapping[poll.answerType!]}
        </div>
      }
    </div>
  );
});
