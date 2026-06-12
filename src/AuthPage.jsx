import React, { useState, useEffect } from 'react';
import { postData } from './api.js'; // 🔗 Bring in the master API bridge!

export default function AuthPage({ onLoginSuccess }) {
  const [isLoginView, setIsLoginView] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // 🎯 BULLETPROOF NATIVE INITIALIZATION GUARD
  useEffect(() => {
    // 🧹 HOUSEKEEPING: Clear any stale tokens if they load the auth page
    localStorage.removeItem('token'); 
    localStorage.removeItem('examos-user-name');

    const renderGoogleButton = () => {
      if (window.google?.accounts?.id) {
        const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
        
        if (!window.examosGoogleInitialized) {
          window.google.accounts.id.initialize({
            client_id: clientId,
            callback: handleGoogleNativeSuccess,
          });
          window.examosGoogleInitialized = true; 
          console.log("🔒 Google Native Identity SDK successfully locked and initialized.");
        }

        const btnContainer = document.getElementById('google-btn-container');
        if (btnContainer) {
          btnContainer.innerHTML = ''; 
          window.google.accounts.id.renderButton(btnContainer, {
            theme: 'filled_dark',
            size: 'large',
            shape: 'pill',
            width: 340,
          });
        }
      }
    };

    if (!document.getElementById('google-gsi-client')) {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.id = 'google-gsi-client';
      script.async = true;
      script.defer = true;
      script.onload = renderGoogleButton;
      document.head.appendChild(script);
    } else {
      renderGoogleButton();
    }
  }, [isLoginView]); 

  const handleGoogleNativeSuccess = async (tokenResponse) => {
    setErrorMessage('');
    try {
      // 🌐 Use the API bridge instead of raw fetch
      const data = await postData('auth/google', { credential: tokenResponse.credential });

      if (data && data.success) {
        localStorage.setItem('token', data.token); // 🎯 FIX: Exact match for the Interceptor!
        localStorage.setItem('examos-user-name', data.user.name);
        onLoginSuccess();
      } else {
        setErrorMessage(data?.error || 'Google token verification refused by server configuration.');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Failed to connect to authentication server endpoint.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    const targetEndpoint = isLoginView ? 'auth/login' : 'auth/register';
    const payload = isLoginView ? { email, password } : { name, email, password };

    try {
      // 🌐 Use the API bridge instead of raw fetch
      const data = await postData(targetEndpoint, payload);

      if (data && data.success) {
        localStorage.setItem('token', data.token); // 🎯 FIX: Exact match for the Interceptor!
        localStorage.setItem('examos-user-name', data.user.name);
        onLoginSuccess();
      } else {
        setErrorMessage(data?.error || 'Authentication parameters validation failed.');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Network authentication gateway connection timeout.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0a0f1d] text-white p-6 w-screen">
      <div className="w-full max-w-md bg-[#0f1422] border border-gray-800 rounded-2xl p-8 shadow-2xl">
        
        <div className="flex items-center space-x-3 justify-center mb-6">
          <div className="h-6 w-6 bg-purple-600 rounded-md"></div>
          <span className="text-lg font-bold font-mono tracking-tight text-gray-200">ExamOS System Gateway</span>
        </div>

        <h2 className="text-2xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400 mb-1">
          {isLoginView ? 'Welcome Back Operator' : 'Register Terminal Node'}
        </h2>
        <p className="text-center text-xs text-gray-500 mb-6">Enter system credentials to gain access parameters.</p>

        {errorMessage && (
          <div className="bg-red-950/40 text-red-400 border border-red-900/50 p-3 rounded-xl text-xs font-medium text-center mb-4">
            ⚠️ {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLoginView && (
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 pl-1">Full Username</label>
              <input 
                type="text" required value={name} onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#141a2e] border border-gray-800 focus:border-purple-500 text-xs px-4 py-2.5 rounded-xl focus:outline-none transition text-gray-200"
                placeholder="e.g., Yash Sharma"
              />
            </div>
          )}
          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 pl-1">Email Account Coordinates</label>
            <input 
              type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#141a2e] border border-gray-800 focus:border-purple-500 text-xs px-4 py-2.5 rounded-xl focus:outline-none transition text-gray-200"
              placeholder="operator@examos.com"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 pl-1">Security Access Token</label>
            <input 
              type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#141a2e] border border-gray-800 focus:border-purple-500 text-xs px-4 py-2.5 rounded-xl focus:outline-none transition text-gray-200"
              placeholder="••••••••••••"
            />
          </div>

          <button type="submit" className="w-full bg-purple-600 hover:bg-purple-500 font-bold text-xs py-3 rounded-xl transition mt-2 shadow-lg shadow-purple-900/20">
            {isLoginView ? 'Initialize Access Terminal 🔑' : 'Construct Account Profile 📦'}
          </button>
        </form>

        <div className="mt-5 space-y-4">
          <div className="flex items-center my-2 text-gray-600 text-[10px] uppercase font-bold tracking-widest">
            <div className="flex-1 border-t border-gray-800"></div>
            <span className="px-3">Or Coordinate via SSO</span>
            <div className="flex-1 border-t border-gray-800"></div>
          </div>
          
          <div className="flex justify-center w-full overflow-hidden rounded-xl min-h-[44px]">
            <div id="google-btn-container" className="w-full flex justify-center"></div>
          </div>
        </div>

        <div className="text-center mt-6 border-t border-gray-800/60 pt-4">
          <button 
            type="button" // 🎯 Added type="button" so it doesn't accidentally submit the form
            onClick={() => { setIsLoginView(!isLoginView); setErrorMessage(''); }}
            className="text-xs text-gray-400 hover:text-purple-400 font-medium transition focus:outline-none"
          >
            {isLoginView ? "Don't have an access node? Register account profile" : 'Already tracked in core registry? Log in securely'}
          </button>
        </div>

      </div>
    </div>
  );
}