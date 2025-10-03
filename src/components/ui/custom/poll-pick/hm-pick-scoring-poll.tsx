"use client";

import { observer } from "mobx-react-lite";
import { ListPollDto, UpsertVoteToPollDto } from "@/lib/Api";
import { HiveMimePickScoringCandidate } from "./hm-pick-scoring-candidate";

export interface HiveMimeScoringPollProps {
  poll: ListPollDto;
  pollVotes: UpsertVoteToPollDto;
}

export const HiveMimeScoringPoll = observer(({ poll, pollVotes }: HiveMimeScoringPollProps) => {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-gray-500 text-sm">Please score the candidates between {poll.minValue} and {poll.maxValue}.</span>
        {poll.candidates!.map((candidate, index) => (
          <HiveMimePickScoringCandidate key={index} vote={pollVotes.candidates![index]} candidate={candidate} poll={poll} />
        ))}
    </div>
  );
});
