"use client";

import { CreatePollDto } from "@/lib/Api";
import { observer } from "mobx-react-lite";
import { HiveMimeCreateCandidates } from "./hm-create-candidate";
import { Label } from "../../label";
import { HiveMimeCreateShuffleRule } from "./hm-create-shuffle-rule";

export interface HiveMimeCreatePollProps {
  poll: CreatePollDto;
}

const HiveMimeCreateMultipleChoiceRules = observer((props: HiveMimeCreatePollProps) =>  {
  return (
    <div className="flex flex-col gap-2">
      <Label>Rules</Label>

      <div className="text-muted-foreground">
        <HiveMimeCreateShuffleRule poll={props.poll} />
      </div>
    </div>
  );
});

export const HiveMimeCreateSingleChoicePoll = observer((props: HiveMimeCreatePollProps) => {
  return (
    <div className="flex flex-col gap-8">
      <HiveMimeCreateMultipleChoiceRules poll={props.poll} />
      <HiveMimeCreateCandidates poll={props.poll} />
    </div>
  )
});
