"use client";

import { observer } from "mobx-react-lite";
import { CategoryDto, PollDto, VoteOnPollDto } from "@/lib/Api";
import { CombinedPollCandidate } from "@/lib/view-models";
import { LayoutGroup } from "framer-motion";
import { getReferenceId } from "@/lib/utils";
import { HiveMimeDraggable } from "../../../utility/hm-draggable";
import { useState } from "react";
import { HiveMimeCategoryPollVoteCandidateDialog, HiveMimeCategoryPollVoteCategoryDialog } from "./hm-category-poll-vote-dialog";
import { HiveMimeCategoryTagBox, HiveMimeCategoryPollVoteCategoryPanel } from "./hm-category-poll-vote-category";

export interface HiveMimeCategoryPollVoteProps {
  poll: PollDto;
  pollVotes: VoteOnPollDto;
}

export const HiveMimeCategoryPollVote = observer(({ poll, pollVotes }: HiveMimeCategoryPollVoteProps) => {
  const [openedCandidate, setOpenedCandidate] = useState<CombinedPollCandidate | null>(null);
  const [openedCategory, setOpenedCategory] = useState<CategoryDto | null>(null);

  const [combinedCandidates, setCombinedCandidates] = useState<CombinedPollCandidate[]>(() => {
    return poll.candidates!.map((candidate, index) => ({
      candidate: candidate,
      vote: pollVotes.candidates![index]
    }));
  });

  function getCandidatesForCategory(categoryIndex: number | null) {
    return combinedCandidates!.filter(candidate => candidate.vote.value === categoryIndex);
  }

  function assignCandidateToCategory(candidate: CombinedPollCandidate, category: CategoryDto) {
    candidate.vote.value = category.value;
  }

  return (
    <LayoutGroup>
      <div className="flex flex-col gap-2">
        <HiveMimeCategoryPollVoteCandidateDialog
          categories={poll.categories!}
          candidate={openedCandidate}
          onClose={() => setOpenedCandidate(null)} />

        <HiveMimeCategoryPollVoteCategoryDialog
          candidates={combinedCandidates}
          category={openedCategory}
          onClose={() => setOpenedCategory(null)} />

        <span className="text-informational text-sm">Please add categories to the candidates.</span>

        <div className="flex flex-wrap gap-2 mb-4">
          {poll.categories!.map((category, index) => (
            <HiveMimeDraggable
              key={getReferenceId(category)}
              data={category}
              droppableFor={[`${getReferenceId(poll)}_category`]}
              draggableOn={[`${getReferenceId(poll)}_candidate`]}
              isDroppable
              isDraggable
              onClick={() => setOpenedCategory(category)}
              onDropped={data => assignCandidateToCategory(data.draggableData as CombinedPollCandidate, category)}
              canDrop={data => (data as CombinedPollCandidate).vote.value != category.value}>
              <HiveMimeCategoryTagBox category={category} />
            </HiveMimeDraggable>
          ))}
        </div>

        {poll.categories!.map(category => (
          combinedCandidates!.some(candidate => candidate.vote.value === category.value) &&
            <HiveMimeCategoryPollVoteCategoryPanel
              key={getReferenceId(category)}
              poll={poll}
              category={category}
              candidates={getCandidatesForCategory(category.value!)}
              candidateClicked={setOpenedCandidate} />
        ))}
        
      </div>
    </LayoutGroup>
  );
});
