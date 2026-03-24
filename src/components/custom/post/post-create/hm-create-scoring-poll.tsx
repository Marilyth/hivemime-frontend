"use client";

import { observer } from "mobx-react-lite";
import { HiveMimeInlineInput } from "../../utility/hm-embedded-input";
import { HiveMimeBulletItem } from "../../utility/hm-bullet-item";
import { HiveMimeCreateMinvoteRule, HiveMimeCreateShuffleRule } from "./hm-create-rules";
import { HiveMimeCreatePollProps } from "./hm-create-choice-poll";


export const HiveMimeCreateScoringRules = observer((props: HiveMimeCreatePollProps) =>  {
  return (
    <div>
      <HiveMimeBulletItem>
        The user has to score candidates from
        <HiveMimeInlineInput min={1} value={props.poll.minValue!}
          onChange={(value) => props.poll.minValue = Number(value.target.value)} />
        to
        <HiveMimeInlineInput min={1} value={props.poll.maxValue!}
          onChange={(value) => props.poll.maxValue = Number(value.target.value)} />
        in steps of
        <HiveMimeInlineInput min={1} value={props.poll.stepValue!}
          onChange={(value) => props.poll.stepValue = Number(value.target.value)} />.
      </HiveMimeBulletItem>

      <HiveMimeCreateMinvoteRule poll={props.poll} />
      <HiveMimeCreateShuffleRule poll={props.poll} />
    </div>
  );
});
