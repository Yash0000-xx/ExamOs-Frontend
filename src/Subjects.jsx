import React, { useState, useEffect } from 'react';
import { fetchData, patchData, deleteData } from './api.js'; // 🔗 Bring in the master API bridge!

export default function Subjects({ onTriggerNewOnboarding }) {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeChapterId, setActiveChapterId] = useState(null); 
  
  // Formulas Overlay States
  const [activeFormulaSheet, setActiveFormulaSheet] = useState(null);
  const [compilingFormulas, setCompilingFormulas] = useState(false);
  const [showFormulaModal, setShowFormulaModal] = useState(false);

  const fetchCurriculumTree = async () => {
    try {
      // 🌐 Use the API bridge! It handles the token and URL automatically.
      const result = await fetchData('subjects/tree');
      
      if (result && result.data && result.data.length > 0) {
        setSubjects(result.data);
      } else {
        throw new Error("No live database tree context found.");
      }
    } catch (error) {
      console.log("Engaging sandbox fallback layout mode:", error.message);
      setSubjects([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurriculumTree();
  }, []);

  const handleTriggerFormulaCompiler = async (subjectId) => {
    setCompilingFormulas(true);
    setShowFormulaModal(true);
    try {
      // 🌐 Use the API bridge!
      const result = await fetchData(`formulas/${subjectId}`);
      
      if (result && result.success) {
        setActiveFormulaSheet(result.data);
      }
    } catch (err) {
      console.error("Formula compilation pipeline exception:", err);
    } finally {
      setCompilingFormulas(false);
    }
  };

  const handleCycleConfidence = async (topicId, currentConfidence) => {
    try {
      // 🌐 Use the API bridge for PATCH requests!
      const result = await patchData(`topics/${topicId}/confidence`, { currentConfidence });

      if (result && result.data) {
        setSubjects(prevSubjects => 
          prevSubjects.map(sub => ({
            ...sub,
            chapters: sub.chapters.map(ch => ({
              ...ch,
              topics: ch.topics.map(t => t.id === topicId ? { ...t, confidence: result.data.confidence } : t)
            }))
          }))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteSubject = async (subjectId) => {
    if (!window.confirm("Are you sure you want to permanently delete this subject space?")) return;
    try {
      // 🌐 Use the API bridge for DELETE requests!
      await deleteData(`subjects/${subjectId}`);
      setSubjects((prev) => prev.filter(sub => sub.id !== subjectId));
    } catch (err) { 
      console.error(err); 
    }
  };

  const confidenceStyles = {
    RED: { bg: 'bg-red-950/30 border-red-900/40 text-red-400', label: '🔴 Clueless' },
    YELLOW: { bg: 'bg-amber-950/30 border-amber-900/40 text-amber-400', label: '🟡 Reviewing' },
    GREEN: { bg: 'bg-emerald-950/30 border-emerald-900/40 text-emerald-400', label: '🟢 Mastered' }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#0a0f1d]">
        <div className="h-10 w-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-400 text-sm font-medium">Assembling curriculum hierarchies...</p>
      </div>
    );
  }

  return (
    <div className="p-8 bg-[#0a0f1d] min-h-screen text-white w-full relative">
      
      <div className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4 max-w-5xl">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Curriculum Blueprints</h1>
          <p className="text-gray-400 text-sm mt-1">Explore chapters, fine-tune prioritized concepts, and run formula sheets on demand.</p>
        </div>
        
        <button
          onClick={onTriggerNewOnboarding}
          className="bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition shadow-lg shadow-purple-900/20 active:scale-95 whitespace-nowrap self-start md:self-auto"
        >
          + Import New Syllabus
        </button>
      </div>

      {subjects.length === 0 ? (
        <div className="text-center mt-20 p-8 border border-gray-800 rounded-xl bg-[#0f1422] max-w-md mx-auto">
          <p className="text-gray-400 text-sm">No active subjects tracked inside your environment core.</p>
          <button
            onClick={onTriggerNewOnboarding}
            className="mt-4 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition shadow-lg shadow-purple-900/20"
          >
            Launch Setup Wizard
          </button>
        </div>
      ) : (
        <div className="space-y-12 max-w-5xl">
          {subjects.map((subject) => (
            <div key={subject.id} className="bg-[#0f1422] border border-gray-800 rounded-2xl p-6 shadow-xl">
              
              <div className="flex justify-between items-center border-b border-gray-800 pb-4 mb-6">
                <div>
                  <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">
                    {subject.name}
                  </h2>
                  <p className="text-xs text-gray-500 font-mono mt-0.5">{subject.code}</p>
                </div>
                
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => handleTriggerFormulaCompiler(subject.id)}
                    className="bg-indigo-950/60 hover:bg-indigo-900 text-indigo-400 border border-indigo-800/80 text-xs px-3 py-1.5 rounded-xl font-medium transition"
                  >
                    ⚡ Formula Sheet
                  </button>

                  <button
                    onClick={() => handleDeleteSubject(subject.id)}
                    className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-950/30 rounded-lg transition"
                  >
                    🗑️
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {subject.chapters?.map((chapter) => {
                  const isOpen = activeChapterId === chapter.id;
                  return (
                    <div key={chapter.id} className="border border-gray-800/60 bg-[#141a2e] rounded-xl overflow-hidden transition-all">
                      <button 
                        onClick={() => setActiveChapterId(isOpen ? null : chapter.id)}
                        className="w-full flex justify-between items-center px-5 py-4 text-left hover:bg-[#1a223d] transition-colors focus:outline-none"
                      >
                        <span className="font-semibold text-sm text-gray-200">{chapter.name}</span>
                        <span className="text-xs text-gray-500 font-medium">{chapter.topics?.length || 0} topics 🔽</span>
                      </button>

                      {isOpen && (
                        <div className="border-t border-gray-800 p-5 bg-[#0f1422]/50 space-y-4">
                          {chapter.topics?.map((topic) => {
                            const conf = confidenceStyles[topic.confidence] || confidenceStyles.RED;
                            return (
                              <div key={topic.id} className="p-4 bg-[#161c2e] border border-gray-800/60 rounded-xl">
                                <div className="flex justify-between items-center mb-3">
                                  <div className="flex items-center space-x-2">
                                    <h4 className="text-xs font-bold text-gray-200">Topic: {topic.name}</h4>
                                    {topic.priority === "HIGH" && (
                                      <span className="text-[9px] bg-red-950/40 text-red-400 border border-red-900/50 px-2 py-0.5 rounded tracking-wide font-bold uppercase animate-pulse">🔥 High Yield</span>
                                    )}
                                  </div>
                                  <button
                                    onClick={() => handleCycleConfidence(topic.id, topic.confidence)}
                                    className={`text-[10px] font-mono font-bold px-3 py-1 rounded-md border transition ${conf.bg}`}
                                  >
                                    {conf.label}
                                  </button>
                                </div>
                                
                                <div className="pl-2 space-y-2">
                                  {topic.questions?.map(q => (
                                    <div key={q.id} className="text-sm text-slate-300 flex justify-between items-start gap-4 pt-1">
                                      <p className="leading-relaxed">{q.text}</p>
                                      <span className="text-[10px] bg-purple-950/40 border border-purple-900/60 text-purple-400 font-mono px-2 py-0.5 rounded shrink-0 font-bold">
                                        {q.marksValue || 5} Marks
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

            </div>
          ))}
        </div>
      )}

      {showFormulaModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-6 z-50">
          <div className="bg-[#0f1422] border border-gray-800 w-full max-w-2xl rounded-2xl max-h-[80vh] flex flex-col p-6 shadow-2xl">
            <div className="flex justify-between items-start border-b border-gray-800 pb-4 mb-4">
              <div>
                <h3 className="text-lg font-bold">Compiled Reference Sheet</h3>
                <p className="text-xs text-gray-400">Automated formulation profiles aggregated across active syllabus scopes.</p>
              </div>
              <button 
                onClick={() => { setShowFormulaModal(false); setActiveFormulaSheet(null); }}
                className="text-gray-400 hover:text-white font-bold font-mono text-sm bg-gray-900 border border-gray-800 px-3 py-1 rounded-xl transition"
              >
                Close Terminal
              </button>
            </div>

            <div className="flex-1 overflow-y-auto pr-1 space-y-4 custom-scrollbar min-h-[250px] flex flex-col justify-center">
              {compilingFormulas ? (
                <div className="text-center py-10">
                  <div className="h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-xs text-gray-500 font-medium font-mono">Running core AI extraction algorithms over module metrics...</p>
                </div>
              ) : !activeFormulaSheet ? (
                <p className="text-center text-xs text-gray-500 italic">Failed to assemble formula blocks.</p>
              ) : (
                <div className="space-y-4 pt-2">
                  {activeFormulaSheet.map((item, idx) => (
                    <div key={idx} className="p-4 bg-[#141a2e] border border-gray-800/60 rounded-xl">
                      <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1.5">{item.concept}</h4>
                      <div className="p-3 bg-[#0a0f1d] border border-gray-900 font-mono text-xs text-emerald-400 rounded-lg select-all leading-relaxed">
                        {item.formula}
                      </div>
                      <p className="text-xs text-gray-400 mt-2 font-medium leading-relaxed">{item.explanation}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}