"use client";

import { ListPollDto, PollType, UpsertVoteToPollDto } from "@/lib/Api";
import { HiveMimePickSingleChoicePoll } from "./single-choice/hm-pick-single-choice-poll";
import { ReactNode } from "react";
import { HiveMimePollTypeIcon } from "../hm-poll-type-icon";
import { observer } from "mobx-react-lite";
import { HiveMimePickMultipleChoicePoll } from "./multiple-choice/hm-pick-multiple-choice-poll";
import { HiveMimePickScoringPoll } from "./scoring/hm-pick-scoring-poll";
import { HiveMimePickRankingPoll } from "./ranking/hm-pick-ranking-poll";
import { HiveMimePickCategorizationPoll } from "./categorization/hm-pick-categorization-poll";

export type HiveMimeListPollProps =   {
  poll: ListPollDto;
  pollVote: UpsertVoteToPollDto;
  footer: ReactNode;
}

export const HiveMimeListPoll = observer(({ poll, pollVote, footer }: HiveMimeListPollProps) => {
  const pollMapping: { [key in PollType]: ReactNode } =
  {
    [PollType.SingleChoice]: <HiveMimePickSingleChoicePoll poll={poll} pollVotes={pollVote} />,
    [PollType.MultipleChoice]: <HiveMimePickMultipleChoicePoll poll={poll} pollVotes={pollVote} />,
    [PollType.Scoring]: <HiveMimePickScoringPoll poll={poll} pollVotes={pollVote} />,
    [PollType.Ranking]: <HiveMimePickRankingPoll poll={poll} pollVotes={pollVote} />,
    [PollType.Categorization]: <HiveMimePickCategorizationPoll poll={poll} pollVotes={pollVote} />,
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

      {footer}
    </div>
  );
});
