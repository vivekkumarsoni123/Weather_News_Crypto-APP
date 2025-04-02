"use client"

import type React from "react"

import { Sidebar } from "@/components/sidebar"
import { Navbar } from "@/components/navbar"
import { useSidebar } from "@/components/sidebar-provider"

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isOpen } = useSidebar()

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <div
        className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${
          isOpen ? "md:ml-64" : "md:ml-20"
        }`}
      >
        <Navbar />
        <main className="flex-1 overflow-auto">
          <div className="w-full px-2 py-2 sm:px-4 sm:py-4 md:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

