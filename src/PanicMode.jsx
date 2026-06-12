import React, { useState, useEffect } from 'react';
import { fetchData } from './api.js'; // 🔗 Master API bridge

export default function PanicMode() {
  const [panicData, setPanicData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [daysLeft, setDaysLeft] = useState(null);

  useEffect(() => {
    const loadPanicStatus = async () => {
      try {
        // 🌐 Use the API bridge! Automatically attaches token and uses correct base URL.
        const data = await fetchData('panic/status');
        
        if (data && data.success) {
          setPanicData(data);
          
          // Calculate live days countdown remaining
          if (data.examTargetDate) {
            const target = new Date(data.examTargetDate);
            const today = new Date();
            const difference = target - today;
            const computedDays = Math.ceil(difference / (1000 * 60 * 60 * 24));
            setDaysLeft(computedDays > 0 ? computedDays : 0);
          }
        }
      } catch (err) {
        console.error("Failed downloading urgent telemetry frames:", err);
      } finally {
        setLoading(false);
      }
    };

    loadPanicStatus();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[var(--bg-workspace)]">
        <div className="h-10 w-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-[var(--text-secondary)] text-sm font-medium font-mono">Scanning imminent deadline targets...</p>
      </div>
    );
  }

  if (!panicData || panicData.panicStatus === "calm") {
    return (
      <div className="p-8 bg-[var(--bg-workspace)] min-h-screen text-[var(--text-primary)] w-full flex flex-col items-center justify-center text-center transition-colors duration-200">
        <span className="text-5xl animate-bounce">🛡️</span>
        <h2 className="text-xl font-bold mt-4 text-emerald-500">System State: Protected</h2>
        <p className="text-[var(--text-secondary)] text-xs max-w-sm mt-1.5 leading-relaxed">
          No imminent university test deadlines are recorded in the database tracking matrix. You are currently clear of panic vectors.
        </p>
      </div>
    );
  }

  return (
    <div className="p-8 bg-[var(--bg-workspace)] min-h-screen text-[var(--text-primary)] w-full transition-colors duration-200">
      
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-amber-500">
          Panic Mode Engine
        </h1>
        <p className="text-[var(--text-secondary)] text-sm mt-1">Automated high-intensity cramming router isolating uncompleted course segments.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl">
        
        {/* COUNTDOWN TICKER COLUMN */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-xl transition-colors duration-200">
          <p className="text-xs font-bold text-red-500 uppercase tracking-widest mb-2">Imminent Threat Profile</p>
          <h2 className="text-xl font-bold text-[var(--text-primary)] truncate max-w-xs">{panicData.examTitle}</h2>
          <p className="text-[11px] font-mono font-medium text-[var(--text-secondary)] mt-0.5 uppercase tracking-wider">{panicData.subjectName}</p>

          <div className="my-8 w-36 h-36 border-2 border-red-500/20 bg-red-500/5 rounded-full flex flex-col items-center justify-center shadow-2xl shadow-red-500/10">
            <span className="text-5xl font-black text-red-500">{daysLeft}</span>
            <span className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider mt-1">Days Left</span>
          </div>

          <span className="text-xs font-mono font-medium bg-red-500/10 text-red-500 border border-red-500/20 px-3 py-1 rounded-md">
            Target Date: {panicData.examTargetDate}
          </span>
        </div>

        {/* HIGH PRIORITY STUDY CONCEPTS HIT-LIST */}
        <div className="lg:col-span-2 bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-2xl p-6 shadow-xl transition-colors duration-200">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-base font-bold text-[var(--text-primary)]">🔥 Tactical Save Targets</h3>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">Uncompleted syllabus blocks belonging to the target test module.</p>
            </div>
            <span className="bg-amber-500/10 text-amber-500 border border-amber-500/20 text-[11px] font-mono font-bold px-2.5 py-1 rounded-md">
              {panicData.incompleteTopics.length} Save Points Remaining
            </span>
          </div>

          {panicData.incompleteTopics.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-[var(--border-primary)] rounded-xl bg-emerald-500/5">
              <p className="text-emerald-500 text-sm font-semibold">Syllabus Complete!</p>
              <p className="text-[var(--text-secondary)] text-xs mt-1">Every sub-topic under this course stream has been marked done.</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1 custom-scrollbar">
              {panicData.incompleteTopics.map((topic) => (
                <div key={topic.id} className="p-4 bg-[var(--bg-input)] border border-[var(--border-primary)] rounded-xl flex justify-between items-center hover:border-purple-500/40 transition duration-150">
                  <div className="truncate mr-4">
                    <h4 className="text-xs font-bold text-[var(--text-primary)] truncate">{topic.name}</h4>
                    <p className="text-[10px] text-[var(--text-secondary)] font-medium truncate mt-0.5">{topic.chapterName}</p>
                  </div>
                  
                  {topic.pyqCount > 0 && (
                    <span className="text-[10px] bg-purple-500/10 text-purple-500 border border-purple-500/20 font-bold px-2 py-0.5 rounded shrink-0">
                      {topic.pyqCount} Live PYQs
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}