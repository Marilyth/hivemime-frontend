"use client";


import { observer } from "mobx-react-lite";
import { UiCandidateVote } from "@/lib/vote-models";
import { CandidateDto } from "@/lib/Api";
import { ImageViewerContent } from "@/components/custom/utility/image-viewer";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { LocationPicker } from "@/components/custom/utility/location-picker";
import { HiveMimeHoverCard } from "@/components/custom/utility/hm-hover-card";

interface HiveMimeLocatePollVoteCandidateProps {
  vote: UiCandidateVote;
  candidate: CandidateDto;
}

export const HiveMimeLocatePollVoteCandidate = observer(({ vote, candidate }: HiveMimeLocatePollVoteCandidateProps) => {
  const thumbnail = candidate.mediaKeys?.find(key => key.endsWith("thumbnail.webp"));
  const src = candidate.mediaKeys?.find(key => !key.endsWith("thumbnail.webp"));

  return (
    <div onClick={e => e.stopPropagation()}>
      <Dialog>
        <DialogTrigger asChild>
          <HiveMimeHoverCard className="flex flex-row gap-2 items-center cursor-pointer group relative cursor-pointer rounded-md">
            <img src={thumbnail} alt={candidate.name!} className="h-fit w-fit object-cover" />
            <span className="font-medium">{candidate.name}</span>
          </HiveMimeHoverCard>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{candidate.name!}</DialogTitle>
          </DialogHeader>
          <LocationPicker rectangles={vote.rectangles!}>
            <ImageViewerContent src={src} alt={candidate.name!} />
          </LocationPicker>
        </DialogContent>
      </Dialog>
    </div>
  );
});
