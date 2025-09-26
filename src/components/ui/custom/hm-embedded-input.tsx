"use client";

import { observer } from "mobx-react-lite";
import { Input } from "../input";

export const HiveMimeEmbeddedInput = observer(({ className, ...props }: React.ComponentProps<"input">) => {
  return (
    <Input className={`!bg-transparent !ring-offset-transparent border-0 shadow-none focus-visible:ring-0 p-0 ${className}`} {...props} />
  );
});
