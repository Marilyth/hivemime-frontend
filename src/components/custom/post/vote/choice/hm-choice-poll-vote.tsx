"use client";

import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import { PollDto, PollVoteDto } from "@/lib/Api";
import { HiveMimeChoicePollVoteCandidate } from "./hm-choice-poll-vote-candidate";

export interface HiveMimePickMultipleChoicePollProps {
  poll: PollDto;
  pollVotes: PollVoteDto;
}

export const HiveMimeChoicePollVote = observer(({ poll, pollVotes }: HiveMimePickMultipleChoicePollProps) => {
  const { t } = useTranslation();

  function selectChoice(index: number) {
    const currentVote = pollVotes.candidates![index];
    const currentValue = currentVote?.value;

    // Flip the vote state.
    if (currentValue == 1)
      currentVote!.value = null;
    else
      currentVote!.value = 1;
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="text-informational text-sm">{t("posts:vote.choiceInstruction", { minVotes: poll.minVotes, maxVotes: poll.maxVotes })}</span>
        {poll.candidates!.map((candidate, index) => (
          <HiveMimeChoicePollVoteCandidate key={index} vote={pollVotes.candidates![index]} candidate={candidate}
            onClick={() => selectChoice(index)}
          />
        ))}
    </div>
  );
});
