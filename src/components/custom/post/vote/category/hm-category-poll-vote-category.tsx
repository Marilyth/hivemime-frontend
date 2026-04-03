import { CombinedPollCandidate } from "@/lib/view-models";
import { HiveMimeHoverCard } from "../../../utility/hm-hover-card";
import { getReferenceId } from "@/lib/utils";
import { HiveMimeDraggable } from "../../../utility/hm-draggable";
import { motion } from "framer-motion";
import { Tag } from "lucide-react";
import { CategoryDto, PollDto } from "@/lib/Api";
import { HiveMimeTagItem } from "../../../utility/hm-tag-item";
import { numberToColorHex } from "@/lib/colors";

export interface HiveMimeCategoryPollVoteCategoryPanelProps {
  candidateClicked: (candidate: CombinedPollCandidate) => void;
  poll: PollDto;
  category: CategoryDto;
  candidates: CombinedPollCandidate[];
}

export function HiveMimeCategoryPollVoteCategoryPanel(props: HiveMimeCategoryPollVoteCategoryPanelProps) {
  function assignCandidateToCategory(candidate: CombinedPollCandidate, category: CategoryDto) {
    candidate.vote.value = category.value;
  }

  return (
    <HiveMimeDraggable
      key={getReferenceId(props.category)}
      data={props.category}
      isDropArea
      dropAreaName={[`${getReferenceId(props.poll)}_category`]}
      onDropped={data => assignCandidateToCategory(data.draggableData as CombinedPollCandidate, props.category)}
      canDrop={data => (data as CombinedPollCandidate).vote.value != props.category.value}>

      <motion.div layout
        layoutId={getReferenceId(props.category)} key={getReferenceId(props.category)}
        style={{ 
          backgroundColor: `${numberToColorHex(props.category.color!)}00`,
          borderColor: `${numberToColorHex(props.category.color!)}77`,
        }}
        whileHover={{
          backgroundColor: `${numberToColorHex(props.category.color!)}20`,
          borderColor: `${numberToColorHex(props.category.color!)}`,
        }}
        className="flex flex-col border-l-6 rounded-md gap-2 p-2">
        {props.candidates.map((candidate, index) => (
          <div key={getReferenceId(candidate)} >
            <motion.div layout layoutId={getReferenceId(candidate)} className="flex flex-row">
              <div className="flex-1">
                <HiveMimeDraggable
                  draggableOnArea={[`${getReferenceId(props.poll)}_category`]}
                  dropAreaName={[`${getReferenceId(props.poll)}_candidate`]}
                  isDropArea
                  isDraggable
                  data={candidate}
                  onDropped={data => assignCandidateToCategory(data.dropAreaData as CombinedPollCandidate, data.draggableData as CategoryDto)}
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

export function HiveMimePickCandidate({ candidate, category }: { candidate: CombinedPollCandidate, category: CategoryDto }) {
  return (
    <HiveMimeHoverCard
     style={{
      borderColor: `${numberToColorHex(category.color!)}77`,
     }}
     className={`flex flex-row gap-2 items-center cursor-pointer hover:text-honey-brown`}>
      <span className="flex-1">{candidate.candidate.name}</span>
      <HiveMimeCategoryTag category={category} />
    </HiveMimeHoverCard>
  );
};

export function HiveMimeCategoryTag({ category }: { category: CategoryDto }) {
  return (
    <div className="flex flex-row items-center gap-2 text-sm text-muted-foreground">
      <Tag 
        style={{ 
          color: `${numberToColorHex(category.color!)}`,
        }}
        className="w-4 h-4" />
      <span title={category.name!} className="truncate max-w-32">{category.name}</span>
    </div>
  );
};

type HiveMimeCategoryTagBoxProps = React.ComponentProps<"div"> & {
  category: CategoryDto;
};

export function HiveMimeCategoryTagBox({ category, ...props }: HiveMimeCategoryTagBoxProps) {
  console.log("Rendering category panel for category " + category.name);
  return (
    <motion.div
      className="cursor-pointer border-1 rounded-md"
      style={{
        color: `${numberToColorHex(category.color!)}`,
        borderColor: `${numberToColorHex(category.color!)}`,
        backgroundColor: `${numberToColorHex(category.color!)}20`,
      }}
      whileHover={{
        backgroundColor: `${numberToColorHex(category.color!)}50`,
      }}>
      <HiveMimeTagItem {...props}>
        <div className="text-muted-foreground">
          {category.name}
        </div>
      </HiveMimeTagItem>
    </motion.div>
  );
};