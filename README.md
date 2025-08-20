# Dead Click Miner 🎯

A powerful analytics tool for Shopify merchants to identify and debug "dead clicks" - user clicks that don't work or lead anywhere. This helps optimize user experience by finding broken buttons, non-functional links, and other clickable elements that frustrate customers.

## 🌟 Features

### Analytics Dashboard
- **Page Overview**: See which pages have the most dead clicks
- **Detailed Insights**: Drill down to see specific CSS selectors with click counts
- **Polaris UI**: Clean, Shopify-style interface using Shopify Polaris components

### Live Element Testing
- **"Test Selector" Feature**: Click any selector to open your live store
- **Visual Highlighting**: Problematic elements flash with red borders and labels
- **Auto-scroll**: Automatically scrolls to the highlighted element

### Data Collection
- **JavaScript Collector**: Lightweight script tracks dead clicks in real-time
- **Supabase Backend**: Stores click data with timestamps and context
- **RESTful APIs**: Clean endpoints for data retrieval and analysis

## 🚀 How It Works

1. **Data Collection**: A JavaScript collector on your Shopify store tracks clicks on non-functional elements
2. **Data Storage**: Click data (page path, CSS selector, timestamp) is sent to your analytics API
3. **Analytics Dashboard**: View dead clicks organized by page and specific selectors
4. **Live Testing**: Click "Test Selector" to see the exact problematic element highlighted on your store

## 📋 Prerequisites

- Node.js 18+ and npm
- Supabase account and database
- Shopify store (for theme integration)

## ⚙️ Setup Instructions

### 1. Clone and Install

```bash
git clone [your-repo-url]
cd dead_click_miner
npm install
```

### 2. Environment Setup

Create `.env.local` with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_STORE_URL=https://your-store.myshopify.com/
```

### 3. Database Setup

Create a `dead_clicks` table in Supabase:

```sql
CREATE TABLE dead_clicks (
  id BIGSERIAL PRIMARY KEY,
  store_url TEXT NOT NULL,
  page_path TEXT NOT NULL,
  target_selector TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_dead_clicks_page_path ON dead_clicks(page_path);
CREATE INDEX idx_dead_clicks_created_at ON dead_clicks(created_at);
```

### 4. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see the dashboard.

### 5. Shopify Integration

#### Install the Highlighter Script

1. Copy `public/dead-click-highlighter.js` to your Shopify theme's `assets/` folder
2. Add this line to your `layout/theme.liquid` before `</body>`:
   ```liquid
   {{ 'dead-click-highlighter.js' | asset_url | script_tag }}
   ```

#### Install the Click Collector

1. Copy `public/collector.js` to your theme's `assets/` folder
2. Add this to your `layout/theme.liquid` before `</body>`:
   ```liquid
   {{ 'collector.js' | asset_url | script_tag }}
   ```
3. Update the `API_ENDPOINT` in collector.js to point to your deployment

## 🔧 Configuration

### Update Store URL

The store URL is now configured via environment variable. Make sure to set `NEXT_PUBLIC_STORE_URL` in your `.env.local` file.

### Customize Click Detection

Modify `public/collector.js` to adjust which elements are considered "dead clicks" based on your store's behavior.

## 📁 Project Structure

```
dead_click_miner/
├── src/app/
│   ├── api/
│   │   ├── insights/
│   │   │   ├── pages/route.ts      # API: Get pages with click counts
│   │   │   └── selectors/route.ts  # API: Get selectors for a page
│   │   └── track/route.ts          # API: Record dead clicks
│   ├── insights/[...path]/
│   │   └── page.tsx                # Selector details page
│   ├── layout.tsx                  # Root layout with Polaris
│   └── page.tsx                    # Main dashboard
├── src/components/
│   └── PolarisProvider.tsx         # Client-side Polaris wrapper
├── public/
│   ├── collector.js                # Store-side click collector
│   └── dead-click-highlighter.js   # Store-side element highlighter
└── README.md
```

## 🛠️ API Endpoints

### GET `/api/insights/pages`
Returns pages sorted by dead click count.

**Response:**
```json
{
  "data": [
    {
      "page_path": "/products/sneaker",
      "click_count": 15
    }
  ]
}
```

### GET `/api/insights/selectors?path=[page]`
Returns selectors for a specific page sorted by click count.

**Response:**
```json
{
  "data": [
    {
      "target_selector": "#checkout-button",
      "click_count": 8
    }
  ],
  "path": "/products/sneaker"
}
```

### POST `/api/track`
Records a dead click event.

**Request:**
```json
{
  "store_url": "https://store.com",
  "page_path": "/products/item",
  "target_selector": "#broken-button"
}
```

## 🎨 UI Components

Built with **Shopify Polaris** components:
- `Page` - Main page container with navigation
- `Card` - Content sections
- `ResourceList` - Data tables with items
- `Badge` - Click count indicators
- `Button` - "Test Selector" actions

## 🚀 Deployment

### Deploy to Vercel

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Deploy to Other Platforms

The app is a standard Next.js application and can be deployed to:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🔍 Troubleshooting

### Common Issues

**"Element not found" when testing selectors:**
- The element may have been removed from the page
- CSS selectors might be dynamic (generated by JavaScript)
- Try refreshing the store page and testing again

**No dead clicks showing:**
- Verify the collector script is installed on your store
- Check browser console for JavaScript errors
- Ensure API endpoint URL is correct in collector.js

**Polaris styling issues:**
- Verify PolarisProvider is properly wrapping the app
- Check that Inter font is loading correctly

### Debug Mode

Enable console logging in the collector script to see click events in real-time.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙋 Support

- **Issues**: Report bugs or request features via GitHub Issues
- **Documentation**: Check this README and inline code comments
- **Community**: Join discussions in GitHub Discussions

---

**Made with ❤️ for Shopify merchants who want to optimize their customer experience**