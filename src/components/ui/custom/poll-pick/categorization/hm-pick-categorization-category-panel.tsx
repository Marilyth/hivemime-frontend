import { CombinedPollCandidate, CombinedPollCategory } from "@/lib/view-models";
import { HiveMimeHoverCard } from "../../hm-hover-card";
import { getReferenceId } from "@/lib/utils";
import { HiveMimeDraggable } from "../../hm-draggable";
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

      <motion.div layout
        layoutId={getReferenceId(props.category)} key={getReferenceId(props.category)} className="flex flex-col border-l-6 bg-muted-foreground/5 rounded-md gap-2 hover:border-honey-brown p-2 transition-colors duration-200">
        {props.candidates.map((candidate, index) => (
          <div key={getReferenceId(candidate)} >
            <motion.div layout layoutId={getReferenceId(candidate)} className="flex flex-row">
              <div className="flex-1">
                <HiveMimeDraggable
                  draggableOn={[`${getReferenceId(props.poll)}_category`]}
                  droppableFor={[`${getReferenceId(props.poll)}_candidate`]}
                  isDroppable
                  isDraggable
                  data={candidate}
                  onDropped={data => assignCandidateToCategory(data.droppableData as CombinedPollCandidate, data.draggableData as CombinedPollCategory)}
                  onClick={() => props.candidateClicked(candidate)}>
                  <HiveMimePickCandidate candidate={candidate} />
                </HiveMimeDraggable>
              </div>
              {
                index == 0 &&
                <motion.div layout layoutId={`${getReferenceId(props.category)}_label`} className={`flex items-center gap-1 text-sm px-2 ${props.category.value == null ? "text-muted-foreground" : "text-honey-brown"}`}>
                  <Tag className="w-4 h-4" />
                  <span title={props.category.category.name!} className="truncate max-w-32">{props.category.category.name}</span>
                </motion.div>
              }
            </motion.div>
          </div>
        ))}
      </motion.div>
    </HiveMimeDraggable>
  );
};

export function HiveMimePickCandidate({ candidate, className }: { candidate: CombinedPollCandidate, className?: string }) {
  return (
    <HiveMimeHoverCard className={`cursor-pointer hover:text-honey-brown ${className}`}>
      <span>{candidate.candidate.name}</span>
    </HiveMimeHoverCard>
  );
};