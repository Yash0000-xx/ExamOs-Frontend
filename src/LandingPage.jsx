import React, { useState, useEffect } from 'react';
import { motion, animate } from 'framer-motion';
import { Activity, Target, RotateCcw, FunctionSquare, Zap, AlertTriangle, ChevronRight, Terminal } from 'lucide-react';

// 🎯 Custom Hook for the Telemetry Grid Counter Animation
const AnimatedCounter = ({ from, to }) => {
  const [count, setCount] = useState(from);

  useEffect(() => {
    const controls = animate(from, to, {
      duration: 2.5,
      ease: "easeOut",
      onUpdate: (value) => setCount(Math.round(value)),
    });
    return controls.stop;
  }, [from, to]);

  return <span>{count}</span>;
};

export default function LandingPage({ onGetStarted }) {
  return (
    <div className="bg-[#0a0f1d] min-h-screen text-white w-full font-sans selection:bg-purple-500/30 overflow-x-hidden">
      
      {/* 🌌 FLOATING STICKY NAVIGATION */}
      <header className="w-full border-b border-gray-900 bg-[#0a0f1d]/80 backdrop-blur-md sticky top-0 z-50 px-6 lg:px-12 py-4 flex justify-between items-center max-w-7xl mx-auto">
        
        {/* 🎯 FIX: Cleaned up the Tactical Terminal Logo Block */}
        <div className="flex items-center gap-3 group cursor-pointer">
          {/* The Tactical Icon Box */}
          <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-[#0f1422] border border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.2)] group-hover:border-purple-400 group-hover:shadow-[0_0_25px_rgba(168,85,247,0.5)] group-hover:bg-[#141a2e] transition-all duration-300">
            <Terminal className="w-5 h-5 text-purple-400 group-hover:text-purple-300 transition-colors" />
          </div>
          
          {/* Two-Tone Typography */}
          <span className="text-2xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-300">
            Exam<span className="text-purple-500">OS</span><span className="text-gray-500 text-xs tracking-widest ml-1 font-mono">.IO</span>
          </span>
        </div>
        
        <nav className="hidden md:flex items-center gap-8 text-[11px] font-bold uppercase tracking-widest text-gray-400">
          <a href="#metrics" className="hover:text-purple-400 transition">System Status</a>
          <a href="#core-engine" className="hover:text-purple-400 transition">Core Processing</a>
          <a href="#preview" className="hover:text-purple-400 transition">Workspace Blueprint</a>
        </nav>

        <div className="flex items-center gap-4">
          <button onClick={onGetStarted} className="text-xs font-bold text-gray-400 hover:text-white transition">Access Terminal</button>
          <button onClick={onGetStarted} className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 font-bold text-xs px-5 py-2.5 rounded-xl transition shadow-[0_0_15px_rgba(147,51,234,0.3)] hover:shadow-[0_0_25px_rgba(147,51,234,0.5)] active:scale-95">
            Initialize Core
          </button>
        </div>
      </header>

      {/* 🚀 THE TACTICAL HERO PANEL (Now Animated) */}
      <section className="max-w-6xl mx-auto px-6 text-center pt-24 pb-20 flex flex-col items-center relative">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute top-12 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-purple-600/15 blur-[120px] rounded-full pointer-events-none"
        />

        <motion.div 
          initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 bg-purple-950/30 border border-purple-900/50 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest text-purple-400 uppercase mb-8 font-mono"
        >
          <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-ping"></span> AI System Node: Online
        </motion.div>
        
        <motion.h1 
          initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl md:text-7xl font-black tracking-tight max-w-5xl leading-[1.1] text-gray-100"
        >
          Syllabus Ingestion. Past Paper Vectoring. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-400 to-emerald-400">
            Zero Guesswork.
          </span>
        </motion.h1>
        
        <motion.p 
          initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }}
          className="text-gray-300 text-xs md:text-sm max-w-2xl mt-6 leading-relaxed font-medium"
        >
          ExamOS is an intelligent academic command center custom-built to eliminate the uncertainty of exam prep. Drop in your university curriculum PDFs and historical papers to isolate repeated derivation paths, map grading parameters, and instantly close your knowledge gaps.
        </motion.p>

        <motion.div 
          initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 flex flex-wrap gap-4 justify-center z-10"
        >
          <button onClick={onGetStarted} className="group bg-gradient-to-r from-purple-600 to-indigo-600 hover:scale-[1.02] font-bold text-xs px-8 py-4 rounded-xl transition shadow-[0_0_20px_rgba(147,51,234,0.4)] hover:shadow-[0_0_40px_rgba(147,51,234,0.6)] active:scale-95 flex items-center gap-2">
            Deploy Student Workspace <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
          <a href="#core-engine" className="bg-[#0f1422] hover:bg-[#141a2e] hover:border-gray-700 border border-gray-800 font-bold text-xs px-8 py-4 rounded-xl transition flex items-center gap-2">
            Explore Engine Architecture
          </a>
        </motion.div>
      </section>

      {/* 📊 LIVE INTERACTIVE ARCHITECTURE SIMULATION PREVIEW */}
      <motion.section 
        initial={{ y: 40, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.7 }}
        id="preview" className="max-w-5xl mx-auto px-6 mb-32 relative"
      >
        <div className="bg-[#0f1422] border border-gray-800/80 rounded-2xl shadow-2xl overflow-hidden p-6 relative group hover:border-gray-700 transition-colors duration-500">
          <div className="flex items-center justify-between border-b border-gray-800/60 pb-4 mb-6">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500/40"></div>
              <div className="w-3 h-3 rounded-full bg-amber-500/40"></div>
              <div className="w-3 h-3 rounded-full bg-emerald-500/40"></div>
              <span className="text-[11px] font-mono text-gray-500 pl-2">dashboard_telemetry_grid.exe</span>
            </div>
            <span className="text-[10px] font-mono bg-purple-950/40 border border-purple-900/40 text-purple-400 px-2 py-0.5 rounded flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse"></span> Live Preview
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Simulation Block 1: Dynamic Counter */}
            <div className="bg-[#0a0f1d] border border-red-950/80 p-5 rounded-xl relative hover:-translate-y-1 transition-transform duration-300">
              <div className="absolute top-0 left-0 w-full h-0.5 bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]"></div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-red-400 font-mono flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Predicted Risk</span>
                <span className="text-[9px] font-bold bg-red-950/60 border border-red-900/50 px-1.5 py-0.5 text-red-400 rounded">HIGH DEFICIT</span>
              </div>
              <p className="text-3xl font-black text-red-500 mt-3 font-mono">
                <AnimatedCounter from={0} to={-34} /> Marks
              </p>
              <p className="text-[10px] text-gray-400 mt-1 leading-relaxed">Deficit tied directly to uncompleted or weak (RED flagged) curriculum derivation trees.</p>
            </div>

            {/* Simulation Block 2 */}
            <div className="bg-[#0a0f1d] border border-purple-900/40 p-5 rounded-xl relative hover:-translate-y-1 transition-transform duration-300 delay-75">
              <div className="absolute top-0 left-0 w-full h-0.5 bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.8)]"></div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 font-mono">AI Syllabus Map</span>
                <span className="text-[9px] font-bold bg-purple-950/60 border border-purple-900/50 px-1.5 py-0.5 text-purple-400 rounded font-mono">HIGH YIELD</span>
              </div>
              <h4 className="text-xs font-bold text-gray-200 mt-3 truncate">Quantum Mechanics Basics</h4>
              <div className="mt-2 space-y-1.5 text-[10px]">
                <div className="flex justify-between text-gray-400"><span>Schrödinger Proof</span> <span className="text-red-400 font-bold font-mono">Asked 4x (14M)</span></div>
                <div className="w-full bg-[#141a2e] h-1 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} whileInView={{ width: '80%' }} transition={{ duration: 1.5, delay: 0.5 }} className="bg-purple-500 h-full rounded-full shadow-[0_0_5px_rgba(168,85,247,0.8)]"></motion.div>
                </div>
              </div>
            </div>

            {/* Simulation Block 3 */}
            <div className="bg-[#0a0f1d] border border-emerald-950 p-5 rounded-xl relative hover:-translate-y-1 transition-transform duration-300 delay-150">
              <div className="absolute top-0 left-0 w-full h-0.5 bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]"></div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 font-mono">Revision Arena</span>
                <span className="text-[9px] font-bold bg-emerald-950/60 border border-emerald-900/50 px-1.5 py-0.5 text-emerald-400 rounded">ACTIVE LOOP</span>
              </div>
              <p className="text-3xl font-black text-emerald-400 mt-3 font-mono">Box 1 Requeue</p>
              <p className="text-[10px] text-gray-400 mt-1 leading-relaxed">System dynamically pushes failed cards to the back of your active loop until mastered.</p>
            </div>

          </div>
        </div>
      </motion.section>

      {/* ⚙️ THE TRUE PLATFORM FEATURE ARCHITECTURE ENGINE (Now with Hover States) */}
      <section id="core-engine" className="max-w-5xl mx-auto px-6 mb-32 scroll-mt-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-gray-200">Engine Modules & Operational Architecture</h2>
          <p className="text-xs text-gray-400 mt-1.5 max-w-sm mx-auto">No generic study templates. Here is exactly how ExamOS processes your raw academic documents.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Engine Card 1 */}
          <div className="group bg-[#0f1422] border border-gray-900 hover:border-purple-500/40 p-6 rounded-2xl shadow-xl hover:shadow-[0_0_30px_rgba(168,85,247,0.1)] hover:-translate-y-1 transition-all duration-300 flex gap-4 cursor-default">
            <div className="h-10 w-10 rounded-xl bg-purple-950/50 border border-purple-900/40 text-purple-400 flex items-center justify-center shrink-0 group-hover:bg-purple-900/60 group-hover:scale-110 transition-all">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-gray-200 group-hover:text-purple-300 transition-colors">Automatic Frequency Density Extraction</h4>
              <p className="text-gray-400 text-xs mt-2 leading-relaxed">
                When you upload a document pack, our parser runs an automated frequency check. If a question pattern or theorem appears 3 or more times, the engine dynamically overrides the topic priority flag to <span className="text-red-400 font-bold">HIGH YIELD</span>.
              </p>
            </div>
          </div>

          {/* Engine Card 2 */}
          <div className="group bg-[#0f1422] border border-gray-900 hover:border-indigo-500/40 p-6 rounded-2xl shadow-xl hover:shadow-[0_0_30px_rgba(99,102,241,0.1)] hover:-translate-y-1 transition-all duration-300 flex gap-4 cursor-default">
            <div className="h-10 w-10 rounded-xl bg-indigo-950/50 border border-indigo-900/40 text-indigo-400 flex items-center justify-center shrink-0 group-hover:bg-indigo-900/60 group-hover:scale-110 transition-all">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-gray-200 group-hover:text-indigo-300 transition-colors">The Live Grade Deficit Radar Matrix</h4>
              <p className="text-gray-400 text-xs mt-2 leading-relaxed">
                Your analytics panel evaluates your red, yellow, and green confidence toggles, cross-referencing them with past year point distributions. It tracks exactly how many marks you are risking on the final test paper if you step into the hall right now.
              </p>
            </div>
          </div>

          {/* Engine Card 3 */}
          <div className="group bg-[#0f1422] border border-gray-900 hover:border-emerald-500/40 p-6 rounded-2xl shadow-xl hover:shadow-[0_0_30px_rgba(16,185,129,0.1)] hover:-translate-y-1 transition-all duration-300 flex gap-4 cursor-default">
            <div className="h-10 w-10 rounded-xl bg-emerald-950/50 border border-emerald-900/40 text-emerald-400 flex items-center justify-center shrink-0 group-hover:bg-emerald-900/60 group-hover:scale-110 transition-all">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-gray-200 group-hover:text-emerald-300 transition-colors">In-Session Leitner Box Requeue Loop</h4>
              <p className="text-gray-400 text-xs mt-2 leading-relaxed">
                The Revision Arena utilizes an adaptive spaced-repetition loop. Flagging a card as wrong drops it to Box 1 and injects it straight back into your active deck queue so you are forced to conquer it before the workspace logs off.
              </p>
            </div>
          </div>

          {/* Engine Card 4 */}
          <div className="group bg-[#0f1422] border border-gray-900 hover:border-amber-500/40 p-6 rounded-2xl shadow-xl hover:shadow-[0_0_30px_rgba(245,158,11,0.1)] hover:-translate-y-1 transition-all duration-300 flex gap-4 cursor-default">
            <div className="h-10 w-10 rounded-xl bg-amber-950/50 border border-amber-900/40 text-amber-400 flex items-center justify-center shrink-0 group-hover:bg-amber-900/60 group-hover:scale-110 transition-all">
              <FunctionSquare className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-gray-200 group-hover:text-amber-300 transition-colors">AI LaTeX Formula Cheat-Sheet Compiler</h4>
              <p className="text-gray-400 text-xs mt-2 leading-relaxed">
                Skip searching long threads for a missing constant. The background compiler scans your curriculum text maps, compiles formulas into clean typography layouts, and serves up a functional reference cheat-sheet on demand.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 🚨 TACTICAL CRITICAL BANNER (Now with urgency animations) */}
      <section className="max-w-4xl mx-auto px-6 mb-32">
        <div className="bg-gradient-to-br from-[#1d0b0b] to-[#0f1422] border border-red-950/60 p-8 rounded-2xl shadow-[0_0_40px_rgba(220,38,38,0.1)] relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(220,38,38,0.02)_10px,rgba(220,38,38,0.02)_20px)]">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-red-600 shadow-[0_0_15px_rgba(220,38,38,1)]"></div>
          <div className="z-10">
            <div className="inline-flex items-center gap-2 bg-red-950/40 border border-red-900/40 px-2.5 py-1 rounded text-[9px] font-mono font-bold text-red-400 uppercase mb-3 tracking-wider">
              <Zap className="w-3 h-3 text-red-500 fill-red-500" /> System Exception Handler: Panic Mode
            </div>
            <h3 className="text-xl font-bold text-gray-100">Running out of time before the test?</h3>
            <p className="text-gray-300 text-xs mt-1.5 max-w-lg leading-relaxed">
              Activate Panic Mode to deploy a localized sprint strategy. The system filters out the low-value fluff and extracts the high-probability derivations to help you maximize your points under tight time constraints.
            </p>
          </div>
          <button onClick={onGetStarted} className="relative z-10 bg-red-600 hover:bg-red-500 text-white font-bold text-xs px-6 py-3.5 rounded-xl transition shadow-[0_0_20px_rgba(220,38,38,0.4)] hover:shadow-[0_0_30px_rgba(220,38,38,0.6)] shrink-0 active:scale-95 group overflow-hidden">
            <span className="relative z-10 flex items-center gap-2">Initialize Panic Matrix <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
          </button>
        </div>
      </section>

      {/* 🏁 SYSTEM DISPATCH CTA FOOTER */}
      <section className="max-w-5xl mx-auto px-6 pb-24 text-center border-t border-gray-900 pt-20">
        <h2 className="text-3xl font-bold tracking-tight">Stop Guessing. Weaponize Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">Syllabus.</span></h2>
        <p className="text-gray-500 text-xs mt-2 max-w-sm mx-auto">Get your active workspace environment set up in less than 2 minutes flat.</p>
        <button onClick={onGetStarted} className="bg-gradient-to-r from-purple-600 to-indigo-600 font-bold text-xs px-10 py-4 rounded-xl transition mt-8 shadow-[0_0_20px_rgba(147,51,234,0.3)] hover:shadow-[0_0_40px_rgba(147,51,234,0.5)] hover:-translate-y-1 active:scale-95">
          Construct Account Instance
        </button>
        
        <p className="text-[10px] text-gray-600 font-mono mt-16">© 2026 ExamOS Intelligence Architecture Core. All tracking parameters synchronized.</p>
      </section>

    </div>
  );
}