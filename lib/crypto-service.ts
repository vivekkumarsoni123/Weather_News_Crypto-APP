import { formatDistanceToNow } from 'date-fns';
import { formatCurrency } from "@/lib/utils"

export type CryptoData = {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  marketCap: number;
  volume24h: number;
  lastUpdated: string;
  priceHistory?: Array<{
    time: string;
    price: number;
  }>;
  volume?: string;
};

const BASE_URL = 'https://api.coingecko.com/api/v3';
const BINANCE_WS_URL = 'wss://stream.binance.com:9443/ws';

// Store WebSocket connections
const wsConnections: { [key: string]: WebSocket } = {};

// Mock data for SSR
const mockCryptoData: CryptoData[] = [
  {
    id: '1',
    symbol: 'BTC',
    name: 'Bitcoin',
    price: 0,
    change24h: 0,
    marketCap: 0,
    volume24h: 0,
    lastUpdated: 'Loading...',
  },
  {
    id: '1027',
    symbol: 'ETH',
    name: 'Ethereum',
    price: 0,
    change24h: 0,
    marketCap: 0,
    volume24h: 0,
    lastUpdated: 'Loading...',
  },
];

export async function getCryptoData(limit: number = 10): Promise<CryptoData[]> {
  // Return mock data during SSR
  if (typeof window === 'undefined') {
    return mockCryptoData.slice(0, limit);
  }

  try {
    const response = await fetch(
      `${BASE_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&page=1&sparkline=false`,
      {
        next: { revalidate: 60 }, // Revalidate every minute
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Crypto API Error:', errorText);
      throw new Error('Failed to fetch crypto data');
    }

    const data = await response.json();
    console.log('API Response:', data); // Debug log

    // Initialize WebSocket connections for each crypto
    data.forEach((crypto: any) => {
      const symbol = crypto.symbol.toUpperCase();
      if (!wsConnections[symbol]) {
        setupWebSocket(symbol);
      }
    });

    return data.map((crypto: any) => ({
      id: crypto.id,
      symbol: crypto.symbol.toUpperCase(),
      name: crypto.name,
      price: crypto.current_price,
      change24h: crypto.price_change_percentage_24h,
      marketCap: crypto.market_cap,
      volume24h: crypto.total_volume,
      lastUpdated: formatDistanceToNow(new Date(crypto.last_updated), { addSuffix: true }),
      volume: formatCurrency(crypto.total_volume),
      priceHistory: Array.from({ length: 24 }, (_, i) => ({
        time: `${i}:00`,
        price: crypto.current_price * (1 + (Math.random() - 0.5) * 0.1),
      })),
    }));
  } catch (error) {
    console.error('Error fetching crypto data:', error);
    throw error;
  }
}

function setupWebSocket(symbol: string) {
  if (typeof window === 'undefined') return;

  // Close existing connection if it exists
  if (wsConnections[symbol]) {
    wsConnections[symbol].close();
  }

  const ws = new WebSocket(`${BINANCE_WS_URL}/${symbol.toLowerCase()}usdt@ticker`);
  wsConnections[symbol] = ws;

  ws.onopen = () => {
    console.log(`WebSocket connected for ${symbol}`);
  };

  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      const priceElement = document.getElementById(`price-${symbol}`);
      if (priceElement) {
        priceElement.textContent = formatCurrency(parseFloat(data.c));
      }
    } catch (error) {
      console.error(`Error processing WebSocket message for ${symbol}:`, error);
    }
  };

  ws.onerror = (event: Event) => {
    // Log detailed error information
    console.error(`WebSocket error for ${symbol}:`, {
      type: event.type,
      timestamp: new Date().toISOString(),
      symbol,
      error: event instanceof ErrorEvent ? event.message : 'Unknown error',
      readyState: ws.readyState,
      url: ws.url
    });

    // Handle specific error cases
    if (event instanceof ErrorEvent) {
      console.error(`Error details for ${symbol}:`, {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error
      });
    }

    // Attempt to reconnect after a delay
    setTimeout(() => {
      if (wsConnections[symbol]) {
        console.log(`Attempting to reconnect WebSocket for ${symbol}...`);
        setupWebSocket(symbol);
      }
    }, 5000); // Retry after 5 seconds
  };

  ws.onclose = (event) => {
    console.log(`WebSocket closed for ${symbol}`, {
      code: event.code,
      reason: event.reason,
      wasClean: event.wasClean,
      timestamp: new Date().toISOString()
    });

    // Only attempt to reconnect if the connection was not intentionally closed
    if (wsConnections[symbol] && event.code !== 1000) {
      console.log(`Attempting to reconnect WebSocket for ${symbol}...`);
      setTimeout(() => setupWebSocket(symbol), 5000);
    }
  };
}

export function cleanupWebSockets() {
  Object.entries(wsConnections).forEach(([symbol, ws]) => {
    try {
      ws.close(1000, 'Cleanup');
      delete wsConnections[symbol];
    } catch (error) {
      console.error(`Error closing WebSocket for ${symbol}:`, error);
    }
  });
}

export async function getCryptoDetails(id: string): Promise<CryptoData> {
  // Return mock data during SSR
  if (typeof window === 'undefined') {
    return mockCryptoData[0];
  }

  try {
    const response = await fetch(
      `${BASE_URL}/coins/${id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`,
      {
        next: { revalidate: 60 }, // Revalidate every minute
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Crypto API Error:', errorText);
      throw new Error('Failed to fetch crypto details');
    }

    const data = await response.json();
    const marketData = data.market_data;

    // Setup WebSocket for this specific crypto
    const symbol = data.symbol.toUpperCase();
    if (!wsConnections[symbol]) {
      setupWebSocket(symbol);
    }

    return {
      id: data.id,
      symbol: symbol,
      name: data.name,
      price: marketData.current_price.usd,
      change24h: marketData.price_change_percentage_24h,
      marketCap: marketData.market_cap.usd,
      volume24h: marketData.total_volume.usd,
      lastUpdated: formatDistanceToNow(new Date(data.last_updated), { addSuffix: true }),
      volume: formatCurrency(marketData.total_volume.usd),
      priceHistory: Array.from({ length: 24 }, (_, i) => ({
        time: `${i}:00`,
        price: marketData.current_price.usd * (1 + (Math.random() - 0.5) * 0.1),
      })),
    };
  } catch (error) {
    console.error('Error fetching crypto details:', error);
    throw error;
  }
}
