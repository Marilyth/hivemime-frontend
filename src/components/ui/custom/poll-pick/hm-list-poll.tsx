"use client";

import { ListPollDto, PollType, UpsertVoteToPollDto, UpsertVoteToPostDto } from "@/lib/Api";
import { HiveMimePickSingleChoicePoll } from "./hm-pick-single-choice-poll";
import { ReactNode, useEffect } from "react";
import { HiveMimePollTypeIcon } from "../hm-poll-type-icon";
import { Button } from "../../button";
import { Send } from "lucide-react";
import { observer } from "mobx-react-lite";
import { HiveMimePickMultipleChoiceCandidate } from "./hm-pick-multiple-choice-candidate";
import { HiveMimePickMultipleChoicePoll } from "./hm-pick-multiple-choice-poll";
import { HiveMimeScoringPoll } from "./hm-pick-scoring-poll";

export type HiveMimeListPollProps =   {
  poll: ListPollDto;
  pollVote: UpsertVoteToPollDto;
}

export const HiveMimeListPoll = observer(({ poll, pollVote }: HiveMimeListPollProps) => {
  const pollMapping: { [key in PollType]: ReactNode } = {
      [PollType.SingleChoice]: <HiveMimePickSingleChoicePoll poll={poll} pollVotes={pollVote} />,
      [PollType.MultipleChoice]: <HiveMimePickMultipleChoicePoll poll={poll} pollVotes={pollVote} />,
      [PollType.Scoring]: <HiveMimeScoringPoll poll={poll} pollVotes={pollVote} />,
      [PollType.Ranking]: <span>ToDo</span>,
      [PollType.Categorization]: <span>ToDo</span>
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

      <Button className="w-full" variant={"outline"} disabled >
        <Send />
        Submit
      </Button>
    </div>
  );
});
