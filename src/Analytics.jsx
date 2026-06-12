import React, { useState, useEffect } from 'react';
import { fetchData } from "./api.js"; // 🔗 Master API bridge

export default function Analytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        // 🌐 Use the API bridge!
        const resData = await fetchData('analytics');
        if (resData && resData.success) {
          setData(resData);
        }
      } catch (err) {
        console.error("Failed gathering metrics:", err);
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[var(--bg-workspace)]">
        <div className="h-10 w-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-[var(--text-secondary)] text-sm font-medium font-mono">Computing live deficit matrices...</p>
      </div>
    );
  }

  const summary = data?.summary || { 
    totalSubjects: 0, totalChapters: 0, totalTopics: 0, completedTopics: 0, 
    totalQuestions: 0, totalStudyMinutes: 0, completionPercentage: 0, globalMarksAtRisk: 0 
  };
  const subjectsList = data?.subjectBreakdown || [];

  return (
    <div className="p-8 bg-[var(--bg-workspace)] min-h-screen text-[var(--text-primary)] w-full transition-colors duration-200">
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight">Performance Analytics</h1>
        <p className="text-[var(--text-secondary)] text-sm mt-1">Live metric indicators running active risk assessments across course branches.</p>
      </div>

      {/* Grid Summary Rows */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10 max-w-5xl">
        <div className="bg-[var(--bg-card)] border border-red-500/30 p-5 rounded-2xl shadow-lg relative overflow-hidden transition-colors duration-200">
          <div className="absolute top-0 left-0 w-full h-1 bg-red-500"></div>
          <p className="text-xs font-bold text-red-500 uppercase tracking-wider">Predicted Marks at Risk</p>
          <p className="text-3xl font-black text-red-500 mt-2">{summary.globalMarksAtRisk} Marks</p>
          <p className="text-[10px] text-[var(--text-secondary)] mt-1 font-medium">Deficit tied to weak / untracked topics</p>
        </div>

        <div className="bg-[var(--bg-card)] border border-[var(--border-primary)] p-5 rounded-2xl shadow-lg transition-colors duration-200">
          <p className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Syllabus Coverage</p>
          <p className="text-3xl font-bold text-emerald-500 mt-2">{summary.completionPercentage}%</p>
          <p className="text-[11px] text-[var(--text-secondary)] mt-1">{summary.completedTopics} of {summary.totalTopics} topics clear</p>
        </div>

        <div className="bg-[var(--bg-card)] border border-[var(--border-primary)] p-5 rounded-2xl shadow-lg transition-colors duration-200">
          <p className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Extracted PYQs</p>
          <p className="text-3xl font-bold text-indigo-500 mt-2">{summary.totalQuestions}</p>
          <p className="text-[11px] text-[var(--text-secondary)] mt-1">Exam items mapped in workspace</p>
        </div>

        <div className="bg-[var(--bg-card)] border border-[var(--border-primary)] p-5 rounded-2xl shadow-lg transition-colors duration-200">
          <p className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Total Focus Time</p>
          <p className="text-3xl font-bold text-amber-500 mt-2">{summary.totalStudyMinutes}m</p>
          <p className="text-[11px] text-[var(--text-secondary)] mt-1">Focus clock time session registers</p>
        </div>
      </div>

      {/* Main Breakdown Section */}
      <div className="max-w-5xl space-y-6">
        <h3 className="text-lg font-bold text-[var(--text-primary)]">Course Risk Analysis Profiles</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {subjectsList.map((subject) => (
            <div key={subject.id} className="bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-2xl p-6 flex flex-col justify-between relative shadow-md transition-colors duration-200">
              {subject.marksAtRisk > 15 && (
                <span className="absolute top-3 right-3 bg-red-500/10 border border-red-500/20 text-red-500 text-[9px] font-bold px-2 py-0.5 rounded font-mono animate-pulse tracking-wide">
                  ⚠️ HIGH RISK AREA
                </span>
              )}
              
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="font-bold text-base text-[var(--text-primary)]">{subject.name}</h4>
                    <p className="text-[11px] text-[var(--text-secondary)] font-mono mt-0.5">{subject.code}</p>
                  </div>
                </div>

                <div className="my-4 bg-[var(--bg-input)] border border-[var(--border-primary)] p-3 rounded-xl flex justify-between items-center transition-colors duration-200">
                  <span className="text-xs text-[var(--text-secondary)] font-medium">Unstudied Marks Deficit:</span>
                  <span className={`text-sm font-bold font-mono ${subject.marksAtRisk > 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                    -{subject.marksAtRisk} M
                  </span>
                </div>

                <div className="my-4">
                  <div className="flex justify-between text-xs mb-1.5 font-medium">
                    <span className="text-[var(--text-secondary)]">Completion Status</span>
                    <span className="text-emerald-500 font-semibold">{subject.completionPercentage}%</span>
                  </div>
                  <div className="w-full bg-[var(--bg-input)] h-2.5 rounded-full border border-[var(--border-primary)] overflow-hidden transition-colors duration-200">
                    <div className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500" style={{ width: `${subject.completionPercentage}%` }}></div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 border-t border-[var(--border-primary)] pt-4 mt-2 text-center text-xs">
                <div>
                  <p className="text-[var(--text-secondary)] font-medium">Chapters</p>
                  <p className="text-sm font-bold text-[var(--text-primary)] mt-0.5">{subject.chaptersCount}</p>
                </div>
                <div>
                  <p className="text-[var(--text-secondary)] font-medium">Total Topics</p>
                  <p className="text-sm font-bold text-[var(--text-primary)] mt-0.5">{subject.topicsCount}</p>
                </div>
                <div>
                  <p className="text-[var(--text-secondary)] font-medium">Completed</p>
                  <p className="text-sm font-bold text-emerald-500 mt-0.5">{subject.completedTopics}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}