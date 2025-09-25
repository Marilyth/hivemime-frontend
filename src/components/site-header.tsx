"use client"

import { SidebarIcon, Plus } from "lucide-react"

import { SearchForm } from "@/components/search-form"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useSidebar } from "@/components/ui/sidebar"
import { UserOptions } from "./user-options"
import { Tooltip } from "@radix-ui/react-tooltip"
import { redirect } from "next/navigation"

export function SiteHeader() {
  const { toggleSidebar } = useSidebar()

  return (
    <header className="z-10 bg-background sticky top-0 flex h-16 shrink-0 items-center gap-2 border-b">
      <div className="flex h-(--header-height) w-full items-center gap-2 px-4">
        <Button
          className="h-8 w-8"
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
        >
          <SidebarIcon />
        </Button>

        <Separator orientation="vertical" className="mr-2 h-4" />
        <div className="flex justify-center flex-1">
          <SearchForm className="max-w-128 w-full" />
        </div>
        <Button variant="outline" onClick={() => redirect("/create")}>
            <Plus />
            New post
        </Button>
        <UserOptions user={{name: "test", email: "test@example.com", avatar: "/avatars/test.jpg"}} />
      </div>
    </header>
  )
}
