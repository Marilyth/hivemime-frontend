"use client";


import { observer } from "mobx-react-lite";
import { UiCandidateVote } from "@/lib/vote-models";
import { CandidateDto } from "@/lib/Api";
import { GridPicker, Variant } from "@/components/custom/utility/grid-picker";

interface HiveMimeGridPollVoteCandidateProps {
  vote: UiCandidateVote;
  candidate: CandidateDto;
}

export const HiveMimeGridPollVoteCandidate = observer(({ vote, candidate }: HiveMimeGridPollVoteCandidateProps) => {
  const thumbnail = candidate.mediaKeys?.find(key => key.endsWith("thumbnail.webp"));
  const src = candidate.mediaKeys?.find(key => !key.endsWith("thumbnail.webp"));

  return (
    <GridPicker variant={Variant.Grid} cellSelection={vote.cellSelection!} src={src!} />
  );
});
