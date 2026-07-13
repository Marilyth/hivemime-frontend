"use client";

import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import { PollDto } from "@/lib/Api";
import { HiveMimeDrawPollVoteCandidate } from "./hm-draw-poll-vote-candidate";
import { UiPollVoteDto } from "@/lib/vote-models";

export interface HiveMimeDrawPollVoteProps {
  poll: PollDto;
  pollVotes: UiPollVoteDto;
}

export const HiveMimeDrawPollVote = observer(({ poll, pollVotes }: HiveMimeDrawPollVoteProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-2">
      <span className="text-informational text-sm">{t("posts:vote.drawInstruction", { minCells: poll.minVotesPerCandidate, maxCells: poll.maxVotesPerCandidate })}</span>
      <HiveMimeDrawPollVoteCandidate
        vote={pollVotes.candidates![0]}
        candidate={poll.candidates![0]}
      />
    </div>
  );
});
