"use client";

import { Send } from "lucide-react"
import { Button } from "../../button";
import { observer } from "mobx-react-lite";
import { ListPollDto } from "@/lib/Api";
import HiveMimePickSingleChoiceCandidate from "./hm-pick-single-choice-candidate";

export interface HiveMimePickSingleChoicePollProps {
  poll: ListPollDto;
}

export const HiveMimePickSingleChoicePoll = observer(({ poll }: HiveMimePickSingleChoicePollProps) => {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-gray-500 text-sm">Please pick 1 option</span>
        {poll.options!.map((option, index) => (
          <HiveMimePickSingleChoiceCandidate key={index} value={(index + 1).toString()} name={option.name!} />
        ))}

        <div className="flex flex-row mt-2">
          <Button className="w-full" variant={"outline"} disabled >
              <Send />
              Submit
          </Button>
        </div>
    </div>
  );
});
