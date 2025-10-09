"use client";

import { observer } from "mobx-react-lite";
import { ListPollDto, UpsertVoteToPollDto } from "@/lib/Api";
import { CombinedPollCandidate } from "@/lib/view-models";
import { LayoutGroup, motion } from "framer-motion";
import { getReferenceId } from "@/lib/utils";
import { HiveMimeDraggable } from "../hm-draggable";
import { HiveMimePickCandidate } from "./hm-pick-candidate";
import { useState } from "react";
import { HiveMimePickCategorizationPollDialog } from "./hm-pick-categorization-poll-dialog";

export interface HiveMimePickCategorizationPollProps {
  poll: ListPollDto;
  pollVotes: UpsertVoteToPollDto;
}

export const HiveMimePickCategorizationPoll = observer(({ poll, pollVotes }: HiveMimePickCategorizationPollProps) => {
  const [openedCandidate, setOpenedCandidate] = useState<CombinedPollCandidate | null>(null);

  const [combinedCandidates, setCombinedCandidates] = useState<CombinedPollCandidate[]>(() => {
      return poll.candidates!.map((candidate, index) => ({
        candidate: candidate,
        vote: pollVotes.candidates![index]
      }));
    });

  return (
    <div className="flex flex-col gap-2">
      <HiveMimePickCategorizationPollDialog poll={poll} candidate={openedCandidate} onClose={() => setOpenedCandidate(null)} />

      <span className="text-gray-500 text-sm">Please add the candidates to a category.</span>

      <LayoutGroup>
        {poll.categories?.map((category, index) => (
          <HiveMimeDraggable<CombinedPollCandidate>
            key={getReferenceId(category)}
            draggableGroup={getReferenceId(poll)}
            isDroppable
            onDropped={data => data.draggableData.vote.value = index}
            canDrop={data => data.vote.value != index}>
            <motion.div layout className="flex flex-col bg-honey-brown/20 p-2 rounded-md border-2 border-honey-brown/30 gap-2">
              <motion.div layout="position" className="text-sm text-center mb-2">
                {category.name}
              </motion.div>

              {combinedCandidates!.filter(candidate => candidate.vote.value == index)
                                  .map((candidate) => (
                <motion.div layout key={getReferenceId(candidate)} layoutId={getReferenceId(candidate)}>
                  <HiveMimeDraggable draggableGroup={getReferenceId(poll)} isDraggable data={candidate} onClick={() => setOpenedCandidate(candidate)}>
                    <HiveMimePickCandidate candidate={candidate} className="bg-honey-brown/30" />
                  </HiveMimeDraggable>
                </motion.div>
              ))}
            </motion.div>
          </HiveMimeDraggable>
        ))}

        <HiveMimeDraggable<CombinedPollCandidate>
          draggableGroup={getReferenceId(poll)}
          isDroppable
          onDropped={(args) => args.draggableData.vote.value = null}
          canDrop={(data) => data.vote.value != null}>
          <motion.div layout
            className="flex flex-col gap-2 bg-muted-foreground/5 p-2 rounded-md border-2 border-muted-foreground/10">
            <motion.div layout="position" className="text-sm text-center mb-2">
              Uncategorized
            </motion.div>

            {combinedCandidates!.filter(candidate => candidate.vote.value == null)
                                .map((candidate, index) => (
              <motion.div layout key={getReferenceId(candidate)} layoutId={getReferenceId(candidate)}>
                <HiveMimeDraggable draggableGroup={getReferenceId(poll)} isDraggable data={candidate} onClick={() => setOpenedCandidate(candidate)}>
                  <HiveMimePickCandidate candidate={candidate} labelComponent={<span className="text-sm text-gray-500 w-8">{index + 1}</span>} />
                </HiveMimeDraggable>
              </motion.div>
            ))}
          </motion.div>
        </HiveMimeDraggable>
      </LayoutGroup>
    </div>
  );
});
