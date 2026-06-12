import React from 'react';

export default function Sidebar({ currentPage, setCurrentPage, onLogout }) {
  
  // 🎨 High-fidelity inline SVG icon maps for every single module node
  const iconMatrix = {
    'Dashboard': <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" /></svg>,
    'Subjects': <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>,
    // 🎯 NEW: Added Workspace Icon right below Subjects
    'Workspace': <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>,
    'Analytics': <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10a2 2 0 01-2 2h-2a2 2 0 01-2-2zm9 0v-4a2 2 0 00-2-2h-2a2 2 0 00-2 2v4a2 2 0 002 2h2a2 2 0 002-2z" /></svg>,
    'Flashcards': <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>,
    'Revision': <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    'Panic Mode': <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
    'Quiz Arena': <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>,
    'Notes Arena': <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>,
    'Settings': <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
  };

  return (
    <div className="w-64 h-screen sticky top-0 bg-[var(--bg-card)] border-r border-[var(--border-primary)] p-5 flex flex-col justify-between transition-all duration-200 shrink-0 font-sans select-none">
      
      {/* LOGO WRAPPER */}
      <div>
        <div className="flex items-center gap-3 px-2 mt-2 mb-8">
          <div className="h-7 w-7 bg-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-purple-500/20">
            <span className="text-white font-black text-sm">Ω</span>
          </div>
          <span className="text-lg font-bold tracking-tight text-[var(--text-primary)]">
            Exam<span className="text-purple-500">OS</span>
          </span>
        </div>
        
        {/* NAVIGATION LINKS */}
        <nav className="space-y-1">
          {Object.keys(iconMatrix).map((item) => {
            const isActive = currentPage === item;
            return (
              <div 
                key={item} 
                onClick={() => setCurrentPage(item)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer font-medium text-sm transition-all duration-150 group relative
                  ${isActive 
                    ? 'bg-purple-600/10 text-purple-500 font-semibold' 
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-input)]'
                  }`}
              >
                {isActive && (
                  <div className="absolute left-0 top-3 bottom-3 w-1 bg-purple-500 rounded-r-md"></div>
                )}
                
                <div className={`transition-transform duration-150 group-hover:scale-105 ${isActive ? 'text-purple-500' : 'text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]'}`}>
                  {iconMatrix[item]}
                </div>

                <span>{item}</span>
              </div>
            );
          })}
        </nav>
      </div>

      {/* DISCONNECT TRUNCATE CORE BUTTON */}
      <div className="border-t border-[var(--border-primary)] pt-4 pb-2">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] hover:text-red-500 px-4 py-3 rounded-xl hover:bg-red-500/5 border border-transparent hover:border-red-500/10 transition-all duration-150"
          title="Sign out of active platform session keys safely"
        >
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l4-4m-4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Disconnect Core
        </button>
      </div>

    </div>
  );
}