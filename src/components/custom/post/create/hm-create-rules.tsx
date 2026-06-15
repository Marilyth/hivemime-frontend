"use client";

import { observer } from "mobx-react-lite";
import { HiveMimeBulletItem } from "../../utility/hm-bullet-item";
import { Select, SelectContent, SelectItem, SelectValue } from "../../../ui/select";
import { HiveMimeInlineSelectTrigger } from "../../utility/hm-inline-select";
import { HiveMimeCreatePollProps } from "./hm-create-choice-poll";
import { Trans, useTranslation } from "react-i18next";


export const HiveMimeCreateMinvoteRule = observer((props: HiveMimeCreatePollProps) =>  {
  function updateMinVotes(value: string)  {
    const newValue = Number(value);
    props.poll.minVotes = newValue;

    if (newValue > props.poll.maxVotes!) {
      props.poll.maxVotes = newValue;
    }
  }

  return (
    <HiveMimeBulletItem>
      <Trans
        i18nKey="posts:create.rules.minVotes"
        components={{
          select: (
            <Select
              value={props.poll.minVotes!.toString()}
              onValueChange={updateMinVotes}>
              <HiveMimeInlineSelectTrigger>
                  <SelectValue />
              </HiveMimeInlineSelectTrigger>
              <SelectContent>
                {[...Array(1 + (props.poll.candidates!.length + props.poll.allowedCustomCandidateCount!)).keys()].map(i => (
                  <SelectItem key={i} value={(i).toString()}>{i.toString()}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          ),
        }}
      />
    </HiveMimeBulletItem>
  );
});

export const HiveMimeCreateMaxvoteRule = observer((props: HiveMimeCreatePollProps) =>  {
  const effectiveMinVotes = Math.max(1, props.poll.minVotes!);

  return (
    <HiveMimeBulletItem>
      <Trans
        i18nKey="posts:create.rules.maxVotes"
        components={{
          select: (
            <Select
              value={props.poll.maxVotes!.toString()}
              onValueChange={(value) => props.poll.maxVotes = Number(value)}>
              <HiveMimeInlineSelectTrigger>
                <SelectValue />
              </HiveMimeInlineSelectTrigger>
              <SelectContent>
                {[...Array(props.poll.candidates!.length + props.poll.allowedCustomCandidateCount! - effectiveMinVotes + 1).keys()].map(i => (
                  <SelectItem key={i} value={(effectiveMinVotes + i).toString()}>{(effectiveMinVotes + i).toString()}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          ),
        }}
      />
    </HiveMimeBulletItem>
  );
});

export const HiveMimeCreateShuffleRule = observer((props: HiveMimeCreatePollProps) =>  {
  const { t } = useTranslation();

  return (
    <HiveMimeBulletItem>
      <Trans
        i18nKey="posts:create.rules.shuffle"
        components={{
          select: (
            <Select
              value={props.poll.isShuffled ? "true" : "false"}
              onValueChange={(value) => props.poll.isShuffled = value === "true"}>
              <HiveMimeInlineSelectTrigger>
                  <SelectValue />
              </HiveMimeInlineSelectTrigger>
              <SelectContent>
                  <SelectItem value="true">{t("enums:shuffle.are")}</SelectItem>
                  <SelectItem value="false">{t("enums:shuffle.areNot")}</SelectItem>
              </SelectContent>
            </Select>
          ),
        }}
      />
    </HiveMimeBulletItem>
  );
});

export const HiveMimeCreateCustomCandidatesRule = observer((props: HiveMimeCreatePollProps) =>  {
  const { t } = useTranslation();

  function setAllowedCustomCandidateCount(value: string) {
    props.poll.allowedCustomCandidateCount = Number(value);

    const maxVotesUpperBound = props.poll.candidates!.length + props.poll.allowedCustomCandidateCount!;

    if (maxVotesUpperBound < props.poll.minVotes!) {
      props.poll.minVotes = maxVotesUpperBound;
    }

    if (maxVotesUpperBound < props.poll.maxVotes!) {
      props.poll.maxVotes = maxVotesUpperBound;
    }
  }

  return (
      <HiveMimeBulletItem>
        <Trans i18nKey="posts:create.customCandidateCount" components={{ count:
          <Select value={props.poll.allowedCustomCandidateCount?.toString()} onValueChange={setAllowedCustomCandidateCount}>
            <HiveMimeInlineSelectTrigger>
              <SelectValue />
            </HiveMimeInlineSelectTrigger>
            <SelectContent>
              {[0, 1, 2, 3, 4, 5].map(i => (
                <SelectItem key={i} value={i.toString()}>{i.toString()}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        }} />
      </HiveMimeBulletItem>
  );
});
