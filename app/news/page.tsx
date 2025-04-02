import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ExternalLink, Newspaper, Search, Clock, TrendingUp, Filter, AlertCircle } from "lucide-react"
import { getNewsData } from "@/lib/news-service"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Suspense } from "react"

type NewsItem = {
  id: string
  title: string
  summary: string
  source: string
  time: string
  url: string
  category: string
  image?: string
}

async function NewsContent({ category = "all" }: { category?: string }) {
  try {
    const newsItems = await getNewsData(20, category) // Pass the category to getNewsData

    // For the "all" category, we want to show a featured section and a list section
    if (category === "all") {
      return (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {newsItems.slice(0, 6).map((news) => (
              <NewsCard key={news.id} news={news} />
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Newspaper className="h-5 w-5" />
                Latest Updates
              </CardTitle>
              <CardDescription>Recent cryptocurrency news and articles</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {newsItems.slice(6).map((news) => (
                  <NewsListItem key={news.id} news={news} />
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )
    }

    // For specific categories, show all news items in a grid
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {newsItems.map((news) => (
          <NewsCard key={news.id} news={news} />
        ))}
      </div>
    )
  } catch (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          {error instanceof Error ? error.message : "Failed to load news data"}
        </AlertDescription>
      </Alert>
    )
  }
}

function NewsCard({ news }: { news: NewsItem }) {
  return (
    <Card className="overflow-hidden flex flex-col">
      {news.image && (
        <div className="relative h-48 w-full">
          <img
            src={news.image}
            alt={news.title}
            className="object-cover w-full h-full"
          />
        </div>
      )}
      <CardHeader className={news.image ? "pt-4" : ""}>
        <div className="flex items-center justify-between">
          <Badge variant="outline">{news.category}</Badge>
          <span className="text-xs text-muted-foreground">{news.time}</span>
        </div>
        <CardTitle className="text-lg mt-2">{news.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-sm text-muted-foreground">{news.summary}</p>
      </CardContent>
      <div className="p-4 pt-0 mt-auto flex items-center justify-between">
        <span className="text-sm font-medium">{news.source}</span>
        <Button variant="outline" size="sm" className="gap-1" asChild>
          <a href={news.url} target="_blank" rel="noopener noreferrer">
            Read More
            <ExternalLink className="h-3 w-3 ml-1" />
          </a>
        </Button>
      </div>
    </Card>
  )
}

function NewsListItem({ news }: { news: NewsItem }) {
  return (
    <div className="flex items-start gap-4 border-b pb-4 last:border-0 last:pb-0">
      {news.image && (
        <img
          src={news.image}
          alt={news.title}
          className="object-cover w-20 h-20 rounded-md"
        />
      )}
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <Badge variant="outline">{news.category}</Badge>
          <span className="text-xs text-muted-foreground">{news.time}</span>
        </div>
        <h3 className="font-medium mb-1">{news.title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2">{news.summary}</p>
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs font-medium">{news.source}</span>
          <Button variant="ghost" size="sm" className="h-7 gap-1" asChild>
            <a href={news.url} target="_blank" rel="noopener noreferrer">
              Read
              <ExternalLink className="h-3 w-3" />
            </a>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function NewsPage() {
  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-3xl font-bold">News & Updates</h1>

          <div className="flex items-center gap-2">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search news..." className="pl-8" />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Tabs defaultValue="all" className="space-y-6">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="all">All News</TabsTrigger>
              <TabsTrigger value="crypto">Crypto</TabsTrigger>
              <TabsTrigger value="blockchain">Blockchain</TabsTrigger>
              <TabsTrigger value="defi">DeFi</TabsTrigger>
              <TabsTrigger value="nft">NFTs</TabsTrigger>
              <TabsTrigger value="regulation">Regulation</TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="gap-1">
                <Clock className="h-4 w-4" />
                Latest
              </Button>
              <Button variant="ghost" size="sm" className="gap-1">
                <TrendingUp className="h-4 w-4" />
                Trending
              </Button>
            </div>
          </div>

          {["all", "crypto", "blockchain", "defi", "nft", "regulation"].map((category) => (
            <TabsContent key={category} value={category}>
              <Suspense fallback={<div>Loading news...</div>}>
                <NewsContent category={category} />
              </Suspense>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </DashboardLayout>
  )
}

