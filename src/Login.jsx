import React, { useState, useEffect } from 'react';
import { postData } from '../api.js'; // 🔗 Master API bridge

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('123456');
  const [name, setName] = useState('Yash');
  const [isLoading, setIsLoading] = useState(false);

  // 🧹 HOUSEKEEPING: Clear any stale tokens on mount
  useEffect(() => {
    localStorage.removeItem('token');
  }, []);

  const handleRegister = async () => {
    setIsLoading(true);
    try {
      // 🌐 Use centralized API bridge
      const data = await postData('auth/register', { name, email, password });
      if (data) alert("Registration successful! You may now Sign In.");
    } catch (error) {
      alert("Registration failed: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      // 🌐 Use centralized API bridge
      const data = await postData('auth/login', { email, password });
      
      if (data && data.token) {
        localStorage.setItem('token', data.token); // 🔑 Store token for the Interceptor
        onLogin(data.user);
      }
    } catch (error) {
      alert("Login failed. Check your credentials and registration status.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0b0f19] text-white p-6">
      <div className="bg-[#0f1422] p-8 rounded-2xl border border-gray-800 w-full max-w-sm shadow-2xl">
        <h2 className="text-2xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">
          ExamOS Terminal
        </h2>
        
        <input 
          className="w-full p-3 mb-3 bg-[#1a2035] rounded-xl border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-600 transition" 
          placeholder="Email Address" 
          onChange={(e) => setEmail(e.target.value)} 
          value={email}
        />
        
        <input 
          className="w-full p-3 mb-6 bg-[#1a2035] rounded-xl border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-600 transition" 
          placeholder="Password" 
          type="password"
          onChange={(e) => setPassword(e.target.value)} 
          value={password}
        />

        <div className="space-y-3">
          <button 
            onClick={handleLogin} 
            disabled={isLoading}
            className="w-full bg-purple-600 py-3 rounded-xl font-bold hover:bg-purple-500 transition-all active:scale-95 shadow-lg shadow-purple-900/30 disabled:opacity-50"
          >
            {isLoading ? 'Authenticating...' : 'Sign In'}
          </button>
          
          <button 
            onClick={handleRegister} 
            disabled={isLoading}
            className="w-full bg-transparent border border-gray-700 py-3 rounded-xl font-bold hover:bg-gray-800 transition-all disabled:opacity-50"
          >
            Register New Account
          </button>
        </div>
        
        <p className="text-[10px] text-gray-500 text-center mt-6 font-mono">
          © 2026 ExamOS Secure Gateway
        </p>
      </div>
    </div>
  );
}