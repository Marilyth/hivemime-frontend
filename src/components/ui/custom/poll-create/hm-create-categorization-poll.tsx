"use client";

import { observer } from "mobx-react-lite";
import { HiveMimeCreatePollProps } from "./hm-create-single-choice-poll";
import { HiveMimeCreateCategories } from "./hm-create-category";
import { HiveMimeCreateCandidates } from "./hm-create-candidate";
import { Label } from "../../label";
import { HiveMimeCreateShuffleRule } from "./hm-create-shuffle-rule";

const HiveMimeCreateCategorizationRules = observer((props: HiveMimeCreatePollProps) =>  {
  return (
    <div className="flex flex-col gap-2">
      <Label>Rules</Label>

      <div className="text-muted-foreground">
        <HiveMimeCreateShuffleRule poll={props.poll} />
      </div>
    </div>
  );
});

export const HiveMimeCreateCategorizationPoll = observer((props: HiveMimeCreatePollProps) => {
  return (
    <div className="flex flex-col gap-8">
      <HiveMimeCreateCategorizationRules poll={props.poll} />
      <HiveMimeCreateCategories poll={props.poll} />
      <HiveMimeCreateCandidates poll={props.poll} />
    </div>
  );
});
