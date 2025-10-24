# Quick Listicle

A simple web application to save and remember your favorite websites using a Chrome extension.

## Features

- 🌐 Save websites via Chrome extension
- 📱 View your saved sites in a clean, minimal interface
- ☁️ Cloud storage with Upstash Redis
- 🚀 Deployed on Vercel

## Architecture

- **Frontend**: Next.js 14 with React
- **Backend**: Next.js API Routes
- **Database**: Upstash Redis (optional)
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 20+ 
- npm or yarn

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/coolstoryjoe/Quick-Listicle.git
cd Quick-Listicle
```

2. Install dependencies:
```bash
npm install
```

3. (Optional) Set up Upstash Redis:
   - Create a free account at [Upstash](https://upstash.com)
   - Create a new Redis database
   - Copy the credentials

4. (Optional) Create a `.env.local` file with your Redis credentials:
```env
KV_REST_API_URL=your_redis_url
KV_REST_API_TOKEN=your_redis_token
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000)

**Note**: The app works without Redis configuration. If Redis is not configured, the UI will display a helpful message explaining how to set it up.

## Deployment to Vercel

### Option 1: Deploy Without Backend (Frontend Only)

The app has been designed to work gracefully without Redis. Simply deploy to Vercel:

```bash
npm run build  # Test the build locally first
```

Then push to GitHub and connect to Vercel. The app will deploy successfully and show:
- ✅ Clean, functional UI
- ✅ Instructions for setting up the backend
- ✅ No build errors

### Option 2: Deploy With Full Backend

1. Set up Upstash Redis (if you haven't already)

2. Add environment variables in Vercel:
   - Go to your project settings in Vercel
   - Navigate to "Environment Variables"
   - Add:
     - `KV_REST_API_URL`
     - `KV_REST_API_TOKEN`

3. Redeploy your application

4. The backend will now be fully functional!

## Troubleshooting Vercel Deployments

### Build Failures

If builds are failing on Vercel:

1. **Missing Environment Variables**: The app now handles this gracefully. Builds will succeed even without Redis configured.

2. **Check Build Logs**: Go to your Vercel dashboard → Deployments → Click on the failed deployment → View logs

3. **Test Locally**: Run `npm run build` locally to verify it builds successfully

### 404 Errors

If you're seeing 404 errors:

1. **Check Routes**: Ensure your Next.js app structure is correct (app directory)
2. **Verify Deployment**: Check the Vercel dashboard to ensure the deployment completed
3. **Custom Domain**: If using a custom domain, verify DNS settings

### API Errors

If the API is returning errors:

1. **No Redis Configured**: The app will show a friendly warning and still work (frontend-only mode)
2. **Redis Connection Issues**: Check that your Upstash credentials are correct in Vercel environment variables
3. **CORS Issues**: Not applicable for this Next.js setup (same origin)

## Project Structure

```
Quick-Listicle/
├── src/
│   └── app/
│       ├── api/
│       │   └── sites/
│       │       └── route.ts      # API endpoints (GET, POST)
│       ├── page.tsx               # Main UI
│       ├── layout.tsx             # Root layout
│       └── globals.css            # Global styles
├── extension/                      # Chrome extension files
│   ├── manifest.json
│   ├── popup.html
│   └── popup.js
├── public/                         # Static assets
└── package.json
```

## Chrome Extension

The Chrome extension allows you to save websites while browsing:

1. Load the extension in Chrome:
   - Go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `extension` folder

2. Click the extension icon on any website to save it

## Recent Changes (v0.1.1)

### Frontend Decoupling
- ✅ App now works without Redis backend
- ✅ Graceful error handling for missing environment variables
- ✅ Clear UI messaging when backend is not configured
- ✅ Successful builds even without Redis

### Why This Matters
Previously, the app would fail to build or show errors if Redis wasn't configured. Now:
- The frontend always deploys successfully
- Users can see the UI and understand what's needed
- Backend can be added later without redeploying the frontend

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)
