"use client";

import { HiveMimeHoverCard } from "../hm-hover-card";
import { observer } from "mobx-react-lite";
import { PollCandidateDto, UpsertVoteToCandidateDto } from "@/lib/Api";

interface HiveMimePickChoiceCandidateProps {
  onClick?: () => void;
  vote: UpsertVoteToCandidateDto;
  candidate: PollCandidateDto;
}

export const HiveMimePickChoiceCandidate = observer(({ vote, candidate, onClick }: HiveMimePickChoiceCandidateProps) => {
  return (
    <HiveMimeHoverCard className={`flex flex-row cursor-pointer ${vote.value == 1 ? 'bg-honey-brown/20' : 'hover:text-honey-brown'}`} onClick={onClick}>
      <span className="w-8 font-light text-gray-500">{vote.candidateId}</span>
      <span>{candidate.name}</span>
    </HiveMimeHoverCard>
  );
});
