"use client";

import { HiveMimeHoverCard } from "../hm-hover-card";
import { observer } from "mobx-react-lite";
import { CombinedPollCandidate } from "@/lib/view-models";

type HiveMimePickCandidateProps = React.ComponentProps<"div"> & {
  candidate: CombinedPollCandidate;
  labelComponent?: React.ReactNode;
}

export const HiveMimePickCandidate = observer(({ candidate, className, labelComponent, ...props }: HiveMimePickCandidateProps) => {
  return (
    <HiveMimeHoverCard className={`flex flex-row items-center cursor-pointer hover:text-honey-brown ${className}`} {...props}>
      {labelComponent}
      <span>{candidate.candidate.name}</span>
    </HiveMimeHoverCard>
  );
});
