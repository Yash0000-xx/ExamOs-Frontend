import React, { useState, useEffect } from 'react';
import { fetchData } from './api.js';

// 🎯 FIX: Accept 'setCurrentPage' as a prop at the top
// 🎯 FIX: Add setActiveDocumentId here
export default function Workspace({ setCurrentPage, setActiveDocumentId }) {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWorkspaceData();
  }, []);

  const fetchWorkspaceData = async () => {
    try {
      const result = await fetchData('workspace');
      if (result && result.data) {
        setMaterials(result.data);
      } else {
        console.error("Failed to fetch workspace data");
      }
    } catch (err) {
      console.error("Network error fetching workspace:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-[var(--bg-workspace)] min-h-screen text-[var(--text-primary)] w-full transition-colors duration-200">
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight">My Workspace</h1>
        <p className="text-[var(--text-secondary)] text-sm mt-1">
          Your personal vault of AI-generated study materials, secured in the cloud.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
        </div>
      ) : materials.length === 0 ? (
        <div className="bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-2xl p-16 text-center text-[var(--text-secondary)] shadow-xl transition-colors duration-200">
          <span className="text-5xl opacity-50 mb-4 block">🗄️</span>
          <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">Workspace is Empty</h3>
          <p className="text-sm">Head over to the Notes Arena or Quiz Arena to generate and save your first study asset.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {materials.map((item) => (
            <div 
              key={item._id} 
              className="bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-2xl p-6 shadow-lg hover:border-purple-500/50 transition-all cursor-pointer flex flex-col h-full transition-colors duration-200"
            >
              <div className="flex justify-between items-start mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
                  ${item.type === 'notes' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 
                    'bg-orange-500/10 text-orange-400 border border-orange-500/20'}`}
                >
                  {item.type}
                </span>
                <span className="text-xs text-[var(--text-secondary)]">
                  {new Date(item.createdAt).toLocaleDateString()}
                </span>
              </div>
              
              <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2 line-clamp-2">
                {item.title}
              </h3>
              
              <p className="text-sm text-[var(--text-secondary)] line-clamp-3 mb-6 flex-grow">
                {item.type === 'notes' 
                  ? item.content.substring(0, 150) + "..." 
                  : `Contains ${item.content.length} generated questions for review.`}
              </p>

              {/* 🎯 FIX: The button now uses your State engine to change pages! */}
              <button 
                onClick={() => {
                  setActiveDocumentId(item._id);
                  if (item.type === 'notes') {
                    setCurrentPage('Notes Arena');
                  } else {
                    setCurrentPage('Quiz Arena');
                  }
                }}
                className="w-full bg-[var(--bg-input)] hover:bg-purple-600/20 text-purple-400 hover:text-purple-300 border border-[var(--border-primary)] hover:border-purple-500 font-semibold text-sm py-2.5 rounded-xl transition active:scale-95"
              >
                Open {item.type === 'notes' ? 'Notes' : 'Quiz'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}