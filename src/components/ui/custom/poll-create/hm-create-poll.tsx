"use client";

import { Button } from "../../button";
import { CreatePollDto, PollType } from "@/lib/Api";
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
  const pollMapping: { [key in PollType]: ReactNode } = {
    [PollType.Value0]: <HiveMimeCreateSingleChoicePoll poll={poll} />,
    [PollType.Value1]: <span>ToDo</span>,
    [PollType.Value2]: <span>ToDo</span>,
    [PollType.Value3]: <span>ToDo</span>,
    [PollType.Value4]: <span>ToDo</span>
  };

  return (
    <div>
      { poll.pollType == undefined &&
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
            <Button variant="link" className="border-1 cursor-pointer text-honey-brown" onClick={() => poll.pollType = undefined}>
              <HiveMimePollTypeIcon answerType={poll.pollType!} />
              {PollType[poll.pollType!]}
            </Button>
            <Separator className="flex-1" />
          </div>

          {pollMapping[poll.pollType!]}
        </div>
      }
    </div>
  );
});
