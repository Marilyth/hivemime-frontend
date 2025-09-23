"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "@/lib/utils"
import { ScrollArea, ScrollBar } from "./scroll-area"
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip"

function EmbeddedTabs({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn("flex flex-col", className)}
      {...props}
    />
  )
}

function EmbeddedTabsList({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <ScrollArea className="rounded-t-lg whitespace-nowrap -mb-[1px] mx-3">
      <TabsPrimitive.List
        data-slot="tabs-list"
        className={cn(
          "text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg ",
          className
        )}
        {...props}
      />
      <ScrollBar orientation="horizontal" className="-mb-[9px]" />
    </ScrollArea>
  )
}

function EmbeddedTabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "hover:border-honey-brown hover:border-b-transparent data-[state=active]:bg-background data-[state=active]:text-honey-brown focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring data-[state=active]:border-border data-[state=active]:border-b-background inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-t-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 transition-colors duration-200",
        className
      )}
      {...props}
    />
  )
}

function EmbeddedTabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("flex-1 rounded-lg border p-4", className)}
      {...props}
    />
  )
}

export { EmbeddedTabs, EmbeddedTabsList, EmbeddedTabsTrigger, EmbeddedTabsContent }
