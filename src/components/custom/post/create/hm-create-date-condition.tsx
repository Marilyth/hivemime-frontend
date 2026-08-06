"use client";

import { observer } from "mobx-react-lite";
import { HiveMimeCreatePollProps } from "./hm-create-choice-poll";
import { useMemo, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { Select, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { HiveMimeInlineSelectTrigger } from "../../utility/hm-inline-select";
import { HiveMimeBulletItem } from "../../utility/hm-bullet-item";
import { CalendarScope, DateSelection, Variant } from "../../utility/date-selection";
import { DatePicker } from "../../utility/date-picker";
import { FilterQuery, FilterQueryGroup, PollDto, PostDto } from "@/lib/Api";
import { createFilterQuery, createFilterQueryGroup } from "@/lib/vote-query";
import { HiveMimePostResultFilter } from "../result/filter/hm-post-result-filter";
import { HiveMimeFilterConditionCreator } from "../result/filter/hm-condition-creator";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const DATE_SCOPES = Array.from({ length: CalendarScope.Year + 1 }, (_, i) => i) as CalendarScope[];

export const HiveMimeCreateDateCondition = observer((props: HiveMimeCreatePollProps) => {
  const { t } = useTranslation();
  const [creatorOpen, setCreatorOpen] = useState(false);
  const [draftQuery, setDraftQuery] = useState<FilterQuery | null>(null);

  if (props.poll.candidates!.length === 0) {
    props.poll.candidates!.push({ name: "Date", description: "" });
  }

  if (!props.poll.dateFilterQuery) {
    props.poll.dateFilterQuery = createFilterQueryGroup();
  }

  const dateQuery = props.poll.dateFilterQuery as FilterQueryGroup;

  const post: PostDto = useMemo(() => ({
    polls: [{ ...props.poll, candidates: props.poll.candidates } as PollDto],
  }), [props.poll]);

  function updateGranularity(value: string) {
    props.poll.stepValue = Number(value);
  }

  function addCondition() {
    const query = createFilterQuery();
    query.property = "0:0";
    setDraftQuery(query);
    setCreatorOpen(true);
  }

  function creatorFinished(result: FilterQuery | null) {
    setCreatorOpen(false);

    if (result && draftQuery)
      dateQuery.children!.push(result);

    setDraftQuery(null);
  }

  const stepValue = props.poll.stepValue ?? CalendarScope.Day;
  const dateSelection = new DateSelection(stepValue as CalendarScope, props.poll.maxVotesPerCandidate!, [], Variant.Result);

  return (
    <div className="flex flex-col gap-2">
      <HiveMimeBulletItem className="mb-4">
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

      <HiveMimePostResultFilter post={post} builder={dateQuery} onAddCondition={addCondition} />

      <Dialog open={creatorOpen} onOpenChange={(open) => !open && setCreatorOpen(false)}>
        <DialogContent onClick={(e) => e.stopPropagation()}>
          <span className="text-lg font-semibold">
            {t("posts:filter.createCondition")}
          </span>

          <HiveMimeFilterConditionCreator post={post} currentItem={draftQuery} poll={post.polls![0]} candidate={post.polls![0].candidates![0]} onFinished={creatorFinished} />
        </DialogContent>
      </Dialog>

      <div className="flex flex-col items-center">
        <DatePicker dateSelection={dateSelection} />
      </div>
    </div>
  );
});
