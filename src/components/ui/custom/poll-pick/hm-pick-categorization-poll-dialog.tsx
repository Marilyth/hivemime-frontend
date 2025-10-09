"use client";

import { observer } from "mobx-react-lite";
import { CombinedPollCandidate } from "@/lib/view-models";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../../dialog";
import { HiveMimeHoverCard } from "../hm-hover-card";
import { ListPollDto, PollCategoryDto } from "@/lib/Api";
import { HiveMimeTagItem } from "../hm-tag-item";
import { Button } from "../../button";

export interface HiveMimePickCategorizationPollCandidateDialogProps {
  categories: PollCategoryDto[];
  candidate: CombinedPollCandidate | null;
  onClose: () => void;
}

export const HiveMimePickCategorizationPollCandidateDialog = observer(({ categories, candidate, onClose }: HiveMimePickCategorizationPollCandidateDialogProps) => {
  return (
    <Dialog open={candidate != null} onOpenChange={() => onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Pick a category for <span className="text-honey-brown">{candidate?.candidate.name}</span></DialogTitle>
          <DialogDescription>
            Please pick a category to assign the candidate to.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-wrap gap-2 mb-4">
          {categories?.map((category, index) => (
            <HiveMimeTagItem key={index}
              onClick={() => {console.log("test"); candidate!.vote.value = index; onClose();}}
              className="cursor-pointer bg-honey-brown/20 border-honey-brown/30 text-honey-brown hover:bg-honey-brown/30">
              <div className="text-muted-foreground">
                {category.name}
              </div>
            </HiveMimeTagItem>
          ))}
        </div>

        <div className="flex">
          <Button variant={"destructive"}
            onClick={() => {candidate!.vote.value = null; onClose();}}
            className="cursor-pointer">
            <div className="text-muted-foreground">
              Uncategorize
            </div>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
});


export interface HiveMimePickCategorizationPollCategoryDialogProps {
  candidates: CombinedPollCandidate[];
  category: PollCategoryDto | null;
  value?: number;
  onClose: () => void;
}

export const HiveMimePickCategorizationPollCategoryDialog = observer(({ candidates, category, value, onClose }: HiveMimePickCategorizationPollCategoryDialogProps) => {
  return (
    <Dialog open={category != null} onOpenChange={() => onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Pick a candidate for <span className="text-honey-brown">{category?.name}</span></DialogTitle>
          <DialogDescription>
            Please pick a candidate to assign the category to.
          </DialogDescription>
        </DialogHeader>

        {candidates?.map((candidate, index) => (
          <HiveMimeHoverCard key={index}
            onClick={() => {candidate!.vote.value = value; onClose();}}
            className="cursor-pointer hover:text-honey-brown flex flex-col p-2 rounded-md border-1 gap-2 text-center">
            <div className="text-sm mb-2">
              {candidate.candidate.name}
            </div>
          </HiveMimeHoverCard>
        ))}
      </DialogContent>
    </Dialog>
  );
});

