import { CombinedPollCandidate } from "@/lib/view-models";
import { HiveMimeHoverCard } from "../../../utility/hm-hover-card";
import { motion } from "framer-motion";
import { Tag } from "lucide-react";
import { CategoryDto } from "@/lib/Api";
import { HiveMimeTagItem } from "../../../utility/hm-tag-item";
import { numberToColorHex } from "@/lib/colors";


export function HiveMimePickCandidate({ candidate, category }: { candidate: CombinedPollCandidate, category: CategoryDto | null }) {
  return (
    <HiveMimeHoverCard
     style={ category ? {
      background: `${numberToColorHex(category?.color ?? 0)}20`,
     } : undefined}
     className={`flex flex-row gap-2 items-center cursor-pointer hover:text-honey-brown`}>
      <span className="flex-1">{candidate.candidate.name}</span>
      {category && <HiveMimeCategoryTag category={category} />}
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
      <span className="truncate max-w-32">{category.name}</span>
    </div>
  );
};

type HiveMimeCategoryTagBoxProps = React.ComponentProps<"div"> & {
  category: CategoryDto;
};

export function HiveMimeCategoryTagBox({ category, ...props }: HiveMimeCategoryTagBoxProps) {
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