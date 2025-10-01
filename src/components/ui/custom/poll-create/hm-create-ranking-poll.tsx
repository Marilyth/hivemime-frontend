"use client";

import { observer } from "mobx-react-lite";
import { HiveMimeCreateCandidates } from "./hm-create-candidate";
import { HiveMimeCreatePollProps } from "./hm-create-single-choice-poll";
import { HiveMimeInlineInput } from "../hm-embedded-input";
import { useEffect } from "react";
import { Label } from "../../label";
import { HiveMimeCreateShuffleRule } from "./hm-create-shuffle-rule";
import { HiveMimeBulletItem } from "../hm-bullet-item";

const HiveMimeCreateRankingRules = observer((props: HiveMimeCreatePollProps) =>  {
  return (
    <div className="flex flex-col gap-2">
      <Label>Rules</Label>

      <div className="text-muted-foreground">
        <HiveMimeBulletItem>
          The user has to rank at least
          <HiveMimeInlineInput min={1} value={props.poll.minVotes} className="w-5"
            onChange={(e) => props.poll.minVotes = Number(e.target.value)} />
          candidates.
        </HiveMimeBulletItem>

        <HiveMimeCreateShuffleRule poll={props.poll} />
      </div>
    </div>
  );
});

export const HiveMimeCreateRankingPoll = observer((props: HiveMimeCreatePollProps) => {
  useEffect(() => {
    // Set default values for ranking poll.
    props.poll.minVotes = 1;
  }, []);

  return (
    <div className="flex flex-col gap-8">
      <HiveMimeCreateRankingRules poll={props.poll} />
      <HiveMimeCreateCandidates poll={props.poll} />
    </div>
  );
});
