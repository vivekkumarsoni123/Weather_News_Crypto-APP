import { NextResponse } from "next/server"
import { fetchWithTimeout } from "@/lib/api-utils"
import { getMultiCityWeather } from "@/lib/weather-service"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const cities = searchParams.get("cities")?.split(",") || ["New York", "Los Angeles", "Chicago"]

  try {
    const weatherData = await getMultiCityWeather(cities)
    return NextResponse.json(weatherData)
  } catch (error) {
    console.error("Error in weather API route:", error)
    return NextResponse.json(
      { 
        error: "Failed to fetch weather data",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}
