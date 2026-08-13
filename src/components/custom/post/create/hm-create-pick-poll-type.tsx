"use client";

import { observer } from "mobx-react-lite";
import { CreatePollDto, PollType } from "@/lib/Api";
import { HiveMimeHoverCard } from "../../utility/hm-hover-card";
import { HiveMimePollTypeIcon } from "../../utility/hm-poll-type-icon";
import { useTranslation } from "react-i18next";
import { confirmStore } from "@/lib/contexts";

export interface HiveMimeCreatePollTypePickerProps
{
  poll: CreatePollDto;
}

interface HiveMimeCreatePollTypePickerOption {
  value: PollType;
}

export const HiveMimeCreatePollTypePicker = observer(({ poll }: HiveMimeCreatePollTypePickerProps) => {
  const { t } = useTranslation();

  async function selectPollType(pollType: PollType) {
    if (poll.pollType === pollType)
      return;

    if ((poll.candidates?.length ?? 0) > 0 && !await confirmStore.request({
      title: t("posts:create.changePollTypeTitle"),
      description: t("posts:create.changePollTypeDescription"),
    }))
      return;

    Object.assign(poll, {
      title: "",
      description: "",
      candidates: [],
      categories: [],
      minValue: 0,
      maxValue: 100,
      minVotes: 1,
      maxVotes: 1,
      minVotesPerCandidate: 1,
      maxVotesPerCandidate: 1,
      allowedCustomCandidateCount: 0,
      isShuffled: false,
      rows: null,
      columns: null,
      stepValue: null,
      dateFilterQuery: null,
      ignoreTimeZone: null,
      conditionQuery: null,
      media: undefined,
      pollType,
    });
  }

  const options: HiveMimeCreatePollTypePickerOption[] = [
    { value: PollType.Choice },
    { value: PollType.Score },
    { value: PollType.Date },
    { value: PollType.Rank },
    { value: PollType.Category },
    { value: PollType.Draw },
  ];

  return (
    <div className="flex flex-col gap-2">
        {options.map((option, index) => {
          const pollTypeKey = option.value.toLowerCase();

          return (
          <HiveMimeHoverCard key={index} className={`flex flex-row cursor-pointer items-center hover:text-honey-brown ${
              poll.pollType === option.value ? 'text-honey-brown border-honey-brown' : ''
            }`} onClick={() => selectPollType(option.value)}>
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
