"use client";

import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import { PollDto } from "@/lib/Api";
import { UiPollVoteDto } from "@/lib/vote-models";
import { DatePicker } from "@/components/custom/utility/date-picker";

export interface HiveMimeDatePollVoteProps {
  poll: PollDto;
  pollVotes: UiPollVoteDto;
}

export const HiveMimeDatePollVote = observer(({ poll, pollVotes }: HiveMimeDatePollVoteProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-2">
      <span className="text-informational text-sm">{t("posts:vote.dateInstruction", { minDates: poll.minVotesPerCandidate, maxDates: poll.maxVotesPerCandidate })}</span>
      <DatePicker dateSelection={pollVotes.candidates![0].dateSelection!} />
    </div>
  );
});
