"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowDown, ArrowUp, CreditCard, DollarSign, TrendingUp, Loader2 } from "lucide-react"
import { XAxis, YAxis, ResponsiveContainer, AreaChart, Area, LineChart, Line, CartesianGrid, Tooltip } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { getCryptoData, type CryptoData, cleanupWebSockets } from "@/lib/crypto-service"
import { useToast } from "@/hooks/use-toast"
import { formatCurrency, formatNumber } from "@/lib/utils"

export default function CryptoPage() {
  const [cryptoData, setCryptoData] = useState<CryptoData[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    async function fetchCryptoData() {
      try {
        setLoading(true)
        const data = await getCryptoData(10)
        setCryptoData(data)
      } catch (error) {
        console.error("Error fetching crypto data:", error)
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

    // Cleanup WebSocket connections when component unmounts
    return () => {
      cleanupWebSockets()
    }
  }, [toast])

  // Calculate market overview data
  const calculateMarketOverview = () => {
    if (!cryptoData.length)
      return {
        totalMarketCap: "$0",
        volume24h: "$0",
        btcDominance: "0%",
        ethDominance: "0%",
        activeCoins: "0",
        totalExchanges: "0",
      }

    // This is a simplified calculation - in a real app, you'd get this from the API
    const btcData = cryptoData.find((c) => c.symbol === "BTC")
    const ethData = cryptoData.find((c) => c.symbol === "ETH")

    return {
      totalMarketCap: "$1.87T", // This would come from API
      volume24h: "$78.5B", // This would come from API
      btcDominance: btcData ? "42.3%" : "0%",
      ethDominance: ethData ? "18.7%" : "0%",
      activeCoins: "8,831", // This would come from API
      totalExchanges: "487", // This would come from API
    }
  }

  const marketOverview = calculateMarketOverview()

  // Generate historical data for Bitcoin
  const generateBtcHistoricalData = () => {
    const btcData = cryptoData.find((c) => c.symbol === "BTC")
    if (!btcData) return []

    // In a real app, you'd fetch this from an API
    return [
      { date: "Jan", price: 38000 },
      { date: "Feb", price: 42000 },
      { date: "Mar", price: 45000 },
      { date: "Apr", price: 43000 },
      { date: "May", price: 39000 },
      { date: "Jun", price: 36000 },
      { date: "Jul", price: 34000 },
      { date: "Aug", price: 38000 },
      { date: "Sep", price: 40000 },
      { date: "Oct", price: 42000 },
      { date: "Nov", price: 41000 },
      { date: "Dec", price: btcData.price },
    ]
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-6 flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="text-center">
            <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4 text-primary" />
            <h3 className="text-lg font-medium">Loading cryptocurrency data...</h3>
            <p className="text-muted-foreground">Please wait while we fetch the latest market information</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  // Generate sample price history data for the chart
  const generatePriceHistory = (price: number) => {
    return Array.from({ length: 30 }, (_, i) => ({
      date: `Day ${i + 1}`,
      price: price * (1 + (Math.random() - 0.5) * 0.1),
    }));
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Cryptocurrency Market</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Market Cap</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <DollarSign className="h-5 w-5 text-green-500 mr-2" />
                <div className="text-2xl font-bold">{marketOverview.totalMarketCap}</div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Global crypto market cap</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">24h Volume</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <TrendingUp className="h-5 w-5 text-blue-500 mr-2" />
                <div className="text-2xl font-bold">{marketOverview.volume24h}</div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Total trading volume</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">BTC Dominance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <CreditCard className="h-5 w-5 text-amber-500 mr-2" />
                <div className="text-2xl font-bold">{marketOverview.btcDominance}</div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Bitcoin market share</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Active Cryptocurrencies</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <CreditCard className="h-5 w-5 text-purple-500 mr-2" />
                <div className="text-2xl font-bold">{marketOverview.activeCoins}</div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Across all exchanges</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Bitcoin Price History</CardTitle>
              <CardDescription>12-month price movement</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart 
                    data={generateBtcHistoricalData()}
                    margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                  >
                    <defs>
                      <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fill: "hsl(var(--foreground))" }}
                      tickLine={{ stroke: "hsl(var(--muted))" }}
                      axisLine={{ stroke: "hsl(var(--muted))" }}
                    />
                    <YAxis 
                      tickFormatter={(value) => formatCurrency(value)}
                      tick={{ fill: "hsl(var(--foreground))" }}
                      tickLine={{ stroke: "hsl(var(--muted))" }}
                      axisLine={{ stroke: "hsl(var(--muted))" }}
                    />
                    <Tooltip 
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="rounded-lg border bg-background p-2 shadow-sm">
                              <div className="grid grid-cols-2 gap-2">
                                <div className="text-sm font-medium">Date</div>
                                <div className="text-sm">{label}</div>
                                <div className="text-sm font-medium">Price</div>
                                <div className="text-sm">{formatCurrency(payload[0].value as number)}</div>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="price"
                      stroke="hsl(var(--primary))"
                      fillOpacity={1}
                      fill="url(#colorPrice)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Market Distribution</CardTitle>
              <CardDescription>Top cryptocurrencies by market cap</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cryptoData.slice(0, 5).map((crypto) => (
                  <div key={crypto.symbol} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="font-medium">{crypto.name}</div>
                      <div className="text-xs text-muted-foreground">{crypto.symbol}</div>
                    </div>
                    <div className="text-sm font-medium">{crypto.marketCap}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Price History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={generatePriceHistory(cryptoData[0]?.price || 0)}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis 
                    domain={['auto', 'auto']}
                    tickFormatter={(value) => formatCurrency(value)}
                  />
                  <Tooltip 
                    formatter={(value: number) => formatCurrency(value)}
                    labelFormatter={(label) => `Date: ${label}`}
                  />
                  <Line
                    type="monotone"
                    dataKey="price"
                    stroke="#8884d8"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Cryptocurrencies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>24h Change</TableHead>
                    <TableHead>Market Cap</TableHead>
                    <TableHead>24h Volume</TableHead>
                    <TableHead>Last Updated</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cryptoData.map((crypto) => (
                    <TableRow key={crypto.id}>
                      <TableCell className="font-medium">
                        {crypto.name} ({crypto.symbol})
                      </TableCell>
                      <TableCell id={`price-${crypto.symbol}`}>
                        {formatCurrency(crypto.price)}
                      </TableCell>
                      <TableCell className={crypto.change24h >= 0 ? "text-green-500" : "text-red-500"}>
                        {crypto.change24h.toFixed(2)}%
                      </TableCell>
                      <TableCell>{formatCurrency(crypto.marketCap)}</TableCell>
                      <TableCell>{formatCurrency(crypto.volume24h)}</TableCell>
                      <TableCell>{crypto.lastUpdated}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

