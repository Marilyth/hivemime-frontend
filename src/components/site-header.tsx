"use client"

import { SidebarIcon, Plus } from "lucide-react"

import { SearchForm } from "@/components/search-form"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useSidebar } from "@/components/ui/sidebar"
import { UserOptions } from "./user-options"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { useRouter } from "next/navigation"
import { useContext } from "react"
import { UserContext } from "@/lib/contexts"

export function SiteHeader() {
  const { toggleSidebar } = useSidebar();
  const router = useRouter();
  const user = useContext(UserContext);

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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Plus />
              Create...
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => router.push("/posts/create")}>
              New post
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/hives/create")}>
              New hive
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <UserOptions />
      </div>
    </header>
  )
}
