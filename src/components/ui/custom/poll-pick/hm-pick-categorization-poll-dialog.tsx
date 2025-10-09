"use client";

import { observer } from "mobx-react-lite";
import { CombinedPollCandidate } from "@/lib/view-models";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../../dialog";
import { HiveMimeHoverCard } from "../hm-hover-card";
import { ListPollDto } from "@/lib/Api";

export interface HiveMimePickCategorizationPollDialogProps {
  poll: ListPollDto;
  candidate: CombinedPollCandidate | null;
  onClose: () => void;
}

export const HiveMimePickCategorizationPollDialog = observer(({ candidate, poll, onClose }: HiveMimePickCategorizationPollDialogProps) => {
  return (
    <Dialog open={candidate != null} onOpenChange={() => onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Pick a category for <span className="text-honey-brown">{candidate?.candidate.name}</span></DialogTitle>
          <DialogDescription>
            Please pick a category to assign the candidate to.
          </DialogDescription>
        </DialogHeader>

        {poll.categories?.map((category, index) => (
          <HiveMimeHoverCard key={index}
            onClick={() => {candidate!.vote.value = index; onClose();}}
            className="cursor-pointer hover:text-honey-brown flex flex-col bg-honey-brown/20 p-2 rounded-md border-1 border-honey-brown/30 gap-2 text-center">
            <div className="text-sm mb-2">
              {category.name}
            </div>
            <div className="text-sm text-muted-foreground">
              {category.description}
            </div>
          </HiveMimeHoverCard>
        ))}

        <HiveMimeHoverCard
            onClick={() => {candidate!.vote.value = null; onClose();}}
            className="cursor-pointer hover:text-honey-brown flex flex-col p-2 rounded-md border-1 gap-2 text-center">
            <div className="text-sm mb-2">
              Uncategorized
            </div>
            <div className="text-sm text-muted-foreground">
              This candidate is not assigned to any category.
            </div>
          </HiveMimeHoverCard>
      </DialogContent>
    </Dialog>
  );
});
