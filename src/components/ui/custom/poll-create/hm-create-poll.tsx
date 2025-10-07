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
import { motion } from "framer-motion";

export interface HiveMimeCreatePollProps {
  poll: CreatePollDto;
  canDelete: boolean;
  onDeleteRequested?: () => void;
}

export const HiveMimeCreatePoll = observer((props: HiveMimeCreatePollProps) => {
  const pollMapping: { [key in PollType]: ReactNode } = {
    [PollType.SingleChoice]: <HiveMimeCreateSingleChoicePoll poll={props.poll} />,
    [PollType.MultipleChoice]: <HiveMimeCreateMultipleChoicePoll poll={props.poll} />,
    [PollType.Scoring]: <HiveMimeCreateScoringPoll poll={props.poll} />,
    [PollType.Ranking]: <HiveMimeCreateRankingPoll poll={props.poll} />,
    [PollType.Categorization]: <HiveMimeCreateCategorizationPoll poll={props.poll} />,
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row gap-2 items-end">
        <InputWithLabel isRequired label="Poll title" placeholder="Give your poll a title." value={props.poll.title!}
          onChange={(e) => props.poll.title = e.target.value} />
        <Button disabled={!props.canDelete} variant="ghost" className="text-muted-foreground hover:text-red-400" onClick={props.onDeleteRequested}>
          <Trash2 />
        </Button>
      </div>

      <TextAreaWithLabel className="mb-8" label="Description" placeholder="Optionally, add a description." value={props.poll.description!}
        onChange={(e) => props.poll.description = e.target.value} />

      { props.poll.pollType == undefined ?
        <motion.div key="pollPicker"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.15 }}>
          <HiveMimeCreatePollTypePicker poll={props.poll} />
        </motion.div> :

        <motion.div key="pollEditor"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.15 }}
          className="flex flex-col gap-2">
          <div className="flex flex-row items-center">
            <Separator className="flex-1" />
            <Button variant="link" className="border-1 cursor-pointer text-honey-brown" onClick={() => props.poll.pollType = undefined}>
              <HiveMimePollTypeIcon answerType={props.poll.pollType!} />
              {props.poll.pollType}
            </Button>
            <Separator className="flex-1" />
          </div>

          {pollMapping[props.poll.pollType!]}
        </motion.div>
      }
    </div>
  );
});
