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
import { NavTags } from "@/components/nav-tags"
import {
  Sidebar,
  SidebarContent,
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
      url: "home",
      icon: TrendingUp,
    },
    {
      name: "New",
      url: "home",
      icon: Calendar,
    },
    {
      name: "History",
      url: "home",
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
        <NavTags tags={data.navMain} title="Browse" />
        <NavTags tags={data.tags} title="Followed hives" />
      </SidebarContent>
    </Sidebar>
  )
}
