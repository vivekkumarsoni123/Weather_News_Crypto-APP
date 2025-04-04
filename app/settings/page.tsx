import { DashboardLayout } from "@/components/dashboard-layout"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Bell, Lock, User, Palette, Cloud, CreditCard } from "lucide-react"

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 space-y-8 bg-gray-800 rounded-lg shadow-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-wide">Settings & Preferences</h1>
        </div>

        <Tabs defaultValue="account" className="space-y-6">
          <TabsList className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 w-full bg-gray-700 rounded-lg p-2">
            <TabsTrigger value="account" className="flex items-center gap-2 text-white font-semibold hover:bg-gray-600 rounded-md p-2">
              <User className="h-5 w-5" />
              <span className="hidden sm:inline">Account</span>
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex items-center gap-2 text-white font-semibold hover:bg-gray-600 rounded-md p-2">
              <Palette className="h-5 w-5" />
              <span className="hidden sm:inline">Appearance</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2 text-white font-semibold hover:bg-gray-600 rounded-md p-2">
              <Bell className="h-5 w-5" />
              <span className="hidden sm:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2 text-white font-semibold hover:bg-gray-600 rounded-md p-2">
              <Lock className="h-5 w-5" />
              <span className="hidden sm:inline">Security</span>
            </TabsTrigger>
            <TabsTrigger value="cloud" className="flex items-center gap-2 text-white font-semibold hover:bg-gray-600 rounded-md p-2">
              <Cloud className="h-5 w-5" />
              <span className="hidden sm:inline">Cloud</span>
            </TabsTrigger>
            <TabsTrigger value="billing" className="flex items-center gap-2 text-white font-semibold hover:bg-gray-600 rounded-md p-2">
              <CreditCard className="h-5 w-5" />
              <span className="hidden sm:inline">Billing</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="account" className="mt-6 sm:mt-0 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
              <div>
                <Label htmlFor="name" className="text-white font-medium">Name</Label>
                <Input id="name" placeholder="Enter your name" className="mt-2 bg-gray-700 text-white" />
              </div>
              <div>
                <Label htmlFor="email" className="text-white font-medium">Email</Label>
                <Input id="email" placeholder="Enter your email" className="mt-2 bg-gray-700 text-white" />
              </div>
            </div>
            <Button className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold w-full sm:w-auto">Save Changes</Button>
          </TabsContent>

          <TabsContent value="appearance" className="mt-6 sm:mt-0 space-y-6">
            <div className="space-y-4">
              <Label htmlFor="theme" className="text-white font-medium">
                Theme
              </Label>
              <select
                id="theme"
                className="w-full bg-gray-700 text-white rounded-md p-2"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="system">System</option>
              </select>
            </div>
          </TabsContent>

          <TabsContent value="notifications" className="mt-6 sm:mt-0 space-y-6">
            <div className="space-y-4">
              <Label htmlFor="email-notifications" className="text-white font-medium">
                Email Notifications
              </Label>
              <Switch id="email-notifications" />
            </div>
            <div className="space-y-4">
              <Label htmlFor="push-notifications" className="text-white font-medium">
                Push Notifications
              </Label>
              <Switch id="push-notifications" />
            </div>
          </TabsContent>

          <TabsContent value="security" className="mt-6 sm:mt-0 space-y-6">
            <div className="space-y-4">
              <Label htmlFor="password" className="text-white font-medium">
                Change Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter new password"
                className="mt-2 bg-gray-700 text-white"
              />
            </div>
            <Button className="bg-red-500 hover:bg-red-600 text-white font-semibold w-full sm:w-auto">
              Update Password
            </Button>
          </TabsContent>

          <TabsContent value="cloud" className="mt-6 sm:mt-0 space-y-6">
            <div className="space-y-4">
              <Label htmlFor="storage" className="text-white font-medium">
                Cloud Storage
              </Label>
              <Input
                id="storage"
                type="text"
                placeholder="Enter storage plan"
                className="mt-2 bg-gray-700 text-white"
              />
            </div>
          </TabsContent>

          <TabsContent value="billing" className="mt-6 sm:mt-0 space-y-6">
            <div className="space-y-4">
              <Label htmlFor="card" className="text-white font-medium">
                Credit Card
              </Label>
              <Input
                id="card"
                type="text"
                placeholder="Enter card details"
                className="mt-2 bg-gray-700 text-white"
              />
            </div>
            <Button className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold w-full sm:w-auto">
              Update Billing Info
            </Button>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}

