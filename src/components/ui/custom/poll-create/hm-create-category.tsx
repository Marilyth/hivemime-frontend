"use client";

import { CreatePollDto, PollCategoryDto } from "@/lib/Api";
import { observer } from "mobx-react-lite";
import { HiveMimeHoverCard } from "../hm-hover-card";
import { HiveMimeEmbeddedInput } from "../hm-embedded-input";
import { HiveMimeIndexHandle } from "../hm-index-handle";
import { Label } from "../../label";
import { Button } from "../../button";
import { Plus, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getReferenceId } from "@/lib/utils";
import { HiveMimeDraggable } from "../hm-draggable";

interface HiveMimeCreateCategoryProps {
  index: number;
  onIndexChange?: (newIndex: number) => void;
  category: PollCategoryDto;
}

export interface HiveMimeCreateCategoriesProps {
  poll: CreatePollDto;
}

export const HiveMimeCreateCategories = observer(({ poll }: HiveMimeCreateCategoriesProps) => {
  function moveCategory(oldIndex: number, newIndex: number) {
    if (newIndex < 0 || newIndex >= poll.categories!.length) {
      return; // Out of bounds
    }

    const [movedCategory] = poll.categories!.splice(oldIndex, 1);
    poll.categories!.splice(newIndex, 0, movedCategory);
  }

  function removeCategory(index: number) {
    poll.categories!.splice(index, 1);
  }

  function addCategory() {
    poll.categories?.push({ name: `Category ${poll.categories!.length + 1}`, description: "" });
  }

  return (
    <div className="flex flex-col gap-2">
      <Label>Categories</Label>
      <div className="flex flex-col gap-0.5">
        <AnimatePresence>
          {poll.categories!.map((category, index) => (
            <motion.div layout
              key={getReferenceId(category)}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}>
                <HiveMimeDraggable isDraggable isDroppable isSticky data={category} dataList={poll.categories!} allowedEdges={['top', 'bottom']}>
                  <div className="flex flex-row items-center">
                    <div className="flex-1">
                      <HiveMimeCreateCategory category={category} index={index} onIndexChange={(newIndex) => moveCategory(index, newIndex)} />
                    </div>
                      <Button variant="ghost"
                        className="ml-2 text-muted-foreground hover:text-red-400"
                        onClick={() => removeCategory(index)}>
                          <Trash2 />
                      </Button>
                    </div>
                </HiveMimeDraggable>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <Button variant="outline" onClick={addCategory}>
        <Plus />Add category
      </Button>
    </div>
  );
});


export const HiveMimeCreateCategory = observer(({ index, category, onIndexChange }: HiveMimeCreateCategoryProps) => {
  return (
    <HiveMimeHoverCard className="flex flex-row gap-2">
      <HiveMimeIndexHandle index={index} onIndexChange={(newIndex) => onIndexChange?.(newIndex)} />
      <HiveMimeEmbeddedInput className="h-auto" value={category.name!} onChange={(e) => category.name = e.target.value} />
    </HiveMimeHoverCard>
  );
});
