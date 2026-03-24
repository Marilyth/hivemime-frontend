"use client";

import { observer } from "mobx-react-lite";
import { HiveMimeCreateMinvoteRule, HiveMimeCreateShuffleRule } from "./hm-create-rules";
import { HiveMimeCreatePollProps } from "./hm-create-choice-poll";

export const HiveMimeCreateCategorizationRules = observer((props: HiveMimeCreatePollProps) =>  {
  return (
    <div>
      <HiveMimeCreateMinvoteRule poll={props.poll} />
      <HiveMimeCreateShuffleRule poll={props.poll} />
    </div>
  );
});