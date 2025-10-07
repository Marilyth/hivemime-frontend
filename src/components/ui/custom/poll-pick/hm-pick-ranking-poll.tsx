"use client";

import { observer } from "mobx-react-lite";
import { ListPollDto, UpsertVoteToPollDto } from "@/lib/Api";
import { HiveMimePickRankingCandidate } from "./hm-pick-ranking-candidate";
import { useState } from "react";
import { CombinedPollCandidate } from "@/lib/view-models";
import { LayoutGroup, motion, AnimatePresence } from "framer-motion";
import { getReferenceId } from "@/lib/utils";

export interface HiveMimePickRankingPollProps {
  poll: ListPollDto;
  pollVotes: UpsertVoteToPollDto;
}

export const HiveMimePickRankingPoll = observer(({ poll, pollVotes }: HiveMimePickRankingPollProps) => {
  const [combinedCandidates, setCombinedCandidates] = useState<CombinedPollCandidate[]>(() => {
    return poll.candidates!.map((candidate, index) => ({
      candidate: candidate,
      vote: pollVotes.candidates![index]
    }));
  });

  function getRankedCandidates() {
    const candidates = combinedCandidates.filter(c => c.vote.value != null);
    candidates.sort((a, b) => {
      return (a.vote.value! - b.vote.value!);
    });

    return candidates;
  }

  function getUnrankedCandidates() {
    return combinedCandidates.filter(c => c.vote.value == null);
  }

  function rankCandidate(candidate: CombinedPollCandidate, rank: number | null) {
    if (candidate.vote.value != null) {
      for (const c of getRankedCandidates()) {
        if (c.vote.value! > candidate.vote.value!) {
          c.vote.value! -= 1;
        }
      }

      candidate.vote.value = null;
    }

    else {
      if (rank == null)
        rank = getRankedCandidates().length;

      // Shift down all candidates that have a rank >= the new rank.
      for(const candidate of getRankedCandidates()) {
        if (candidate.vote.value! >= rank) {
          candidate.vote.value! += 1;
        }
      }

      candidate.vote.value = rank;
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="text-gray-500 text-sm">Please rank the candidates in order of preference.</span>

      <LayoutGroup>
        <motion.div layout className="flex flex-col bg-honey-brown/20 p-2 rounded-md border-2 border-honey-brown/30 gap-2">
          <motion.div layout="position" className="text-sm text-center mb-2">
            Ranked candidates
          </motion.div>

            {getRankedCandidates().map((candidate) => (
              <motion.div key={getReferenceId(candidate)} layoutId={getReferenceId(candidate)}>
                <HiveMimePickRankingCandidate combined={candidate}
                  onClick={() => rankCandidate(candidate, null)}
                />
              </motion.div>
            ))}

          <AnimatePresence>
            <motion.div
              layout
              animate={{ opacity: getUnrankedCandidates().length === 0 ? 0 : 1 }}
              className="text-muted-foreground text-center border-1 border-dashed border-muted-foreground/20 rounded-md text-sm p-1"
            >
                <span>Please select your {getRankedCandidates().length + 1}. candidate</span>
            </motion.div>
        </AnimatePresence>

        </motion.div>
          <motion.div layout
            className="flex flex-col gap-2 bg-muted-foreground/5 p-2 rounded-md border-2 border-muted-foreground/10">
            <motion.div layout="position" className="text-sm text-center mb-2">
              Unranked candidates
            </motion.div>

            {getUnrankedCandidates().map((candidate) => (
              <motion.div key={getReferenceId(candidate)} layoutId={getReferenceId(candidate)}>
                <HiveMimePickRankingCandidate combined={candidate}
                  onClick={() => rankCandidate(candidate, null)}
                />
              </motion.div>
            ))}
          </motion.div>
      </LayoutGroup>
    </div>
  );
});
