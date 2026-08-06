"use client";

import { observer } from "mobx-react-lite";
import { HiveMimeCreatePollProps } from "./hm-create-choice-poll";
import { HiveMimeBulletItem } from "../../utility/hm-bullet-item";
import { Trans } from "react-i18next";
import { Select, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { HiveMimeInlineSelectTrigger } from "../../utility/hm-inline-select";

const MAX_DATE_OPTIONS = 20;

export const HiveMimeCreateDateRules = observer((props: HiveMimeCreatePollProps) => {
  function updateMinDates(value: string) {
    const newValue = Number(value);
    props.poll.minVotesPerCandidate = newValue;

    if (newValue > props.poll.maxVotesPerCandidate!) {
      props.poll.maxVotesPerCandidate = newValue;
    }
  }

  function updateMaxDates(value: string) {
    props.poll.maxVotesPerCandidate = Number(value);
  }

  const effectiveMin = Math.max(1, props.poll.minVotesPerCandidate!);

  return (
    <div>
      <HiveMimeBulletItem>
        <Trans
          i18nKey="posts:create.rules.minDates"
          components={{
            select: (
              <Select value={props.poll.minVotesPerCandidate!.toString()} onValueChange={updateMinDates}>
                <HiveMimeInlineSelectTrigger>
                  <SelectValue />
                </HiveMimeInlineSelectTrigger>
                <SelectContent>
                  {[...Array(MAX_DATE_OPTIONS).keys()].map(i => (
                    <SelectItem key={i} value={(i + 1).toString()}>{(i + 1).toString()}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ),
          }}
        />
      </HiveMimeBulletItem>

      <HiveMimeBulletItem>
        <Trans
          i18nKey="posts:create.rules.maxDates"
          components={{
            select: (
              <Select value={props.poll.maxVotesPerCandidate!.toString()} onValueChange={updateMaxDates}>
                <HiveMimeInlineSelectTrigger>
                  <SelectValue />
                </HiveMimeInlineSelectTrigger>
                <SelectContent>
                  {[...Array(MAX_DATE_OPTIONS - effectiveMin + 1).keys()].map(i => (
                    <SelectItem key={i} value={(effectiveMin + i).toString()}>{(effectiveMin + i).toString()}</SelectItem>
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
