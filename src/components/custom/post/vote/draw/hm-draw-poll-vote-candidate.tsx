"use client";


import { observer } from "mobx-react-lite";
import { UiCandidateVote } from "@/lib/vote-models";
import { CandidateDto } from "@/lib/Api";
import { DrawPicker, Variant } from "@/components/custom/utility/draw-picker";

interface HiveMimeDrawPollVoteCandidateProps {
  vote: UiCandidateVote;
  candidate: CandidateDto;
}

export const HiveMimeDrawPollVoteCandidate = observer(({ vote, candidate }: HiveMimeDrawPollVoteCandidateProps) => {
  const thumbnail = candidate.mediaKeys?.find(key => key.endsWith("thumbnail.webp"));
  const src = candidate.mediaKeys?.find(key => !key.endsWith("thumbnail.webp"));

  return (
    <DrawPicker variant={Variant.Draw} cellSelection={vote.cellSelection!} src={src!} />
  );
});
