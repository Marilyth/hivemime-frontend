"use client";

import { observer } from "mobx-react-lite";
import { ListPollDto, PollCategoryDto, UpsertVoteToPollDto } from "@/lib/Api";
import { CombinedPollCandidate } from "@/lib/view-models";
import { LayoutGroup, motion } from "framer-motion";
import { getReferenceId } from "@/lib/utils";
import { HiveMimeDraggable } from "../hm-draggable";
import { HiveMimePickCandidate } from "./hm-pick-candidate";
import { useState } from "react";
import { HiveMimePickCategorizationPollCandidateDialog, HiveMimePickCategorizationPollCategoryDialog } from "./hm-pick-categorization-poll-dialog";
import { Tag } from "lucide-react";
import { HiveMimeTagItem } from "../hm-tag-item";
import { HiveMimeHoverCard } from "../hm-hover-card";

export interface HiveMimePickCategorizationPollProps {
  poll: ListPollDto;
  pollVotes: UpsertVoteToPollDto;
}

export const HiveMimePickCategorizationPoll = observer(({ poll, pollVotes }: HiveMimePickCategorizationPollProps) => {
  const [openedCandidate, setOpenedCandidate] = useState<CombinedPollCandidate | null>(null);
  const [openedCategory, setOpenedCategory] = useState<PollCategoryDto | null>(null);

  const [combinedCandidates, setCombinedCandidates] = useState<CombinedPollCandidate[]>(() => {
      return poll.candidates!.map((candidate, index) => ({
        candidate: candidate,
        vote: pollVotes.candidates![index]
      }));
    });

  function assignCandidateToCategory(candidate: CombinedPollCandidate | unknown, category: PollCategoryDto | unknown) {
    const convertedCandidate = candidate as CombinedPollCandidate;

    if (category == null) {
      convertedCandidate.vote.value = null;
      return;
    }

    const convertedCategory = category as PollCategoryDto;
    convertedCandidate.vote.value = poll.categories?.indexOf(convertedCategory);
  }

  return (
    <div className="flex flex-col gap-2">
      <HiveMimePickCategorizationPollCandidateDialog
        categories={poll.categories!}
        candidate={openedCandidate}
        onClose={() => setOpenedCandidate(null)} />

      <HiveMimePickCategorizationPollCategoryDialog
        candidates={combinedCandidates}
        category={openedCategory}
        value={poll.categories?.indexOf(openedCategory!)}
        onClose={() => setOpenedCategory(null)} />

      <span className="text-gray-500 text-sm">Please add the candidates to a category.</span>

      <div className="flex flex-wrap gap-2 pb-4">
        {poll.categories?.map((category, index) => (
          <HiveMimeDraggable
            key={getReferenceId(category)}
            data={category}
            droppableGroups={[`${getReferenceId(poll)}_category`]}
            droppableOn={[`${getReferenceId(poll)}_candidate`]}
            isDroppable
            isDraggable
            onClick={() => setOpenedCategory(category)}
            onDropped={data => assignCandidateToCategory(data.draggableData, category)}
            canDrop={data => (data as CombinedPollCandidate).vote.value != index}>
            <HiveMimeTagItem className="cursor-pointer bg-honey-brown/20 border-honey-brown/30 text-honey-brown hover:bg-honey-brown/30">
              <div className="text-muted-foreground">
                {category.name}
              </div>
            </HiveMimeTagItem>
          </HiveMimeDraggable>
        ))}
      </div>

      {combinedCandidates!.sort((a, b) => (a.vote.value ?? 999) - (b.vote.value ?? 999)).map((candidate, index) => (
        <div key={getReferenceId(candidate)} >
          <motion.div layout layoutId={getReferenceId(candidate)}>
            <HiveMimeDraggable
              droppableOn={[`${getReferenceId(poll)}_category`]}
              droppableGroups={[`${getReferenceId(poll)}_candidate`]}
              isDroppable
              isDraggable
              data={candidate}
              onDropped={data => assignCandidateToCategory(data.droppableData, data.draggableData)}
              onClick={() => setOpenedCandidate(candidate)}>
                <HiveMimeHoverCard className="flex flex-row gap-2 cursor-pointer hover:text-honey-brown">
                  <span className="flex-1">{candidate.candidate.name}</span>
                  {
                    candidate.vote.value != null &&
                    <div className="flex items-center gap-1 text-sm text-honey-brown">
                      <Tag className="w-4 h-4" />
                      <span>{poll.categories![candidate.vote.value!].name}</span>
                    </div>
                  }
                </HiveMimeHoverCard>
            </HiveMimeDraggable>
          </motion.div>

          {/** Add spacing between candidates of different categories */}
          {index < combinedCandidates.length - 1 && combinedCandidates[index + 1].vote.value != candidate.vote.value &&
            <div className="py-2"/>
          }
        </div>
      ))}
    </div>
  );
});
