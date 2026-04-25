"use client";

import { observer } from "mobx-react-lite";
import { CategoryDto, PollDto, PollVoteDto } from "@/lib/Api";
import { CombinedPollCandidate } from "@/lib/view-models";
import { LayoutGroup, motion } from "framer-motion";
import { getReferenceId } from "@/lib/utils";
import { HiveMimeDraggable } from "../../../utility/hm-draggable";
import { useState } from "react";
import { HiveMimeCategoryPollVoteCandidateDialog, HiveMimeCategoryPollVoteCategoryDialog } from "./hm-category-poll-vote-dialog";
import { HiveMimeCategoryTagBox, HiveMimePickCandidate } from "./hm-category-poll-vote-category";

export interface HiveMimeCategoryPollVoteProps {
  poll: PollDto;
  pollVotes: PollVoteDto;
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

  function assignCandidateToCategory(candidate: CombinedPollCandidate, category: CategoryDto) {
    candidate.vote.value = category.value;
  }

  function getCandidatesCategory(candidate: CombinedPollCandidate) {
    const category = poll.categories!.find(category => category.value === candidate.vote.value);
    return category ?? null;
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
          <div key={getReferenceId(candidate)} >
            <motion.div layout layoutId={getReferenceId(candidate)} className="flex flex-row">
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
            </motion.div>
          </div>
        ))}
        
      </div>
    </LayoutGroup>
  );
});
