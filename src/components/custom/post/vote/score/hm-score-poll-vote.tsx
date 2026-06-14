"use client";

import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import { PollDto, PollVoteDto } from "@/lib/Api";
import { HiveMimeScorePollVoteCandidate } from "./hm-score-poll-vote-candidate";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

export interface HiveMimePickScoringPollProps {
  poll: PollDto;
  pollVotes: PollVoteDto;
}

export const HiveMimeScorePollVote = observer(({ poll, pollVotes }: HiveMimePickScoringPollProps) => {
  const { t } = useTranslation();

  function removeCustomCandidate(index: number) {
    poll.candidates!.splice(index, 1);
    pollVotes.candidates!.splice(index, 1);
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="text-informational text-sm">{t("posts:vote.scoreInstruction", { minValue: poll.minValue, maxValue: poll.maxValue })}</span>
        {poll.candidates!.map((candidate, index) => (
          <div key={index} className="flex flex-row gap-2">
            <div className="flex-1">
              <HiveMimeScorePollVoteCandidate
                vote={pollVotes.candidates![index]}
                candidate={candidate}
                poll={poll}
              />
            </div>

            {candidate.isCustom &&
              <Button variant="ghost" className="p-0 h-auto text-red-400" onClick={() => removeCustomCandidate(index)}>
                <Trash2 />
              </Button>
            }
          </div>
        ))}
    </div>
  );
});
