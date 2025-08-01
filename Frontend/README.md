# Apify Integration Frontend

A React + Tailwind CSS frontend for the Apify Integration application. This frontend allows users to authenticate with their Apify API key, view their actors, and interact with the Apify platform through a beautiful, responsive interface.

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- Backend server running on `http://localhost:5000`

### Installation & Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Access the application:**
   - Frontend: `http://localhost:5174` (or port shown in terminal)
   - Make sure backend is running on `http://localhost:5000`

## 🏗️ Project Structure

```
Frontend/
├── src/
│   ├── components/          # React components
│   │   ├── ApiKeyForm.jsx   # API key input form
│   │   ├── ActorsList.jsx   # Actors grid display
│   │   ├── ApiConnectionTest.jsx # Backend connection indicator
│   │   └── index.js         # Component exports
│   ├── services/            # API services
│   │   └── apiService.js    # Backend API integration
│   ├── App.jsx             # Main application component
│   ├── main.jsx            # React entry point
│   └── index.css           # Tailwind CSS + custom styles
├── public/                 # Static assets
├── index.html             # HTML template
├── package.json           # Dependencies and scripts
├── tailwind.config.js     # Tailwind configuration
├── vite.config.js         # Vite configuration
└── README.md              # This file
```

## 🎨 Features

### Current Implementation

✅ **API Key Authentication**
- Secure API key input form
- Client-side format validation
- Beautiful, responsive design

✅ **Actors List Display**
- Grid layout with actor cards
- Search functionality
- Sort by name, popularity, or modified date
- Actor statistics display
- Responsive design for all screen sizes

✅ **Backend Integration**
- Real-time connection status indicator
- Comprehensive error handling
- Loading states and user feedback

✅ **User Experience**
- Clean, modern UI with Tailwind CSS
- Smooth transitions and animations
- Mobile-responsive design
- Intuitive navigation flow

## 🧪 Testing the Application

### With Your Apify API Key:

1. **Start both servers:**
   ```bash
   # Terminal 1 - Backend
   cd Backend && node index.js
   
   # Terminal 2 - Frontend  
   cd Frontend && npm run dev
   ```

2. **Test the flow:**
   - Open `http://localhost:5174`
   - Enter your Apify API key (format: `apify_api_...`)
   - Click "Get My Actors"
   - Browse your actors with search and sort functionality

### API Key Format:
- Must start with `apify_api_`
- Must be at least 10 characters long
- Alphanumeric characters only after the prefix

## 🎯 Current Status

✅ **Phase 1 Complete**: API Key Authentication + Actors List
- Beautiful, responsive UI
- Full backend integration
- Error handling
- Search and sort functionality

🔄 **Ready for Phase 2**: Actor Execution Interface

## 📱 Responsive Design

The application is fully responsive and works on:
- ✅ Desktop (1024px+)
- ✅ Tablet (768px - 1023px)  
- ✅ Mobile (320px - 767px)
