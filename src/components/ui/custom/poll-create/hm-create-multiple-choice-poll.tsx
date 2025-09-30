"use client";

import { observer } from "mobx-react-lite";
import { HiveMimeCreateCandidates } from "./hm-create-candidate";
import { HiveMimeCreatePollProps } from "./hm-create-single-choice-poll";
import { HiveMimeInlineInput } from "../hm-embedded-input";
import { useEffect } from "react";

export const HiveMimeCreateMultipleChoicePoll = observer((props: HiveMimeCreatePollProps) => {
  function validatePoll() {
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
    <div className="flex flex-col gap-4">
      <div className="items-center text-muted-foreground">
        The user can pick up to
        <HiveMimeInlineInput max={5} min={1} value={props.poll.candidates?.length} className="w-5" />
        candidates.
      </div>

      <HiveMimeCreateCandidates poll={props.poll} />
    </div>
  );
});
