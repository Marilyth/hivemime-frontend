"use client";

import { HiveMimeHoverCard } from "../hm-hover-card";
import { observer } from "mobx-react-lite";
import { CombinedPollCandidate } from "@/lib/view-models";

interface HiveMimePickRankingCandidateProps {
  onClick?: () => void;
  combined: CombinedPollCandidate;
}

export const HiveMimePickRankingCandidate = observer(({ combined, onClick }: HiveMimePickRankingCandidateProps) => {
  function isRanked() {
    return combined.vote.value != null;
  }

  return (
    <HiveMimeHoverCard className={`flex flex-row items-center cursor-pointer ${isRanked() ? 'bg-honey-brown/20' : 'hover:text-honey-brown'}`} onClick={onClick}>
      <span className="w-8 font-light text-gray-500">{isRanked() ? (combined.vote.value! + 1) : combined.candidate.id}</span>
      <span>{combined.candidate.name}</span>
    </HiveMimeHoverCard>
  );
});
