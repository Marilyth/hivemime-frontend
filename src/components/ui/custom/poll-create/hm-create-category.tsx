"use client";

import { CreatePollDto, PollCandidateDto } from "@/lib/Api";
import { observer } from "mobx-react-lite";
import { HiveMimeHoverCard } from "../hm-hover-card";
import { HiveMimeEmbeddedInput } from "../hm-embedded-input";
import { HiveMimeIndexHandle } from "../hm-index-handle";
import { Label } from "../../label";
import { Button } from "../../button";
import { Plus, Trash2 } from "lucide-react";

interface HiveMimeCreateCategoryProps {
  index: number;
  onIndexChange?: (newIndex: number) => void;
  option: PollCandidateDto;
}

export interface HiveMimeCreateCategoriesProps {
  poll: CreatePollDto;
}

export const HiveMimeCreateCategories = observer(({ poll }: HiveMimeCreateCategoriesProps) => {
  function moveCategory(oldIndex: number, newIndex: number) {
    if (newIndex < 0 || newIndex >= poll.candidates!.length) {
      return; // Out of bounds
    }

    const [movedCandidate] = poll.candidates!.splice(oldIndex, 1);
    poll.candidates!.splice(newIndex, 0, movedCandidate);
  }

  function removeCategory(index: number) {
    if (poll.candidates!.length > 2) {
      poll.candidates!.splice(index, 1);
    }
  }

  function addCategory() {
    poll.candidates?.push({ name: `Category ${poll.candidates!.length + 1}`, description: "" });
  }

  return (
    <div className="flex flex-col gap-2">
      <Label>Categories</Label>
      <div className="flex flex-col gap-0.5">
        {poll.candidates!.map((option, index) => (
          <div className="flex flex-row items-center" key={index}>
            <div className="flex-1">
              <HiveMimeCreateCategory option={option} index={index} onIndexChange={(newIndex) => moveCategory(index, newIndex)} />
            </div>
              <Button disabled={poll.candidates!.length <= 2} variant="ghost"
                className="ml-2 text-muted-foreground hover:text-red-400"
                onClick={() => removeCategory(index)}>
                  <Trash2 />
              </Button>
          </div>
        ))}
      </div>

      <Button variant="outline" onClick={addCategory}>
        <Plus />Add category
      </Button>
    </div>
  );
});


export const HiveMimeCreateCategory = observer(({ index, option, onIndexChange }: HiveMimeCreateCategoryProps) => {
  return (
    <HiveMimeHoverCard className="flex flex-row gap-2">
      <HiveMimeIndexHandle index={index} onIndexChange={(newIndex) => onIndexChange?.(newIndex)} />
      <HiveMimeEmbeddedInput className="h-auto" value={option.name!} onChange={(e) => option.name = e.target.value} />
    </HiveMimeHoverCard>
  );
});
