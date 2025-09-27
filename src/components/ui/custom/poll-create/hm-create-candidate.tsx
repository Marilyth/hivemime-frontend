"use client";

import { PollCandidateDto } from "@/lib/Api";
import { observer } from "mobx-react-lite";
import { HiveMimeHoverCard } from "../hm-hover-card";
import { HiveMimeEmbeddedInput } from "../hm-embedded-input";
import { HiveMimeIndexHandle } from "../hm-index-handle";

interface PostProps {
  index: number;
  option: PollCandidateDto;
}

export const HiveMimeCreateCandidate = observer(({ index, option }: PostProps) => {
  return (
    <HiveMimeHoverCard className="flex flex-row gap-2">
      <HiveMimeIndexHandle index={index} />
      <HiveMimeEmbeddedInput value={option.name!} onChange={(e) => option.name = e.target.value} />
    </HiveMimeHoverCard>
  );
});
