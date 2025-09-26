"use client";

import { PollOptionDto } from "@/lib/Api";
import { observer } from "mobx-react-lite";
import { HiveMimeHoverCard } from "../hm-hover-card";
import { HiveMimeEmbeddedInput } from "../hm-embedded-input";

interface PostProps {
  label: string;
  option: PollOptionDto;
}

export const HiveMimeCreateCandidate = observer(({ label, option }: PostProps) => {
  return (
    <HiveMimeHoverCard className="flex flex-row">
      <span className="w-8 text-gray-500">{label}</span>
      <HiveMimeEmbeddedInput value={option.name!} onChange={(e) => option.name = e.target.value} />
    </HiveMimeHoverCard>
  );
});
