"use client";

import { observer } from "mobx-react-lite";
import { HiveMimeCreatePollProps } from "./hm-create-choice-poll";
import { HiveMimeBulletItem } from "../../utility/hm-bullet-item";
import { Trans } from "react-i18next";
import { Select, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { HiveMimeInlineSelectTrigger } from "../../utility/hm-inline-select";
import { HiveMimeCreateMaxvoteRule, HiveMimeCreateMinvoteRule, HiveMimeCreateShuffleRule } from "./hm-create-rules";


export const HiveMimeCreateLocateRules = observer((props: HiveMimeCreatePollProps) =>  {
  const maxLocations = 10;
  const effectiveMinVotes = Math.max(1, props.poll.minVotes!);
  
  function updateMinLocations(value: string)  {
    const newValue = Number(value);
    props.poll.minVotesPerCandidate = newValue;
    if (newValue > props.poll.maxVotesPerCandidate!) {
      props.poll.maxVotesPerCandidate = newValue;
    }
  }

  function updateMaxLocations(value: string)  {
    const newValue = Number(value);
    props.poll.maxVotesPerCandidate = newValue;
  }

  return (
    <div>
      <HiveMimeBulletItem>
        <Trans
          i18nKey="posts:create.rules.minLocations"
          components={{
            select: (
              <Select
                value={props.poll.minVotesPerCandidate!.toString()}
                onValueChange={updateMinLocations}>
                <HiveMimeInlineSelectTrigger>
                  <SelectValue />
                </HiveMimeInlineSelectTrigger>
                <SelectContent>
                  {[...Array(maxLocations + 1).keys()].map(i => (
                    <SelectItem key={i} value={(i).toString()}>{(i).toString()}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ),
          }}
        />
      </HiveMimeBulletItem>

      <HiveMimeBulletItem>
        <Trans
          i18nKey="posts:create.rules.maxLocations"
          components={{
            select: (
              <Select
                value={props.poll.maxVotesPerCandidate!.toString()}
                onValueChange={updateMaxLocations}>
                <HiveMimeInlineSelectTrigger>
                  <SelectValue />
                </HiveMimeInlineSelectTrigger>
                <SelectContent>
                  {[...Array(maxLocations - effectiveMinVotes! + 1).keys()].map(i => (
                    <SelectItem key={i} value={(effectiveMinVotes! + i).toString()}>{(effectiveMinVotes! + i).toString()}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ),
          }}
        />
      </HiveMimeBulletItem>
    </div>
  );
});
