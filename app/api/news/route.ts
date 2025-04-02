import { NextResponse } from "next/server"
import { fetchWithTimeout } from "@/lib/api-utils"

const NEWS_API_KEY = process.env.NEXT_PUBLIC_NEWS_API_KEY
const BASE_URL = "https://newsdata.io/api/1/news"

export async function GET(request: Request) {
  if (!NEWS_API_KEY) {
    return NextResponse.json({ 
      error: "News API key is not configured",
      message: "Please check your environment variables"
    }, { status: 500 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category") || "business"
    const q = searchParams.get("q") || "crypto OR cryptocurrency OR bitcoin OR blockchain"
    const language = searchParams.get("language") || "en"

    const apiSearchParams = new URLSearchParams({
      apikey: NEWS_API_KEY,
      q,
      category,
      language,
    })

    const url = `${BASE_URL}?${apiSearchParams.toString()}`
    const response = await fetchWithTimeout(url)
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      throw new Error(
        `News API error: ${response.status} ${response.statusText}${
          errorData?.message ? ` - ${errorData.message}` : ''
        }`
      )
    }

    const data = await response.json()
    
    if (!data.results || !Array.isArray(data.results)) {
      throw new Error('Invalid response format from News API')
    }

    if (data.results.length === 0) {
      throw new Error('No news articles found for the given query')
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("News API error:", error)
    return NextResponse.json({ 
      error: "Failed to fetch news data",
      message: error instanceof Error ? error.message : "Unknown error",
      details: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
}

