"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Cloud, CloudRain, Sun, Thermometer, ExternalLink, Loader2 } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import Link from "next/link"
import { getMultiCityWeather, type WeatherData } from "@/lib/weather-service"
import { useToast } from "@/hooks/use-toast"

const DEFAULT_CITIES = ["New York", "Los Angeles", "Chicago"]

export function WeatherPanel() {
  const [weatherData, setWeatherData] = useState<WeatherData[]>([])
  const [activeCity, setActiveCity] = useState<string>(DEFAULT_CITIES[0])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    async function fetchWeatherData() {
      try {
        setLoading(true)
        const data = await getMultiCityWeather(DEFAULT_CITIES)
        setWeatherData(data)
      } catch (error) {
        console.error("Failed to fetch weather data:", error)
        toast({
          title: "Error fetching weather data",
          description: "Please try again later",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchWeatherData()

    // Refresh data every 15 minutes
    const interval = setInterval(fetchWeatherData, 15 * 60 * 1000)
    return () => clearInterval(interval)
  }, [toast])

  const getWeatherIcon = (condition: string) => {
    const lowerCondition = condition.toLowerCase()
    if (lowerCondition.includes("sun") || lowerCondition.includes("clear")) {
      return <Sun className="h-8 w-8 text-amber-500" />
    } else if (
      lowerCondition.includes("rain") ||
      lowerCondition.includes("drizzle") ||
      lowerCondition.includes("shower")
    ) {
      return <CloudRain className="h-8 w-8 text-blue-500" />
    } else if (
      lowerCondition.includes("cloud") ||
      lowerCondition.includes("overcast") ||
      lowerCondition.includes("fog") ||
      lowerCondition.includes("mist")
    ) {
      return <Cloud className="h-8 w-8 text-gray-500" />
    } else {
      return <Thermometer className="h-8 w-8" />
    }
  }

  const getWeatherColor = (condition: string) => {
    const lowerCondition = condition.toLowerCase()
    if (lowerCondition.includes("sun") || lowerCondition.includes("clear")) {
      return "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800"
    } else if (
      lowerCondition.includes("rain") ||
      lowerCondition.includes("drizzle") ||
      lowerCondition.includes("shower")
    ) {
      return "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800"
    } else if (
      lowerCondition.includes("cloud") ||
      lowerCondition.includes("overcast") ||
      lowerCondition.includes("fog") ||
      lowerCondition.includes("mist")
    ) {
      return "bg-gray-50 dark:bg-gray-950/30 border-gray-200 dark:border-gray-800"
    } else {
      return ""
    }
  }

  // Prepare hourly forecast data for the chart
  const getHourlyForecastData = (data: WeatherData) => {
    if (!data || !data.hourlyForecast) return []

    // Get every 3 hours for the chart
    return data.hourlyForecast
      .filter((_, index) => index % 3 === 0)
      .map((hour) => ({
        time: hour.time,
        temperature: hour.temperature,
      }))
  }

  if (loading) {
    return (
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cloud className="h-5 w-5" />
            Weather Overview
          </CardTitle>
          <CardDescription>Loading weather data...</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[300px]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="col-span-1">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
            <Cloud className="h-4 w-4 sm:h-5 sm:w-5" />
            Weather Overview
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">Real-time weather data for your tracked cities</CardDescription>
        </div>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/weather" className="flex items-center gap-1 text-xs sm:text-sm">
            <span>Details</span>
            <ExternalLink className="h-3 w-3" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {weatherData.length > 0 ? (
          <Tabs value={activeCity} onValueChange={setActiveCity} className="space-y-3 sm:space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              {weatherData.map((data) => (
                <TabsTrigger key={data.city} value={data.city} className="text-xs sm:text-sm">
                  {data.city}
                </TabsTrigger>
              ))}
            </TabsList>

            {weatherData.map((data) => (
              <TabsContent key={data.city} value={data.city} className="space-y-3 sm:space-y-4">
                <div
                  className={`flex items-center justify-between rounded-lg border p-2 sm:p-4 ${getWeatherColor(data.condition)}`}
                >
                  <div className="space-y-1">
                    <p className="text-xs sm:text-sm font-medium leading-none">{data.city}</p>
                    <p className="text-xl sm:text-3xl font-bold">{Math.round(data.temperature)}°C</p>
                    <p className="text-xs text-muted-foreground">Humidity: {data.humidity}%</p>
                  </div>
                  {getWeatherIcon(data.condition)}
                </div>

                <div className="h-[100px] sm:h-[150px]">
                  <ChartContainer
                    config={{
                      temperature: {
                        label: "Temperature (°C)",
                        color: "hsl(var(--chart-1))",
                      },
                    }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={getHourlyForecastData(data)}>
                        <XAxis 
                          dataKey="time" 
                          tickLine={false} 
                          axisLine={false} 
                          padding={{ left: 5, right: 5 }}
                          tick={{ fontSize: 8 }}
                        />
                        <YAxis hide={true} domain={["dataMin - 5", "dataMax + 5"]} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line
                          type="monotone"
                          dataKey="temperature"
                          name="temperature"
                          stroke="var(--color-temperature)"
                          strokeWidth={1.5}
                          dot={{ r: 1.5 }}
                          activeDot={{ r: 3 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        ) : (
          <div className="flex flex-col items-center justify-center h-[150px] sm:h-[300px] text-muted-foreground">
            <Cloud className="h-6 w-6 sm:h-10 sm:w-10 mb-2 opacity-50" />
            <p className="text-xs sm:text-base">No weather data available</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-2 sm:mt-4 text-xs sm:text-sm"
              onClick={() => getMultiCityWeather(DEFAULT_CITIES).then(setWeatherData)}
            >
              Retry
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

