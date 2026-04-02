import { cn } from "@/lib/utils"


type HiveMimeBulletItemProps = React.ComponentProps<"div">;

export function HiveMimeBulletItem({
  className,
  children,
  ...props
}: HiveMimeBulletItemProps) {
  return (
    <div className={cn("flex flex-row gap-2 w-full", className)}
      {...props}
    >
      <div>•</div>
      <div className="flex-1 min-w-0">
        {children}
      </div>
    </div>
  )
}