"use client";

import { IoMdCheckboxOutline } from "react-icons/io";
import { HiveMimeHoverCard } from "../../../utility/hm-hover-card";
import { observer } from "mobx-react-lite";
import { CandidateDto } from "@/lib/Api";
import { motion } from "framer-motion";
import { HiveMimeViewCandidate } from "../../hm-candidate";
import { UiCandidateVote } from "@/lib/vote-models";

interface HiveMimePickMultipleChoiceCandidateProps {
  onClick?: () => void;
  vote: UiCandidateVote;
  candidate: CandidateDto;
}

export const HiveMimeChoicePollVoteCandidate = observer(({ vote, candidate, onClick }: HiveMimePickMultipleChoiceCandidateProps) => {
  function isSelected() {
    return vote.selected === true;
  }

  return (
    <HiveMimeHoverCard className={`flex flex-row items-center cursor-pointer ${isSelected() ? 'bg-honey-brown/20' : 'hover:text-honey-brown'}`} onClick={onClick}>
      {isSelected() && <span className="w-6 font-light text-informational"><IoMdCheckboxOutline className="w-4 h-4" /></span>}
      <motion.div layout><HiveMimeViewCandidate candidate={candidate} /></motion.div>
    </HiveMimeHoverCard>
  );
});
