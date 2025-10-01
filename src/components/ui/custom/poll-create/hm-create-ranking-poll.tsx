"use client";

import { observer } from "mobx-react-lite";
import { HiveMimeCreateCandidates } from "./hm-create-candidate";
import { HiveMimeCreatePollProps } from "./hm-create-single-choice-poll";
import { HiveMimeInlineInput } from "../hm-embedded-input";
import { useEffect } from "react";

export const HiveMimeCreateRankingPoll = observer((props: HiveMimeCreatePollProps) => {
  function validatePoll() {
    props.validation!.isValid = true;
    props.validation!.errors = [];

    if (!props.poll.candidates || props.poll.candidates.length < 2) {
      props.validation!.isValid = false;
      props.validation!.errors.push("A ranking poll must have at least two candidates.");
    }
  }

  useEffect(() => {
    // Set default values for ranking poll.
    props.poll.minVotes = 1;
  }, []);

  useEffect(() => {
    validatePoll();
  }, [props.poll.candidates?.length]);

  return (
    <div className="flex flex-col gap-4">
      <div className="items-center text-muted-foreground">
        The user has to rank at least
        <HiveMimeInlineInput min={1} value={props.poll.minVotes} className="w-5"
          onChange={(e) => props.poll.minVotes = Number(e.target.value)} />
        candidates.
      </div>

      <HiveMimeCreateCandidates poll={props.poll} />
    </div>
  );
});
