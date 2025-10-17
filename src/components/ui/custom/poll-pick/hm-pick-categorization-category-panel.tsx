import { CombinedPollCandidate, CombinedPollCategory } from "@/lib/view-models";
import { HiveMimeHoverCard } from "../hm-hover-card";
import { getReferenceId } from "@/lib/utils";
import { HiveMimeDraggable } from "../hm-draggable";
import { motion } from "framer-motion";
import { Tag } from "lucide-react";
import { ListPollDto } from "@/lib/Api";

export interface HiveMimePickCategoryPanelProps {
  candidateClicked: (candidate: CombinedPollCandidate) => void;
  poll: ListPollDto;
  category: CombinedPollCategory;
  candidates: CombinedPollCandidate[];
}

export function HiveMimePickCategorizationCategoryPanel(props: HiveMimePickCategoryPanelProps) {
  function assignCandidateToCategory(candidate: CombinedPollCandidate, category: CombinedPollCategory) {
    candidate.vote.value = category.value;
  }

  return (
    <HiveMimeDraggable
      key={getReferenceId(props.category)}
      data={props.category}
      isDroppable
      droppableFor={[`${getReferenceId(props.poll)}_category`]}
      onDropped={data => assignCandidateToCategory(data.draggableData as CombinedPollCandidate, props.category)}
      canDrop={data => (data as CombinedPollCandidate).vote.value != props.category.value}>

      <motion.div layout layoutId={getReferenceId(props.category)} key={getReferenceId(props.category)}>
        <HiveMimeHoverCard className="flex flex-col !p-0 gap-2">
          {props.candidates.map((candidate, index) => (
            <div key={getReferenceId(candidate)} >
              <motion.div layout layoutId={getReferenceId(candidate)}>
                <HiveMimeDraggable
                  draggableOn={[`${getReferenceId(props.poll)}_category`]}
                  droppableFor={[`${getReferenceId(props.poll)}_candidate`]}
                  isDroppable
                  isDraggable
                  data={candidate}
                  onDropped={data => assignCandidateToCategory(data.droppableData as CombinedPollCandidate, data.draggableData as CombinedPollCategory)}
                  onClick={() => props.candidateClicked(candidate)}>
                    <HiveMimeHoverCard className={`flex flex-row gap-2 cursor-pointer hover:bg-honey-brown/10 hover:text-honey-brown border-0`}>
                      <span className="flex-1">{candidate.candidate.name}</span>
                      {
                        index == 0 &&
                        <div className={`flex items-center gap-1 text-sm ${props.category.value == null ? "text-muted-foreground" : "text-honey-brown"}`}>
                          <Tag className="w-4 h-4" />
                          <span>{props.category.category.name}</span>
                        </div>
                      }
                    </HiveMimeHoverCard>
                </HiveMimeDraggable>
              </motion.div>
            </div>
          ))}
        </HiveMimeHoverCard>
      </motion.div>
    </HiveMimeDraggable>
  );
};
