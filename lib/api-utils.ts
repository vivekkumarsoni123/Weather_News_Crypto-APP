// Helper functions for API requests
export async function fetchWithTimeout(url: string, options: RequestInit = {}) {
  try {
    // Handle both internal and external URLs
    const absoluteUrl = url.startsWith('http') 
      ? url 
      : url.startsWith('/api/')
        ? new URL(url, process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000').toString()
        : url

    console.log(`Fetching: ${absoluteUrl}`)
    const response = await fetch(absoluteUrl, {
      ...options,
      headers: {
        'Accept': 'application/json',
        ...options.headers,
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      throw new Error(
        `API error: ${response.status} ${response.statusText}${
          errorData?.message ? ` - ${errorData.message}` : ''
        }`
      )
    }

    return response
  } catch (error: any) {
    console.error(`Fetch error: ${error.message || "Unknown error"}`)
    throw error
  }
}

export function formatNumber(num: number, decimals = 2) {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num)
}

export function formatCurrency(num: number, currency = "USD", decimals = 2) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num)
}

export function formatCompactNumber(num: number) {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    compactDisplay: "short",
  }).format(num)
}

export function formatTimeAgo(dateString: string) {
  const date = new Date(dateString)
  const now = new Date()
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  let interval = seconds / 31536000
  if (interval > 1) {
    return Math.floor(interval) + " years ago"
  }

  interval = seconds / 2592000
  if (interval > 1) {
    return Math.floor(interval) + " months ago"
  }

  interval = seconds / 86400
  if (interval > 1) {
    return Math.floor(interval) + " days ago"
  }

  interval = seconds / 3600
  if (interval > 1) {
    return Math.floor(interval) + " hours ago"
  }

  interval = seconds / 60
  if (interval > 1) {
    return Math.floor(interval) + " minutes ago"
  }

  return Math.floor(seconds) + " seconds ago"
}

