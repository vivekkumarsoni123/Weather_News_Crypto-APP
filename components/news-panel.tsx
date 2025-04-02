"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Newspaper, ExternalLink, Loader2, AlertCircle } from "lucide-react"
import Link from "next/link"
import { getNewsData, type NewsItem } from "@/lib/news-service"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"

export function NewsPanel() {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    async function fetchNewsData() {
      try {
        setLoading(true)
        setError(null)
        const data = await getNewsData(6) // Get 6 news items for the panel
        setNewsItems(data)
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to fetch news data"
        console.error("Failed to fetch news data:", error)
        setError(errorMessage)
        toast({
          title: "Error fetching news data",
          description: errorMessage,
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchNewsData()

    // Refresh data every 30 minutes
    const interval = setInterval(fetchNewsData, 30 * 60 * 1000)
    return () => clearInterval(interval)
  }, [toast])

  // Group news by category
  const getNewsByCategory = (category: string) => {
    return newsItems
      .filter((item) => {
        const title = item.title.toLowerCase();
        const itemCategory = item.category.toLowerCase();
        
        if (category === "trending") {
          // Show news about major cryptocurrencies and market trends
          return title.includes("bitcoin") || 
                 title.includes("ethereum") ||
                 title.includes("crypto market") ||
                 title.includes("price") ||
                 title.includes("trading") ||
                 itemCategory === "cryptocurrency" ||
                 itemCategory === "business";
        } else if (category === "latest") {
          // Show the most recent news
          return true; // Show all news sorted by timestamp
        } else if (category === "popular") {
          // Show news about DeFi, NFTs, blockchain, and technology
          return title.includes("defi") ||
                 title.includes("nft") ||
                 title.includes("blockchain") ||
                 title.includes("web3") ||
                 title.includes("metaverse") ||
                 itemCategory === "technology" ||
                 itemCategory === "defi" ||
                 itemCategory === "nft" ||
                 itemCategory === "blockchain";
        }
        return false;
      })
      .sort((a, b) => {
        if (category === "latest") {
          return (b.timestamp || 0) - (a.timestamp || 0);
        }
        // For trending and popular, prioritize items with matching categories
        if (category === "trending") {
          const aIsCrypto = a.category.toLowerCase() === "cryptocurrency";
          const bIsCrypto = b.category.toLowerCase() === "cryptocurrency";
          if (aIsCrypto !== bIsCrypto) return bIsCrypto ? 1 : -1;
        }
        if (category === "popular") {
          const aIsTech = a.category.toLowerCase() === "technology";
          const bIsTech = b.category.toLowerCase() === "technology";
          if (aIsTech !== bIsTech) return bIsTech ? 1 : -1;
        }
        return (b.timestamp || 0) - (a.timestamp || 0);
      })
      .slice(0, 2);
  }

  if (loading) {
    return (
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Newspaper className="h-5 w-5" />
            Crypto News & Insights
          </CardTitle>
          <CardDescription>Loading news data...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Newspaper className="h-5 w-5" />
            Crypto News & Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <Button 
            variant="outline" 
            className="mt-4 w-full" 
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="col-span-1">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
            <Newspaper className="h-4 w-4 sm:h-5 sm:w-5" />
            Crypto News & Insights
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">Latest cryptocurrency news and updates</CardDescription>
        </div>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/news" className="flex items-center gap-1 text-xs sm:text-sm">
            <span>Details</span>
            <ExternalLink className="h-3 w-3" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {newsItems.length > 0 ? (
          <Tabs defaultValue="trending" className="space-y-3 sm:space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="trending" className="text-[10px] sm:text-sm">Trending</TabsTrigger>
              <TabsTrigger value="latest" className="text-[10px] sm:text-sm">Latest</TabsTrigger>
              <TabsTrigger value="popular" className="text-[10px] sm:text-sm">Popular</TabsTrigger>
            </TabsList>

            {["trending", "latest", "popular"].map((category) => (
              <TabsContent key={category} value={category} className="space-y-3 sm:space-y-4">
                {getNewsByCategory(category).length > 0 ? (
                  getNewsByCategory(category).map((news) => (
                    <div key={news.id} className="border-b pb-2 sm:pb-4 last:border-0 last:pb-0">
                      <div className="flex items-start justify-between gap-1.5 sm:gap-2">
                        <div className="space-y-0.5 sm:space-y-1">
                          <h4 className="font-medium text-xs sm:text-base line-clamp-2">{news.title}</h4>
                          <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-muted-foreground">
                            <span>{news.source}</span>
                            <span>•</span>
                            <span>{news.time}</span>
                          </div>
                        </div>
                        <a
                          href={news.url}
                          className="shrink-0 text-muted-foreground hover:text-foreground"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4" />
                        </a>
                      </div>
                      {news.category && (
                        <Badge variant="outline" className="mt-1.5 sm:mt-2 text-[10px] sm:text-xs">
                          {news.category}
                        </Badge>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="py-4 sm:py-8 text-center text-muted-foreground text-xs sm:text-base">
                    No {category} news available
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        ) : (
          <div className="flex flex-col items-center justify-center h-[150px] sm:h-[300px] text-muted-foreground">
            <Newspaper className="h-6 w-6 sm:h-10 sm:w-10 mb-2 opacity-50" />
            <p className="text-xs sm:text-base">No news data available</p>
            <Button variant="outline" size="sm" className="mt-2 sm:mt-4 text-xs sm:text-sm" onClick={() => window.location.reload()}>
              Retry
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

