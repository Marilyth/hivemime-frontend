import { cn } from "@/lib/utils"
import { Tag } from "lucide-react";

type HiveMimeTagItemProps = React.ComponentProps<"div"> & {
}

export function HiveMimeTagItem({
  className,
  children,
  ...props
}: HiveMimeTagItemProps) {
  return (
    <div className={`flex flex-row px-2 py-1 rounded-md gap-2 text-sm items-center ${cn("", className)}`} {...props}>
      <Tag className={`w-4 h-4`} />
      {children}
    </div>
  )
}