"use client"

import { useEffect, useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { getCryptoData } from "@/lib/crypto-service"

// This component handles real-time data updates and notifications
export function DataRefresh() {
  const { toast } = useToast()
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())

  useEffect(() => {
    // Set up interval for periodic updates and notifications
    const interval = setInterval(async () => {
      setLastUpdate(new Date())

      try {
        // Randomly show crypto or weather notifications
        const random = Math.random()

        if (random < 0.3) {
          // Crypto price alert
          const cryptoData = await getCryptoData(5)
          if (cryptoData.length > 0) {
            const randomIndex = Math.floor(Math.random() * Math.min(5, cryptoData.length))
            const crypto = cryptoData[randomIndex]

            toast({
              title: `${crypto.name} ${crypto.change24h > 0 ? "increased" : "decreased"} by ${Math.abs(crypto.change24h).toFixed(2)}%`,
              description: `${crypto.name} price ${crypto.change24h > 0 ? "rose" : "fell"} to $${crypto.price.toFixed(2)} in the last hour.`,
            })
          }
        } else if (random < 0.6) {
          // Weather alert - use simulated data to avoid API errors
          const cities = ["New York", "Los Angeles", "Chicago", "Miami", "Seattle"]
          const city = cities[Math.floor(Math.random() * cities.length)]

          // Use a simulated weather condition instead of making an API call
          const conditions = [
            { type: "rain", description: "Rain expected" },
            { type: "extreme heat", description: "Temperatures above 30°C" },
            { type: "high winds", description: "Wind speeds above 20 km/h" },
            { type: "storm", description: "Thunderstorms possible" },
          ]

          const randomCondition = conditions[Math.floor(Math.random() * conditions.length)]

          toast({
            title: `Weather Alert: ${randomCondition.type} in ${city}`,
            description: `${randomCondition.description} in ${city} in the next few hours.`,
          })
        }
      } catch (error) {
        console.error("Error in data refresh:", error)
      }
    }, 60000) // Every minute for demo purposes

    return () => clearInterval(interval)
  }, [toast])

  return null // This is a background component, no UI
}

