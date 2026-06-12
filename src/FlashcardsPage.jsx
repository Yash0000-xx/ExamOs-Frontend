import React, { useState, useEffect } from 'react';
import { fetchData, postData, patchData } from './api.js'; // 🔗 Bring in the master API bridge!

export default function Flashcards() {
  const [metaTree, setMetaTree] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [currentCards, setCurrentCards] = useState([]);
  const [generating, setGenerating] = useState(false);
  const [activeCardIdx, setActiveCardIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const loadFlashcardMeta = async () => {
    try {
      // 🌐 Use the central API bridge! 
      const resData = await fetchData('flashcards/meta');
      if (resData && resData.success) {
        setMetaTree(resData.data);
      }
    } catch (err) {
      console.error("Failed loading flashcards meta framework:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFlashcardMeta();
  }, []);

  const handleSelectTopic = (topic) => {
    setSelectedTopic(topic);
    setCurrentCards(topic.flashcards || []);
    setActiveCardIdx(0);
    setIsFlipped(false);
  };

  const handleGenerateCards = async () => {
    if (!selectedTopic) return;
    setGenerating(true);
    try {
      // 🌐 Use the API bridge for clean POST requests
      const result = await postData('flashcards/generate', { 
        topicId: selectedTopic.id, 
        topicName: selectedTopic.name 
      });
      
      if (result && result.success) {
        setCurrentCards(result.data);
        loadFlashcardMeta(); 
      }
    } catch (err) {
      console.error("Flashcards compilation loop failure:", err);
    } finally {
      setGenerating(false);
    }
  };

  const handleToggleMemorized = async (cardId) => {
    try {
      // 🌐 Use the API bridge for PATCH requests
      const response = await patchData(`flashcards/${cardId}/toggle`);
      
      // If the interceptor didn't throw an error, the request succeeded
      if (response) {
        setCurrentCards(prev => prev.map(c => c.id === cardId ? { ...c, isMemorized: !c.isMemorized } : c));
      }
    } catch (err) {
      console.error("Failed adjusting flag state:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[var(--bg-workspace)]">
        <div className="h-10 w-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-[var(--text-secondary)] text-sm font-medium">Assembling active recall matrices...</p>
      </div>
    );
  }

  return (
    <div className="p-8 bg-[var(--bg-workspace)] min-h-screen text-[var(--text-primary)] w-full flex flex-col md:flex-row gap-8 transition-colors duration-200">
      
      {/* LEFT PANEL: Navigator Hierarchy */}
      <div className="w-full md:w-80 shrink-0 bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-2xl p-4 max-h-[85vh] overflow-y-auto custom-scrollbar transition-colors duration-200">
        <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--text-secondary)] px-2 mb-4">Study Classrooms</h2>
        {metaTree.length === 0 ? (
          <p className="text-xs text-[var(--text-secondary)] italic p-2">Upload a syllabus workspace to activate review decks.</p>
        ) : (
          <div className="space-y-4">
            {metaTree.map((subject) => (
              <div key={subject.id} className="space-y-1">
                <h3 className="text-xs font-bold text-purple-500 font-mono px-2">{subject.name}</h3>
                {subject.chapters?.map(chapter => (
                  <div key={chapter.id} className="pl-2 pt-1 space-y-0.5">
                    {chapter.topics?.map(topic => (
                      <button
                        key={topic.id}
                        onClick={() => handleSelectTopic(topic)}
                        className={`w-full text-left text-xs px-3 py-2 rounded-lg transition border flex justify-between items-center ${
                          selectedTopic?.id === topic.id 
                            ? 'bg-purple-500/10 text-purple-500 border-purple-500/30 font-semibold' 
                            : 'text-[var(--text-secondary)] border-transparent hover:bg-[var(--bg-input)] hover:text-[var(--text-primary)]'
                        }`}
                      >
                        <span className="truncate mr-2">💡 {topic.name}</span>
                        <span className="text-[10px] font-mono bg-[var(--bg-input)] border border-[var(--border-primary)] px-1.5 py-0.5 rounded text-[var(--text-secondary)] shrink-0">
                          {topic.flashcards?.length || 0}
                        </span>
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* RIGHT PANEL: Study Desk View */}
      <div className="flex-1 bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-2xl p-6 min-h-[50vh] flex flex-col items-center justify-center transition-colors duration-200">
        {!selectedTopic ? (
          <div className="text-center text-[var(--text-secondary)]">
            <span className="text-4xl">🎴</span>
            <p className="text-sm mt-3 italic max-w-xs mx-auto">Select an active concept topic node from the sidebar map to slide up your active recall cards.</p>
          </div>
        ) : currentCards.length === 0 ? (
          <div className="text-center max-w-sm">
            <h3 className="text-base font-bold text-[var(--text-primary)] mb-1">Deck Container Empty</h3>
            <p className="text-xs text-[var(--text-secondary)] mb-6">No study decks generated for "{selectedTopic.name}" yet.</p>
            <button
              onClick={handleGenerateCards}
              disabled={generating}
              className="bg-purple-600 hover:bg-purple-500 text-white font-medium text-xs px-5 py-2.5 rounded-xl transition shadow-lg shadow-purple-900/30 disabled:opacity-50"
            >
              {generating ? 'Drafting Cards via AI Engine...' : '⚡ Generate Active Recall Flashcards'}
            </button>
          </div>
        ) : (
          <div className="w-full max-w-lg flex flex-col items-center">
            
            {/* Top Deck Metric Markers */}
            <div className="w-full flex justify-between items-center text-xs text-[var(--text-secondary)] mb-4 px-2 font-medium">
              <span>Topic Deck: <span className="text-purple-500 font-semibold">{selectedTopic.name}</span></span>
              <span>{activeCardIdx + 1} of {currentCards.length} Cards</span>
            </div>

            {/* Core Interactive Card Body Container */}
            <div 
              onClick={() => setIsFlipped(!isFlipped)}
              className={`w-full h-64 border rounded-2xl p-6 shadow-2xl cursor-pointer transition-all duration-300 flex flex-col items-center justify-center text-center relative ${
                isFlipped 
                  ? 'bg-purple-500/5 border-purple-500/40 text-purple-500' 
                  : 'bg-[var(--bg-input)] border-[var(--border-primary)] text-[var(--text-primary)] hover:border-purple-500/40'
              }`}
            >
              <span className="absolute top-3 right-4 font-mono text-[9px] uppercase tracking-widest text-[var(--text-secondary)] font-bold bg-[var(--bg-card)] border border-[var(--border-primary)] px-2 py-0.5 rounded">
                {isFlipped ? 'Answer View' : 'Question Node'}
              </span>
              
              <p className="text-base font-medium leading-relaxed max-w-md select-none">
                {isFlipped ? currentCards[activeCardIdx].answer : currentCards[activeCardIdx].question}
              </p>
              
              <span className="absolute bottom-3 text-[10px] text-[var(--text-secondary)] font-medium select-none animate-pulse">
                🔄 Click card face to flip view
              </span>
            </div>

            {/* Bottom Stepper Controllers Toolbar */}
            <div className="w-full flex justify-between items-center mt-6 gap-4">
              <button
                onClick={() => handleToggleMemorized(currentCards[activeCardIdx].id)}
                className={`text-xs px-4 py-2 rounded-xl border transition font-medium ${
                  currentCards[activeCardIdx].isMemorized
                    ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                    : 'bg-[var(--bg-input)] text-[var(--text-secondary)] border-[var(--border-primary)] hover:text-[var(--text-primary)]'
                }`}
              >
                {currentCards[activeCardIdx].isMemorized ? '✓ Memorized' : '👁 Mark as Memorized'}
              </button>

              <div className="flex items-center space-x-2">
                <button
                  disabled={activeCardIdx === 0}
                  onClick={(e) => { e.stopPropagation(); setActiveCardIdx(p => p - 1); setIsFlipped(false); }}
                  className="bg-[var(--bg-input)] border border-[var(--border-primary)] hover:bg-[var(--bg-card)] text-[var(--text-primary)] text-sm p-2 rounded-lg transition disabled:opacity-30"
                >
                  ◀
                </button>
                <button
                  disabled={activeCardIdx === currentCards.length - 1}
                  onClick={(e) => { e.stopPropagation(); setActiveCardIdx(p => p + 1); setIsFlipped(false); }}
                  className="bg-[var(--bg-input)] border border-[var(--border-primary)] hover:bg-[var(--bg-card)] text-[var(--text-primary)] text-sm p-2 rounded-lg transition disabled:opacity-30"
                >
                  ▶
                </button>
              </div>
            </div>

          </div>
        )}
      </div>

    </div>
  );
}