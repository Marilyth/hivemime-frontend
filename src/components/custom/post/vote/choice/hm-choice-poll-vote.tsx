"use client";

import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import { PollDto } from "@/lib/Api";
import { HiveMimeChoicePollVoteCandidate } from "./hm-choice-poll-vote-candidate";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { UiPollVoteDto } from "@/lib/vote-models";

export interface HiveMimePickMultipleChoicePollProps {
  poll: PollDto;
  pollVotes: UiPollVoteDto;
}

export const HiveMimeChoicePollVote = observer(({ poll, pollVotes }: HiveMimePickMultipleChoicePollProps) => {
  const { t } = useTranslation();

  function selectChoice(index: number) {
    const currentVote = pollVotes.candidates![index];

    if (currentVote.selected)
      currentVote.selected = false;
    else
      currentVote.selected = true;
  }

  function removeCustomCandidate(index: number) {
    poll.candidates!.splice(index, 1);
    pollVotes.candidates!.splice(index, 1);
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="text-informational text-sm">{t("posts:vote.choiceInstruction", { minVotes: poll.minVotes, maxVotes: poll.maxVotes })}</span>
        {poll.candidates!.map((candidate, index) => (
          <div key={index} className="flex flex-row gap-2">
            <div className="flex-1">
              <HiveMimeChoicePollVoteCandidate
                vote={pollVotes.candidates![index]}
                candidate={candidate}
                onClick={() => selectChoice(index)}
              />
            </div>

            {candidate.isCustom &&
              <Button variant="ghost" className="p-0 h-auto text-failure" onClick={() => removeCustomCandidate(index)}>
                <Trash2 />
              </Button>
            }
          </div>
        ))}
    </div>
  );
});
