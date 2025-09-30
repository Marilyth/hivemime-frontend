"use client";

import { observer } from "mobx-react-lite";
import { HiveMimeCreateCandidates } from "./hm-create-candidate";
import { HiveMimeCreatePollProps } from "./hm-create-single-choice-poll";
import { HiveMimeInlineInput } from "../hm-embedded-input";
import { Slider } from "../../slider";
import { useEffect } from "react";

export const HiveMimeCreateScoringPoll = observer((props: HiveMimeCreatePollProps) => {
  function validatePoll() {
    props.validation!.isValid = true;
    props.validation!.errors = [];

    if (!props.poll.candidates || props.poll.candidates.length < 1) {
      props.validation!.isValid = false;
      props.validation!.errors.push("A scoring poll must have at least one candidate.");
    }
  }

  useEffect(() => {
    validatePoll();
  }, [props.poll.candidates?.length]);
    
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <div className="items-center text-muted-foreground">
          The user has to score candidates from
          <HiveMimeInlineInput min={1} defaultValue={1} className="w-5" />
          to
          <HiveMimeInlineInput min={1} defaultValue={10} className="w-5"  />
          in steps of
          <HiveMimeInlineInput min={1} defaultValue={1} className="w-5" />
        </div>

        <Slider min={1} max={10} step={1} />
      </div>

      <HiveMimeCreateCandidates poll={props.poll} />
    </div>
  );
});
