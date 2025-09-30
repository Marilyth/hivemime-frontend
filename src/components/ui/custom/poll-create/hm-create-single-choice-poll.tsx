"use client";

import { CreatePollDto } from "@/lib/Api";
import { observer } from "mobx-react-lite";
import { HiveMimeCreateCandidates } from "./hm-create-candidate";
import { useEffect } from "react";
import { autorun, comparer, reaction, toJS } from "mobx";

export interface HiveMimeCreatePollProps {
  validation: { isValid: boolean; errors: string[] };
  poll: CreatePollDto;
}

export const HiveMimeCreateSingleChoicePoll = observer((props: HiveMimeCreatePollProps) => {
  function validatePoll() {
    console.log("Validating single choice poll", props.poll);
    props.validation!.isValid = true;
    props.validation!.errors = [];

    if (!props.poll.candidates || props.poll.candidates.length < 2) {
      props.validation!.isValid = false;
      props.validation!.errors.push("A choice poll must have at least two candidates.");
    }
  }

  useEffect(() => {
    validatePoll();
  }, [props.poll.candidates?.length]);

  return (
    <HiveMimeCreateCandidates poll={props.poll} />
  )
});
