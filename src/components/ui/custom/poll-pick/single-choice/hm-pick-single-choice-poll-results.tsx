"use client";

import { observer } from "mobx-react-lite";
import { PollResultsDto } from "@/lib/Api";
import { HiveMimeChart } from "../../hm-chart";
import { ChartType } from "@/lib/view-models";

export interface HiveMimePickSingleChoicePollResultsProps {
  result: PollResultsDto;
}

export const HiveMimePickSingleChoicePollResults = observer(({ result }: HiveMimePickSingleChoicePollResultsProps) => {
  return (
    <HiveMimeChart data={{
      chartType: ChartType.Bar,
      dataPoints: result.candidates!.map(candidateResult => ({
        label: candidateResult.name!,
        value: candidateResult.score!
      }))
    }} />
  );
});
