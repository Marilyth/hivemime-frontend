import { cn } from "@/lib/utils"


type HiveMimeBulletItemProps = React.ComponentProps<"div">;

export function HiveMimeBulletItem({
  className,
  children,
  ...props
}: HiveMimeBulletItemProps) {
  return (
    <div className={cn("flex flex-row gap-2", className)}
      {...props}
    >
      <span>•</span>
      <div>
        {children}
      </div>
    </div>
  )
}