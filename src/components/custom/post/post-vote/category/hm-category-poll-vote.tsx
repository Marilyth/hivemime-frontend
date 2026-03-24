"use client";

import { observer } from "mobx-react-lite";
import { PollDto, VoteOnPollDto } from "@/lib/Api";
import { CombinedPollCandidate, CombinedPollCategory } from "@/lib/view-models";
import { LayoutGroup } from "framer-motion";
import { getReferenceId } from "@/lib/utils";
import { HiveMimeDraggable } from "../../../utility/hm-draggable";
import { useState } from "react";
import { HiveMimeCategoryPollVoteCandidateDialog, HiveMimeCategoryPollVoteCategoryDialog } from "./hm-category-poll-vote-dialog";
import { HiveMimeCategoryTagBox, HiveMimeCategoryPollVoteCategoryPanel } from "./hm-category-poll-vote-category";
import { mutedColors, colorHexToNumber } from "@/lib/colors";

export interface HiveMimeCategoryPollVoteProps {
  poll: PollDto;
  pollVotes: VoteOnPollDto;
}

export const HiveMimeCategoryPollVote = observer(({ poll, pollVotes }: HiveMimeCategoryPollVoteProps) => {
  const [openedCandidate, setOpenedCandidate] = useState<CombinedPollCandidate | null>(null);
  const [openedCategory, setOpenedCategory] = useState<CombinedPollCategory | null>(null);

  const [combinedCandidates, setCombinedCandidates] = useState<CombinedPollCandidate[]>(() => {
    return poll.candidates!.map((candidate, index) => ({
      candidate: candidate,
      vote: pollVotes.candidates![index]
    }));
  });

  const [combinedCategories, setCombinedCategories] = useState<CombinedPollCategory[]>(() => {
    const pollCategories: CombinedPollCategory[] = poll.categories!.map((category, index) => ({
      category: category,
      value: index + 1
    }));
    pollCategories.push({ category: { name: "Uncategorized", color: colorHexToNumber(mutedColors.gray) }, value: null });

    return pollCategories;
  });

  function getCandidatesForCategory(categoryIndex: number | null) {
    return combinedCandidates!.filter(candidate => candidate.vote.value === categoryIndex);
  }

  function assignCandidateToCategory(candidate: CombinedPollCandidate, category: CombinedPollCategory) {
    candidate.vote.value = category.value;
  }

  return (
    <LayoutGroup>
      <div className="flex flex-col gap-2">
        <HiveMimeCategoryPollVoteCandidateDialog
          categories={combinedCategories!}
          candidate={openedCandidate}
          onClose={() => setOpenedCandidate(null)} />

        <HiveMimeCategoryPollVoteCategoryDialog
          candidates={combinedCandidates}
          category={openedCategory}
          onClose={() => setOpenedCategory(null)} />

        <span className="text-gray-500 text-sm">Please add categories to the candidates.</span>

        <div className="flex flex-wrap gap-2 mb-4">
          {combinedCategories?.map((category, index) => (
            <HiveMimeDraggable
              key={getReferenceId(category)}
              data={category}
              droppableFor={[`${getReferenceId(poll)}_category`]}
              draggableOn={[`${getReferenceId(poll)}_candidate`]}
              isDroppable
              isDraggable
              onClick={() => setOpenedCategory(category)}
              onDropped={data => assignCandidateToCategory(data.draggableData as CombinedPollCandidate, category as CombinedPollCategory)}
              canDrop={data => (data as CombinedPollCandidate).vote.value != category.value}>
              <HiveMimeCategoryTagBox category={category} />
            </HiveMimeDraggable>
          ))}
        </div>

        {combinedCategories?.map(category => (
          combinedCandidates!.some(candidate => candidate.vote.value === category.value) &&
            <HiveMimeCategoryPollVoteCategoryPanel
              key={getReferenceId(category)}
              poll={poll}
              category={category}
              candidates={getCandidatesForCategory(category.value)}
              candidateClicked={setOpenedCandidate} />
        ))}
        
      </div>
    </LayoutGroup>
  );
});
