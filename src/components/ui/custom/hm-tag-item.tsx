import { cn } from "@/lib/utils"
import { Tag } from "lucide-react";

type HiveMimeBulletItemProps = React.ComponentProps<"div"> & {
}

export function HiveMimeTagItem({
  className,
  children,
  ...props
}: HiveMimeBulletItemProps) {
  return (
    <div className={`flex flex-row px-2 py-1 rounded-md border-1 gap-2 text-sm items-center ${cn("", className)}`} {...props}>
      <Tag className={`w-4 h-4`} />
      {children}
    </div>
  )
}