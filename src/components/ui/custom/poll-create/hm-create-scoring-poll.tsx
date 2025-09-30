"use client";

import { observer } from "mobx-react-lite";
import { HiveMimeCreateCandidates } from "./hm-create-candidate";
import { HiveMimeCreatePollProps } from "./hm-create-single-choice-poll";
import { HiveMimeInlineInput } from "../hm-embedded-input";
import { Slider } from "../../slider";
import { useEffect, useState } from "react";
import { Label } from "../../label";

export const HiveMimeCreateScoringPoll = observer((props: HiveMimeCreatePollProps) => {
  const [sliderSelection, setSliderSelection] = useState(1);

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
      <div className="flex flex-col gap-2">
        <div className="items-center text-muted-foreground">
          The user has to score candidates from
          <HiveMimeInlineInput min={1} value={props.poll.minValue} className="w-5"
            onChange={(value) => props.poll.minValue = Number(value.target.value)} />
          to
          <HiveMimeInlineInput min={1} value={props.poll.maxValue} className="w-5"
            onChange={(value) => props.poll.maxValue = Number(value.target.value)} />
          in steps of
          <HiveMimeInlineInput min={1} value={props.poll.stepValue} className="w-5"
            onChange={(value) => props.poll.stepValue = Number(value.target.value)} />
          .
        </div>

        <div className="flex flex-row items-center">
          <Label className="flex-1 text-gray-500 text-sm">Example</Label>
          <Label className="text-gray-500 text-sm">{sliderSelection}</Label>
        </div>
        <Slider min={props.poll.minValue} max={props.poll.maxValue} step={props.poll.stepValue} onValueChange={(value) => setSliderSelection(value[0])} />
      </div>

      <HiveMimeCreateCandidates poll={props.poll} />
    </div>
  );
});
