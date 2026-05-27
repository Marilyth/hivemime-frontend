"use client"

import * as React from "react"
import {
  TrendingUp,
  Search,
  Users,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { ThemePicker } from "./custom/utility/hm-theme-picker"
import { followedHivesStore } from "@/lib/contexts"
import { observer } from "mobx-react-lite"

export const AppSidebar = observer(({ ...props }: React.ComponentProps<typeof Sidebar>) => {
  return (
    <Sidebar
      {...props}
    >
      <SidebarContent>
        <SidebarHeader>
          <div className="flex flex-col gap-4 items-center">
            <div className="relative h-24 w-24">
              <img src="/HiveMimeIcon.png" alt="HiveMime Logo" style={{ objectFit: "contain" }} />
            </div>
            <div className="flex text-2xl font-bold">
              <span className="text-honey-brown">Hive</span>
              <span className="text-honey-yellow">Mime</span>
            </div>
          </div>
        </SidebarHeader>

         <SidebarGroup className="group-data-[collapsible=icon]:hidden">
          <SidebarGroupLabel>Posts</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href={"/posts"} className="flex items-center gap-2">
                  <TrendingUp />
                  Popular
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
          <SidebarGroupLabel>Hives</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href={"/hives"} className="flex items-center gap-2">
                  <Search />
                  Browse
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            {followedHivesStore.followedHives.values().map((hive) => (
              <SidebarMenuItem key={hive.hive?.id}>
                <SidebarMenuButton asChild>
                  <Link href={`/posts?hiveId=${hive.hive?.id}`} className="flex items-center gap-2">
                    <Users />
                    {hive.hive?.name}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
        <div className="mt-auto mx-auto p-4">
          <ThemePicker />
        </div>
      </SidebarContent>
    </Sidebar>
  )
});