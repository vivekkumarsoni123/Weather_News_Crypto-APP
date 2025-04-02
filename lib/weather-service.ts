import { fetchWithTimeout } from "./api-utils"

export type WeatherData = {
  city: string
  country: string
  temperature: number
  feelsLike: number
  humidity: number
  condition: string
  conditionIcon: string
  windSpeed: number
  windDirection: string
  pressure: number
  uv: number
  forecast: Array<{
    date: string
    maxTemp: number
    minTemp: number
    condition: string
    conditionIcon: string
    chanceOfRain: number
  }>
  hourlyForecast: Array<{
    time: string
    temperature: number
    condition: string
    conditionIcon: string
  }>
}

const WEATHER_API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY
const WEATHER_API_URL = "https://api.openweathermap.org/data/2.5"

export async function getWeatherData(city: string): Promise<WeatherData> {
  if (!WEATHER_API_KEY) {
    throw new Error("Weather API key is not configured")
  }

  try {
    console.log(`Fetching weather data for ${city}...`)
    
    // Fetch current weather
    const currentWeatherResponse = await fetchWithTimeout(
      `${WEATHER_API_URL}/weather?q=${encodeURIComponent(city)}&appid=${WEATHER_API_KEY}&units=metric`
    )
    
    if (!currentWeatherResponse.ok) {
      const errorText = await currentWeatherResponse.text()
      console.error(`Weather API error response: ${currentWeatherResponse.status} ${currentWeatherResponse.statusText}`, errorText)
      throw new Error(`Weather API returned ${currentWeatherResponse.status}: ${currentWeatherResponse.statusText}. ${errorText}`)
    }

    const currentData = await currentWeatherResponse.json()
    
    // Fetch 5-day forecast
    const forecastResponse = await fetchWithTimeout(
      `${WEATHER_API_URL}/forecast?q=${encodeURIComponent(city)}&appid=${WEATHER_API_KEY}&units=metric`
    )
    
    if (!forecastResponse.ok) {
      const errorText = await forecastResponse.text()
      console.error(`Forecast API error response: ${forecastResponse.status} ${forecastResponse.statusText}`, errorText)
      throw new Error(`Forecast API returned ${forecastResponse.status}: ${forecastResponse.statusText}. ${errorText}`)
    }

    const forecastData = await forecastResponse.json()
    
    // Process hourly forecast data
    const hourlyForecast = forecastData.list.slice(0, 8).map((item: any) => ({
      time: new Date(item.dt * 1000).toLocaleTimeString([], { hour: '2-digit' }),
      temperature: item.main.temp,
      condition: item.weather[0].main,
      conditionIcon: `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`
    }))

    // Process 5-day forecast
    const dailyForecast = forecastData.list
      .filter((item: any, index: number) => index % 8 === 0)
      .slice(0, 5)
      .map((item: any) => ({
        date: new Date(item.dt * 1000).toISOString().split('T')[0],
        maxTemp: item.main.temp_max,
        minTemp: item.main.temp_min,
        condition: item.weather[0].main,
        conditionIcon: `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`,
        chanceOfRain: item.pop ? Math.round(item.pop * 100) : 0
      }))

    const weatherData: WeatherData = {
      city: currentData.name,
      country: currentData.sys.country,
      temperature: currentData.main.temp,
      feelsLike: currentData.main.feels_like,
      humidity: currentData.main.humidity,
      condition: currentData.weather[0].main,
      conditionIcon: `https://openweathermap.org/img/wn/${currentData.weather[0].icon}@2x.png`,
      windSpeed: currentData.wind.speed,
      windDirection: getWindDirection(currentData.wind.deg),
      pressure: currentData.main.pressure,
      uv: 0, // UV index not available in free API
      forecast: dailyForecast,
      hourlyForecast: hourlyForecast
    }

    return weatherData
  } catch (error) {
    console.error("Error fetching weather data:", error)
    throw new Error(`Failed to fetch weather data: ${String(error)}`)
  }
}

function getWindDirection(degrees: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW']
  const index = Math.round(degrees / 22.5) % 16
  return directions[index]
}

export async function getMultiCityWeather(cities: string[]): Promise<WeatherData[]> {
  try {
    console.log(`Fetching weather data for multiple cities: ${cities.join(", ")}`)
    const promises = cities.map((city) => getWeatherData(city))
    return await Promise.all(promises)
  } catch (error) {
    console.error("Error fetching multi-city weather data:", error)
    throw new Error(`Failed to fetch weather data for multiple cities: ${String(error)}`)
  }
}
