"use client";

import { HiveMimeHoverCard } from "../../hm-hover-card";
import { observer } from "mobx-react-lite";
import { ListPollDto, PollCandidateDto, UpsertVoteToCandidateDto } from "@/lib/Api";
import { Slider } from "../../../slider";

interface HiveMimePickScoringCandidateProps {
  poll: ListPollDto;
  vote: UpsertVoteToCandidateDto;
  candidate: PollCandidateDto;
}

export const HiveMimePickScoringCandidate = observer(({ poll, vote, candidate }: HiveMimePickScoringCandidateProps) => {
  return (
    <HiveMimeHoverCard className={`flex flex-col gap-4 !pb-4 hover:text-honey-brown`}>
      <div className="flex flex-row">
        <span className="flex-1">{candidate.name}</span>
        <span className="text-sm text-honey-brown">{vote.value}</span>
      </div>
      <Slider
        value={[vote.value!]}
        onValueChange={(value) => vote.value = value[0]}
        min={poll.minValue}
        max={poll.maxValue}
        step={poll.stepValue!}
      />
    </HiveMimeHoverCard>
  );
});
