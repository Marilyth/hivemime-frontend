"use client";

import { PollOptionDto } from "@/lib/Api";
import { observer } from "mobx-react-lite";
import { Input } from "./input";

interface PostProps {
  label: string;
  option: PollOptionDto;
}

export const HiveMimeCreateCandidate = observer(({ label, option }: PostProps) => {
  return (
    <div className="flex flex-row hover:border-honey-brown transition-colors border rounded-md px-2 py-1 items-center">
      <span className="w-8 text-gray-500">{label}</span>
      <Input className="!bg-transparent !ring-offset-transparent border-0 shadow-none focus-visible:ring-0 p-0" value={option.name!}
        onChange={(e) => option.name = e.target.value} />
    </div>
  );
});
