"use client";

import { observer } from "mobx-react-lite";
import { HiveMimeCreateCandidates } from "./hm-create-candidate";
import { HiveMimeCreatePollProps } from "./hm-create-single-choice-poll";
import { HiveMimeInlineInput } from "../hm-embedded-input";
import { useEffect } from "react";
import { Label } from "../../label";
import { HiveMimeCreateShuffleRule } from "./hm-create-shuffle-rule";
import { HiveMimeBulletItem } from "../hm-bullet-item";


const HiveMimeCreateScoringRules = observer((props: HiveMimeCreatePollProps) =>  {
  return (
    <div className="flex flex-col gap-2">
      <Label>Rules</Label>

      <div className="text-muted-foreground">
        <HiveMimeBulletItem>
          The user has to score candidates from
          <HiveMimeInlineInput min={1} value={props.poll.minValue!} className="w-5"
            onChange={(value) => props.poll.minValue = Number(value.target.value)} />
          to
          <HiveMimeInlineInput min={1} value={props.poll.maxValue!} className="w-7"
            onChange={(value) => props.poll.maxValue = Number(value.target.value)} />
          in steps of
          <HiveMimeInlineInput min={1} value={props.poll.stepValue!} className="w-5"
            onChange={(value) => props.poll.stepValue = Number(value.target.value)} />.
        </HiveMimeBulletItem>

        <HiveMimeCreateShuffleRule poll={props.poll} />
      </div>
    </div>
  );
});

export const HiveMimeCreateScoringPoll = observer((props: HiveMimeCreatePollProps) => {

  useEffect(() => {
    // Set default values for scoring poll.
    props.poll.minValue = 1;
    props.poll.stepValue = 1;
    props.poll.maxValue = 100;
  }, []);

  return (
    <div className="flex flex-col gap-8">
      <HiveMimeCreateScoringRules poll={props.poll} />
      <HiveMimeCreateCandidates poll={props.poll} />
    </div>
  );
});
