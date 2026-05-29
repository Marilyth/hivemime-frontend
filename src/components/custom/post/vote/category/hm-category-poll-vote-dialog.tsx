"use client";

import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import { CombinedPollCandidate } from "@/lib/view-models";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../../../../ui/dialog";
import { HiveMimeHoverCard } from "../../../utility/hm-hover-card";
import { CategoryDto } from "@/lib/Api";
import { SquareCheck } from "lucide-react"; 
import { motion } from "framer-motion";
import { HiveMimeCategoryTag } from "./hm-category-poll-vote-category";
import { HiveMimeViewCandidate } from "../../hm-candidate";

export interface HiveMimeCategoryPollVoteCandidateDialogProps {
  categories: CategoryDto[];
  candidate: CombinedPollCandidate | null;
  onClose: () => void;
}

export const HiveMimeCategoryPollVoteCandidateDialog = observer(({ categories, candidate, onClose }: HiveMimeCategoryPollVoteCandidateDialogProps) => {
  const { t } = useTranslation();

  function isSelected(category: CategoryDto) {
    return candidate?.vote.value == category?.value;
  }

  function selectCategory(category: CategoryDto) {
    if (category == null || candidate == null)
      return;

    if (isSelected(category)) {
      candidate.vote.value = null;
    } else {
      candidate.vote.value = category!.value;
    }
  }

  return (
    <Dialog open={candidate != null} onOpenChange={() => onClose()}>
      <DialogContent className="gap-2">
        <DialogHeader>
          <DialogTitle>{t("posts:vote.pickCategoryFor", { name: candidate?.candidate.name })}</DialogTitle>
          <DialogDescription>
            {t("posts:vote.pickCategoryDescription")}
          </DialogDescription>
        </DialogHeader>

        {categories?.map((category, index) => (
          <HiveMimeHoverCard key={index} className={`flex flex-row items-center cursor-pointer ${isSelected(category) ? 'bg-honey-brown/20' : 'hover:text-honey-brown'}`} onClick={() => selectCategory(category)}>
            {isSelected(category) && <span className="w-6 font-light text-informational"><SquareCheck className="w-4 h-4" /></span>}
            <motion.div layout><HiveMimeCategoryTag category={category} /></motion.div>
          </HiveMimeHoverCard>
        ))}
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
  const { t } = useTranslation();

  function isSelected(candidate: CombinedPollCandidate) {
    return candidate.vote.value === category?.value;
  }

  function selectCategory(candidate: CombinedPollCandidate) {
    if (candidate == null)
      return;

    if (isSelected(candidate)) {
      candidate.vote.value = null;
    } else {
      candidate.vote.value = category!.value;
    }
  }

  return (
    <Dialog open={category != null} onOpenChange={() => onClose()}>
      <DialogContent className="gap-2">
        <DialogHeader>
          <DialogTitle>{t("posts:vote.pickCandidatesFor", { name: category?.name })}</DialogTitle>
          <DialogDescription>
            {t("posts:vote.pickCandidatesDescription")}
          </DialogDescription>
        </DialogHeader>

        {candidates?.map((candidate, index) => (
          <HiveMimeHoverCard key={index} className={`flex flex-row items-center cursor-pointer ${isSelected(candidate) ? 'bg-honey-brown/20' : 'hover:text-honey-brown'}`} onClick={() => selectCategory(candidate)}>
            {isSelected(candidate) && <span className="w-6 font-light text-informational"><SquareCheck className="w-4 h-4" /></span>}
            <motion.div layout><HiveMimeViewCandidate candidate={candidate.candidate} /></motion.div>
          </HiveMimeHoverCard>
        ))}
      </DialogContent>
    </Dialog>
  );
});

