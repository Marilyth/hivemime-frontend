"use client";

import { observer } from "mobx-react-lite";
import { CombinedPollCandidate } from "@/lib/view-models";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../../../../ui/dialog";
import { HiveMimeHoverCard } from "../../../utility/hm-hover-card";
import { getReferenceId } from "@/lib/utils";
import { HiveMimeCategoryTagBox } from "./hm-category-poll-vote-category";
import { CategoryDto } from "@/lib/Api";

export interface HiveMimeCategoryPollVoteCandidateDialogProps {
  categories: CategoryDto[];
  candidate: CombinedPollCandidate | null;
  onClose: () => void;
}

export const HiveMimeCategoryPollVoteCandidateDialog = observer(({ categories, candidate, onClose }: HiveMimeCategoryPollVoteCandidateDialogProps) => {
  return (
    <Dialog open={candidate != null} onOpenChange={() => onClose()}>
      <DialogContent className="gap-2">
        <DialogHeader>
          <DialogTitle>Pick a category for <span className="text-honey-brown">{candidate?.candidate.name}</span></DialogTitle>
          <DialogDescription>
            Please pick a category to assign the candidate to.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-wrap gap-2">
          {categories?.map((category) => (
            <HiveMimeCategoryTagBox key={getReferenceId(category)}
              category={category}
              onClick={() => { candidate!.vote.value = category.value; onClose(); }}
            />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
});

export interface HiveMimeCategoryPollVoteCategoryDialogProps {
  candidates: CombinedPollCandidate[];
  category: CategoryDto | null;
  onClose: () => void;
}

export const HiveMimeCategoryPollVoteCategoryDialog = observer(({ candidates, category, onClose }: HiveMimeCategoryPollVoteCategoryDialogProps) => {
  return (
    <Dialog open={category != null} onOpenChange={() => onClose()}>
      <DialogContent className="gap-2">
        <DialogHeader>
          <DialogTitle>Pick a candidate for <span className="text-honey-brown">{category?.name}</span></DialogTitle>
          <DialogDescription>
            Please pick a candidate to assign the category to.
          </DialogDescription>
        </DialogHeader>

        {candidates?.map((candidate, index) => (
          <HiveMimeHoverCard key={index}
            onClick={() => {candidate!.vote.value = category?.value; onClose();}}
            className="cursor-pointer hover:text-honey-brown flex flex-col p-2 rounded-md border-1 gap-2">
              {candidate.candidate.name}
          </HiveMimeHoverCard>
        ))}
      </DialogContent>
    </Dialog>
  );
});

