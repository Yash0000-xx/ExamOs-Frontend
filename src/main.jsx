import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import './App.css';
import { GoogleOAuthProvider } from '@react-oauth/google';

// 🎯 Pulling from Vite's environment management system
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

// Safety check for production deployment
if (!GOOGLE_CLIENT_ID) {
  console.error("🚨 VITE_GOOGLE_CLIENT_ID is missing in environment variables!");
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID || ""}>
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>,
);