"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { useSidebar } from "@/components/sidebar-provider"

export function Sidebar() {
  const { isOpen } = useSidebar()

  return (
    <aside
      className={cn(
        "fixed top-0 left-0 z-40 h-screen bg-gray-900/90 backdrop-blur-md border-r border-white/10 transition-all duration-300",
        isOpen ? "w-64" : "w-20"
      )}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-center h-16 text-white font-bold">
          {isOpen ? "My Dashboard" : "MD"}
        </div>
        <nav className="flex-1 px-2 py-4 space-y-2">
          {/* Add navigation links here */}
        </nav>
      </div>
    </aside>
  )
}
