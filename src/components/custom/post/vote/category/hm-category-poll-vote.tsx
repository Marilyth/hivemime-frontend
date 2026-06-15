"use client";

import { observer } from "mobx-react-lite";
import { CategoryDto, PollDto, PollVoteDto } from "@/lib/Api";
import { CombinedPollCandidate } from "@/lib/view-models";
import { LayoutGroup, motion } from "framer-motion";
import { getReferenceId } from "@/lib/utils";
import { HiveMimeDraggable } from "../../../utility/hm-draggable";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { HiveMimeCategoryPollVoteCandidateDialog, HiveMimeCategoryPollVoteCategoryDialog } from "./hm-category-poll-vote-dialog";
import { HiveMimeCategoryTagBox, HiveMimePickCandidate } from "./hm-category-poll-vote-category";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

export interface HiveMimeCategoryPollVoteProps {
  poll: PollDto;
  pollVotes: PollVoteDto;
}

export const HiveMimeCategoryPollVote = observer(({ poll, pollVotes }: HiveMimeCategoryPollVoteProps) => {
  const { t } = useTranslation();
  const [openedCandidate, setOpenedCandidate] = useState<CombinedPollCandidate | null>(null);
  const [openedCategory, setOpenedCategory] = useState<CategoryDto | null>(null);

  const combinedCandidates = pollVotes.candidates!.map((candidate, index) => ({
    candidate: poll.candidates![index],
    vote: candidate,
  }));

  function assignCandidateToCategory(candidate: CombinedPollCandidate, category: CategoryDto) {
    candidate.vote.value = category.value;
  }

  function getCandidatesCategory(candidate: CombinedPollCandidate) {
    const category = poll.categories!.find(category => category.value === candidate.vote.value);
    return category ?? null;
  }

  function removeCustomCandidate(index: number) {
    poll.candidates!.splice(index, 1);
    pollVotes.candidates!.splice(index, 1);
  }

  return (
    <div className="flex flex-col gap-2">
      <HiveMimeCategoryPollVoteCandidateDialog
        categories={poll.categories!}
        candidate={openedCandidate}
        onClose={() => setOpenedCandidate(null)} />

      <HiveMimeCategoryPollVoteCategoryDialog
        candidates={combinedCandidates}
        category={openedCategory}
        onClose={() => setOpenedCategory(null)} />

      <span className="text-informational text-sm">{t("posts:vote.categoryInstruction")}</span>

      <div className="flex flex-wrap gap-2 mb-4">
        {poll.categories!.map((category, index) => (
          <HiveMimeDraggable
            key={getReferenceId(category)}
            data={category}
            dropAreaName={[`${getReferenceId(poll)}_category`]}
            draggableOnArea={[`${getReferenceId(poll)}_candidate`]}
            isDropArea
            isDraggable
            onClick={() => setOpenedCategory(category)}
            onDropped={data => assignCandidateToCategory(data.draggableData as CombinedPollCandidate, category)}
            canDrop={data => (data as CombinedPollCandidate).vote.value != category.value}>
            <HiveMimeCategoryTagBox category={category} />
          </HiveMimeDraggable>
        ))}
      </div>

      {combinedCandidates.map((candidate, index) => (
        <div key={getReferenceId(candidate)} className="flex flex-row gap-2">
          <div className="flex-1">
            <HiveMimeDraggable
              draggableOnArea={[`${getReferenceId(poll)}_category`]}
              dropAreaName={[`${getReferenceId(poll)}_candidate`]}
              isDropArea
              isDraggable
              data={candidate}
              onDropped={data => assignCandidateToCategory(data.dropAreaData as CombinedPollCandidate, data.draggableData as CategoryDto)}
              onClick={() => setOpenedCandidate(candidate)}>
              <HiveMimePickCandidate candidate={candidate} category={getCandidatesCategory(candidate)} />
            </HiveMimeDraggable>
          </div>

          {candidate.candidate.isCustom &&
            <Button variant="ghost" className="p-0 h-auto text-failure" onClick={() => removeCustomCandidate(index)}>
              <Trash2 />
            </Button>
          }
        </div>
      ))}
    </div>
  );
});
