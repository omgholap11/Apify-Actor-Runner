# Apify Integration Backend

A robust Node.js backend for integrating with the Apify platform, built with Express.js and designed to work with a React frontend.

## 🚀 Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment:**
   - Copy `.env.example` to `.env` (or use the existing `.env`)
   - Configure your environment variables

3. **Start the server:**
   ```bash
   npm start
   # or for development with auto-reload:
   npm run dev
   ```

4. **Test the setup:**
   ```bash
   node test.js
   ```

The server will start on `http://localhost:5000`

## 🏗️ Architecture

### Project Structure
```
Backend/
├── index.js              # Main server file
├── package.json          # Dependencies and scripts
├── .env                  # Environment variables
├── test.js              # Test script
├── API_DOCUMENTATION.md # Complete API docs
├── routes/              # API routes
│   ├── actors.js        # Actor listing and details
│   ├── schema.js        # Schema fetching with UI hints
│   └── execute.js       # Actor execution
└── utils/
    └── apifyClient.js   # Apify API integration utility
```

### Key Components

1. **Express Server** (`index.js`)
   - Security middleware (Helmet, CORS, Rate limiting)
   - Error handling
   - Route mounting

2. **Apify Client** (`utils/apifyClient.js`)
   - Handles all Apify API communications
   - Error handling and retry logic
   - Run status monitoring

3. **API Routes**
   - `/api/actors` - List and get actor details
   - `/api/schema` - Get actor input schemas with UI hints
   - `/api/execute` - Execute actors and get results

## 🔧 Features

### Core Functionality
- ✅ **Dynamic Actor Loading** - Fetch actors at runtime
- ✅ **Schema Processing** - Convert JSON schemas to UI-friendly format
- ✅ **Single Run Execution** - Execute one actor run per request
- ✅ **Real-time Results** - Wait for completion and return results
- ✅ **Comprehensive Error Handling** - User-friendly error messages

### Security & Performance
- ✅ **Rate Limiting** - 100 requests per 15 minutes
- ✅ **Input Validation** - Schema-based validation
- ✅ **Security Headers** - Helmet.js integration
- ✅ **CORS Configuration** - Frontend integration ready

### Developer Experience
- ✅ **Detailed Logging** - Comprehensive error and debug logs
- ✅ **API Documentation** - Complete endpoint documentation
- ✅ **Test Suite** - Utility and server tests
- ✅ **Environment Configuration** - Flexible configuration

## 🔑 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Server health check |
| GET | `/api/actors` | List user's actors |
| GET | `/api/actors/:id` | Get specific actor details |
| GET | `/api/schema/:id` | Get actor input schema |
| POST | `/api/execute/:id` | Execute actor |
| GET | `/api/execute/status/:runId` | Check run status |

**Authentication:** All endpoints (except `/health`) require `x-api-key` header with a valid Apify API key.

## 🧪 Testing

### Test your setup:
```bash
node test.js
```

### Test with your API key:
```bash
# Replace YOUR_API_KEY with your actual Apify API key
curl -H "x-api-key: YOUR_API_KEY" http://localhost:5000/api/actors
```

### Test actor execution:
```bash
curl -X POST \
  -H "x-api-key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"input":{"startUrls":[{"url":"https://example.com"}]}}' \
  http://localhost:5000/api/execute/ACTOR_ID
```

## 🔄 Integration with Frontend

This backend is designed to work with a React frontend. Key integration points:

1. **CORS Configuration** - Allows requests from `http://localhost:3000`
2. **Error Handling** - Consistent error response format
3. **Schema Processing** - UI-friendly schema with form hints
4. **Authentication** - Secure API key handling

### Frontend Integration Example:
```javascript
// Fetch actors
const response = await fetch('http://localhost:5000/api/actors', {
  headers: {
    'x-api-key': userApiKey
  }
});

// Execute actor
const executeResponse = await fetch(`http://localhost:5000/api/execute/${actorId}`, {
  method: 'POST',
  headers: {
    'x-api-key': userApiKey,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    input: userInput,
    options: { timeout: 300 }
  })
});
```

## 🛠️ Development

### Available Scripts:
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `node test.js` - Run test suite

### Environment Variables:
```env
PORT=5000                              # Server port
NODE_ENV=development                   # Environment mode
FRONTEND_URL=http://localhost:3000     # Frontend URL for CORS
RATE_LIMIT_WINDOW_MS=900000           # Rate limit window
RATE_LIMIT_MAX_REQUESTS=100           # Max requests per window
```

## 📋 Next Steps

1. **Start the backend** - Server is ready to use!
2. **Test with your API key** - Use the curl examples above
3. **Build the React frontend** - Connect to these endpoints
4. **Deploy** - Ready for production deployment

## 🎯 Assignment Requirements Checklist

- ✅ **Dynamic Schema Loading** - Schemas fetched at runtime
- ✅ **Single Run Execution** - One execution per request
- ✅ **Error Handling & Feedback** - Comprehensive error messages
- ✅ **Minimal Dependencies** - Clean, focused solution
- ✅ **Secure API Communication** - Proper authentication handling
- ✅ **Runtime Actor Selection** - No hardcoded definitions

The backend is complete and ready for frontend integration! 🎉
