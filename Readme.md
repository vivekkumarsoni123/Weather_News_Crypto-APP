# Crypto Weather Dashboard

A modern, responsive dashboard that combines real-time cryptocurrency data with weather information. Built with Next.js, TypeScript, and Tailwind CSS.

## Live Demo

Visit the live dashboard at: [https://crypto-weather-dashboard.vercel.app](https://crypto-weather-dashboard.vercel.app)

## Features

- **Real-time Cryptocurrency Data**
  - Live price updates via WebSocket
  - 24-hour price history charts
  - Market cap and volume information
  - Price change indicators
  - Top cryptocurrencies tracking

- **Weather Information**
  - Multi-city weather tracking
  - Temperature and humidity data
  - Weather condition icons
  - Hourly forecast charts
  - Precipitation forecasts

- **News & Insights**
  - Cryptocurrency news feed
  - Market trends and analysis
  - Category-based filtering
  - Real-time updates

- **Modern UI/UX**
  - Responsive design for all screen sizes
  - Dark/light mode support
  - Interactive charts and graphs
  - Clean and intuitive interface

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Charts**: Recharts
- **Data Fetching**: 
  - Coinmarketcap API for cryptocurrency data
  - OpenWeatherMap API for weather data
  - NewsData.io API for news

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn
- API keys for:
  - Coinmarketcap API
  - OpenWeatherMap API
  - NewsData.io API

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/crypto-weather-dashboard.git
cd crypto-weather-dashboard
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file in the root directory and add your API keys:
```env
NEXT_PUBLIC_WEATHER_API_KEY=your_openweathermap_api_key
NEXT_PUBLIC_CRYPTO_API_KEY=your_coinmarketcap_api_key
NEXT_PUBLIC_NEWS_API_KEY=your_newsdata_api_key
```

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
crypto-weather-dashboard/
├── app/
│   ├── api/           # API routes
│   ├── crypto/        # Crypto dashboard page
│   ├── weather/       # Weather dashboard page
│   └── layout.tsx     # Root layout
├── components/
│   ├── ui/           # Reusable UI components
│   ├── crypto-panel.tsx
│   ├── weather-panel.tsx
│   └── news-panel.tsx
├── lib/
│   ├── crypto-service.ts
│   ├── weather-service.ts
│   └── news-service.ts
└── public/           # Static assets
```

## API Integration

### Coinmarketcap API
- Used for cryptocurrency price data
- WebSocket connection for real-time updates
- Rate limiting: 10,000 credits/month
- Alternative APIs:
  - CoinGecko API (free tier available)
  - Binance API (no API key required for basic endpoints)

### OpenWeatherMap API
- Weather data for multiple cities
- Current conditions and forecasts
- Rate limiting: 60 calls/minute
- Alternative APIs:
  - WeatherAPI.com
  - Tomorrow.io
  - AccuWeather API

### NewsData.io API
- Cryptocurrency news and market insights
- Category-based filtering
- Rate limiting: 200 calls/day
- Alternative APIs:
  - CryptoCompare News API
  - CryptoPanic API
  - Alpha Vantage News API

## Development Challenges & Solutions

1. **Real-time Data Updates**
   - Challenge: Maintaining WebSocket connections for multiple cryptocurrencies
   - Solution: Implemented connection pooling and automatic reconnection logic

2. **API Rate Limiting**
   - Challenge: Managing multiple API rate limits
   - Solution: Implemented request queuing and caching strategies

3. **Responsive Design**
   - Challenge: Optimizing charts for mobile devices
   - Solution: Created responsive chart components with dynamic sizing

4. **Data Synchronization**
   - Challenge: Keeping multiple data sources in sync
   - Solution: Implemented a centralized state management system

## Resources & Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [CoinCap WebSocket Documentation](https://docs.coincap.io/)
- [OpenWeatherMap API Documentation](https://openweathermap.org/api)
- [Coinmarketcap API Documentation](https://coinmarketcap.com/api/)
- [NewsData.io Documentation](https://newsdata.io/)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Coinmarketcap](https://coinmarketcap.com/) for cryptocurrency data
- [OpenWeatherMap](https://openweathermap.org/) for weather data
- [NewsData.io](https://newsdata.io/) for news data
- [shadcn/ui](https://ui.shadcn.com/) for UI components
- [Recharts](https://recharts.org/) for charting library 
