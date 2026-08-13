"use client";

import { observer } from "mobx-react-lite";
import { Trans, useTranslation } from "react-i18next";
import { Select, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { HiveMimeInlineSelectTrigger } from "../../utility/hm-inline-select";
import { HiveMimeBulletItem } from "../../utility/hm-bullet-item";
import { CalendarScope } from "../../utility/date-selection";
import { CreatePollDto, CreatePostDto, FilterQuery, FilterQueryGroup } from "@/lib/Api";
import { createFilterQueryGroup } from "@/lib/vote-query";
import { HiveMimePostResultFilter } from "../result/filter/hm-post-result-filter";

const DATE_SCOPES = Array.from({ length: CalendarScope.Year + 1 }, (_, i) => i) as CalendarScope[];
const MAX_DATE_OPTIONS = 20;

export type HiveMimeCreateDateRulesProps = {
  post: CreatePostDto;
  poll: CreatePollDto;
};

export const HiveMimeCreateDateRules = observer((props: HiveMimeCreateDateRulesProps) => {
  const { t } = useTranslation();

  if (props.poll.candidates!.length === 0) {
    props.poll.candidates!.push({ name: "Date", description: "" });
  }

  if (!props.poll.dateFilterQuery) {
    props.poll.dateFilterQuery = createFilterQueryGroup();
  }

  const dateQuery = props.poll.dateFilterQuery as FilterQueryGroup;

  function updateGranularity(value: string) {
    props.poll.stepValue = Number(value);
  }

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

  function addCondition(result: FilterQuery) {
    dateQuery.children!.push(result);
  }

  if (props.poll.stepValue == null)
    props.poll.stepValue = CalendarScope.Day;

  if (props.poll.ignoreTimeZone == null)
    props.poll.ignoreTimeZone = true;

  const stepValue = props.poll.stepValue;
  const effectiveMin = Math.max(1, props.poll.minVotesPerCandidate!);

  return (
    <div className="flex flex-col">
      <HiveMimeBulletItem>
        <Trans
          i18nKey="posts:create.rules.precision"
          components={{
            select: (
              <Select value={stepValue.toString()} onValueChange={updateGranularity}>
                <HiveMimeInlineSelectTrigger>
                  <SelectValue />
                </HiveMimeInlineSelectTrigger>
                <SelectContent>
                  {DATE_SCOPES.map(scope => (
                    <SelectItem key={scope} value={scope.toString()}>
                      {t(`enums:datePrecision.${CalendarScope[scope]}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ),
          }}
        />
      </HiveMimeBulletItem>

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

      <HiveMimeBulletItem>
        <Trans
          i18nKey="posts:create.rules.ignoreTimeZone"
          components={{
            select: (
              <Select
                value={props.poll.ignoreTimeZone! ? "true" : "false"}
                onValueChange={(value) => props.poll.ignoreTimeZone = value === "true"}
              >
                <HiveMimeInlineSelectTrigger>
                  <SelectValue />
                </HiveMimeInlineSelectTrigger>
                <SelectContent>
                  <SelectItem value="true">{t("enums:dateTimeZone.ignored")}</SelectItem>
                  <SelectItem value="false">{t("enums:dateTimeZone.respected")}</SelectItem>
                </SelectContent>
              </Select>
            ),
          }}
        />
      </HiveMimeBulletItem>

      <div className="flex flex-col gap-2 mt-8">
        <span className="text-sm text-muted-foreground">
          {t("posts:filter.dateFilterDescription")}
        </span>

        <HiveMimePostResultFilter
          post={props.post}
          builder={dateQuery}
          onAddCondition={addCondition}
          lockedPoll={props.poll}
          lockedCandidate={props.poll.candidates![0]}
        />
      </div>
    </div>
  );
});
