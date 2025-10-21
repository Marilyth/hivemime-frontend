"use client";

import { Crown } from "lucide-react";
import { HiveMimeHoverCard } from "../../hm-hover-card";
import { observer } from "mobx-react-lite";
import { PollCandidateDto, UpsertVoteToCandidateDto } from "@/lib/Api";
import { motion } from "framer-motion";

interface HiveMimePickChoiceCandidateProps {
  onClick?: () => void;
  vote: UpsertVoteToCandidateDto;
  candidate: PollCandidateDto;
}

export const HiveMimePickSingleChoiceCandidate = observer(({ vote, candidate, onClick }: HiveMimePickChoiceCandidateProps) => {
  function isSelected() {
    return vote.value == 1;
  }

  return (
    <HiveMimeHoverCard className={`flex flex-row items-center cursor-pointer ${isSelected() ? 'bg-honey-brown/20' : 'hover:text-honey-brown'}`} onClick={onClick}>
      {isSelected() && <span className="w-6 font-light text-gray-500"><Crown className="w-4 h-4" /></span>}
      <motion.div layout>{candidate.name}</motion.div>
    </HiveMimeHoverCard>
  );
});
