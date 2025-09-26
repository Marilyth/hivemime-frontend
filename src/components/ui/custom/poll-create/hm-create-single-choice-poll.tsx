"use client";

import { Plus, Trash2 } from "lucide-react"
import { Button } from "../../button";
import { CreatePollDto } from "@/lib/Api";
import { observer } from "mobx-react-lite";
import { Label } from "@radix-ui/react-label";
import { HiveMimeCreateCandidate } from "./hm-create-candidate";

export interface HiveMimeCreatePollProps {
  poll: CreatePollDto;
}

export const HiveMimeCreateSingleChoicePoll = observer(({ poll }: HiveMimeCreatePollProps) => {
  function removeOption(index: number) {
    if (poll.options!.length > 2) {
      poll.options!.splice(index, 1);
    }
  }

  function addOption() {
    poll.options?.push({ name: `Candidate ${poll.options!.length + 1}`, description: "" });
  }

  return (
    <div className="flex flex-col gap-2">
      <Label>Candidates</Label>
      {poll.options!.map((option, index) => (
        <div key={index} className="flex flex-row items-center">
          <div className="flex-1">
            <HiveMimeCreateCandidate option={option} label={`${index + 1}`} />
          </div>
            <Button disabled={poll.options!.length <= 2} variant="ghost"
              className="ml-2 text-muted-foreground hover:text-red-400"
              onClick={() => removeOption(index)}>
                <Trash2 />
            </Button>
        </div>
      ))}

      <Button variant="outline" onClick={addOption}>
        <Plus />Add candidate
      </Button>
    </div>
  );
});
