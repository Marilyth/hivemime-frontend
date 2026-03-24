"use client";

import { observer } from "mobx-react-lite";
import { HiveMimeCreatePollProps } from "./hm-create-choice-poll";
import { HiveMimeCreateMinvoteRule, HiveMimeCreateShuffleRule } from "./hm-create-rules";

export const HiveMimeCreateRankingRules = observer((props: HiveMimeCreatePollProps) =>  {
  return (
    <div>
      <HiveMimeCreateMinvoteRule poll={props.poll} />
      <HiveMimeCreateShuffleRule poll={props.poll} />
    </div>
  );
});