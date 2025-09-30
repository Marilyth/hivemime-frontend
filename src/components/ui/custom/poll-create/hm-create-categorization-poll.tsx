"use client";

import { observer } from "mobx-react-lite";
import { HiveMimeCreatePollProps } from "./hm-create-single-choice-poll";
import { HiveMimeCreateCategories } from "./hm-create-category";
import { HiveMimeCreateCandidates } from "./hm-create-candidate";
import { useEffect } from "react";

export const HiveMimeCreateCategorizationPoll = observer((props: HiveMimeCreatePollProps) => {
  function validatePoll() {
    props.validation!.isValid = true;
    props.validation!.errors = [];

    if (!props.poll.candidates || props.poll.candidates.length < 1) {
      props.validation!.isValid = false;
      props.validation!.errors.push("A categorization poll must have at least one candidate.");
    }

    // if (!props.poll.categories || props.poll.categories.length < 2) {
    //   props.validation!.isValid = false;
    //   props.validation!.errors.push("A categorization poll must have at least two categories.");
    // }
  }
  
  useEffect(() => {
    validatePoll();
  }, [props.poll.candidates?.length]);

  return (
    <div className="flex flex-col gap-4">
      <HiveMimeCreateCategories poll={props.poll} />
      <HiveMimeCreateCandidates poll={props.poll} />
    </div>
  );
});
