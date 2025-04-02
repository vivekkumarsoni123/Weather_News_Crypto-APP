"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowUp, ArrowDown, CreditCard, ExternalLink, Loader2 } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import Link from "next/link"
import { getCryptoData, type CryptoData } from "@/lib/crypto-service"
import { useToast } from "@/hooks/use-toast"

export function CryptoPanel() {
  const [cryptoData, setCryptoData] = useState<CryptoData[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    async function fetchCryptoData() {
      try {
        setLoading(true)
        const data = await getCryptoData(10)
        setCryptoData(data.slice(0, 3)) // Show top 3 cryptocurrencies
      } catch (error) {
        console.error("Failed to fetch crypto data:", error)
        toast({
          title: "Error fetching cryptocurrency data",
          description: "Please try again later",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchCryptoData()

    // Refresh data every 5 minutes
    const interval = setInterval(fetchCryptoData, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [toast])

  if (loading) {
    return (
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Cryptocurrency Market
          </CardTitle>
          <CardDescription>Loading cryptocurrency data...</CardDescription>
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
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Cryptocurrency Market
          </CardTitle>
          <CardDescription>Live cryptocurrency prices and trends</CardDescription>
        </div>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/crypto" className="flex items-center gap-1">
            <span>Details</span>
            <ExternalLink className="h-3 w-3" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {cryptoData.length > 0 ? (
          cryptoData.map((crypto) => (
            <div key={crypto.symbol} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="font-medium text-sm sm:text-base">{crypto.name}</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">{crypto.symbol}</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="font-medium text-sm sm:text-base">
                    ${crypto.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <Badge variant={crypto.change24h > 0 ? "success" : "destructive"} className="flex items-center gap-1 text-xs sm:text-sm">
                    {crypto.change24h > 0 ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                    {Math.abs(crypto.change24h).toFixed(2)}%
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm">
                <div>
                  <span className="text-muted-foreground">Market Cap:</span> {crypto.marketCap}
                </div>
                <div>
                  <span className="text-muted-foreground">Volume:</span> {crypto.volume24h}
                </div>
              </div>

              {crypto.priceHistory && (
                <div className="h-[60px] sm:h-[80px]">
                  <ChartContainer
                    config={{
                      price: {
                        label: "Price",
                        color: crypto.change24h > 0 ? "hsl(142.1 76.2% 36.3%)" : "hsl(0 84.2% 60.2%)",
                      },
                    }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={crypto.priceHistory}>
                        <XAxis
                          dataKey="time"
                          tickLine={false}
                          axisLine={false}
                          tick={{ fontSize: 8 }}
                          padding={{ left: 10, right: 10 }}
                        />
                        <YAxis hide={true} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line
                          type="monotone"
                          dataKey="price"
                          name="price"
                          stroke="var(--color-price)"
                          strokeWidth={2}
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-[200px] sm:h-[300px] text-muted-foreground">
            <CreditCard className="h-8 w-8 sm:h-10 sm:w-10 mb-2 opacity-50" />
            <p className="text-sm sm:text-base">No cryptocurrency data available</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => getCryptoData(10).then((data) => setCryptoData(data.slice(0, 3)))}
            >
              Retry
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

