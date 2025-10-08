"use client";

import { observer } from "mobx-react-lite";
import { ListPollDto, UpsertVoteToPollDto } from "@/lib/Api";
import { HiveMimePickRankingCandidate } from "./hm-pick-ranking-candidate";
import { useState } from "react";
import { CombinedPollCandidate } from "@/lib/view-models";
import { LayoutGroup, motion } from "framer-motion";
import { getReferenceId } from "@/lib/utils";
import { HiveMimeDraggable } from "../hm-draggable";

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

  function hasRankedCandidates() {
    return combinedCandidates.some(c => c.vote.value != null);
  }

  function hasUnrankedCandidates() {
    return combinedCandidates.some(c => c.vote.value == null);
  }

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
    if (rank == -1){
      rank = getRankedCandidates().length;
    }

    // Move all candidates lower than the candidate up one rank.
    if (candidate.vote.value != null) {
      for (const c of getRankedCandidates()) {
        if (c.vote.value! > candidate.vote.value!) {
          c.vote.value! -= 1;
        }
      }
    }

    // Move all candidates lower than the new rank down one rank.
    if (rank != null){
      for (const c of getRankedCandidates()) {
        if (c.vote.value! >= rank) {
          c.vote.value! += 1;
        }
      }
    }

    candidate.vote.value = rank;
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="text-gray-500 text-sm">Please rank the candidates in order of preference.</span>

      <LayoutGroup>
        
        <HiveMimeDraggable<CombinedPollCandidate> isDroppable onDropped={({draggableData}) => rankCandidate(draggableData, -1)} canDrop={(data) => data.vote.value == null}>
          <motion.div layout className="flex flex-col bg-honey-brown/20 p-2 rounded-md border-2 border-honey-brown/30 gap-2">
          <motion.div layout="position" className="text-sm text-center mb-2">
            Ranked candidates
          </motion.div>

            {getRankedCandidates().map((candidate) => (
              <motion.div key={getReferenceId(candidate)} layoutId={getReferenceId(candidate)}>
                <HiveMimeDraggable isDraggable isDroppable isSticky data={candidate}
                  edgeGap={1.5}
                  onDropped={(args) => rankCandidate(args.draggableData, candidate.vote.value! + (args.edge === "bottom" ? 1 : 0))}
                  allowedEdges={['top', 'bottom']}>
                  <HiveMimePickRankingCandidate combined={candidate}
                    onClick={() => rankCandidate(candidate, null)}
                  />
                </HiveMimeDraggable>
              </motion.div>
            ))}

          <motion.div
            layout
            className={`text-muted-foreground text-center border-1 border-dashed ${hasUnrankedCandidates() ? "border-muted-foreground/20" : "border-transparent"} rounded-md text-sm p-1`}
          >
            {hasUnrankedCandidates() ? (
              <span>Please select a candidate for rank {getRankedCandidates().length + 1}</span>
            ) : (
              <span>All candidates ranked</span>
            )}
          </motion.div>

        </motion.div>
        </HiveMimeDraggable>

        <HiveMimeDraggable<CombinedPollCandidate> isDroppable onDropped={(args) => {rankCandidate(args.draggableData, null)}} canDrop={(data) => data.vote.value != null}>
          <motion.div layout
            className="flex flex-col gap-2 bg-muted-foreground/5 p-2 rounded-md border-2 border-muted-foreground/10">
            <motion.div layout="position" className="text-sm text-center mb-2">
              Unranked candidates
            </motion.div>

            {getUnrankedCandidates().map((candidate) => (
              <motion.div key={getReferenceId(candidate)} layoutId={getReferenceId(candidate)}>
                <HiveMimeDraggable isDraggable data={candidate}>
                  <HiveMimePickRankingCandidate combined={candidate}
                    onClick={() => rankCandidate(candidate, -1)}
                  />
                </HiveMimeDraggable>
              </motion.div>
            ))}
          </motion.div>
        </HiveMimeDraggable>
      </LayoutGroup>
    </div>
  );
});
