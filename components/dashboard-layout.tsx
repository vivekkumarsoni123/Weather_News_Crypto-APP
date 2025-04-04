"use client"

import type React from "react"
import { Navbar } from "@/components/navbar"

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <Navbar />
      <main className="flex-1 overflow-y-auto">
        <div className="w-full h-full px-4 py-4 sm:px-6 sm:py-6 md:px-8 lg:px-10">
          <div className="mx-auto max-w-7xl">{children}</div>
        </div>
      </main>
    </div>
  )
}

