"use client";

import { CreatePollDto, PollType } from "@/lib/Api";
import { InputWithLabel, TextAreaWithLabel } from "../../utility/labelled-input";
import { observer } from "mobx-react-lite";
import { HiveMimeCreatePollTypePicker } from "./hm-create-pick-poll-type";
import React from "react";
import { HiveMimeCreateMultipleChoiceRules } from "./hm-create-choice-poll";
import { HiveMimeCreateRankingRules } from "./hm-create-ranking-poll";
import { HiveMimeCreateScoringRules } from "./hm-create-scoring-poll";
import { HiveMimeCreateCategorizationRules } from "./hm-create-categorization-poll";
import { HiveMimeMultiStep, HiveMimeStep } from "../../utility/hm-multistep-ui";
import { validateCreatePoll } from "@/lib/validate-create";
import { HiveMimeCreateCandidates } from "./hm-create-candidate";
import { Label } from "@radix-ui/react-label";
import { HiveMimeCreateCategories } from "./hm-create-category";
import { useTranslation } from "react-i18next";
import { HiveMimeBulletItem } from "../../utility/hm-bullet-item";

export interface HiveMimeCreatePollProps {
  poll: CreatePollDto;
  canCancel: boolean;
  onCancelled?: () => void;
  onFinished?: () => void;
}

export const HiveMimeCreatePoll = observer((props: HiveMimeCreatePollProps) => {
  const { t } = useTranslation();
  const pollMapping: { [key in PollType]: React.ReactElement } = {
    [PollType.Choice]: <HiveMimeCreateMultipleChoiceRules poll={props.poll} />,
    [PollType.Score]: <HiveMimeCreateScoringRules poll={props.poll} />,
    [PollType.Rank]: <HiveMimeCreateRankingRules poll={props.poll} />,
    [PollType.Category]: <HiveMimeCreateCategorizationRules poll={props.poll} />,
  };

  const errors = validateCreatePoll(props.poll);

  return (
    <div className="flex flex-col gap-8">
      <HiveMimeMultiStep onFinished={props.onFinished} onCancelled={props.onCancelled} canCancel={props.canCancel}>
        <HiveMimeStep canContinue={props.poll.pollType !== undefined}>
          <div className="flex flex-col gap-4">
            <Label className="text-sm text-muted-foreground">{t("posts:create.choosePollType")}</Label>
            <HiveMimeCreatePollTypePicker poll={props.poll} />
          </div>
        </HiveMimeStep>

        <HiveMimeStep canContinue={props.poll.title !== undefined && props.poll.title!.trim().length >= 3}>
          <div className="flex flex-col gap-4">
            <InputWithLabel isRequired label={t("posts:create.pollTitle")} placeholder={t("posts:create.pollTitlePlaceholder")} value={props.poll.title!}
              onChange={(e) => props.poll.title = e.target.value} />

            <TextAreaWithLabel label={t("posts:create.description")} placeholder={t("posts:create.descriptionPlaceholder")} value={props.poll.description!}
              onChange={(e) => props.poll.description = e.target.value} />
          </div>
        </HiveMimeStep>

        {props.poll.pollType === PollType.Category &&
          <HiveMimeStep canContinue={props.poll.categories!.length > 0}>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col">
                <Label className="text-sm text-muted-foreground">{t("posts:create.createCategories")}</Label>
              </div>
              <HiveMimeCreateCategories poll={props.poll} />
            </div>
          </HiveMimeStep>
        }

        <HiveMimeStep canContinue={props.poll.candidates!.length == 0 || props.poll.candidates!.every(c => c.name!.trim().length > 0)}>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col">
              <Label className="text-sm text-muted-foreground">{t("posts:create.createCandidates")}</Label>
            </div>
            <HiveMimeCreateCandidates poll={props.poll} />
          </div>
        </HiveMimeStep>

        <HiveMimeStep canContinue={errors.length === 0}>
          <div className="flex flex-col gap-4">
            <Label className="text-sm text-muted-foreground mb-2">{t("posts:create.configureRules")}</Label>
            {pollMapping[props.poll.pollType!]}

            {errors.length > 0 && <div className="flex flex-col">
              {errors.map((error, index) => (
                <HiveMimeBulletItem key={index} className="text-red-400">
                  {error}
                </HiveMimeBulletItem>
              ))}
            </div>}
          </div>
        </HiveMimeStep>
      </HiveMimeMultiStep>
    </div>

  );
});
