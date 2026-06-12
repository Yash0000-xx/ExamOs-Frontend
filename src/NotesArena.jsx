import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import mermaid from 'mermaid';
import { uploadFiles, postData, fetchData } from './api.js'; // 🎯 FIX: Added fetchData to pull the note

// Initialize the mermaid diagram engine
mermaid.initialize({
  startOnLoad: false,
  theme: 'base',
  themeVariables: { primaryColor: '#8b5cf6', primaryTextColor: '#fff', primaryBorderColor: '#6d28d9', lineColor: '#94a3b8' }
});

// 🎯 FIX: Component now accepts documentId from App.jsx
export default function NotesArena({ documentId }) {
  const [file, setFile] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [notesMarkdown, setNotesMarkdown] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  // 🎯 NEW: Loading state for when we are fetching an existing note
  const [isLoadingDocument, setIsLoadingDocument] = useState(false);

  // 🎯 NEW: Fetch the saved document if documentId exists
  useEffect(() => {
    if (documentId) {
      const loadSavedNote = async () => {
        setIsLoadingDocument(true);
        try {
          const result = await fetchData(`workspace/${documentId}`);
          if (result && result.data) {
            setNotesMarkdown(result.data.content);
            setSaveSuccess(true); // Treat it as already saved
          }
        } catch (err) {
          console.error("Failed to fetch saved document:", err);
          alert("Could not load the requested document.");
        } finally {
          setIsLoadingDocument(false);
        }
      };
      loadSavedNote();
    } else {
      // If we navigate here normally (without an ID), reset the board
      setNotesMarkdown("");
      setSaveSuccess(false);
    }
  }, [documentId]);

 // Trigger mermaid to paint the diagrams every time the markdown updates
  useEffect(() => {
    if (notesMarkdown && !isLoadingDocument) {
      // 🎯 FIX: A tiny delay ensures React has actually painted the DOM before Mermaid tries to read it
      setTimeout(() => {
        try {
          mermaid.run({
            querySelector: '.mermaid',
          });
        } catch (error) {
          console.error("Mermaid diagram rendering failed:", error);
        }
      }, 100); // 100ms is imperceptible to humans, but an eternity for code!
    }
  }, [notesMarkdown, isLoadingDocument]);
  const handleFileChange = (e) => {
    if (e.target.files[0]) setFile(e.target.files[0]);
  };

  const handleGenerateNotes = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please attach a syllabus or notes document.");

    setGenerating(true);
    setNotesMarkdown("");
    setSaveSuccess(false);

    const formData = new FormData();
    formData.append('document', file);

    try {
      const result = await uploadFiles('notes/generate', formData);
      if (result) {
        setNotesMarkdown(result.data);
      }
    } catch (err) {
      alert("Network processing engine timeout or server error.");
    } finally {
      setGenerating(false);
    }
  };

  const handleSaveToWorkspace = async () => {
    if (!notesMarkdown || documentId) return; // Prevent re-saving if it's already a saved doc
    setIsSaving(true);
    
    try {
      const result = await postData('workspace/save', {
        title: file ? file.name.replace(/\.[^/.]+$/, "") + " - Revision Notes" : "Generated Notes",
        type: 'notes',
        content: notesMarkdown
      });

      if (result) {
        setSaveSuccess(true);
        // Removed the timeout here so the "Secured in Workspace" button stays green for that session
      }
    } catch (err) {
      alert("Network error while saving to database.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-8 bg-[var(--bg-workspace)] min-h-screen text-[var(--text-primary)] w-full transition-colors duration-200">
      <div className="mb-10 max-w-3xl">
        <h1 className="text-3xl font-bold tracking-tight">{documentId ? "Archived Revision Notes" : "AI Revision Notes"}</h1>
        <p className="text-[var(--text-secondary)] text-sm mt-1">
          {documentId ? "Viewing a secured document from your Workspace vault." : "Upload a raw syllabus to generate highly detailed, structured study notes complete with visual concept mapping."}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Context Injector Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-2xl p-6 shadow-xl sticky top-8">
            <h3 className="text-sm font-bold text-purple-500 uppercase tracking-wider mb-4">Context Injector</h3>
            <form onSubmit={handleGenerateNotes} className="space-y-4">
              <div className="border-2 border-dashed border-[var(--border-primary)] rounded-xl p-4 bg-[var(--bg-input)] text-center cursor-pointer relative group hover:border-purple-500/40 transition">
                <input type="file" accept=".pdf,.txt" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                <span className="text-2xl">📚</span>
                <p className="text-xs font-medium text-[var(--text-primary)] mt-2 truncate">{file ? file.name : "Drop Syllabus PDF"}</p>
              </div>
              <button
                type="submit"
                disabled={generating || isLoadingDocument}
                className="w-full bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white font-bold text-xs py-3 rounded-xl transition shadow-lg"
              >
                {generating ? "Mapping Concepts..." : "⚡ Synthesize Notes"}
              </button>
            </form>
          </div>
        </div>

        {/* Main Document Area */}
        <div className="lg:col-span-3">
          {isLoadingDocument ? (
            <div className="bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-2xl p-16 text-center shadow-xl flex flex-col items-center justify-center h-full min-h-[400px]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mb-4"></div>
              <p className="text-[var(--text-secondary)] text-sm font-mono">Decrypting document from Workspace...</p>
            </div>
          ) : notesMarkdown ? (
            <div className="bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-2xl p-8 shadow-xl custom-scrollbar prose prose-invert max-w-none transition-colors duration-200">
              <div className="flex justify-between items-center mb-6 pb-6 border-b border-[var(--border-primary)]">
                <h2 className="text-xl font-bold text-[var(--text-primary)] tracking-tight">
                  {documentId ? "Secured Notes Document" : "Generated Synthesized Notes"}
                </h2>
                
                {/* 🎯 FIX: Disables the save button if we are viewing an already saved document */}
                <button 
                  onClick={handleSaveToWorkspace}
                  disabled={isSaving || saveSuccess || !!documentId}
                  className={`px-5 py-2.5 text-xs font-bold rounded-xl transition shadow-md flex items-center gap-2
                    ${(saveSuccess || documentId)
                      ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500 opacity-80 cursor-default' 
                      : 'bg-purple-600 hover:bg-purple-500 text-white border border-transparent'}`}
                >
                  {(saveSuccess || documentId) ? '✅ Secured in Workspace' : isSaving ? '💾 Writing to Database...' : '💾 Save to Workspace'}
                </button>
              </div>

              <ReactMarkdown
                components={{
                  code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '');
                    if (!inline && match && match[1] === 'mermaid') {
                      return <div className="mermaid flex justify-center my-8 bg-[var(--bg-input)] border border-[var(--border-primary)] p-6 rounded-xl">{String(children).replace(/\n$/, '')}</div>;
                    }
                    return !inline ? (
                      <pre className="bg-[var(--bg-input)] p-4 rounded-xl border border-[var(--border-primary)] overflow-x-auto my-4 text-xs font-mono"><code className={className} {...props}>{children}</code></pre>
                    ) : (
                      <code className="bg-[var(--bg-input)] px-1.5 py-0.5 rounded text-purple-400 font-mono text-sm" {...props}>{children}</code>
                    );
                  },
                  h1: ({node, ...props}) => <h1 className="text-3xl font-black mb-6 text-[var(--text-primary)] border-b border-[var(--border-primary)] pb-2" {...props} />,
                  h2: ({node, ...props}) => <h2 className="text-xl font-bold mt-8 mb-4 text-purple-500" {...props} />,
                  h3: ({node, ...props}) => <h3 className="text-lg font-bold mt-6 mb-3 text-[var(--text-primary)]" {...props} />,
                  p: ({node, ...props}) => <p className="text-sm leading-relaxed text-[var(--text-secondary)] mb-4" {...props} />,
                  ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-4 text-sm text-[var(--text-secondary)] space-y-1" {...props} />,
                  li: ({node, ...props}) => <li className="pl-1" {...props} />
                }}
              >
                {notesMarkdown}
              </ReactMarkdown>
            </div>
          ) : (
            <div className="bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-2xl p-16 text-center text-[var(--text-secondary)] shadow-xl flex flex-col items-center justify-center h-full min-h-[400px]">
              <span className="text-5xl opacity-50 mb-4">📝</span>
              <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">No Notes Generated Yet</h3>
              <p className="text-sm max-w-md mx-auto">Upload your syllabus on the left to extract the core framework, definitions, and visual relationship diagrams.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}