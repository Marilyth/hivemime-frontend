"use client";

import { observer } from "mobx-react-lite";

type HiveMimeHoverCardProps = React.ComponentProps<"div">;

export const HiveMimeHoverCard = observer(({ className, ...props }: HiveMimeHoverCardProps) => {
  return (
    <div className={`hover:border-honey-brown transition-colors duration-200 border rounded-md px-2 py-1 ${className}`} {...props}>
      {props.children}
    </div>
  );
});
