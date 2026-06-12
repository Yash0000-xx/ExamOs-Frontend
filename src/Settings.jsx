import React, { useState, useEffect } from 'react';

export default function Settings({ onLogout }) {
  const studentName = localStorage.getItem('examos-user-name') || 'Active Student';
  
  const [activeTheme, setActiveTheme] = useState(localStorage.getItem('examos-theme-preset') || 'obsidian-midnight');

  const handleApplyThemeMatrix = (themeKey) => {
    setActiveTheme(themeKey);
    localStorage.setItem('examos-theme-preset', themeKey);
    
    const root = document.documentElement;
    root.classList.remove('theme-obsidian', 'theme-light-mode');
    
    if (themeKey === 'obsidian-midnight') {
      root.classList.add('theme-obsidian');
      root.style.setProperty('--bg-workspace', '#0a0f1d');
      root.style.setProperty('--bg-card', '#0f1422');
      root.style.setProperty('--bg-input', '#141a2e');
      root.style.setProperty('--text-primary', '#ffffff');
      root.style.setProperty('--text-secondary', '#94a3b8');
      root.style.setProperty('--border-primary', '#1e293b');
    } else if (themeKey === 'crisp-light') {
      root.classList.add('theme-light-mode');
      root.style.setProperty('--bg-workspace', '#f8fafc');
      root.style.setProperty('--bg-card', '#ffffff');
      root.style.setProperty('--bg-input', '#f1f5f9');
      root.style.setProperty('--text-primary', '#0f172a');
      root.style.setProperty('--text-secondary', '#475569');
      root.style.setProperty('--border-primary', '#e2e8f0');
    }
  };

  useEffect(() => {
    handleApplyThemeMatrix(activeTheme);
  }, []);

  const handleResetOnboardingWizard = () => {
    if (window.confirm("Do you want to reset your onboarding status? This lets you re-run the setup wizard to upload a brand-new syllabus file for another semester.")) {
      localStorage.removeItem('examos-setup-done');
      window.location.reload(); 
    }
  };

  const handleNuclearSystemReset = () => {
    if (window.confirm("🚨 WARNING: This will completely wipe your local browser login tokens, cached themes, and session configurations. Proceed?")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="p-8 bg-[var(--bg-workspace)] min-h-screen text-[var(--text-primary)] w-full transition-colors duration-200">
      
      <div className="mb-10 max-w-3xl">
        <h1 className="text-3xl font-bold tracking-tight">System Settings</h1>
        <p className="text-[var(--text-secondary)] text-sm mt-1">Manage your active authentication session parameters, appearance properties, and local database cache states.</p>
      </div>

      <div className="space-y-6 max-w-3xl">
        
        {/* 👤 1. USER PROFILE PROFILE */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-2xl p-6 shadow-xl flex flex-wrap justify-between items-center gap-4 transition-colors duration-200">
          <div>
            <p className="text-[10px] font-bold text-purple-400 uppercase tracking-widest mb-1">Active Core Profile</p>
            <h3 className="text-lg font-bold">{studentName}</h3>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">Terminal authenticated session key is currently online.</p>
          </div>
          
          <button
            onClick={onLogout}
            className="bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 text-xs font-bold px-4 py-2 rounded-xl transition"
          >
            Log Out Account 🚪
          </button>
        </div>

        {/* 🌓 2. THEME SELECTION PANEL */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-2xl p-6 shadow-xl transition-colors duration-200">
          <p className="text-[10px] font-bold text-purple-400 uppercase tracking-widest mb-1">Workspace Appearance</p>
          <h3 className="text-base font-bold mb-4">Core Layout Profiles</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Obsidian Dark Card Preview */}
            <div 
              onClick={() => handleApplyThemeMatrix('obsidian-midnight')}
              className={`p-4 rounded-xl border cursor-pointer transition flex justify-between items-center bg-[#0f1422] ${activeTheme === 'obsidian-midnight' ? 'border-purple-500 ring-1 ring-purple-500/30' : 'border-gray-800 hover:border-gray-700'}`}
            >
              <div>
                <p className="text-xs font-bold text-white">Obsidian Midnight</p>
                <p className="text-[10px] text-gray-500 font-medium mt-0.5">Deep Cyber Core (Dark)</p>
              </div>
              <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${activeTheme === 'obsidian-midnight' ? 'border-purple-500 bg-purple-600' : 'border-gray-700'}`}>
                {activeTheme === 'obsidian-midnight' && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
              </div>
            </div>

            {/* Crisp Light Card Preview */}
            <div 
              onClick={() => handleApplyThemeMatrix('crisp-light')}
              className={`p-4 rounded-xl border cursor-pointer transition flex justify-between items-center bg-white border-slate-200 hover:bg-slate-50 ${activeTheme === 'crisp-light' ? 'border-indigo-600 ring-1 ring-indigo-500/20' : 'border-slate-300'}`}
            >
              <div>
                <p className="text-xs font-bold text-slate-900">Crisp Light Mode</p>
                <p className="text-[10px] text-slate-500 font-medium mt-0.5">High Contrast Chalk (Light)</p>
              </div>
              <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${activeTheme === 'crisp-light' ? 'border-indigo-600 bg-indigo-600' : 'border-slate-300'}`}>
                {activeTheme === 'crisp-light' && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
              </div>
            </div>

          </div>
        </div>

        {/* ⚙️ 3. DATA UTILITIES */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-2xl p-6 shadow-xl transition-colors duration-200">
          <p className="text-[10px] font-bold text-purple-400 uppercase tracking-widest mb-1">System Utilities</p>
          <h3 className="text-base font-bold mb-4">Data Maintenance Operations</h3>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center bg-[var(--bg-input)] p-4 rounded-xl border border-[var(--border-primary)] gap-4 transition-colors duration-200">
              <div>
                <p className="text-xs font-bold">Re-run Onboarding Setup Wizard</p>
                <p className="text-[10px] text-[var(--text-secondary)] mt-0.5">Clears out your setup token status so you can upload a new course syllabus structure cleanly.</p>
              </div>
              <button
                onClick={handleResetOnboardingWizard}
                className="bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/20 text-[11px] font-semibold px-3 py-1.5 rounded-xl transition shrink-0"
              >
                Reset Setup State
              </button>
            </div>

            <div className="flex justify-between items-center bg-[var(--bg-input)] p-4 rounded-xl border border-[var(--border-primary)] gap-4 transition-colors duration-200">
              <div>
                <p className="text-xs font-bold text-red-500">Nuclear Local Storage Purge</p>
                <p className="text-[10px] text-[var(--text-secondary)] mt-0.5">Instantly clear browser cache parameters, user configurations, and layout selections.</p>
              </div>
              <button
                onClick={handleNuclearSystemReset}
                className="bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 text-[11px] font-semibold px-3 py-1.5 rounded-xl transition shrink-0"
              >
                Clear Local Cache
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}