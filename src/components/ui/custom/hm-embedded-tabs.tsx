"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "@/lib/utils"
import { ScrollArea, ScrollBar } from "../scroll-area"

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
  actionComponent,
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List> & { actionComponent?: React.ReactNode }) {
  return (
    <div className="relative top-[1px] mx-3 flex">
      <ScrollArea className="min-w-0 rounded-t-lg whitespace-nowrap">
        <TabsPrimitive.List {...props} className={cn("inline-flex h-9 w-fit rounded-lg text-muted-foreground", className)} />
        <ScrollBar orientation="horizontal" className="-mb-[9px]" />
      </ScrollArea>
      {actionComponent && <div className="ml-2">{actionComponent}</div>}
    </div>
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
        "hover:border-honey-brown hover:border-b-transparent focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring items-center justify-center rounded-t-md border border-transparent px-2 text-sm font-medium whitespace-nowrap disabled:opacity-50 transition-colors duration-200 data-[state=active]:bg-background data-[state=active]:text-honey-brown data-[state=active]:border-border data-[state=active]:border-b-background",
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
