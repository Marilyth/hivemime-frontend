"use client";

import { IoMdCheckboxOutline } from "react-icons/io";
import { HiveMimeHoverCard } from "../hm-hover-card";
import { observer } from "mobx-react-lite";
import { PollCandidateDto, UpsertVoteToCandidateDto } from "@/lib/Api";

interface HiveMimePickMultipleChoiceCandidateProps {
  onClick?: () => void;
  vote: UpsertVoteToCandidateDto;
  candidate: PollCandidateDto;
}

export const HiveMimePickMultipleChoiceCandidate = observer(({ vote, candidate, onClick }: HiveMimePickMultipleChoiceCandidateProps) => {
  function isSelected() {
    return vote.value == 1;
  }

  return (
    <HiveMimeHoverCard className={`flex flex-row items-center cursor-pointer ${isSelected() ? 'bg-honey-brown/20' : 'hover:text-honey-brown'}`} onClick={onClick}>
      <span className="w-8 font-light text-gray-500">{isSelected() ? <IoMdCheckboxOutline className="w-4 h-4" />: vote.candidateId}</span>
      <span>{candidate.name}</span>
    </HiveMimeHoverCard>
  );
});
