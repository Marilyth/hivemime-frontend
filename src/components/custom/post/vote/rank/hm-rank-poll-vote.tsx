"use client";

import { observer } from "mobx-react-lite";
import { PollDto } from "@/lib/Api";
import { HiveMimeRankPollVoteCandidate } from "./hm-rank-poll-vote-candidate";
import { CombinedPollCandidate } from "@/lib/view-models";
import { LayoutGroup, motion } from "framer-motion";
import { getReferenceId } from "@/lib/utils";
import { HiveMimeDraggable, OnDroppedArgs } from "../../../utility/hm-draggable";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { UiCandidateVote, UiPollVoteDto } from "@/lib/vote-models";

export interface HiveMimeRankPollVoteProps {
  poll: PollDto;
  pollVotes: UiPollVoteDto;
}

export const HiveMimeRankPollVote = observer(({ poll, pollVotes }: HiveMimeRankPollVoteProps) => {
  const { t } = useTranslation();

  function rerankCandidates() {
    let isRanked = true;

    for (let i = 0; i < pollVotes.candidates!.length; i++) {
      const candidate = pollVotes.candidates![i];

      if (!isRanked) {
        candidate.rank = undefined;
        continue;
      }

      if (candidate.rank != null)
        candidate.rank = i + 1;

      else
        isRanked = false;
    }
  }

  function triggerRank(candidate: CombinedPollCandidate) {
    const currentIndex = pollVotes.candidates!.findIndex(c => c === candidate.vote);
    pollVotes.candidates!.splice(currentIndex, 1);

    const rankedEndIndex = pollVotes.candidates!.findIndex(c => c.rank == null);

    candidate.vote.rank = candidate.vote.rank == null ? 1 : undefined;

    if (rankedEndIndex === -1)
      pollVotes.candidates!.push(candidate.vote);
    else
      pollVotes.candidates!.splice(rankedEndIndex, 0, candidate.vote);

    rerankCandidates();
  }

  function removeCustomCandidate(candidate: CombinedPollCandidate) {
    const voteIndex = pollVotes.candidates!.findIndex(c => c.name === candidate.vote.name);
    pollVotes.candidates!.splice(voteIndex, 1);

    const index = poll.candidates!.findIndex(c => c.name === candidate.candidate.name);
    poll.candidates!.splice(index, 1);

    rerankCandidates();
  }

  function onDrop(args: OnDroppedArgs) {
    const originalCandidate = args.draggableData as UiCandidateVote;
    const currentIndex = pollVotes.candidates!.findIndex(c => c.name === originalCandidate.name);
    
    for (let i = 0; i <= currentIndex; i++)
      pollVotes.candidates![i].rank = 1;

    rerankCandidates();
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="text-informational text-sm">{t("posts:vote.rankInstruction")}</span>

      <LayoutGroup>
        {pollVotes.candidates!.map((candidate) => {
          const combinedCandidate = {candidate: poll.candidates!.find(c => c.name === candidate.name)!, vote: candidate} as CombinedPollCandidate;

          if (!combinedCandidate.candidate)
            return null;

          return (
            <motion.div key={getReferenceId(candidate)} layoutId={getReferenceId(candidate)}>
              <HiveMimeDraggable dropAreaName={getReferenceId(poll)} onDropped={onDrop} draggableOnArea={[getReferenceId(poll)]} isDraggable isDropArea isSticky data={candidate}
                dataList={pollVotes.candidates!} allowedZones={['top', 'bottom']} className="flex flex-row gap-2">
                <div className="flex-1">
                  <HiveMimeRankPollVoteCandidate combined={combinedCandidate} poll={poll}
                    onClick={() => triggerRank(combinedCandidate)}
                  />
                </div>
                {combinedCandidate.candidate.isCustom &&
                  <Button variant="ghost" className="p-0 h-auto text-failure" onClick={() => removeCustomCandidate(combinedCandidate)}>
                    <Trash2 />
                  </Button>
                }
              </HiveMimeDraggable>
            </motion.div>
          )})}
      </LayoutGroup>
    </div>
  );
});
