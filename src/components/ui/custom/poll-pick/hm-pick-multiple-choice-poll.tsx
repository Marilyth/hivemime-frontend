"use client";

import { observer } from "mobx-react-lite";
import { ListPollDto, UpsertVoteToPollDto } from "@/lib/Api";
import { HiveMimePickMultipleChoiceCandidate } from "./hm-pick-multiple-choice-candidate";

export interface HiveMimePickMultipleChoicePollProps {
  poll: ListPollDto;
  pollVotes: UpsertVoteToPollDto;
}

export const HiveMimePickMultipleChoicePoll = observer(({ poll, pollVotes }: HiveMimePickMultipleChoicePollProps) => {
  function selectChoice(index: number) {
    const currentVote = pollVotes.candidates![index];
    const currentValue = currentVote?.value;

    // Flip the vote state.
    currentVote!.value = ((currentValue ?? 0) + 1) % 2;
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="text-gray-500 text-sm">Please pick between {poll.minVotes} and {poll.maxVotes} options</span>
        {poll.candidates!.map((candidate, index) => (
          <HiveMimePickMultipleChoiceCandidate key={index} vote={pollVotes.candidates![index]} candidate={candidate}
            onClick={() => selectChoice(index)}
          />
        ))}
    </div>
  );
});
