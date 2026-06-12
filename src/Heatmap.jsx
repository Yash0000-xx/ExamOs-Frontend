import React, { useState, useEffect } from 'react';
import { fetchData } from './api.js'; // 🔗 Master API bridge

export default function Heatmap() {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHeatmap = async () => {
      try {
        // 🌐 Use the API bridge!
        const data = await fetchData('dashboard/heatmap');
        
        if (data && Array.isArray(data)) {
          // Sort topics by frequency (highest yield first)
          const sortedData = data.sort((a, b) => b.count - a.count);
          setTopics(sortedData);
        }
      } catch (err) {
        console.error("Could not fetch heatmap data", err);
      } finally {
        setLoading(false);
      }
    };

    loadHeatmap();
  }, []);

  // Calculate the highest frequency to determine dynamic scaling
  const maxCount = topics.length > 0 ? Math.max(...topics.map(t => t.count)) : 0;

  const getHeatStyling = (count) => {
    if (maxCount === 0) return { bg: 'bg-gray-800', text: 'text-gray-400', border: 'border-gray-700', label: 'Unknown' };
    const ratio = count / maxCount;
    
    if (ratio >= 0.7) return { bg: 'bg-red-500/10', fill: 'bg-red-500', text: 'text-red-500', border: 'border-red-500/20', label: 'High Yield' };
    if (ratio >= 0.4) return { bg: 'bg-orange-500/10', fill: 'bg-orange-500', text: 'text-orange-400', border: 'border-orange-500/20', label: 'Medium' };
    return { bg: 'bg-blue-500/10', fill: 'bg-blue-500', text: 'text-blue-400', border: 'border-blue-500/20', label: 'Low Yield' };
  };

  return (
    <div className="bg-[var(--bg-card)] p-8 rounded-2xl border border-[var(--border-primary)] shadow-2xl w-full font-sans transition-colors duration-200">
      
      <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-[var(--text-primary)] mb-1">
            PYQ Predictive Heatmap
          </h2>
          <div className="flex items-center gap-2 text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
            Target: RTU First-Semester Theory
          </div>
        </div>
        
        <div className="flex gap-2">
          <span className="px-3 py-1.5 text-xs font-bold bg-red-500/10 text-red-500 border border-red-500/20 rounded-lg">High Yield</span>
          <span className="px-3 py-1.5 text-xs font-bold bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded-lg">Medium</span>
          <span className="px-3 py-1.5 text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-lg">Low Yield</span>
        </div>
      </div>
      
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-16 w-full bg-gray-800/50 animate-pulse rounded-xl border border-gray-800/50"></div>
          ))}
        </div>
      ) : topics.length === 0 ? (
        <div className="py-12 text-center border-2 border-dashed border-gray-800 rounded-xl bg-[#0a0f1d]/50">
          <span className="text-4xl block mb-3 opacity-50">📡</span>
          <p className="text-[var(--text-primary)] font-semibold">Insufficient Data</p>
          <p className="text-sm text-[var(--text-secondary)] mt-1">Upload syllabus or complete quizzes to generate probability metrics.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {topics.map((topic, index) => {
            const style = getHeatStyling(topic.count);
            const probability = Math.min(99, Math.round((topic.count / maxCount) * 90 + 5));
            
            return (
              <div 
                key={topic.name} 
                className={`relative overflow-hidden flex items-center justify-between p-4 rounded-xl border transition-all duration-300 hover:scale-[1.01] cursor-default ${style.bg} ${style.border}`}
              >
                <div 
                  className={`absolute left-0 top-0 bottom-0 opacity-10 transition-all duration-1000 ${style.fill}`}
                  style={{ width: `${(topic.count / maxCount) * 100}%` }}
                ></div>
                
                <div className="relative z-10 flex items-center gap-4">
                  <span className={`text-sm font-black opacity-40 w-4 ${style.text}`}>#{index + 1}</span>
                  <div>
                    <h3 className={`font-bold ${style.text}`}>{topic.name}</h3>
                    <p className="text-xs text-[var(--text-secondary)] mt-0.5 font-mono">
                      Appeared {topic.count} times in DB
                    </p>
                  </div>
                </div>
                
                <div className="relative z-10 flex items-center gap-6 text-right">
                  <div className="hidden sm:block">
                    <span className={`text-[10px] uppercase font-bold tracking-wider opacity-70 block mb-0.5 ${style.text}`}>Status</span>
                    <span className={`text-xs font-bold px-2 py-1 rounded bg-black/20 ${style.text}`}>
                      {style.label}
                    </span>
                  </div>
                  <div className="w-16">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[var(--text-secondary)] block mb-0.5">Prob.</span>
                    <span className="text-lg font-black text-white">{probability}%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}