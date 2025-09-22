"use client"

import * as React from "react"
import {
  Frame,
  Map,
  PieChart,
  History,
  Calendar,
  TrendingUp,
} from "lucide-react"
import Image from "next/image"
import { NavTags } from "@/components/nav-tags"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      name: "Popular",
      url: "#",
      icon: TrendingUp,
    },
    {
      name: "New",
      url: "#",
      icon: Calendar,
    },
    {
      name: "History",
      url: "#",
      icon: History,
    },
  ],
  tags: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      className="top-(--header-height) h-[calc(100svh-var(--header-height))]!"
      {...props}
    >
      <SidebarContent>
        <SidebarHeader>
        <div className="flex flex-col items-center">
          <div className="relative h-24 w-24">
            <Image src="/HiveMimeIcon.png" alt="HiveMime Logo" fill style={{ objectFit: "contain" }} />
          </div>
          <div className="flex text-2xl font-bold">
            <span className="text-honey-brown">Hive</span>
            <span className="text-honey-yellow">Mime</span>
          </div>
        </div>
        </SidebarHeader>
        <NavTags tags={data.navMain} title="Feed" />
        <NavTags tags={data.tags} title="Followed tags" />
      </SidebarContent>
    </Sidebar>
  )
}
