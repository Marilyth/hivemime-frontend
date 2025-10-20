"use client";

import { Send } from "lucide-react"
import { Button } from "../../../button";
import { observer } from "mobx-react-lite";
import { ListPollDto, UpsertVoteToPollDto } from "@/lib/Api";
import { HiveMimePickSingleChoiceCandidate } from "./hm-pick-single-choice-candidate";

export interface HiveMimePickSingleChoicePollProps {
  poll: ListPollDto;
  pollVotes: UpsertVoteToPollDto;
}

export const HiveMimePickSingleChoicePoll = observer(({ poll, pollVotes }: HiveMimePickSingleChoicePollProps) => {
  function selectChoice(index: number) {
    const currentVote = pollVotes.candidates![index];
    const currentValue = currentVote?.value;

    // Flip the vote state.
    currentVote!.value = ((currentValue ?? 0) + 1) % 2;

    if (currentVote!.value === 0)
      return;

    // If the value is set to 1, set all other votes to 0.
    // Since this is a single-choice poll.
    for (let i = 0; i < pollVotes.candidates!.length; i++) {
      if (i !== index) {
        pollVotes.candidates![i].value = 0;
      }
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="text-gray-500 text-sm">Please pick 1 option</span>
        {poll.candidates!.map((candidate, index) => (
          <HiveMimePickSingleChoiceCandidate key={index} vote={pollVotes.candidates![index]} candidate={candidate}
            onClick={() => selectChoice(index)}
          />
        ))}
    </div>
  );
});
