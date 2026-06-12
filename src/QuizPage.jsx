import React, { useState } from 'react';
import { uploadFiles } from './api.js'; // 🔗 Master API bridge for uploads

export default function QuizPage() {
  const [file, setFile] = useState(null);
  const [quizConfig, setQuizConfig] = useState({ count: 5, type: 'mcq' }); 
  const [activeQuizMeta, setActiveQuizMeta] = useState(null);

  const [generating, setGenerating] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files[0]) setFile(e.target.files[0]);
  };

  const handleUploadAndGenerate = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please attach a valid study text or notes document first.");

    setGenerating(true);
    setQuizQuestions([]);
    setUserAnswers({});
    setQuizSubmitted(false);
    setActiveQuizMeta(null);

    const formData = new FormData();
    formData.append('document', file);
    formData.append('questionCount', quizConfig.count);
    formData.append('questionType', quizConfig.type);

    try {
      // 🌐 Use uploadFiles helper for the multi-part form data
      const result = await uploadFiles('quiz/generate', formData);
      
      if (result) {
        setQuizQuestions(result.data);
        setActiveQuizMeta(result.meta);
      }
    } catch (err) {
      console.error(err);
      alert("Network processing engine timeout or server error.");
    } finally {
      setGenerating(false);
    }
  };

  const handleAnswerInput = (qIdx, value) => {
    if (quizSubmitted) return;
    setUserAnswers(prev => ({ ...prev, [qIdx]: value }));
  };

  const calculateMCQScore = () => {
    let score = 0;
    quizQuestions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correctIndex) score++;
    });
    return score;
  };

  return (
    <div className="p-8 bg-[var(--bg-workspace)] min-h-screen text-[var(--text-primary)] w-full transition-colors duration-200">
      <div className="mb-10 max-w-3xl">
        <h1 className="text-3xl font-bold tracking-tight">AI Quiz Arena</h1>
        <p className="text-[var(--text-secondary)] text-sm mt-1">Configure your parameters and drop your notes to compile dynamic, adaptive mock examinations.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl">
        
        <div className="space-y-6">
          <div className="bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-2xl p-6 shadow-xl">
            <h3 className="text-sm font-bold text-purple-500 uppercase tracking-wider mb-4">Exam Parameters</h3>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="text-xs font-bold text-[var(--text-secondary)] block mb-2">Question Count</label>
                <div className="flex bg-[var(--bg-input)] rounded-lg p-1 border border-[var(--border-primary)]">
                  {[5, 10, 15].map(num => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setQuizConfig(prev => ({ ...prev, count: num }))}
                      className={`flex-1 py-1.5 text-xs font-bold rounded-md transition ${quizConfig.count === num ? 'bg-purple-500 text-white shadow-md' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[var(--text-secondary)] block mb-2">Examination Format</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setQuizConfig(prev => ({ ...prev, type: 'mcq' }))}
                    className={`py-2 px-3 text-xs font-bold rounded-xl border transition ${quizConfig.type === 'mcq' ? 'bg-purple-500/10 border-purple-500 text-purple-500' : 'bg-[var(--bg-input)] border-[var(--border-primary)] text-[var(--text-secondary)] hover:border-purple-500/40'}`}
                  >
                    Multiple Choice
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuizConfig(prev => ({ ...prev, type: 'subjective' }))}
                    className={`py-2 px-3 text-xs font-bold rounded-xl border transition ${quizConfig.type === 'subjective' ? 'bg-purple-500/10 border-purple-500 text-purple-500' : 'bg-[var(--bg-input)] border-[var(--border-primary)] text-[var(--text-secondary)] hover:border-purple-500/40'}`}
                  >
                    Subjective Written
                  </button>
                </div>
              </div>
            </div>

            <h3 className="text-sm font-bold text-purple-500 uppercase tracking-wider mb-4 border-t border-[var(--border-primary)] pt-6">Context Injector</h3>
            <form onSubmit={handleUploadAndGenerate} className="space-y-4">
              <div className="border-2 border-dashed border-[var(--border-primary)] rounded-xl p-4 bg-[var(--bg-input)] text-center cursor-pointer relative group hover:border-purple-500/40 transition">
                <input type="file" accept=".pdf,.txt" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                <span className="text-2xl">📄</span>
                <p className="text-xs font-medium text-[var(--text-primary)] mt-2 truncate">{file ? file.name : "Choose PDF / Text file"}</p>
              </div>
              <button
                type="submit"
                disabled={generating}
                className="w-full bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white font-bold text-xs py-3 rounded-xl transition shadow-lg"
              >
                {generating ? "Parsing Groq Inferences..." : "⚡ Compile Examination"}
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          {quizQuestions.length === 0 ? (
            <div className="bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-2xl p-12 text-center text-[var(--text-secondary)] shadow-xl">
              <span className="text-4xl">🎯</span>
              <p className="text-sm mt-3 italic max-w-xs mx-auto">Set your parameters and upload notes to stream live customized testing frames onto your workspace desk.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {quizQuestions.map((q, qIdx) => (
                <div key={qIdx} className="bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-2xl p-6 shadow-md">
                  <h4 className="text-sm font-bold leading-relaxed mb-4 text-[var(--text-primary)]">Q{qIdx + 1}: {q.question}</h4>
                  
                  {activeQuizMeta?.type === 'mcq' ? (
                    <div className="space-y-2">
                      {q.options.map((opt, optIdx) => {
                        const isSelected = userAnswers[qIdx] === optIdx;
                        const isCorrect = q.correctIndex === optIdx;
                        let optionStyle = "bg-[var(--bg-input)] border-[var(--border-primary)] hover:border-purple-500/30";
                        
                        if (isSelected) optionStyle = "bg-purple-500/10 border-purple-500 text-purple-500 font-semibold";
                        if (quizSubmitted) {
                          if (isCorrect) optionStyle = "bg-emerald-500/10 border-emerald-500 text-emerald-500 font-semibold";
                          else if (isSelected && !isCorrect) optionStyle = "bg-red-500/10 border-red-500 text-red-500";
                        }
                        return (
                          <button
                            key={optIdx}
                            disabled={quizSubmitted}
                            onClick={() => handleAnswerInput(qIdx, optIdx)}
                            className={`w-full text-left text-xs p-3.5 rounded-xl border text-[var(--text-primary)] transition flex items-center gap-3 ${optionStyle}`}
                          >
                            <span className="w-5 h-5 rounded-full bg-[var(--bg-card)] border border-[var(--border-primary)] flex items-center justify-center text-[10px] font-mono shrink-0 font-bold">{optIdx + 1}</span>
                            {opt}
                          </button>
                        );
                      })}
                      {quizSubmitted && (
                        <p className="text-xs text-[var(--text-secondary)] bg-[var(--bg-input)] border border-[var(--border-primary)] p-3 rounded-xl mt-4 leading-relaxed"><span className="text-purple-500 font-bold">Explanation:</span> {q.explanation}</p>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <textarea
                        disabled={quizSubmitted}
                        placeholder="Draft your engineering response here..."
                        value={userAnswers[qIdx] || ""}
                        onChange={(e) => handleAnswerInput(qIdx, e.target.value)}
                        className="w-full h-32 bg-[var(--bg-input)] border border-[var(--border-primary)] rounded-xl p-4 text-xs text-[var(--text-primary)] focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition resize-none custom-scrollbar"
                      />
                      {quizSubmitted && (
                        <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4 mt-4">
                          <h5 className="text-xs font-bold text-emerald-500 uppercase tracking-widest mb-2">Ideal Grading Rubric</h5>
                          <p className="text-xs text-[var(--text-primary)] leading-relaxed mb-4">{q.expectedAnswer}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}

              {!quizSubmitted ? (
                <button
                  onClick={() => setQuizSubmitted(true)}
                  disabled={Object.keys(userAnswers).length < quizQuestions.length && activeQuizMeta?.type === 'mcq'}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-3.5 rounded-xl transition shadow-lg"
                >
                  {activeQuizMeta?.type === 'mcq' ? "Submit Answers & Evaluate" : "Reveal Grading Rubrics for Self-Evaluation"}
                </button>
              ) : (
                <div className="bg-[var(--bg-card)] border border-[var(--border-primary)] p-6 rounded-2xl text-center shadow-xl">
                  <span className="text-3xl">🏆</span>
                  <h3 className="text-lg font-bold mt-2">Evaluation Phase Complete</h3>
                  {activeQuizMeta?.type === 'mcq' ? (
                    <p className="text-2xl font-black text-purple-500 mt-2">{calculateMCQScore()} / {quizQuestions.length} Correct</p>
                  ) : (
                    <p className="text-sm font-medium text-emerald-500 mt-2">Compare your written drafts against the official rubrics above.</p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}