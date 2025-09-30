"use client";

import { observer } from "mobx-react-lite";
import { HiveMimeCreateCandidates } from "./hm-create-candidate";
import { HiveMimeCreatePollProps } from "./hm-create-single-choice-poll";
import { HiveMimeInlineInput } from "../hm-embedded-input";
import { Slider } from "../../slider";
import { useEffect, useState } from "react";
import { Label } from "../../label";

export const HiveMimeCreateScoringPoll = observer((props: HiveMimeCreatePollProps) => {
  const [sliderValue, setSliderValue] = useState([1, 10, 1]);
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
          <HiveMimeInlineInput min={1} defaultValue={1} className="w-5"
            onChange={(value) => setSliderValue([Number.parseInt(value.target.value), sliderValue[1], sliderValue[2]])} />
          to
          <HiveMimeInlineInput min={1} defaultValue={10} className="w-5"
            onChange={(value) => setSliderValue([sliderValue[0], Number.parseInt(value.target.value), sliderValue[2]])} />
          in steps of
          <HiveMimeInlineInput min={1} defaultValue={1} className="w-5"
            onChange={(value) => setSliderValue([sliderValue[0], sliderValue[1], Number.parseInt(value.target.value)])} />
          .
        </div>

        <div className="flex flex-row items-center">
          <Label className="flex-1 text-gray-500 text-sm">Example</Label>
          <Label className="text-gray-500 text-sm">{sliderSelection}</Label>
        </div>
        <Slider min={sliderValue[0]} max={sliderValue[1]} step={sliderValue[2]} onValueChange={(value) => setSliderSelection(value[0])} />
      </div>

      <HiveMimeCreateCandidates poll={props.poll} />
    </div>
  );
});
