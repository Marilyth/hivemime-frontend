"use client";

import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import { PollDto } from "@/lib/Api";
import { HiveMimeGridPollVoteCandidate } from "./hm-grid-poll-vote-candidate";
import { UiPollVoteDto } from "@/lib/vote-models";

export interface HiveMimeGridPollVoteProps {
  poll: PollDto;
  pollVotes: UiPollVoteDto;
}

export const HiveMimeGridPollVote = observer(({ poll, pollVotes }: HiveMimeGridPollVoteProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-2">
      <span className="text-informational text-sm">{t("posts:vote.gridInstruction", { minCells: poll.minVotesPerCandidate, maxCells: poll.maxVotesPerCandidate })}</span>
      <HiveMimeGridPollVoteCandidate
        vote={pollVotes.candidates![0]}
        candidate={poll.candidates![0]}
      />
    </div>
  );
});
