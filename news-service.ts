import { formatDistanceToNow, parseISO } from 'date-fns';

export type NewsItem = {
  id: string;
  title: string;
  summary: string;
  source: string;
  time: string;
  url: string;
  category: string;
  image?: string;
  timestamp?: number;
};

type NewsApiResponse = {
  status: string;
  totalResults: number;
  results: Array<{
    article_id: string;
    title: string;
    description: string;
    source_id: string;
    pubDate: string;
    link: string;
    category: string[];
    image_url?: string;
  }>;
};

const API_KEY = process.env.NEXT_PUBLIC_NEWS_API_KEY;
const BASE_URL = 'https://newsdata.io/api/1/news';

const categoryMapping: Record<string, string> = {
  'crypto': 'cryptocurrency',
  'blockchain': 'technology',
  'defi': 'cryptocurrency',
  'nft': 'technology',
  'regulation': 'business'
};

export async function getNewsData(
  limit: number = 10,
  category?: string,
  sortBy: SortOption = 'latest'
): Promise<NewsItem[]> {
  if (!API_KEY) {
    console.error('News API key is not configured');
    throw new Error('News API key is not configured. Please check your environment variables.');
  }

  try {
    // Construct query parameters
    const params = new URLSearchParams({
      apikey: API_KEY,
      language: 'en',
    });

    // Map our categories to NewsAPI categories
    if (category && category !== 'all') {
      params.append('category', categoryMapping[category] || 'cryptocurrency');
    } else {
      params.append('q', 'crypto OR blockchain OR cryptocurrency OR bitcoin');
    }

    // Fetch news from the API
    const response = await fetch(`${BASE_URL}?${params.toString()}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('News API error response:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      throw new Error(`Failed to fetch news data: ${response.status} ${response.statusText}`);
    }

    const data: NewsApiResponse = await response.json();

    if (data.status !== 'success') {
      console.error('News API returned error status:', data);
      throw new Error('API returned an error status');
    }

    if (!data.results || !Array.isArray(data.results)) {
      console.error('Invalid API response format:', data);
      throw new Error('Invalid response format from News API');
    }

    // Transform API response to our NewsItem format
    let newsItems: NewsItem[] = data.results.map(item => {
      const timestamp = parseISO(item.pubDate).getTime();
      return {
        id: item.article_id,
        title: item.title,
        summary: item.description,
        source: item.source_id,
        timestamp,
        time: formatDistanceToNow(timestamp, { addSuffix: true }),
        url: item.link,
        category: item.category[0] || 'general',
        image: item.image_url
      };
    });

    // Sort news items
    if (sortBy === 'latest') {
      newsItems.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
    } else if (sortBy === 'trending') {
      // For trending, we'll still sort by latest as the API doesn't provide trending data
      newsItems.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
    }

    // Return limited number of news items
    return newsItems.slice(0, limit);
  } catch (error) {
    console.error('Error fetching news:', error);
    throw error;
  }
}

type SortOption = 'latest' | 'trending';