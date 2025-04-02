"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Bell, Search, Sun, Moon, User, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTheme } from "next-themes"
import { NotificationsPanel } from "@/components/notifications-panel"
import { useSidebar } from "@/components/sidebar-provider"
import { useToast } from "@/hooks/use-toast"

export function Navbar() {
  const { setTheme, theme, resolvedTheme } = useTheme()
  const [showNotifications, setShowNotifications] = useState(false)
  const { toggle } = useSidebar()
  const [mounted, setMounted] = useState(false)
  const { toast } = useToast()

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const searchInput = form.elements.namedItem("search") as HTMLInputElement

    if (searchInput.value.trim()) {
      toast({
        title: "Search initiated",
        description: `Searching for "${searchInput.value}"`,
      })
      searchInput.value = ""
    }
  }

  if (!mounted) {
    return (
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 sm:px-6">
        <div className="flex-1"></div>
      </header>
    )
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 sm:px-6">
      <Button variant="ghost" size="icon" className="md:hidden" onClick={toggle} aria-label="Toggle menu">
        <Menu className="h-5 w-5" />
      </Button>

      <div className="flex flex-1 items-center gap-4 justify-end">
        <form className="flex-1 md:max-w-xs" onSubmit={handleSearch}>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              name="search"
              placeholder="Search..."
              className="w-full bg-background pl-8 md:w-[300px]"
            />
          </div>
        </form>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>

          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={() => setShowNotifications(!showNotifications)}
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
                3
              </span>
            </Button>
            {showNotifications && <NotificationsPanel onClose={() => setShowNotifications(false)} />}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

