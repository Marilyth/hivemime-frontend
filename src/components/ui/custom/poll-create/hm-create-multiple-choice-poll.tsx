"use client";

import { observer } from "mobx-react-lite";
import { HiveMimeCreateCandidates } from "./hm-create-candidate";
import { HiveMimeCreatePollProps } from "./hm-create-single-choice-poll";
import { HiveMimeInlineInput } from "../hm-embedded-input";
import { useEffect } from "react";
import { HiveMimeBulletItem } from "../hm-bullet-item";
import { Label } from "../../label";
import { HiveMimeCreateShuffleRule } from "./hm-create-shuffle-rule";

const HiveMimeCreateMultipleChoiceRules = observer((props: HiveMimeCreatePollProps) =>  {
  return (
    <div className="flex flex-col gap-2">
      <Label>Rules</Label>

      <div className="text-muted-foreground">
        <HiveMimeBulletItem>
          The user can pick up to
          <HiveMimeInlineInput max={props.poll.candidates?.length} min={1}
            value={props.poll.maxVotes ?? props.poll.candidates?.length} className="w-5" onChange={(e) => props.poll.maxVotes = Number(e.target.value)} />
          candidates.
        </HiveMimeBulletItem>

        <HiveMimeCreateShuffleRule poll={props.poll} />
      </div>
    </div>
  );
});

export const HiveMimeCreateMultipleChoicePoll = observer((props: HiveMimeCreatePollProps) => {
  useEffect(() => {
    props.poll.maxVotes = undefined;
  }, []);

  return (
    <div className="flex flex-col gap-8">
      <HiveMimeCreateMultipleChoiceRules poll={props.poll} />
      <HiveMimeCreateCandidates poll={props.poll} />
    </div>
  );
});
