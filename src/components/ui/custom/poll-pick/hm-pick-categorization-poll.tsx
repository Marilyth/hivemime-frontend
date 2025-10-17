"use client";

import { observer } from "mobx-react-lite";
import { ListPollDto, UpsertVoteToPollDto } from "@/lib/Api";
import { CombinedPollCandidate, CombinedPollCategory } from "@/lib/view-models";
import { LayoutGroup } from "framer-motion";
import { getReferenceId } from "@/lib/utils";
import { HiveMimeDraggable } from "../hm-draggable";
import { useState } from "react";
import { HiveMimePickCategorizationPollCandidateDialog, HiveMimePickCategorizationPollCategoryDialog } from "./hm-pick-categorization-poll-dialog";
import { HiveMimeTagItem } from "../hm-tag-item";
import { HiveMimePickCategorizationCategoryPanel } from "./hm-pick-categorization-category-panel";

export interface HiveMimePickCategorizationPollProps {
  poll: ListPollDto;
  pollVotes: UpsertVoteToPollDto;
}

export const HiveMimePickCategorizationPoll = observer(({ poll, pollVotes }: HiveMimePickCategorizationPollProps) => {
  const [openedCandidate, setOpenedCandidate] = useState<CombinedPollCandidate | null>(null);
  const [openedCategory, setOpenedCategory] = useState<CombinedPollCategory | null>(null);

  const [combinedCandidates, setCombinedCandidates] = useState<CombinedPollCandidate[]>(() => {
    return poll.candidates!.map((candidate, index) => ({
      candidate: candidate,
      vote: pollVotes.candidates![index]
    }));
  });

  const [combinedCategories, setCombinedCategories] = useState<CombinedPollCategory[]>(() => {
    const pollCategories = poll.categories!.map((category, index) => ({
      category: category,
      value: index
    }));
    pollCategories.push({ category: { name: "Uncategorized" }, value: null });

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
        <HiveMimePickCategorizationPollCandidateDialog
          categories={poll.categories!}
          candidate={openedCandidate}
          onClose={() => setOpenedCandidate(null)} />

        <HiveMimePickCategorizationPollCategoryDialog
          candidates={combinedCandidates}
          category={openedCategory}
          onClose={() => setOpenedCategory(null)} />

        <span className="text-gray-500 text-sm">Please add categories to the candidates.</span>

        <div className="flex flex-wrap gap-2 pb-4">
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
              canDrop={data => (data as CombinedPollCandidate).vote.value != index}>
              <HiveMimeTagItem className={`cursor-pointer ${category.value == null ? "" : "bg-honey-brown/20 border-honey-brown/30 text-honey-brown hover:bg-honey-brown/30"}`}>
                <div className="text-muted-foreground">
                  {category.category.name}
                </div>
              </HiveMimeTagItem>
            </HiveMimeDraggable>
          ))}
        </div>

        {combinedCategories?.map(category => (
          combinedCandidates!.some(candidate => candidate.vote.value === category.value) &&
            <HiveMimePickCategorizationCategoryPanel
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
