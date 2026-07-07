"use client";

import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import { PollDto } from "@/lib/Api";
import { HiveMimeLocatePollVoteCandidate } from "./hm-locate-poll-vote-candidate";
import { UiPollVoteDto } from "@/lib/vote-models";
import { LocationRectangles } from "@/components/custom/utility/location-picker";

export interface HiveMimeLocatePollVoteProps {
  poll: PollDto;
  pollVotes: UiPollVoteDto;
}

export const HiveMimeLocatePollVote = observer(({ poll, pollVotes }: HiveMimeLocatePollVoteProps) => {
  const { t } = useTranslation();

  for (const candidateVote of pollVotes.candidates!) {
    if (candidateVote.rectangles == null)
      candidateVote.rectangles = new LocationRectangles(poll.maxVotes);
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="text-informational text-sm">{t("posts:vote.locateInstruction", { minVotes: poll.minVotes, maxVotes: poll.maxVotes })}</span>
      <HiveMimeLocatePollVoteCandidate
        vote={pollVotes.candidates![0]}
        candidate={poll.candidates![0]}
      />
    </div>
  );
});
