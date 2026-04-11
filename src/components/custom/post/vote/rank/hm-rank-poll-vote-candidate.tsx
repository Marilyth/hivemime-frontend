"use client";

import { HiveMimeHoverCard } from "../../../utility/hm-hover-card";
import { observer } from "mobx-react-lite";
import { CombinedPollCandidate } from "@/lib/view-models";
import { motion } from "framer-motion";
import { hiveMimeRankIcon } from "@/components/custom/utility/hm-rank-icon";
import { PollDto } from "@/lib/Api";

interface HiveMimeRankPollVoteCandidateProps {
  onClick?: () => void;
  combined: CombinedPollCandidate;
  poll: PollDto;
}

export const HiveMimeRankPollVoteCandidate = observer(({ combined, poll, onClick }: HiveMimeRankPollVoteCandidateProps) => {
  function isRanked() {
    return combined.vote.value != null;
  }

  return (
    <HiveMimeHoverCard className={`flex flex-row items-center cursor-pointer ${isRanked() ? 'bg-honey-brown/20' : 'hover:text-honey-brown'}`} onClick={onClick}>
      {isRanked() && <span className="w-6 font-light text-informational">{hiveMimeRankIcon(poll.maxValue! - combined.vote.value! + 1)}</span>}
      <motion.div layout>{combined.candidate.name}</motion.div>
    </HiveMimeHoverCard>
  );
});
