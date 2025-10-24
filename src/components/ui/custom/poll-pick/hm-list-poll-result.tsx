"use client";

import { ListPollDto, PollResultsDto, PollType } from "@/lib/Api";
import { ReactNode } from "react";
import { HiveMimePollTypeIcon } from "../hm-poll-type-icon";
import { observer } from "mobx-react-lite";
import { HiveMimePickSingleChoicePollResults } from "./single-choice/hm-pick-single-choice-poll-results";
import { Item, ItemContent, ItemDescription, ItemTitle } from "../../item";
import { makeAutoObservable } from "mobx";
import { ChartType } from "@/lib/view-models";
import { HiveMimeChart } from "../hm-chart";

export type HiveMimeListPollResultProps =   {
  poll: ListPollDto;
  pollResult: PollResultsDto;
  chartType?: ChartType;
}

export const HiveMimeListPollResult = observer(({ poll, pollResult, chartType }: HiveMimeListPollResultProps) => {
  const chartData = makeAutoObservable({
    chartType: chartType || ChartType.Doughnut,
    dataPoints: pollResult.candidates!.map(candidateResult => ({
      label: candidateResult.name!,
      value: candidateResult.score!
    }))
  });

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row items-center gap-2">
        <div className="flex flex-1 flex-col gap-2">
            <span className="text-honey-brown">{poll.title}</span>
            <span className="text-muted-foreground">{poll.description}</span>
        </div>
        <HiveMimePollTypeIcon answerType={poll.pollType!} className="text-gray-500 w-6 h-6 self-start" />
      </div>
      <div className="flex flex-wrap gap-2 mb-4">
        <Item variant="outline" size="sm">
          <ItemContent>
            <ItemTitle>Voters</ItemTitle>
            <ItemDescription>
              100 votes were submitted</ItemDescription>
          </ItemContent>
        </Item>
        <Item variant="outline" size="sm">
          <ItemContent>
            <ItemTitle>Country</ItemTitle>
            <ItemDescription>Most voters came from Germany</ItemDescription>
          </ItemContent>
        </Item>
      </div>

      <HiveMimeChart data={chartData} />
    </div>
  );
});
