"use client";

import { HiveMimeEmbeddedInput } from "./hm-embedded-input";
import { useState } from "react";

interface HiveMimeIndexHandleProps {
  index?: number;
  onIndexChange?: (newIndex: number) => void;
}

export function HiveMimeIndexHandle({ index, onIndexChange }: HiveMimeIndexHandleProps) {
    const [currentIndex, setCurrentIndex] = useState(index);

    const handleIndexChange = (newIndex: number) => {
        newIndex = Math.max(1, newIndex);

        setCurrentIndex(newIndex);
        onIndexChange?.(newIndex);
    };

    return (
    <div className="flex flex-row items-center justify-center">
        <HiveMimeEmbeddedInput className="p-0 w-6 h-auto text-gray-500" value={currentIndex} onChange={(e) => handleIndexChange(Number(e.target.value))} />
    </div>
    );
}
