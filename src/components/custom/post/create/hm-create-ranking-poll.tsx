"use client";

import { observer } from "mobx-react-lite";
import { HiveMimeCreatePollProps } from "./hm-create-choice-poll";
import { HiveMimeCreateMaxvoteRule, HiveMimeCreateMinvoteRule, HiveMimeCreateShuffleRule } from "./hm-create-rules";

export const HiveMimeCreateRankingRules = observer((props: HiveMimeCreatePollProps) =>  {
  return (
    <div>
      <HiveMimeCreateMinvoteRule poll={props.poll} />
      <HiveMimeCreateMaxvoteRule poll={props.poll} />
      <HiveMimeCreateShuffleRule poll={props.poll} />
    </div>
  );
});