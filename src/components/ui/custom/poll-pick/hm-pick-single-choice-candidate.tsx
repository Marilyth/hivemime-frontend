"use client";

import { Crown } from "lucide-react";
import { HiveMimeHoverCard } from "../hm-hover-card";
import { observer } from "mobx-react-lite";
import { PollCandidateDto, UpsertVoteToCandidateDto } from "@/lib/Api";

interface HiveMimePickChoiceCandidateProps {
  onClick?: () => void;
  vote: UpsertVoteToCandidateDto;
  candidate: PollCandidateDto;
}

export const HiveMimePickChoiceCandidate = observer(({ vote, candidate, onClick }: HiveMimePickChoiceCandidateProps) => {
  function isSelected() {
    return vote.value == 1;
  }

  return (
    <HiveMimeHoverCard className={`flex flex-row cursor-pointer ${isSelected() ? 'bg-honey-brown/20' : 'hover:text-honey-brown'}`} onClick={onClick}>
      <span className="w-8 font-light text-gray-500">{isSelected() ? <Crown className="w-4 h-4" />: vote.candidateId}</span>
      <span>{candidate.name}</span>
    </HiveMimeHoverCard>
  );
});
