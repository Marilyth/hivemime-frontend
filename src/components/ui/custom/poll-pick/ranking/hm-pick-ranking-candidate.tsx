"use client";

import { HiveMimeHoverCard } from "../../hm-hover-card";
import { observer } from "mobx-react-lite";
import { CombinedPollCandidate } from "@/lib/view-models";
import { motion } from "framer-motion";

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
      {isRanked() && <span className="w-6 font-light text-gray-500">{combined.vote.value}</span>}
      <motion.div layout>{combined.candidate.name}</motion.div>
    </HiveMimeHoverCard>
  );
});
