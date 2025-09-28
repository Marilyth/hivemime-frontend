"use client";

import { observer } from "mobx-react-lite";
import { CreatePollDto } from "@/lib/Api";
import { HiveMimeHoverCard } from "../hm-hover-card";
import { HiveMimePollTypeIcon } from "../hm-poll-type-icon";

export interface HiveMimeCreatePollTypePickerProps
{
  poll: CreatePollDto;
}

interface HiveMimeCreatePollTypePickerOption {
  name: string;
  description: string;
}

export const HiveMimeCreatePollTypePicker = observer(({ poll }: HiveMimeCreatePollTypePickerProps) => {
  const options: HiveMimeCreatePollTypePickerOption[] = [
    { name: "Single choice", description: "The user has to pick one out of several candidates." },
    { name: "Multiple choice", description: "The user has to pick one or more out of several candidates." },
    { name: "Scoring", description: "The user has to assign each candidate a numerical value within a specified range." },
    { name: "Ranking", description: "The user has to rank the candidates in order of preference. (E.g. top 10 lists)" },
    { name: "Categorization", description: "The user has to assign a category to each candidate. (E.g. tier lists)" },
  ];

  return (
    <div className="flex flex-col gap-2">
      <div className="text-sm text-muted-foreground">Choose the type of poll you wish to create.</div>
        {options.map((option, index) => (
          <HiveMimeHoverCard key={index} className="flex flex-row cursor-pointer hover:text-honey-brown" onClick={() => poll.pollType = index}>
            <HiveMimePollTypeIcon answerType={index} className="mr-2 text-gray-500 w-8" />
            <div className="flex-1 flex flex-col">
              <span>{option.name}</span>
              <span className="text-sm text-muted-foreground">{option.description}</span>
            </div>
          </HiveMimeHoverCard>
        ))}
    </div>
  );
});
