"use client"

import { useState, useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ArrowUp, ArrowDown, AlertTriangle, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

type Notification = {
  id: string
  type: "crypto" | "weather"
  title: string
  message: string
  time: string
  read: boolean
  severity?: "info" | "warning" | "critical"
  change?: "up" | "down"
  percentage?: number
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "crypto",
    title: "Bitcoin Spike",
    message: "BTC price increased by 5% in the last hour",
    time: "5 min ago",
    read: false,
    change: "up",
    percentage: 5,
  },
  {
    id: "2",
    type: "weather",
    title: "Storm Warning",
    message: "Severe thunderstorm warning for New York",
    time: "10 min ago",
    read: false,
    severity: "critical",
  },
  {
    id: "3",
    type: "crypto",
    title: "Ethereum Drop",
    message: "ETH price decreased by 3% in the last hour",
    time: "30 min ago",
    read: true,
    change: "down",
    percentage: 3,
  },
  {
    id: "4",
    type: "weather",
    title: "Temperature Alert",
    message: "Unusually high temperatures expected in Los Angeles",
    time: "1 hour ago",
    read: true,
    severity: "warning",
  },
  {
    id: "5",
    type: "crypto",
    title: "Market Update",
    message: "Crypto market cap increased by 2.5% today",
    time: "2 hours ago",
    read: true,
    change: "up",
    percentage: 2.5,
  },
]

interface NotificationsPanelProps {
  onClose?: () => void
}

export function NotificationsPanel({ onClose }: NotificationsPanelProps) {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [activeTab, setActiveTab] = useState("all")
  const panelRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  const filteredNotifications = notifications.filter((notification) => {
    if (activeTab === "all") return true
    return notification.type === activeTab
  })

  const unreadCount = notifications.filter((n) => !n.read).length

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )

    toast({
      title: "Notification marked as read",
      description: "The notification has been marked as read.",
    })
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })))

    toast({
      title: "All notifications marked as read",
      description: "All notifications have been marked as read.",
    })
  }

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        onClose?.()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [onClose])

  return (
    <Card ref={panelRef} className="absolute right-0 top-12 w-80 md:w-96 z-50 shadow-lg overflow-hidden">
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="font-medium">Notifications</h3>
          <Badge variant="secondary">{unreadCount} new</Badge>
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead} className="h-8 text-xs">
              Mark all as read
            </Button>
          )}
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
        <div className="border-b px-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="crypto">Crypto</TabsTrigger>
            <TabsTrigger value="weather">Weather</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value={activeTab} className="max-h-[400px] overflow-auto">
          <div className="divide-y">
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-muted/50 cursor-pointer ${!notification.read ? "bg-muted/20" : ""}`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      {notification.type === "crypto" ? (
                        notification.change === "up" ? (
                          <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full">
                            <ArrowUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                          </div>
                        ) : (
                          <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-full">
                            <ArrowDown className="h-4 w-4 text-red-600 dark:text-red-400" />
                          </div>
                        )
                      ) : (
                        <div className="bg-amber-100 dark:bg-amber-900/30 p-2 rounded-full">
                          <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-sm">{notification.title}</h4>
                        <span className="text-xs text-muted-foreground">{notification.time}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-muted-foreground">No notifications</div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  )
}

