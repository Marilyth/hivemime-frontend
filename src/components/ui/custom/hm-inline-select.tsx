import * as SelectPrimitive from "@radix-ui/react-select"
import { cn } from "@/lib/utils"


export function HiveMimeInlineSelectTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger>) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      className={cn(
        "text-honey-brown align-middle border-0 border-b rounded-none border-b-honey-brown focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:shadow-none aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive flex w-fit items-center justify-between gap-2 bg-transparent whitespace-nowrap shadow-none outline-none focus-visible:ring-0 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 inline-block px-1 py-0 h-auto mx-1.5",
        className
      )}
      {...props}
    >
      {children}
    </SelectPrimitive.Trigger>
  )
}