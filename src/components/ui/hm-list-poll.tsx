"use client";

import { Send } from "lucide-react"
import { Button } from "./button";
import HiveMimePickOption from "./hm-pick-option";
import { ListPollDto } from "@/lib/Api";

export interface HiveMimeListPollProps {
  poll: ListPollDto;
}

export function HiveMimeListPoll({ poll }: HiveMimeListPollProps) {
  return (
    <div className="flex flex-col gap-2">
        <span className="text-honey-brown">{poll.title}</span>
        <span className="text-muted-foreground">{poll.description}</span>
        <span className="text-gray-500 text-sm">Please pick 1 option</span>
        {poll.options!.map((option, index) => (
          <HiveMimePickOption key={index} value={(index + 1).toString()} name={option.name!} />
        ))}

        <div className="flex flex-row mt-2">
          <Button className="w-full" variant={"outline"} disabled >
              <Send />
              Submit
          </Button>
        </div>
    </div>
  );
}
