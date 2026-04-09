"use client";

import { observer } from "mobx-react-lite";
import { PollDto, VoteOnPollDto } from "@/lib/Api";
import { HiveMimeScorePollVoteCandidate } from "./hm-score-poll-vote-candidate";

export interface HiveMimePickScoringPollProps {
  poll: PollDto;
  pollVotes: VoteOnPollDto;
}

export const HiveMimeScorePollVote = observer(({ poll, pollVotes }: HiveMimePickScoringPollProps) => {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-informational text-sm">Please score the candidates between {poll.minValue} and {poll.maxValue}.</span>
        {poll.candidates!.map((candidate, index) => (
          <HiveMimeScorePollVoteCandidate key={index} vote={pollVotes.candidates![index]} candidate={candidate} poll={poll} />
        ))}
    </div>
  );
});
