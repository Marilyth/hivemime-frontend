"use client";

import { CreatePollDto, PollCategoryDto } from "@/lib/Api";
import { observer } from "mobx-react-lite";
import { HiveMimeHoverCard } from "../hm-hover-card";
import { HiveMimeEmbeddedInput } from "../hm-embedded-input";
import { Label } from "../../label";
import { Button } from "../../button";
import { Plus, Trash2, Brush, Tag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getReferenceId } from "@/lib/utils";
import { HiveMimeDraggable } from "../hm-draggable";
import { useState } from "react";
import { CirclePicker } from "react-color";
import { colorHexToNumber, mutedColors, mutedColorsList, numberToColorHex } from "@/lib/colors";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogPortal, DialogTitle } from "../../dialog";


interface HiveMimeCreateCategoryProps {
  index: number;
  onIndexChange?: (newIndex: number) => void;
  category: PollCategoryDto;
}

export interface HiveMimeCreateCategoriesProps {
  poll: CreatePollDto;
}

export const HiveMimeCreateCategories = observer(({ poll }: HiveMimeCreateCategoriesProps) => {
  const [selectedCategory, setSelectedCategory] =  useState<PollCategoryDto | null>(null);
  
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
    poll.categories?.push({ name: `Category ${poll.categories!.length + 1}`, description: "", color: colorHexToNumber(mutedColors.honeyBrown) });
  }

  return (
    <div className="flex flex-col gap-2">
      <Dialog open={selectedCategory != null} onOpenChange={() => setSelectedCategory(null)}>
        <DialogContent className="gap-2 w-auto">
          <DialogHeader>
            <DialogTitle>Pick a color for <span className="text-honey-brown">{selectedCategory?.name}</span></DialogTitle>
          </DialogHeader>
          <CirclePicker
            color={numberToColorHex(selectedCategory?.color ?? 0)}
            onChangeComplete={(color) => selectedCategory!.color = colorHexToNumber(color.hex)}
            colors={mutedColorsList}
          />
        </DialogContent>
      </Dialog>
      
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
                      <Button variant="link"
                        style={{
                          color: numberToColorHex(category.color!)
                        }}
                        className="ml-2 text-muted-foreground hover:text-honey-brown"
                        onClick={() => setSelectedCategory(category)}>
                          <Brush />
                      </Button>
                      <Button variant="ghost"
                        className="text-muted-foreground hover:text-red-400"
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


export const HiveMimeCreateCategory = observer(({ category }: HiveMimeCreateCategoryProps) => {
  return (
    <HiveMimeHoverCard className="flex flex-row gap-2 items-center">
      <Tag style={{
        color: numberToColorHex(category.color!)
      }} className="w-4 h-4" />
      <HiveMimeEmbeddedInput className="h-auto" value={category.name!} onChange={(e) => category.name = e.target.value} />
    </HiveMimeHoverCard>
  );
});
