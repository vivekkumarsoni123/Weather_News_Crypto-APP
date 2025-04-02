import { DashboardLayout } from "@/components/dashboard-layout"
import { WeatherPanel } from "@/components/weather-panel"
import { CryptoPanel } from "@/components/crypto-panel"
import { NewsPanel } from "@/components/news-panel"
import { DataRefresh } from "@/components/data-refresh"

export default function Home() {
  return (
    <DashboardLayout>
      <DataRefresh />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        <WeatherPanel />
        <CryptoPanel />
        <NewsPanel />
      </div>
    </DashboardLayout>
  )
}

