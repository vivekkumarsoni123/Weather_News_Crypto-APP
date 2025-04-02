"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Cloud, CloudRain, Droplets, Sun, Thermometer, Wind, Loader2, RefreshCw } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, BarChart, Bar } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { getMultiCityWeather, type WeatherData } from "@/lib/weather-service"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"

const DEFAULT_CITIES = ["New York", "Los Angeles", "Chicago", "Miami", "Seattle"]
const REFRESH_INTERVAL = 2 * 60 * 1000 // 2 minutes

export default function WeatherPage() {
  const [weatherData, setWeatherData] = useState<WeatherData[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCity, setActiveCity] = useState<string>(DEFAULT_CITIES[0])
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const { toast } = useToast()

  const fetchWeatherData = async () => {
    try {
      setIsRefreshing(true)
      const data = await getMultiCityWeather(DEFAULT_CITIES)
      setWeatherData(data)
      setLastUpdate(new Date())
    } catch (error) {
      console.error("Failed to fetch weather data:", error)
      toast({
        title: "Error fetching weather data",
        description: "Please try again later",
        variant: "destructive",
      })
    } finally {
      setIsRefreshing(false)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchWeatherData()

    // Set up interval for periodic updates
    const interval = setInterval(fetchWeatherData, REFRESH_INTERVAL)

    return () => clearInterval(interval)
  }, [])

  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000)
    if (seconds < 60) return "just now"
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`
    return date.toLocaleTimeString()
  }

  const getWeatherIcon = (condition: string) => {
    const lowerCondition = condition.toLowerCase()
    if (lowerCondition.includes("sun") || lowerCondition.includes("clear")) {
      return <Sun className="h-6 w-6 text-amber-500" />
    } else if (
      lowerCondition.includes("rain") ||
      lowerCondition.includes("drizzle") ||
      lowerCondition.includes("shower")
    ) {
      return <CloudRain className="h-6 w-6 text-blue-500" />
    } else if (
      lowerCondition.includes("cloud") ||
      lowerCondition.includes("overcast") ||
      lowerCondition.includes("fog") ||
      lowerCondition.includes("mist")
    ) {
      return <Cloud className="h-6 w-6 text-gray-500" />
    } else {
      return <Thermometer className="h-6 w-6" />
    }
  }

  // Generate precipitation data based on forecast
  const generatePrecipitationData = (data: WeatherData) => {
    if (!data || !data.forecast) return []

    return data.forecast.map((day) => ({
      date: day.date.split("-")[2], // Just get the day
      rainfall: day.chanceOfRain / 25, // Convert percentage to inches (mock conversion)
    }))
  }

  // Generate temperature data for the chart
  const generateTemperatureData = (data: WeatherData) => {
    if (!data || !data.hourlyForecast) return []

    // Get every 4 hours for the chart
    return data.hourlyForecast
      .filter((_, index) => index % 4 === 0)
      .map((hour) => ({
        hour: hour.time,
        temp: hour.temperature,
        humidity: data.humidity - Math.floor(Math.random() * 10), // Mock humidity variation
      }))
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-6 flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="text-center">
            <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4 text-primary" />
            <h3 className="text-lg font-medium">Loading weather data...</h3>
            <p className="text-muted-foreground">Please wait while we fetch the latest weather information</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  const activeWeather = weatherData.find((w) => w.city === activeCity)

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Weather Insights</h1>
          <div className="flex items-center gap-2">
            {lastUpdate && (
              <span className="text-sm text-muted-foreground">
                Last updated: {formatTimeAgo(lastUpdate)}
              </span>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={fetchWeatherData}
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        <Tabs value={activeCity} onValueChange={setActiveCity} className="space-y-6">
          <TabsList className="flex flex-wrap">
            {weatherData.map((data) => (
              <TabsTrigger key={data.city} value={data.city}>
                {data.city}
              </TabsTrigger>
            ))}
          </TabsList>

          {weatherData.map((data) => (
            <TabsContent key={data.city} value={data.city} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Current Temperature</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center">
                      <Thermometer className="h-5 w-5 text-orange-500 mr-2" />
                      <div className="text-3xl font-bold">{Math.round(data.temperature)}Â°C</div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Feels like {Math.round(data.feelsLike)}Â°C</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Humidity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center">
                      <Droplets className="h-5 w-5 text-blue-500 mr-2" />
                      <div className="text-3xl font-bold">{data.humidity}%</div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {data.humidity > 70 ? "High" : data.humidity > 40 ? "Moderate" : "Low"} humidity
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Wind</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center">
                      <Wind className="h-5 w-5 text-teal-500 mr-2" />
                      <div className="text-3xl font-bold">{Math.round(data.windSpeed)} km/h</div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Direction: {data.windDirection}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Condition</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center">
                      {getWeatherIcon(data.condition)}
                      <div className="text-3xl font-bold ml-2">{data.condition}</div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">UV Index: {data.uv}</p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Temperature & Humidity Trend</CardTitle>
                    <CardDescription>24-hour temperature and humidity data</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ChartContainer
                        config={{
                          temperature: {
                            label: "Temperature (Â°C)",
                            color: "hsl(22 100% 60%)",
                          },
                          humidity: {
                            label: "Humidity (%)",
                            color: "hsl(220 100% 60%)",
                          },
                        }}
                      >
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={generateTemperatureData(data)}>
                            <XAxis dataKey="hour" tickLine={false} axisLine={false} />
                            <YAxis
                              yAxisId="left"
                              orientation="left"
                              tickLine={false}
                              axisLine={false}
                              domain={["dataMin - 5", "dataMax + 5"]}
                            />
                            <YAxis
                              yAxisId="right"
                              orientation="right"
                              tickLine={false}
                              axisLine={false}
                              domain={[30, 100]}
                            />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Line
                              yAxisId="left"
                              type="monotone"
                              dataKey="temp"
                              name="temperature"
                              stroke="var(--color-temperature)"
                              strokeWidth={2}
                              dot={{ r: 4 }}
                              activeDot={{ r: 6 }}
                            />
                            <Line
                              yAxisId="right"
                              type="monotone"
                              dataKey="humidity"
                              name="humidity"
                              stroke="var(--color-humidity)"
                              strokeWidth={2}
                              dot={{ r: 4 }}
                              activeDot={{ r: 6 }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>5-Day Forecast</CardTitle>
                    <CardDescription>Weather forecast for the next 5 days</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {data.forecast.map((day) => (
                        <div key={day.date} className="flex items-center justify-between border-b pb-3 last:border-0">
                          <div className="font-medium">
                            {new Date(day.date).toLocaleDateString("en-US", {
                              weekday: "short",
                              month: "short",
                              day: "numeric",
                            })}
                          </div>
                          <div className="flex items-center">{getWeatherIcon(day.condition)}</div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{Math.round(day.maxTemp)}Â°</span>
                            <span className="text-muted-foreground">{Math.round(day.minTemp)}Â°</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="overflow-hidden">
                <CardHeader>
                  <CardTitle>Precipitation Forecast</CardTitle>
                  <CardDescription>Chance of rain for the next 5 days</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="w-full ">
                    <ChartContainer
                      config={{
                        rainfall: {
                          label: "Chance of Rain (%)",
                          color: "hsl(220 100% 60%)",
                        },
                      }}
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data.forecast}>
                          <XAxis
                            dataKey="date"
                            tickFormatter={(value) => new Date(value).toLocaleDateString("en-US", { weekday: "short" })}
                            tickLine={false}
                            axisLine={false}
                          />
                          <YAxis tickLine={false} axisLine={false} domain={[0, 100]} tickCount={10} />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Bar
                            dataKey="chanceOfRain"
                            name="rainfall"
                            fill="var(--color-rainfall)"
                            radius={[2, 2, 2, 2]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </DashboardLayout>
  )
}

