"use client";

import { PollDto, PollType, VoteOnPollDto } from "@/lib/Api";
import { ReactNode, useEffect, useState } from "react";
import { HiveMimePollTypeIcon } from "../../utility/hm-poll-type-icon";
import { observer } from "mobx-react-lite";
import { HiveMimeChoicePollVote } from "./choice/hm-choice-poll-vote";
import { HiveMimeScorePollVote } from "./score/hm-score-poll-vote";
import { HiveMimeRankPollVote } from "./rank/hm-rank-poll-vote";
import { HiveMimeCategoryPollVote } from "./category/hm-category-poll-vote";
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { getReferenceId } from "@/lib/utils";
import { validatePickPoll } from "@/lib/validate-vote";
import { HiveMimeStateIcon } from "../../utility/hm-state-icon";
import { reaction, toJS } from "mobx";
import { HiveMimeBulletItem } from "../../utility/hm-bullet-item";

export type HiveMimeListPollProps =   {
  poll: PollDto;
  pollVote: VoteOnPollDto;
}

export const HiveMimeListPoll = observer(({ poll, pollVote }: HiveMimeListPollProps) => {
  const [state, setState] = useState<"nothing" | "indeterminate" | "finished" | "error">("nothing");
  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  const pollMapping: { [key in PollType]: ReactNode } =
  {
    [PollType.Choice]: <HiveMimeChoicePollVote poll={poll} pollVotes={pollVote} />,
    [PollType.Score]: <HiveMimeScorePollVote poll={poll} pollVotes={pollVote} />,
    [PollType.Rank]: <HiveMimeRankPollVote poll={poll} pollVotes={pollVote} />,
    [PollType.Category]: <HiveMimeCategoryPollVote poll={poll} pollVotes={pollVote} />,
  };

  function validatePostVote()
  {
    const errors = validatePickPoll(poll, pollVote);
    setErrorMessages(errors);
    setState(errors.length > 0 ? "error" : "finished");
  }

  useEffect(() => {
    const dispose = reaction(
      () => toJS(pollVote),
      validatePostVote
    );

    return () => dispose();
  }, []);

  return (
    <AccordionItem value={getReferenceId(poll)} className="border-b last:border-b-0">
      <AccordionTrigger className="bg-popover rounded-none p-2">
        <div className="flex flex-row gap-4 font-bold items-center">
          <HiveMimePollTypeIcon answerType={poll.pollType!} className="text-honey-brown w-6 h-6 self-start" />
          <span className="text-muted-foreground font-bold">
            {poll.title}
          </span>
          <HiveMimeStateIcon state={state} shape="none" />
        </div>
      </AccordionTrigger>
      <AccordionContent className="p-4 flex flex-col gap-2" >
          <span className="text-muted-foreground">{poll.description}test</span>
          {pollMapping[poll.pollType!]}

        <div>
          {errorMessages.length > 0 && (
            <HiveMimeBulletItem className="pl-1 text-red-400">
              {errorMessages.map((error, index) => (
                <div key={index}>
                  {error}
                </div>
              ))}
          </HiveMimeBulletItem>)}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
});
