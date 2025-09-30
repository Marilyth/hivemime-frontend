"use client";

import { Trash2 } from "lucide-react";
import { Button } from "../../button";
import { CreatePollDto, PollType } from "@/lib/Api";
import { InputWithLabel, TextAreaWithLabel } from "../labelled-input";
import { observer } from "mobx-react-lite";
import { Separator } from "../../separator";
import { HiveMimeCreatePollTypePicker } from "./hm-create-pick-poll-type";
import React, { ReactNode, useEffect } from "react";
import { HiveMimeCreateSingleChoicePoll } from "./hm-create-single-choice-poll";
import { HiveMimePollTypeIcon } from "../hm-poll-type-icon";
import { HiveMimeCreateMultipleChoicePoll } from "./hm-create-multiple-choice-poll";
import { HiveMimeCreateRankingPoll } from "./hm-create-ranking-poll";
import { HiveMimeCreateScoringPoll } from "./hm-create-scoring-poll";
import { HiveMimeCreateCategorizationPoll } from "./hm-create-categorization-poll";
import { PollCreationValidation } from "@/models/PollCreationValidation";

export interface HiveMimeCreatePollProps {
  validation: PollCreationValidation;
  poll: CreatePollDto;
  canDelete: boolean;
  onDeleteRequested?: () => void;
}

export const HiveMimeCreatePoll = observer((props: HiveMimeCreatePollProps) => {
  function validatePoll() {
    props.validation!.isValid = true;
    props.validation!.errors = [];
    
    if (props.poll.pollType === undefined) {
      props.validation!.isValid = false;
      props.validation!.errors = ["A poll type must be selected."];
    }
  }

  useEffect(() => {
    validatePoll();
  }, [props.poll.pollType]);

  const pollMapping: { [key in PollType]: ReactNode } = {
    [PollType.SingleChoice]: <HiveMimeCreateSingleChoicePoll validation={props.validation} poll={props.poll} />,
    [PollType.MultipleChoice]: <HiveMimeCreateMultipleChoicePoll validation={props.validation} poll={props.poll} />,
    [PollType.Rating]: <HiveMimeCreateScoringPoll validation={props.validation} poll={props.poll} />,
    [PollType.Ranking]: <HiveMimeCreateRankingPoll validation={props.validation} poll={props.poll} />,
    [PollType.Categorization]: <HiveMimeCreateCategorizationPoll validation={props.validation} poll={props.poll} />,
  };

  return (
    <div>
      { props.poll.pollType == undefined &&
        <HiveMimeCreatePollTypePicker poll={props.poll} /> ||
        <div className="flex flex-col gap-2">

          <div className="flex flex-row gap-2 items-end">
            <InputWithLabel label="Question" placeholder="My poll's title" value={props.poll.title!}
              onChange={(e) => props.poll.title = e.target.value} />
            <Button disabled={!props.canDelete} variant="ghost" className="text-muted-foreground hover:text-red-400" onClick={props.onDeleteRequested}>
              <Trash2 />
            </Button>
          </div>

          <TextAreaWithLabel label="Description" placeholder="My poll's description" value={props.poll.description!}
            onChange={(e) => props.poll.description = e.target.value} />

          <div className="flex flex-row items-center mt-8">
            <Separator className="flex-1" />
            <Button variant="link" className="border-1 cursor-pointer text-honey-brown" onClick={() => props.poll.pollType = undefined}>
              <HiveMimePollTypeIcon answerType={props.poll.pollType!} />
              {props.poll.pollType}
            </Button>
            <Separator className="flex-1" />
          </div>

          {pollMapping[props.poll.pollType!]}
        </div>
      }
    </div>
  );
});
