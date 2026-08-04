"use client";

import { observer } from "mobx-react-lite";
import { CreatePollDto, DatePollMode } from "@/lib/Api";
import { HiveMimeCreatePollProps } from "./hm-create-choice-poll";
import { HiveMimeBulletItem } from "../../utility/hm-bullet-item";
import { HiveMimeHoverCard } from "../../utility/hm-hover-card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { HiveMimeInlineSelectTrigger } from "../../utility/hm-inline-select";
import { HiveMimeCreateMaxvoteRule, HiveMimeCreateMinvoteRule, HiveMimeCreateShuffleRule } from "./hm-create-rules";
import { Trans, useTranslation } from "react-i18next";

const DAY_MS = 60 * 60 * 24 * 1000;

const inlineTriggerClass =
  "text-honey-brown align-middle border-0 border-b rounded-b-none rounded-t-lg border-b-honey-brown " +
  "focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:shadow-none " +
  "inline-flex w-fit items-center gap-2 bg-transparent whitespace-nowrap shadow-none outline-none " +
  "px-1 py-0 h-auto mx-1.5";

export interface HiveMimeCreateDateModePickerProps {
  poll: CreatePollDto;
}

export const HiveMimeCreateDateModePicker = observer(({ poll }: HiveMimeCreateDateModePickerProps) => {
  const { t } = useTranslation();

  const options: { value: DatePollMode; description: string }[] = [
    { value: DatePollMode.Range, description: t("enums:datePollMode.rangeDescription") },
    { value: DatePollMode.Specific, description: t("enums:datePollMode.specificDescription") },
  ];

  return (
    <div className="flex flex-col gap-2">
      {options.map((option, index) => (
        <HiveMimeHoverCard key={index}
          className={`flex flex-row cursor-pointer items-center hover:text-honey-brown ${
            poll.dateMode === option.value ? 'text-honey-brown border-honey-brown' : ''
          }`}
          onClick={() => poll.dateMode = option.value}>
          <div className="flex-1 flex flex-col">
            <span>{t(`enums:datePollMode.${option.value.toLowerCase()}`)}</span>
            <span className="text-sm text-muted-foreground">{option.description}</span>
          </div>
        </HiveMimeHoverCard>
      ))}
    </div>
  );
});

export const HiveMimeCreateDateRangeRules = observer((props: HiveMimeCreatePollProps) => {
  const { t } = useTranslation();
  const poll = props.poll;

  if (!poll.minValue || !poll.maxValue) {
    const now = Date.now();
    poll.minValue = now;
    poll.maxValue = now + 6 * DAY_MS;
  }

  function setStartDate(date: Date | null) {
    if (!date)
      return;

    poll.minValue = date.getTime();

    if (!poll.maxValue || poll.maxValue < poll.minValue) {
      poll.maxValue = poll.minValue + DAY_MS;
    }
  }

  function setEndDate(date: Date | null) {
    if (!date)
      return;

    poll.maxValue = date.getTime();

    if (!poll.minValue || poll.minValue > poll.maxValue) {
      poll.minValue = poll.maxValue - DAY_MS;
    }
  }

  const precisions = [
    { seconds: 60 * 60 * 24, label: t("enums:datePrecision.day") },
    { seconds: 60 * 60, label: t("enums:datePrecision.hour") },
    { seconds: 60, label: t("enums:datePrecision.minute") },
  ];

  function setMinDates(value: string) {
    const newValue = Number(value);
    poll.minVotesPerCandidate = newValue;

    if (poll.maxVotesPerCandidate! < newValue) {
      poll.maxVotesPerCandidate = newValue;
    }
  }

  function setMaxDates(value: string) {
    const newValue = Number(value);
    poll.maxVotesPerCandidate = newValue;

    if (poll.minVotesPerCandidate! > newValue) {
      poll.minVotesPerCandidate = newValue;
    }
  }

  return (
    <div>
      <HiveMimeBulletItem>
        <Trans
          i18nKey="posts:create.rules.startDate"
          components={{
            select: (
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" className={inlineTriggerClass}>
                    {poll.minValue ? new Date(poll.minValue).toLocaleDateString() : t("posts:create.pickDate")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={poll.minValue ? new Date(poll.minValue) : undefined}
                    onSelect={setStartDate}
                    modifiers={{ endDate: poll.maxValue ? new Date(poll.maxValue) : undefined }}
                    modifiersClassNames={{
                      endDate: "border border-honey-brown rounded-md border-dashed",
                    }}
                    showOutsideDays={false}
                    required
                  />
                </PopoverContent>
              </Popover>
            ),
          }}
        />
      </HiveMimeBulletItem>

      <HiveMimeBulletItem>
        <Trans
          i18nKey="posts:create.rules.endDate"
          components={{
            select: (
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" className={inlineTriggerClass}>
                    {poll.maxValue ? new Date(poll.maxValue).toLocaleDateString() : t("posts:create.pickDate")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={poll.maxValue ? new Date(poll.maxValue) : undefined}
                    onSelect={setEndDate}
                    modifiers={{ startDate: poll.minValue ? new Date(poll.minValue) : undefined }}
                    modifiersClassNames={{
                      startDate: "border border-honey-brown rounded-md border-dashed",
                    }}
                    showOutsideDays={false}
                    required
                  />
                </PopoverContent>
              </Popover>
            ),
          }}
        />
      </HiveMimeBulletItem>

      <HiveMimeBulletItem>
        <Trans
          i18nKey="posts:create.rules.precision"
          components={{
            select: (
              <Select
                value={(poll.stepValue ?? 60 * 60 * 24).toString()}
                onValueChange={(value) => poll.stepValue = Number(value)}>
                <HiveMimeInlineSelectTrigger>
                  <SelectValue />
                </HiveMimeInlineSelectTrigger>
                <SelectContent>
                  {precisions.map((precision) => (
                    <SelectItem key={precision.seconds} value={precision.seconds.toString()}>
                      {precision.label}
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
              <Select
                value={(poll.minVotesPerCandidate ?? 1).toString()}
                onValueChange={setMinDates}>
                <HiveMimeInlineSelectTrigger>
                  <SelectValue />
                </HiveMimeInlineSelectTrigger>
                <SelectContent>
                  {[...Array(poll.maxVotesPerCandidate ?? 1).keys()].map(i => (
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
              <Select
                value={(poll.maxVotesPerCandidate ?? 1).toString()}
                onValueChange={setMaxDates}>
                <HiveMimeInlineSelectTrigger>
                  <SelectValue />
                </HiveMimeInlineSelectTrigger>
                <SelectContent>
                  {[...Array(20 - (poll.minVotesPerCandidate ?? 1) + 1).keys()].map(i => (
                    <SelectItem key={i} value={((poll.minVotesPerCandidate ?? 1) + i).toString()}>
                      {((poll.minVotesPerCandidate ?? 1) + i).toString()}
                    </SelectItem>
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

export const HiveMimeCreateDateSpecificRules = observer((props: HiveMimeCreatePollProps) => {
  return (
    <div>
      <HiveMimeCreateMinvoteRule poll={props.poll} />
      <HiveMimeCreateMaxvoteRule poll={props.poll} />
      <HiveMimeCreateShuffleRule poll={props.poll} />
    </div>
  );
});
