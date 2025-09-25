"use client";

import { Plus } from "lucide-react"
import { Button } from "./button";
import { CreatePollDto } from "@/lib/Api";
import { InputWithLabel } from "./labelled-input";
import { observer } from "mobx-react-lite";
import { Label } from "@radix-ui/react-label";
import { HiveMimeCreatePickOption } from "./hm-create-pick-option";

export interface HiveMimeCreatePollProps {
  poll: CreatePollDto;
}

export const HiveMimeCreatePoll = observer(({ poll }: HiveMimeCreatePollProps) => {
  function addOption() {
    poll.options?.push({ name: `Candidate ${poll.options!.length + 1}`, description: "" });
  }

  return (
    <div className="flex flex-col gap-2">
      <InputWithLabel label="Question" placeholder="My poll's title" value={poll.title!}
        onChange={(e) => poll.title = e.target.value} />
      <InputWithLabel label="Description" placeholder="My poll's description" value={poll.description!}
        onChange={(e) => poll.description = e.target.value} />

        <Label className="mt-8">Candidates</Label>
        {poll.options!.map((option, index) => (
          <HiveMimeCreatePickOption key={index} option={option} label={`${index + 1}`} />
        ))}

        <Button variant="outline" onClick={addOption}>
          <Plus />Add candidate
        </Button>
    </div>
  );
});
