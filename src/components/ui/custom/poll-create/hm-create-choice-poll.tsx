"use client";

import { observer } from "mobx-react-lite";
import { CreatePollDto } from "@/lib/Api";
import { HiveMimeCreateMaxvoteRule, HiveMimeCreateMinvoteRule, HiveMimeCreateShuffleRule } from "./hm-create-rules";

export interface HiveMimeCreatePollProps {
  poll: CreatePollDto;
}

export const HiveMimeCreateMultipleChoiceRules = observer((props: HiveMimeCreatePollProps) =>  {
  return (
    <div>
      <HiveMimeCreateMinvoteRule poll={props.poll} />
      <HiveMimeCreateMaxvoteRule poll={props.poll} />
      <HiveMimeCreateShuffleRule poll={props.poll} />
    </div>
  );
});
