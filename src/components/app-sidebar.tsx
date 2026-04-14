"use client"

import * as React from "react"
import {
  TrendingUp,
  Search,
  Users,
  Lightbulb
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
import { FollowedHivesContext } from "@/lib/contexts"
import Link from "next/link"
import { Button } from "./ui/button"
import { useTheme } from "next-themes"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const followedHives = React.useContext(FollowedHivesContext);
  const theme = useTheme();

  function toggleTheme() {
    theme.setTheme(theme.theme === "dark" ? "light" : "dark");
  }

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
            {followedHives!.followedHives.map((hive) => (
              <SidebarMenuItem key={hive.id}>
                <SidebarMenuButton asChild>
                  <Link href={`/posts?hiveId=${hive.id}`} className="flex items-center gap-2">
                    <Users />
                    {hive.name}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
        <div className="mt-auto mx-auto p-4">
          <Button variant="outline" size="sm" onClick={toggleTheme}>
            <Lightbulb />
            Toggle theme
          </Button>
        </div>
      </SidebarContent>
    </Sidebar>
  )
}
