"use client";

import { ListPollDto, PollType, UpsertVoteToPollDto, UpsertVoteToPostDto } from "@/lib/Api";
import { HiveMimePickSingleChoicePoll } from "./hm-pick-single-choice-poll";
import { ReactNode } from "react";
import { HiveMimePollTypeIcon } from "../hm-poll-type-icon";
import { Button } from "../../button";
import { Send } from "lucide-react";
import { observer } from "mobx-react-lite";
import { HiveMimePickMultipleChoicePoll } from "./hm-pick-multiple-choice-poll";
import { HiveMimePickScoringPoll } from "./hm-pick-scoring-poll";
import { HiveMimePickRankingPoll } from "./hm-pick-ranking-poll";

export type HiveMimeListPollProps =   {
  poll: ListPollDto;
  pollVote: UpsertVoteToPollDto;
}

export const HiveMimeListPoll = observer(({ poll, pollVote }: HiveMimeListPollProps) => {
  const pollMapping: { [key in PollType]: ReactNode } = {
      [PollType.SingleChoice]: <HiveMimePickSingleChoicePoll poll={poll} pollVotes={pollVote} />,
      [PollType.MultipleChoice]: <HiveMimePickMultipleChoicePoll poll={poll} pollVotes={pollVote} />,
      [PollType.Scoring]: <HiveMimePickScoringPoll poll={poll} pollVotes={pollVote} />,
      [PollType.Ranking]: <HiveMimePickRankingPoll poll={poll} pollVotes={pollVote} />,
      [PollType.Categorization]: <span>ToDo</span>
    };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row items-center gap-2">
        <div className="flex flex-1 flex-col gap-2">
            <span className="text-honey-brown">{poll.title}</span>
            <span className="text-muted-foreground">{poll.description}</span>
        </div>
        <HiveMimePollTypeIcon answerType={poll.pollType!} className="text-gray-500 w-6 h-6 self-start" />
      </div>

      {pollMapping[poll.pollType!]}

      <Button className="w-full" variant={"outline"} disabled >
        <Send />
        Submit
      </Button>
    </div>
  );
});
