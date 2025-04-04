"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Bell, Search, Sun, Moon, Menu, X } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useTheme } from "next-themes"
import { Toaster, toast } from "sonner"
import { NotificationsPanel } from "@/components/notifications-panel"
import { useRouter } from "next/navigation"

type Notification = {
  id: string
  type: "price_alert" | "weather_alert"
  message: string
}

type User = {
  name: string
  email: string
}

export function Navbar() {
  const router = useRouter()
  const { setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isNotificationsPanelOpen, setIsNotificationsPanelOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const handleLogin = () => {
    router.push("/login")
  }

  const handleLogout = () => {
    router.push("/logout")
  }

  const handleSignup = () => {
    router.push("/signup")
  }

  useEffect(() => {
    setMounted(true)

    // Replace with your actual WebSocket server URL
    const ws = new WebSocket("wss://your-backend-server.com/notifications")

    ws.onmessage = (event) => {
      const notification: Notification = JSON.parse(event.data)
      setNotifications((prev) => [notification, ...prev])

      // Display toast for significant notifications
      toast(notification.message, {
        description: notification.type === "price_alert" ? "Price Alert" : "Weather Alert",
      })
    }

    return () => ws.close()
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <header className="sticky top-0 left-0 z-50 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-lg">
      <Toaster position="top-right" />
      <div className="flex items-center justify-between px-4 py-2 sm:px-6">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-white font-bold text-xl">
            CryptoWeather
          </Link>
          <nav className="hidden md:flex items-center gap-4">
            <Link href="/" className="text-white hover:text-gray-200">
              Dashboard
            </Link>
            <Link href="/weather" className="text-white hover:text-gray-200">
              Weather
            </Link>
            <Link href="/crypto" className="text-white hover:text-gray-200">
              Crypto
            </Link>
            <Link href="/news" className="text-white hover:text-gray-200">
              News
            </Link>
            <Link href="/settings" className="text-white hover:text-gray-200">
              Settings
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <form className="hidden md:block">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-300" />
              <Input
                type="search"
                name="search"
                placeholder="Search..."
                className="w-full bg-white/20 pl-8 text-white placeholder:text-gray-300 rounded-md"
              />
            </div>
          </form>
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
              onClick={() => setIsNotificationsPanelOpen(!isNotificationsPanelOpen)}
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5 text-white" />
              {notifications.length > 0 && (
                <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full" />
              )}
            </Button>
            {isNotificationsPanelOpen && (
              <NotificationsPanel onClose={() => setIsNotificationsPanelOpen(false)} />
            )}
          </div>
          <div className="relative">
            {user ? (
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  aria-label="Profile"
                >
                  <img
                    src="https://via.placeholder.com/40"
                    alt="Profile"
                    className="h-8 w-8 rounded-full"
                  />
                </Button>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-800 text-white rounded-lg shadow-lg">
                    <div className="p-4 border-b border-gray-700">
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-gray-400">{user.email}</p>
                    </div>
                    <ul className="divide-y divide-gray-700">
                      <li className="p-4 hover:bg-gray-700 cursor-pointer">
                        <Link href="/settings">Settings</Link>
                      </li>
                      <li
                        className="p-4 hover:bg-gray-700 cursor-pointer"
                        onClick={handleLogout}
                      >
                        Logout
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-gray-900 border-gray-900 hover:text-black hover:border-white dark:text-white dark:border-white"
                  onClick={handleLogin}
                >
                  Login
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-gray-900 border-gray-900 hover:text-black hover:border-white dark:text-white dark:border-white"
                  onClick={handleSignup}
                >
                  Signup
                </Button>
              </div>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5 text-white" /> : <Menu className="h-5 w-5 text-white" />}
          </Button>
        </div>
      </div>
      {isMobileMenuOpen && (
        <nav className="md:hidden bg-gray-800 text-white p-4 space-y-2">
          <Link href="/" className="block hover:text-gray-300">
            Dashboard
          </Link>
          <Link href="/weather" className="block hover:text-gray-300">
            Weather
          </Link>
          <Link href="/crypto" className="block hover:text-gray-300">
            Crypto
          </Link>
          <Link href="/news" className="block hover:text-gray-300">
            News
          </Link>
          <Link href="/settings" className="block hover:text-gray-300">
            Settings
          </Link>
        </nav>
      )}
    </header>
  )
}

