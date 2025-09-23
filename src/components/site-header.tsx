"use client"

import { SidebarIcon } from "lucide-react"

import { SearchForm } from "@/components/search-form"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useSidebar } from "@/components/ui/sidebar"
import { UserOptions } from "./user-options"

export function SiteHeader() {
  const { toggleSidebar } = useSidebar()

  return (
    <header className="bg-background sticky top-0 flex h-16 shrink-0 items-center gap-2 border-b">
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
        <UserOptions user={{name: "test", email: "test@example.com", avatar: "/avatars/test.jpg"}} />
      </div>
    </header>
  )
}
