"use client";

import { observer } from "mobx-react-lite";
import { PollResultsDto } from "@/lib/Api";
import { HiveMimeChart } from "../../hm-chart";
import { ChartType } from "@/lib/view-models";
import { makeAutoObservable } from "mobx";

export interface HiveMimePickSingleChoicePollResultsProps {
  result: PollResultsDto;
}

export const HiveMimePickSingleChoicePollResults = observer(({ result }: HiveMimePickSingleChoicePollResultsProps) => {
  const chartData = makeAutoObservable({
    chartType: ChartType.Doughnut,
    dataPoints: result.candidates!.map(candidateResult => ({
      label: candidateResult.name!,
      value: candidateResult.score!
    }))
  });

  return (
    <HiveMimeChart data={chartData} />
  );
});
