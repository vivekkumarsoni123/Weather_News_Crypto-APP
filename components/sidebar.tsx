"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Cloud, CreditCard, Newspaper, Settings, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useSidebar } from "@/components/sidebar-provider"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const navItems = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Weather Insights",
    href: "/weather",
    icon: Cloud,
  },
  {
    title: "Cryptocurrency Market",
    href: "/crypto",
    icon: CreditCard,
  },
  {
    title: "News & Updates",
    href: "/news",
    icon: Newspaper,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const { isOpen, toggle } = useSidebar()
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <TooltipProvider delayDuration={300}>
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen bg-background border-r border-border transition-all duration-300",
          isOpen ? "w-64" : "w-20",
        )}
      >
        <div className="flex h-16 items-center justify-between px-4">
          <div className={cn("flex items-center", isOpen ? "justify-between w-full" : "justify-center")}>
            {isOpen && (
              <Link href="/" className="flex items-center gap-2">
                <span className="font-bold text-xl">CryptoWeather</span>
              </Link>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggle}
              className="h-8 w-8"
              aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
            >
              {isOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </Button>
          </div>
        </div>
        <div className="space-y-4 py-4">
          <nav className="space-y-1 px-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)

              return isOpen ? (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  <item.icon className="h-5 w-5 mr-2" />
                  <span>{item.title}</span>
                </Link>
              ) : (
                <Tooltip key={item.href}>
                  <TooltipTrigger asChild>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center justify-center rounded-md px-0 py-2 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground",
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">{item.title}</TooltipContent>
                </Tooltip>
              )
            })}
          </nav>
        </div>
      </aside>
    </TooltipProvider>
  )
}

