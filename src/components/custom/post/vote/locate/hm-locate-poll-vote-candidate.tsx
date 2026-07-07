"use client";


import { observer } from "mobx-react-lite";
import { UiCandidateVote } from "@/lib/vote-models";
import { ImageViewerContent } from "@/components/custom/utility/image-viewer";
import { CandidateDto } from "@/lib/Api";
import { LocationPicker } from "@/components/custom/utility/location-picker";

interface HiveMimeLocatePollVoteCandidateProps {
  vote: UiCandidateVote;
  candidate: CandidateDto;
}

export const HiveMimeLocatePollVoteCandidate = observer(({ vote, candidate }: HiveMimeLocatePollVoteCandidateProps) => {
  return (
    <div className="border">
      <LocationPicker rectangles={vote.rectangles!}>
        <ImageViewerContent src={candidate.mediaKeys![0]} alt={candidate.name!} />
      </LocationPicker>
    </div>
  );
});
