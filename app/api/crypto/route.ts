import { NextResponse } from "next/server"
import { fetchWithTimeout } from "@/lib/api-utils"

const CRYPTO_API_KEY = process.env.NEXT_PUBLIC_CRYPTO_API_KEY
const BASE_URL = "https://pro-api.coinmarketcap.com/v1"

export async function GET(request: Request) {
  if (!CRYPTO_API_KEY) {
    return NextResponse.json({ 
      error: "Crypto API key is not configured",
      message: "Please check your environment variables"
    }, { status: 500 })
  }

  const { searchParams } = new URL(request.url)
  const limit = searchParams.get("limit") || "10"
  const convert = searchParams.get("convert") || "USD"

  try {
    const url = `${BASE_URL}/cryptocurrency/listings/latest`
    const data = await fetchWithTimeout(url, {
      headers: {
        "X-CMC_PRO_API_KEY": CRYPTO_API_KEY,
        Accept: "application/json",
      },
      next: { revalidate: 300 }, // Cache for 5 minutes
    })

    return NextResponse.json(data)
  } catch (error) {
    console.error("Crypto API error:", error)
    return NextResponse.json({ 
      error: "Failed to fetch cryptocurrency data",
      message: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}

