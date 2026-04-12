"use client";

import { PollDto, PollResultDto, PollType } from "@/lib/Api";
import { HiveMimePollTypeIcon } from "../../utility/hm-poll-type-icon";
import { observer } from "mobx-react-lite";
import { ChartType } from "@/lib/view-models";
import { ReactNode } from "react";
import { AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { getReferenceId } from "@/lib/utils";
import { HiveMimeChoiceResult } from "./choice/hm-choice-result";
import { HiveMimeScoreResult } from "./score/hm-score-result";
import { HiveMimeRankResult } from "./rank/hm-rank-result";
import { HiveMimeCategoryResult } from "./category/hm-category-result";

export type HiveMimePollResultProps =   {
  poll: PollDto;
  pollResult?: PollResultDto;
  chartType?: ChartType;
}

export const HiveMimePollResult = observer(({ poll, pollResult, chartType }: HiveMimePollResultProps) => {
  const pollMapping: { [key in PollType]: ReactNode } =
  {
    [PollType.Choice]: <HiveMimeChoiceResult pollResult={pollResult!} />,
    [PollType.Score]: <HiveMimeScoreResult pollResult={pollResult!} poll={poll} />,
    [PollType.Rank]: <HiveMimeRankResult pollResult={pollResult!} poll={poll} />,
    [PollType.Category]: <HiveMimeCategoryResult pollResult={pollResult!} poll={poll} />,
  };

  return (
    <AccordionItem value={getReferenceId(poll)} className="border-b last:border-b-0">
      <AccordionTrigger className="bg-popover rounded-none p-2">
        <div className="flex flex-row gap-4 font-bold items-center">
          <HiveMimePollTypeIcon answerType={poll.pollType!} className="text-honey-brown w-6 h-6 self-start" />
          <span className="text-muted-foreground font-bold">
            {poll.title}
          </span>
        </div>
      </AccordionTrigger>
      <AccordionContent className="p-4 flex flex-col gap-2" >
          {poll.description && <span className="text-muted-foreground">{poll.description}</span>}
          {pollMapping[poll.pollType!]} 
      </AccordionContent>
    </AccordionItem>
  );
});
