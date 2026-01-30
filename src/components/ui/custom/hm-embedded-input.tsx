"use client";

import { observer } from "mobx-react-lite";
import { Input } from "../input";
import React from "react";

export const HiveMimeEmbeddedInput = observer(({ className, ...props }: React.ComponentProps<"input">) => {
  return (
    <Input className={`!bg-transparent !ring-offset-transparent border-0 shadow-none focus-visible:ring-0 p-0 ${className}`} {...props} />
  );
});

export const HiveMimeInlineInput = observer(
  ({ className, ...props }: React.ComponentProps<"input">) => {
    const ref = React.useRef<HTMLInputElement>(null);

    const resize = () => {
      if (!ref.current) return;

      // Padding messes with this calculation. Include it in the width instead.
      ref.current.style.width = "0px";
      ref.current.style.width = `${ref.current.scrollWidth + 8}px`;
    };

    React.useEffect(resize, [props.value]);

    return (
      <Input
        ref={ref}
        onInput={resize}
        className={`text-honey-brown !bg-transparent !ring-offset-transparent border-0 shadow-none focus-visible:ring-0 mx-1.5 text-center p-0 rounded-none border-b-1 border-honey-brown w-0 h-auto ${className}`}
        {...props}
      />
    );
  }
);