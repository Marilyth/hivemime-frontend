"use client";

import { observer } from "mobx-react-lite";
import { Label } from "@radix-ui/react-label";
import { Toggle } from "./toggle";

interface HiveMimeCreatePollTypeOption {
  name: string;
  description: string;
}

export const HiveMimeCreatePollType = observer(() => {
  const options: HiveMimeCreatePollTypeOption[] = [
    { name: "Single choice", description: "The user can pick one out of several candidates." },
    { name: "Multiple choice", description: "The user can pick one or more candidates." },
  ];

  return (
    <div className="flex flex-col gap-2">
        {options.map((option, index) => (
          <Toggle key={index}>
            <Label>
              <div className="flex flex-col">
                <div className="font-medium">{option.name}</div>
                <div className="text-sm text-muted-foreground">{option.description}</div>
              </div>
            </Label>
          </Toggle>
        ))}
    </div>
  );
});
