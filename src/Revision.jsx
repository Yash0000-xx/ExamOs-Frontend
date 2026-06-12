import React, { useState, useEffect } from 'react';
import { fetchData, postData } from './api.js'; // 🔗 Bring in the master API bridge!

export default function Revision() {
  const [deck, setDeck] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [sessionMinutes, setSessionMinutes] = useState(0);
  const [cardsReviewedCount, setCardsReviewedCount] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);
  const [savingLog, setSavingLog] = useState(false);

  useEffect(() => {
    const internalTicker = setInterval(() => {
      setSessionMinutes(prev => prev + 1);
    }, 60000);

    // 🌐 Use the API bridge!
    fetchData('revision/quiz').then(resData => {
      if (resData) setDeck(resData.data || []);
      setLoading(false);
    }).catch(err => {
      console.error("Failed downloading operational review streams:", err);
      setLoading(false);
    });

    return () => clearInterval(internalTicker);
  }, []);

  const handleScoreCard = async (gotCorrect) => {
    const activeCard = deck[currentIdx];
    setCardsReviewedCount(prev => prev + 1);

    try {
      // 🌐 Use the API bridge for POST requests!
      await postData(`revision/card/${activeCard.id}/review`, { gotCorrect });
    } catch (err) {
      console.error("Failed to sync card interval progression state:", err);
    }

    if (!gotCorrect) {
      setDeck(prevDeck => [...prevDeck, { ...activeCard }]);
    }

    if (currentIdx < deck.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setShowAnswer(false);
    } else {
      setQuizComplete(true);
    }
  };

  const handleSyncSessionMetrics = async () => {
    setSavingLog(true);
    try {
      const logMinutes = sessionMinutes === 0 ? 1 : sessionMinutes;
      // 🌐 Use the API bridge!
      const response = await postData('revision/session', { minutes: logMinutes });
      
      if (response) {
        alert(`🎯 Session logged! Syncing ${logMinutes} minute(s) directly to your Analytics tracking boards.`);
        window.location.reload();
      }
    } catch (err) {
      console.error("Failed submitting logs:", err);
    } finally {
      setSavingLog(false);
    }
  };

  const boxIndicators = {
    1: { name: 'Box 1: High Rotation', style: 'bg-red-500/10 border-red-500/20 text-red-500' },
    2: { name: 'Box 2: Intermediate', style: 'bg-amber-500/10 border-amber-500/20 text-amber-500' },
    3: { name: 'Box 3: Near Mastery', style: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-500' }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[var(--bg-workspace)]">
        <div className="h-10 w-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-[var(--text-secondary)] text-sm font-medium">Assembling adaptive active recall review vectors...</p>
      </div>
    );
  }

  if (deck.length === 0) {
    return (
      <div className="p-8 bg-[var(--bg-workspace)] min-h-screen text-[var(--text-primary)] w-full flex flex-col items-center justify-center text-center transition-colors duration-200">
        <span className="text-5xl">🛡️</span>
        <h2 className="text-xl font-bold mt-4 text-emerald-500">Review Vault Clear</h2>
        <p className="text-[var(--text-secondary)] text-xs max-w-sm mt-1.5 leading-relaxed">
          Amazing work. Every single card in your database has been graduated to Mastered status. No pending review loops are currently scheduled.
        </p>
      </div>
    );
  }

  const currentCard = deck[currentIdx];
  const activeBox = boxIndicators[currentCard?.leitnerBox] || boxIndicators[1];

  return (
    <div className="p-8 bg-[var(--bg-workspace)] min-h-screen text-[var(--text-primary)] w-full flex flex-col items-center transition-colors duration-200">
      <div className="w-full max-w-2xl flex justify-between items-center mb-10 border-b border-[var(--border-primary)] pb-4">
        <div>
          <h1 className="text-2xl font-bold">Revision Arena</h1>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">Spaced repetition simulator adjusting card frequency based on memory performance.</p>
        </div>
        <div className="flex space-x-3 text-xs font-mono font-bold">
          <span className="bg-purple-500/10 text-purple-500 border border-purple-500/20 px-3 py-1 rounded-md">
            ⏱️ Active Time: {sessionMinutes}m
          </span>
        </div>
      </div>

      {!quizComplete ? (
        <div className="w-full max-w-xl bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-2xl p-6 shadow-xl flex flex-col items-center transition-colors duration-200">
          <div className="w-full flex justify-between items-center text-[11px] font-medium text-[var(--text-secondary)] mb-6 font-mono">
            <span>Concept Match: <span className="text-purple-500">{currentCard.topic?.name}</span></span>
            <span className={`px-2 py-0.5 border rounded text-[10px] font-bold uppercase tracking-wide ${activeBox.style}`}>
              {activeBox.name}
            </span>
          </div>

          <div className="w-full h-56 bg-[var(--bg-input)] border border-[var(--border-primary)] rounded-xl p-6 flex flex-col items-center justify-center text-center relative mb-8 transition-colors duration-200">
            <p className="text-base font-semibold leading-relaxed max-w-md select-none">
              {showAnswer ? currentCard.answer : currentCard.question}
            </p>
            <span className="absolute bottom-3 text-[9px] font-mono uppercase tracking-widest text-[var(--text-secondary)] font-bold">
              {showAnswer ? "Showing Extracted Answer Core" : "Active Recall Target Question Node"}
            </span>
          </div>

          {!showAnswer ? (
            <button
              onClick={() => setShowAnswer(true)}
              className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs py-3 rounded-xl transition shadow-lg shadow-purple-900/20"
            >
              Reveal Database Answer 🔄
            </button>
          ) : (
            <div className="w-full grid grid-cols-2 gap-4">
              <button
                onClick={() => handleScoreCard(false)}
                className="bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 font-bold text-xs py-3 rounded-xl transition flex flex-col items-center justify-center"
              >
                <span>❌ Got it Wrong</span>
                <span className="text-[9px] font-normal opacity-60 mt-0.5">(Requeues to back of list)</span>
              </button>
              <button
                onClick={() => handleScoreCard(true)}
                className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 border border-emerald-500/20 font-bold text-xs py-3 rounded-xl transition flex flex-col items-center justify-center"
              >
                <span>✓ Got it Right</span>
                <span className="text-[9px] font-normal opacity-60 mt-0.5">(Promotes Box Level)</span>
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="w-full max-w-md bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-2xl p-6 text-center shadow-xl transition-colors duration-200">
          <span className="text-4xl">🏆</span>
          <h2 className="text-lg font-bold text-[var(--text-primary)] mt-3">Active Review Passed</h2>
          <p className="text-xs text-[var(--text-secondary)] mt-1">Review interval parameters updated securely.</p>
          <div className="grid grid-cols-2 gap-4 my-6 bg-[var(--bg-input)] border border-[var(--border-primary)] p-4 rounded-xl text-center font-mono transition-colors duration-200">
            <div>
              <p className="text-[10px] text-[var(--text-secondary)] font-bold uppercase tracking-wide">Total Attempts</p>
              <p className="text-xl font-bold text-purple-500 mt-1">{cardsReviewedCount} Hits</p>
            </div>
            <div>
              <p className="text-[10px] text-[var(--text-secondary)] font-bold uppercase tracking-wide">Session Duration</p>
              <p className="text-xl font-bold text-amber-500 mt-1">{sessionMinutes === 0 ? 1 : sessionMinutes} min(s)</p>
            </div>
          </div>
          <button
            onClick={handleSyncSessionMetrics}
            disabled={savingLog}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white disabled:opacity-40 font-bold text-xs py-3 rounded-xl transition tracking-wide shadow-lg"
          >
            {savingLog ? 'Syncing to Analytics Database...' : '💾 Log Study Minutes and Return'}
          </button>
        </div>
      )}
    </div>
  );
}