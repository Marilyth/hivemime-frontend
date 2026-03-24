"use client";

import { CircleCheck, CircleSlash, CircleX, SquareCheck, SquareSlash, SquareX, Check, Slash, X } from "lucide-react";


interface HiveMimeStateIconProps {
  state: "nothing" | "indeterminate" | "finished" | "error";
  shape?: "circle" | "square" | "none";
}

export const HiveMimeStateIcon = ({ state, shape = "circle" }: HiveMimeStateIconProps) => {
    function getShapeArray() {
        if (shape === "circle") {
            return [CircleCheck, CircleSlash, CircleX];
        } else if (shape === "square") {
            return [SquareCheck, SquareSlash, SquareX];
        } else {
            return [Check, Slash, X];
        }
    }

    const [CheckIcon, SlashIcon, XIcon] = getShapeArray();

    switch (state) {
        case "nothing":
            return null;
        case "indeterminate":
            return <SlashIcon className="text-gray-500" />;
        case "finished":
            return <CheckIcon className="text-green-700" />;
        case "error":
            return <XIcon className="text-orange-700" />;
        default:
            return null;
    }
};
