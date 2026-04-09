"use client";

import { HiveMimeHoverCard } from "../../../utility/hm-hover-card";
import { observer } from "mobx-react-lite";
import { CombinedPollCandidate } from "@/lib/view-models";
import { motion } from "framer-motion";

interface HiveMimeRankPollVoteCandidateProps {
  onClick?: () => void;
  combined: CombinedPollCandidate;
}

export const HiveMimeRankPollVoteCandidate = observer(({ combined, onClick }: HiveMimeRankPollVoteCandidateProps) => {
  function isRanked() {
    return combined.vote.value != null;
  }

  return (
    <HiveMimeHoverCard className={`flex flex-row items-center cursor-pointer ${isRanked() ? 'bg-honey-brown/20' : 'hover:text-honey-brown'}`} onClick={onClick}>
      {isRanked() && <span className="w-6 font-light text-informational">{combined.vote.value}</span>}
      <motion.div layout>{combined.candidate.name}</motion.div>
    </HiveMimeHoverCard>
  );
});
