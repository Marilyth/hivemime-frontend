import { CombinedPollCandidate, CombinedPollCategory } from "@/lib/view-models";
import { HiveMimeHoverCard } from "../../hm-hover-card";
import { getReferenceId } from "@/lib/utils";
import { HiveMimeDraggable } from "../../hm-draggable";
import { motion } from "framer-motion";
import { Tag } from "lucide-react";
import { ListPollDto } from "@/lib/Api";
import { HiveMimeTagItem } from "../../hm-tag-item";
import { numberToColorHex } from "@/lib/colors";

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
        layoutId={getReferenceId(props.category)} key={getReferenceId(props.category)}
        style={{ 
          backgroundColor: `${numberToColorHex(props.category.category.color!)}00`,
          borderColor: `${numberToColorHex(props.category.category.color!)}77`,
        }}
        whileHover={{
          backgroundColor: `${numberToColorHex(props.category.category.color!)}20`,
          borderColor: `${numberToColorHex(props.category.category.color!)}`,
        }}
        className="flex flex-col border-l-6 rounded-md gap-2 p-2">
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
                  <HiveMimePickCandidate candidate={candidate} category={props.category} />
                </HiveMimeDraggable>
              </div>
            </motion.div>
          </div>
        ))}
      </motion.div>
    </HiveMimeDraggable>
  );
};

export function HiveMimePickCandidate({ candidate, category }: { candidate: CombinedPollCandidate, category: CombinedPollCategory }) {
  return (
    <HiveMimeHoverCard
     style={{
      borderColor: `${numberToColorHex(category.category.color!)}77`,
     }}
     className={`flex flex-row gap-2 items-center cursor-pointer hover:text-honey-brown`}>
      <span className="flex-1">{candidate.candidate.name}</span>
      <HiveMimeCategoryTag category={category} />
    </HiveMimeHoverCard>
  );
};

export function HiveMimeCategoryTag({ category }: { category: CombinedPollCategory }) {
  return (
    <div className="flex flex-row items-center gap-2 text-sm text-muted-foreground">
      <Tag 
        style={{ 
          color: `${numberToColorHex(category.category.color!)}`,
        }}
        className="w-4 h-4" />
      <span title={category.category.name!} className="truncate max-w-32">{category.category.name}</span>
    </div>
  );
};

type HiveMimeCategoryTagBoxProps = React.ComponentProps<"div"> & {
  category: CombinedPollCategory;
};

export function HiveMimeCategoryTagBox({ category, ...props }: HiveMimeCategoryTagBoxProps) {
  return (
    <motion.div
      className="cursor-pointer border-1 rounded-md"
      style={{
        color: `${numberToColorHex(category.category.color!)}`,
        borderColor: `${numberToColorHex(category.category.color!)}`,
        backgroundColor: `${numberToColorHex(category.category.color!)}20`,
      }}
      whileHover={{
        backgroundColor: `${numberToColorHex(category.category.color!)}50`,
      }}>
      <HiveMimeTagItem {...props}>
        <div className="text-muted-foreground">
          {category.category.name}
        </div>
      </HiveMimeTagItem>
    </motion.div>
  );
};