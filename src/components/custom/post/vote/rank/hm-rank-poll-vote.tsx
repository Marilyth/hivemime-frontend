"use client";

import { observer } from "mobx-react-lite";
import { PollDto, PollVoteDto } from "@/lib/Api";
import { HiveMimeRankPollVoteCandidate } from "./hm-rank-poll-vote-candidate";
import { useEffect, useRef, useState } from "react";
import { CombinedPollCandidate } from "@/lib/view-models";
import { LayoutGroup, motion } from "framer-motion";
import { getReferenceId } from "@/lib/utils";
import { HiveMimeDraggable } from "../../../utility/hm-draggable";
import { observable, reaction } from "mobx";

export interface HiveMimeRankPollVoteProps {
  poll: PollDto;
  pollVotes: PollVoteDto;
}

export const HiveMimeRankPollVote = observer(({ poll, pollVotes }: HiveMimeRankPollVoteProps) => {
  const state = useRef(observable({
    rankedCandidates: [] as CombinedPollCandidate[],
    unrankedCandidates: poll.candidates!.map((candidate, index) => ({
      candidate: candidate,
      vote: pollVotes.candidates![index]
    }))
  })).current;

  function rerankCandidates() {
    for (const candidate of state.unrankedCandidates) {
      if (candidate.vote.value != null) {
        candidate.vote.value = null;
      }
    }

    for (let i = 0; i < state.rankedCandidates.length; i++) {
      state.rankedCandidates[i].vote.value = poll.maxValue! - i;
    }
  }

  function triggerRank(candidate: CombinedPollCandidate) {
    if (candidate.vote.value == null) {
      const index = state.unrankedCandidates.findIndex(c => c === candidate);
      state.unrankedCandidates.splice(index, 1);
      state.rankedCandidates.push(candidate);
    }
    else {
      const index = state.rankedCandidates.findIndex(c => c === candidate);
      state.rankedCandidates.splice(index, 1);
      state.unrankedCandidates.push(candidate);
    }

    rerankCandidates();
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="text-informational text-sm">Please rank the candidates in order of preference.</span>

      <LayoutGroup>
        {state.rankedCandidates.map((candidate) => (
          <motion.div key={getReferenceId(candidate)} layoutId={getReferenceId(candidate)}>
            <HiveMimeDraggable dropAreaName={getReferenceId(poll)} onDropped={rerankCandidates} draggableOnArea={[getReferenceId(poll)]} isDraggable isDropArea isSticky data={candidate} dataList={state.rankedCandidates}
              allowedZones={['top', 'bottom']}>
              <HiveMimeRankPollVoteCandidate combined={candidate} poll={poll}
                onClick={() => triggerRank(candidate)}
              />
            </HiveMimeDraggable>
          </motion.div>
        ))}

        {state.unrankedCandidates.map((candidate) => (
          <motion.div key={getReferenceId(candidate)} layoutId={getReferenceId(candidate)}>
            <HiveMimeDraggable draggableOnArea={[getReferenceId(poll)]} isDraggable isSticky data={candidate} dataList={state.unrankedCandidates}>
              <HiveMimeRankPollVoteCandidate combined={candidate} poll={poll}
                onClick={() => triggerRank(candidate)}
              />
            </HiveMimeDraggable>
          </motion.div>
        ))}
      </LayoutGroup>
    </div>
  );
});
