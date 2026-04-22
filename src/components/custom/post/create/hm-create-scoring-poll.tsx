"use client";

import { observer } from "mobx-react-lite";
import { HiveMimeInlineInput } from "../../utility/hm-embedded-input";
import { HiveMimeBulletItem } from "../../utility/hm-bullet-item";
import { HiveMimeCreateMaxvoteRule, HiveMimeCreateMinvoteRule, HiveMimeCreateShuffleRule } from "./hm-create-rules";
import { HiveMimeCreatePollProps } from "./hm-create-choice-poll";


export const HiveMimeCreateScoringRules = observer((props: HiveMimeCreatePollProps) =>  {
  return (
    <div>
      <HiveMimeBulletItem>
        The minimum score is
        <HiveMimeInlineInput min={1} value={props.poll.minValue!}
          onChange={(value) => props.poll.minValue = Number(value.target.value)} />.
      </HiveMimeBulletItem>

      <HiveMimeBulletItem>
        The maximum score is
        <HiveMimeInlineInput min={1} value={props.poll.maxValue!}
          onChange={(value) => props.poll.maxValue = Number(value.target.value)} />.
      </HiveMimeBulletItem>

      <HiveMimeCreateMinvoteRule poll={props.poll} />
      <HiveMimeCreateMaxvoteRule poll={props.poll} />
      <HiveMimeCreateShuffleRule poll={props.poll} />
    </div>
  );
});
