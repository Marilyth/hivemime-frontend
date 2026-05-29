"use client";

import { observer } from "mobx-react-lite";
import { CreatePollDto, PollType } from "@/lib/Api";
import { HiveMimeHoverCard } from "../../utility/hm-hover-card";
import { HiveMimePollTypeIcon } from "../../utility/hm-poll-type-icon";
import { useTranslation } from "react-i18next";

export interface HiveMimeCreatePollTypePickerProps
{
  poll: CreatePollDto;
}

interface HiveMimeCreatePollTypePickerOption {
  value: PollType;
}

export const HiveMimeCreatePollTypePicker = observer(({ poll }: HiveMimeCreatePollTypePickerProps) => {
  const { t } = useTranslation();

  const options: HiveMimeCreatePollTypePickerOption[] = [
    { value: PollType.Choice },
    { value: PollType.Score },
    { value: PollType.Rank },
    { value: PollType.Category },
  ];

  return (
    <div className="flex flex-col gap-2">
        {options.map((option, index) => {
          const pollTypeKey = option.value.toLowerCase();

          return (
          <HiveMimeHoverCard key={index} className={`flex flex-row cursor-pointer items-center hover:text-honey-brown ${
              poll.pollType === option.value ? 'text-honey-brown border-honey-brown' : ''
            }`} onClick={() => poll.pollType = option.value}>
            <HiveMimePollTypeIcon answerType={option.value} className={`mr-2 w-8 ${poll.pollType === option.value ? 'text-honey-brown' : 'text-informational'}`} />
            <div className="flex-1 flex flex-col">
              <span>{t(`enums:pollType.${pollTypeKey}`)}</span>
              <span className="text-sm text-muted-foreground">{t(`enums:pollTypeDescription.${pollTypeKey}`)}</span>
            </div>
          </HiveMimeHoverCard>
          );
        })}
    </div>
  );
});
