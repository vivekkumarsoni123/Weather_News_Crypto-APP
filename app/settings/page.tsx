import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Bell, Lock, User, Palette, Cloud, CreditCard } from "lucide-react"

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Settings & Preferences</h1>
        </div>

        <Tabs defaultValue="account" className="space-y-6">
          <TabsList className="grid grid-cols-2 md:grid-cols-6 w-full">
            <TabsTrigger value="account" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="hidden md:inline">Account</span>
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              <span className="hidden md:inline">Appearance</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <span className="hidden md:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="weather" className="flex items-center gap-2">
              <Cloud className="h-4 w-4" />
              <span className="hidden md:inline">Weather</span>
            </TabsTrigger>
            <TabsTrigger value="crypto" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              <span className="hidden md:inline">Crypto</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              <span className="hidden md:inline">Security</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>Update your account details and preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" defaultValue="John Doe" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" type="email" defaultValue="john.doe@example.com" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Input id="bio" defaultValue="Crypto enthusiast and weather watcher" />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Preferences</h3>

                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <Select defaultValue="en">
                      <SelectTrigger id="language">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="de">German</SelectItem>
                        <SelectItem value="ja">Japanese</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select defaultValue="utc-5">
                      <SelectTrigger id="timezone">
                        <SelectValue placeholder="Select timezone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="utc-8">Pacific Time (UTC-8)</SelectItem>
                        <SelectItem value="utc-7">Mountain Time (UTC-7)</SelectItem>
                        <SelectItem value="utc-6">Central Time (UTC-6)</SelectItem>
                        <SelectItem value="utc-5">Eastern Time (UTC-5)</SelectItem>
                        <SelectItem value="utc+0">UTC</SelectItem>
                        <SelectItem value="utc+1">Central European Time (UTC+1)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="temperature-unit">Temperature Unit</Label>
                      <p className="text-sm text-muted-foreground">Choose between Fahrenheit and Celsius</p>
                    </div>
                    <Select defaultValue="f">
                      <SelectTrigger id="temperature-unit" className="w-[120px]">
                        <SelectValue placeholder="Select unit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="f">Fahrenheit (°F)</SelectItem>
                        <SelectItem value="c">Celsius (°C)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button variant="outline">Cancel</Button>
                <Button>Save Changes</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="appearance">
            <Card>
              <CardHeader>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>Customize the look and feel of the dashboard</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Dark Mode</Label>
                      <p className="text-sm text-muted-foreground">Toggle between light and dark themes</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Reduced Motion</Label>
                      <p className="text-sm text-muted-foreground">Minimize animations and transitions</p>
                    </div>
                    <Switch />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Compact View</Label>
                      <p className="text-sm text-muted-foreground">Display more content with less spacing</p>
                    </div>
                    <Switch />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Dashboard Layout</h3>

                  <div className="space-y-2">
                    <Label htmlFor="layout">Default Layout</Label>
                    <Select defaultValue="three-column">
                      <SelectTrigger id="layout">
                        <SelectValue placeholder="Select layout" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="three-column">Three Column</SelectItem>
                        <SelectItem value="two-column">Two Column</SelectItem>
                        <SelectItem value="single-column">Single Column</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sidebar">Sidebar Position</Label>
                    <Select defaultValue="left">
                      <SelectTrigger id="sidebar">
                        <SelectValue placeholder="Select position" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="left">Left</SelectItem>
                        <SelectItem value="right">Right</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button variant="outline">Reset to Defaults</Button>
                <Button>Save Changes</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>Configure how you receive alerts and notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Crypto Notifications</h3>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Price Alerts</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications for significant price changes
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Market Updates</Label>
                      <p className="text-sm text-muted-foreground">Daily summaries of market movements</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>News Alerts</Label>
                      <p className="text-sm text-muted-foreground">Breaking news about cryptocurrencies</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Weather Notifications</h3>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Severe Weather Alerts</Label>
                      <p className="text-sm text-muted-foreground">Warnings about extreme weather conditions</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Daily Forecast</Label>
                      <p className="text-sm text-muted-foreground">Morning summary of the day's weather</p>
                    </div>
                    <Switch />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Temperature Changes</Label>
                      <p className="text-sm text-muted-foreground">Alerts for significant temperature fluctuations</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Notification Delivery</h3>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Push Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive notifications in your browser</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>SMS Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive notifications via text message</p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button variant="outline">Reset to Defaults</Button>
                <Button>Save Changes</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="weather">
            <Card>
              <CardHeader>
                <CardTitle>Weather Settings</CardTitle>
                <CardDescription>Configure your weather tracking preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Tracked Locations</h3>

                  <div className="space-y-2">
                    <Label>Add Location</Label>
                    <div className="flex gap-2">
                      <Input placeholder="City name or zip code" />
                      <Button>Add</Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Current Locations</Label>
                    <div className="space-y-2">
                      {["New York", "Los Angeles", "Chicago", "Miami", "Seattle"].map((city) => (
                        <div key={city} className="flex items-center justify-between p-2 border rounded-md">
                          <span>{city}</span>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            &times;
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Display Options</h3>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Show Humidity</Label>
                      <p className="text-sm text-muted-foreground">Display humidity percentage in weather cards</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Show Wind Speed</Label>
                      <p className="text-sm text-muted-foreground">Display wind speed in weather cards</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Show Precipitation</Label>
                      <p className="text-sm text-muted-foreground">Display precipitation chance in weather cards</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Show UV Index</Label>
                      <p className="text-sm text-muted-foreground">Display UV index in weather cards</p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button variant="outline">Reset to Defaults</Button>
                <Button>Save Changes</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="crypto">
            <Card>
              <CardHeader>
                <CardTitle>Cryptocurrency Settings</CardTitle>
                <CardDescription>Configure your cryptocurrency tracking preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Tracked Cryptocurrencies</h3>

                  <div className="space-y-2">
                    <Label>Add Cryptocurrency</Label>
                    <div className="flex gap-2">
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select cryptocurrency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="btc">Bitcoin (BTC)</SelectItem>
                          <SelectItem value="eth">Ethereum (ETH)</SelectItem>
                          <SelectItem value="sol">Solana (SOL)</SelectItem>
                          <SelectItem value="ada">Cardano (ADA)</SelectItem>
                          <SelectItem value="dot">Polkadot (DOT)</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button>Add</Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Current Cryptocurrencies</Label>
                    <div className="space-y-2">
                      {[
                        { name: "Bitcoin", symbol: "BTC" },
                        { name: "Ethereum", symbol: "ETH" },
                        { name: "Binance Coin", symbol: "BNB" },
                        { name: "Solana", symbol: "SOL" },
                        { name: "Cardano", symbol: "ADA" },
                      ].map((crypto) => (
                        <div key={crypto.symbol} className="flex items-center justify-between p-2 border rounded-md">
                          <span>
                            {crypto.name} ({crypto.symbol})
                          </span>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            &times;
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Display Options</h3>

                  <div className="space-y-2">
                    <Label htmlFor="currency">Display Currency</Label>
                    <Select defaultValue="usd">
                      <SelectTrigger id="currency">
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="usd">US Dollar (USD)</SelectItem>
                        <SelectItem value="eur">Euro (EUR)</SelectItem>
                        <SelectItem value="gbp">British Pound (GBP)</SelectItem>
                        <SelectItem value="jpy">Japanese Yen (JPY)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Show 24h Change</Label>
                      <p className="text-sm text-muted-foreground">Display 24-hour price change percentage</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Show Market Cap</Label>
                      <p className="text-sm text-muted-foreground">Display market capitalization</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Show Volume</Label>
                      <p className="text-sm text-muted-foreground">Display 24-hour trading volume</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Show Price Charts</Label>
                      <p className="text-sm text-muted-foreground">Display price history charts</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Price Alerts</h3>

                  <div className="space-y-2">
                    <Label>Alert Threshold</Label>
                    <div className="flex gap-2">
                      <Select defaultValue="5">
                        <SelectTrigger>
                          <SelectValue placeholder="Select threshold" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1% Change</SelectItem>
                          <SelectItem value="3">3% Change</SelectItem>
                          <SelectItem value="5">5% Change</SelectItem>
                          <SelectItem value="10">10% Change</SelectItem>
                          <SelectItem value="15">15% Change</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select defaultValue="both">
                        <SelectTrigger>
                          <SelectValue placeholder="Select direction" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="up">Price Increase</SelectItem>
                          <SelectItem value="down">Price Decrease</SelectItem>
                          <SelectItem value="both">Both Directions</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button variant="outline">Reset to Defaults</Button>
                <Button>Save Changes</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Manage your account security preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Password</h3>

                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input id="current-password" type="password" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input id="new-password" type="password" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input id="confirm-password" type="password" />
                  </div>

                  <Button>Update Password</Button>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Two-Factor Authentication</h3>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Enable 2FA</Label>
                      <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                    </div>
                    <Switch />
                  </div>

                  <Button variant="outline" disabled>
                    Set Up Two-Factor Authentication
                  </Button>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Session Management</h3>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Current Session</p>
                        <p className="text-sm text-muted-foreground">Chrome on Windows • Active now</p>
                      </div>
                      <Button variant="outline" size="sm">
                        This Device
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Other Sessions</p>
                        <p className="text-sm text-muted-foreground">Safari on macOS • 2 days ago</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Log Out
                      </Button>
                    </div>
                  </div>

                  <Button variant="destructive">Log Out of All Devices</Button>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Account Actions</h3>

                  <Button variant="destructive">Delete Account</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}

