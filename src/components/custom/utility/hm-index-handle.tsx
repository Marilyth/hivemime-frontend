"use client";

import { HiveMimeEmbeddedInput } from "./hm-embedded-input";

interface HiveMimeIndexHandleProps {
  index?: number;
  onIndexChange?: (newIndex: number) => void;
}

export function HiveMimeIndexHandle({ index, onIndexChange }: HiveMimeIndexHandleProps) {
    const handleIndexChange = (newIndex: number) => {
        newIndex = Math.max(0, newIndex);
        onIndexChange?.(newIndex);
    };

    return (
    <div className="flex flex-row items-center justify-center">
        <HiveMimeEmbeddedInput className="p-0 w-6 h-auto text-gray-500" value={index} onChange={(e) => handleIndexChange(Number(e.target.value))} />
    </div>
    );
}
