"use client";

import { CreatePollDto, CandidateDto } from "@/lib/Api";
import { observer } from "mobx-react-lite";
import { HiveMimeHoverCard } from "../../utility/hm-hover-card";
import { HiveMimeEmbeddedInput } from "../../utility/hm-embedded-input";
import { Button } from "../../../ui/button";
import { Plus, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getReferenceId } from "@/lib/utils";
import { HiveMimeDraggable } from "../../utility/hm-draggable";

interface HiveMimeCreateCandidateProps {
  index: number;
  onIndexChange?: (newIndex: number) => void;
  option: CandidateDto;
}

export interface HiveMimeCreateCandidatesProps {
  poll: CreatePollDto;
}

export const HiveMimeCreateCandidates = observer(({ poll }: HiveMimeCreateCandidatesProps) => {
  function moveCandidate(oldIndex: number, newIndex: number) {
    if (newIndex < 0 || newIndex >= poll.candidates!.length) {
      return; // Out of bounds
    }

    const [movedCandidate] = poll.candidates!.splice(oldIndex, 1);
    poll.candidates!.splice(newIndex, 0, movedCandidate);
  }

  function removeCandidate(index: number) {
    poll.candidates!.splice(index, 1);
  }

  function addCandidate() {
    poll.candidates!.push({ name: `Candidate ${poll.candidates!.length + 1}`, description: "" });
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-0.5">
        <AnimatePresence>
          {poll.candidates!.map((option, index) => (
            <motion.div layout
              key={getReferenceId(option)}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}>
                <HiveMimeDraggable hasHandle isDraggable isDropArea isSticky data={option} dataList={poll.candidates!} allowedZones={['top', 'bottom']}>
                  <div className="flex flex-row items-center">
                    <div className="flex-1">
                      <HiveMimeCreateCandidate option={option} index={index} onIndexChange={(newIndex) => moveCandidate(index, newIndex)} />
                    </div>
                      <Button variant="ghost"
                        className="ml-2 text-muted-foreground hover:text-red-400"
                        onClick={() => removeCandidate(index)}>
                          <Trash2 />
                      </Button>
                    </div>
                </HiveMimeDraggable>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <Button variant="outline" onClick={addCandidate}>
        <Plus />Add candidate
      </Button>
    </div>
  );
});


export const HiveMimeCreateCandidate = observer(({ index, option, onIndexChange }: HiveMimeCreateCandidateProps) => {
  return (
    <HiveMimeHoverCard className="flex flex-row gap-2">
      <HiveMimeEmbeddedInput className="h-auto" value={option.name!} onChange={(e) => option.name = e.target.value} />
    </HiveMimeHoverCard>
  );
});
