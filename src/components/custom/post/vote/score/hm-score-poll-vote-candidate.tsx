"use client";

import { HiveMimeHoverCard } from "../../../utility/hm-hover-card";
import { observer } from "mobx-react-lite";
import { PollDto, CandidateDto } from "@/lib/Api";
import { Slider } from "../../../../ui/slider";
import { HiveMimeViewCandidate } from "../../hm-candidate";
import { UiCandidateVote } from "@/lib/vote-models";

interface HiveMimeScorePollVoteCandidateProps {
  poll: PollDto;
  vote: UiCandidateVote;
  candidate: CandidateDto;
}

export const HiveMimeScorePollVoteCandidate = observer(({ poll, vote, candidate }: HiveMimeScorePollVoteCandidateProps) => {
  return (
    <HiveMimeHoverCard className={`flex flex-col gap-4 !pb-4 hover:text-honey-brown`}>
      <div className="flex flex-row">
        <HiveMimeViewCandidate candidate={candidate} className="flex-1" />
        <span className="text-sm text-honey-brown">{vote.score ?? ""}</span>
      </div>
      <Slider
        value={[vote.score ?? poll.minValue!]}
        onValueChange={(value) => vote.score = value[0]}
        min={poll.minValue}
        max={poll.maxValue}
        step={poll.stepValue!}
      />
    </HiveMimeHoverCard>
  );
});
