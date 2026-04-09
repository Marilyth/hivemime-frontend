"use client";

import { HiveMimeHoverCard } from "../../../utility/hm-hover-card";
import { observer } from "mobx-react-lite";
import { PollDto, CandidateDto, VoteOnCandidateDto } from "@/lib/Api";
import { Slider } from "../../../../ui/slider";

interface HiveMimeScorePollVoteCandidateProps {
  poll: PollDto;
  vote: VoteOnCandidateDto;
  candidate: CandidateDto;
}

export const HiveMimeScorePollVoteCandidate = observer(({ poll, vote, candidate }: HiveMimeScorePollVoteCandidateProps) => {
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
