"use client"

import { SidebarIcon, Plus } from "lucide-react"

import { SearchForm } from "@/components/search-form"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useSidebar } from "@/components/ui/sidebar"
import { UserOptions } from "./custom/user/user-options"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { useRouter } from "next/navigation"
import { useIsMobile } from "@/hooks/use-mobile"
import { NotificationBanner } from "./notification-banner"
import { useQueryParam } from "./custom/utility/use-query-param"
import { LevelBanner } from "./level-banner"

export function SiteHeader() {
  const { toggleSidebar } = useSidebar();
  const router = useRouter();
  const [hiveId, setHiveId] = useQueryParam("hiveId");
  const isMobile = useIsMobile();

  function navigateWithHive(path: string) {
    if (!hiveId) {
      router.push(path);
      return;
    }

    router.push(`${path}?hiveId=${hiveId}`);
  }

  return (
    <header className="z-10 sticky top-0 flex flex-col shrink-0 items-center gap-2">
      <div className="flex h-(--header-height) w-full items-center gap-2 px-4 bg-sidebar backdrop-blur-sm border-b">
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
            <Button variant="outline" className={`${isMobile ? "p-1! h-auto rounded-xl" : ""}`}>
              <Plus className="w-2 h-2" />{isMobile || "Create..."}
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => navigateWithHive("/posts/create")}>
              New post
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigateWithHive("/hives/create")}>
              New hive
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <UserOptions />
      </div>
      <div className="px-2">
        <NotificationBanner />
      </div>
      <div className="absolute right-0 top-15 px-2 w-64">
        <LevelBanner />
      </div>
    </header>
  )
}
