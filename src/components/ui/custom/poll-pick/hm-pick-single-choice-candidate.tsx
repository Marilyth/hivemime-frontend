"use client";

import { HiveMimeHoverCard } from "../hm-hover-card";

interface HiveMimePickSingleChoiceCandidatePropsProps {
  onClick?: () => void;
  value: string;
  name: string;
}

export default function HiveMimePickSingleChoiceCandidate({ value, name, onClick }: HiveMimePickSingleChoiceCandidatePropsProps) {
  return (
    <HiveMimeHoverCard className="flex flex-row hover:text-honey-brown cursor-pointer" onClick={onClick}>
      <span className="w-8 font-light text-gray-500">{value}</span>
      <span>{name}</span>
    </HiveMimeHoverCard>
  );
}
