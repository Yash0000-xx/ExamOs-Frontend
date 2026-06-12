import React, { useState, useEffect } from 'react';
import { fetchData, postData, patchData, deleteData } from './api.js';

export default function DashboardOverview() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  
  // Pomodoro Timer State
  const [timeLeft, setTimeLeft] = useState(25 * 60); 
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Read personalization contexts
  const enrollmentProfile = localStorage.getItem('examos-enrollment') || 'First-Year Engineering Workspace';
  const branchStream = localStorage.getItem('examos-stream') || 'General Academic Branch';

  const fetchDashboardData = async () => {
    try {
      const data = await fetchData('dashboard/overview');
      if (data) setDashboardData(data);
    } catch (err) {
      console.error("Dashboard synchronization connection break:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Timer Engine Logic
  useEffect(() => {
    let interval;
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    try {
      const data = await postData('dashboard/tasks', { title: newTaskTitle });
      if (data) {
        setNewTaskTitle('');
        fetchDashboardData(); 
      }
    } catch (err) {
      console.error("Task injection protocol failed:", err);
    }
  };

  const handleToggleTask = async (taskId) => {
    setDashboardData(prev => ({
      ...prev,
      tasks: prev.tasks.map(t => t.id === taskId ? { ...t, isDone: !t.isDone } : t)
    }));
    try {
      await patchData(`dashboard/tasks/${taskId}/toggle`);
      fetchDashboardData();
    } catch (err) {
      console.error("Task state inversion failure:", err);
    }
  };

  const handleDeleteTask = async (taskId, e) => {
    e.stopPropagation();
    try {
      await deleteData(`dashboard/tasks/${taskId}`);
      fetchDashboardData();
    } catch (err) {
      console.error("Task purge execution exception:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[var(--bg-workspace)]">
        <div className="h-10 w-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-[var(--text-secondary)] text-sm font-medium font-mono">Calibrating tactical overview...</p>
      </div>
    );
  }

  // 🎯 FIX: Robust fallbacks prevent "undefined Nodes"
  const metrics = dashboardData?.metrics || { 
    currentStreak: 3, // Mock streak for UI testing
    completionRate: 24, // Mock completion for testing
    questionsCount: 0, 
    pendingTasksCount: 0 
  };
  const tasks = dashboardData?.tasks || [];
  const exams = dashboardData?.exams || [];

  let daysLeftText = 'TBD';
  if (exams.length > 0) {
    const nextExamDate = new Date(exams[0].examDate);
    const today = new Date();
    const diffTime = nextExamDate - today;
    
    if (diffTime < 0) {
      daysLeftText = '0';
    } else {
      daysLeftText = Math.ceil(diffTime / (1000 * 60 * 60 * 24)).toString();
    }
  }

  // Tactical Color Logic
  const getReadinessColor = (rate) => {
    if (rate < 30) return 'text-red-500 stroke-red-500';
    if (rate < 70) return 'text-amber-500 stroke-amber-500';
    return 'text-emerald-500 stroke-emerald-500';
  };
  const readinessColorClass = getReadinessColor(metrics.completionRate);

  return (
    <div className="p-6 md:p-8 bg-[var(--bg-workspace)] min-h-screen text-[var(--text-primary)] w-full font-sans">
      
      {/* 🚀 Dynamic Personal Greeting Banner Frame */}
      <div className="mb-8 bg-[#0f1422] border border-purple-500/30 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
        <h1 className="text-3xl font-black tracking-tight mb-2 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">System Operational</h1>
        <p className="text-sm text-purple-400 font-medium flex items-center">
          <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
          Profile Context: <span className="text-white ml-1 font-semibold">{enrollmentProfile}</span> 
          <span className="text-gray-600 mx-2">•</span> {branchStream}
        </p>
      </div>

      {/* 📊 Active Action Hub Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-[var(--bg-card)] border border-[var(--border-primary)] p-5 rounded-xl shadow-md border-t-4 border-t-orange-500">
          <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">Active Focus Streak</p>
          <p className="text-2xl font-black mt-1 text-white flex items-center gap-2">
            🔥 {metrics.currentStreak} Days
          </p>
        </div>
        
        <div className="bg-[var(--bg-card)] border border-[var(--border-primary)] p-5 rounded-xl shadow-md border-t-4 border-t-blue-500">
          <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">Syllabus Coverage</p>
          <p className="text-2xl font-black mt-1 text-white flex items-center gap-2">
            🗺️ {metrics.completionRate}%
          </p>
        </div>

        <div className="bg-[var(--bg-card)] border border-[var(--border-primary)] p-5 rounded-xl shadow-md border-t-4 border-t-indigo-500">
          <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">Pending PYQs</p>
          <p className="text-2xl font-black mt-1 text-white flex items-center gap-2">
            📄 {metrics.questionsCount || 0} Targets
          </p>
        </div>

        <div className="bg-[var(--bg-card)] border border-[var(--border-primary)] p-5 rounded-xl shadow-md border-t-4 border-t-purple-500">
          <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">Active Directives</p>
          <p className="text-2xl font-black mt-1 text-white flex items-center gap-2">
            🎯 {metrics.pendingTasksCount} Goals
          </p>
        </div>
      </div>

      {/* 🏗️ Main Structural Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: Tasks & Exams */}
        <div className="xl:col-span-7 flex flex-col gap-8">
          
          {/* Active Task Matrix */}
          <div className="bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-2xl p-6 shadow-lg h-[450px] flex flex-col relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-purple-500 to-indigo-600"></div>
            <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2 ml-2">
              Action Hub Directives
            </h3>
            
            <form onSubmit={handleAddTask} className="flex gap-2 mb-4 ml-2">
              <input 
                type="text"
                placeholder="Log a priority concept review..."
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                className="flex-1 bg-[var(--bg-input)] border border-[var(--border-primary)] focus:border-purple-500 text-sm px-4 py-3 rounded-xl focus:outline-none transition shadow-inner"
              />
              <button type="submit" className="bg-purple-600 hover:bg-purple-500 text-sm font-bold px-6 py-3 rounded-xl transition shadow-lg shadow-purple-900/50 active:scale-95">
                Deploy
              </button>
            </form>

            <div className="space-y-2 overflow-y-auto flex-1 pr-1 custom-scrollbar ml-2">
              {tasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 opacity-50">
                  <span className="text-4xl mb-3 text-gray-600">⚡</span>
                  <p className="text-sm font-mono">No active directives. Awaiting input.</p>
                </div>
              ) : (
                tasks.map(task => (
                  <div key={task.id} 
                    onClick={() => handleToggleTask(task.id)}
                    className={`group flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all duration-200
                      ${task.isDone ? 'bg-green-900/10 border-green-500/20 opacity-50' : 'bg-[#1a2035] border-gray-700 hover:border-purple-500/60 shadow-md'}
                    `}
                  >
                    <div className="flex items-center gap-4 truncate mr-2">
                      <div className={`w-5 h-5 rounded flex items-center justify-center border shrink-0 transition-colors
                        ${task.isDone ? 'bg-green-500 border-green-500' : 'border-gray-500 group-hover:border-purple-400'}`}
                      >
                        {task.isDone && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                      </div>
                      <span className={`text-sm font-medium truncate tracking-wide ${task.isDone ? 'line-through text-gray-500' : 'text-gray-200'}`}>
                        {task.title}
                      </span>
                    </div>
                    <button onClick={(e) => handleDeleteTask(task.id, e)} className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 p-1.5 transition rounded hover:bg-red-500/10">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Pomodoro & Readiness HUD */}
        <div className="xl:col-span-5 flex flex-col gap-8 h-full">
          
          {/* Readiness HUD */}
          <div className="bg-[var(--bg-card)] p-6 rounded-2xl border border-[var(--border-primary)] shadow-lg relative overflow-hidden h-1/3 min-h-[200px] flex flex-col justify-center">
            <h2 className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2">Combat Readiness</h2>
            
            <div className="flex items-center justify-between mt-2">
              <div className="relative flex items-center justify-center">
                <svg className="w-24 h-24 transform -rotate-90">
                  <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-800" />
                  <circle cx="48" cy="48" r="40" strokeWidth="8" fill="transparent" strokeDasharray="251.2" strokeDashoffset={251.2 - (251.2 * metrics.completionRate) / 100} className={`transition-all duration-1000 ease-out ${readinessColorClass}`} />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className={`text-xl font-black ${readinessColorClass.split(' ')[0]}`}>{metrics.completionRate}%</span>
                </div>
              </div>
              
              <div className="text-right">
                <span className="block text-5xl font-black text-white mb-1 tracking-tighter">{daysLeftText}</span>
                <span className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">Days to Nearest Exam</span>
              </div>
            </div>
          </div>

          {/* Active Pomodoro Engine */}
          <div className={`flex-1 min-h-[250px] bg-[var(--bg-card)] p-6 rounded-2xl border transition-all duration-500 shadow-lg flex flex-col justify-center items-center relative overflow-hidden
            ${isTimerRunning ? 'border-purple-500/50 bg-gradient-to-b from-[#0f1422] to-purple-900/10' : 'border-[var(--border-primary)]'}`}
          >
            {isTimerRunning && <div className="absolute inset-0 bg-purple-500/5 animate-pulse pointer-events-none"></div>}

            <h2 className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2 relative z-10">Deep Work Engine</h2>
            <div className="text-[10px] text-purple-400 font-mono mb-4 relative z-10 bg-purple-900/20 px-3 py-1 rounded-full border border-purple-500/30">25:00 Standard Interval</div>
            
            <div className={`text-7xl font-black font-mono tracking-tight transition-colors duration-300 relative z-10
              ${isTimerRunning ? 'text-white drop-shadow-[0_0_15px_rgba(168,85,247,0.4)]' : 'text-gray-500'}`}
            >
              {formatTime(timeLeft)}
            </div>

            <div className="flex gap-3 mt-8 relative z-10 w-full max-w-[280px]">
              <button 
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className={`flex-1 py-3 rounded-xl font-bold transition-all text-sm tracking-wide ${
                  isTimerRunning ? 'bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20' : 'bg-purple-600 text-white hover:bg-purple-500 shadow-lg shadow-purple-900/50 active:scale-95'
                }`}
              >
                {isTimerRunning ? 'HALT ENGINE' : 'ENGAGE FOCUS'}
              </button>
              
              <button onClick={() => { setIsTimerRunning(false); setTimeLeft(25 * 60); }} className="px-5 py-3 rounded-xl font-bold border border-gray-700 text-gray-400 hover:text-white hover:border-gray-500 transition-all bg-[#1a2035]">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}