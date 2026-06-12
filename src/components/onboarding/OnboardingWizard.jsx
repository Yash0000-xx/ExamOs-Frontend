import React, { useState } from 'react';
import { postData, uploadFiles } from '../../api.js'; // 🔗 Master API bridge

export default function OnboardingWizard({ onComplete }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const [syllabusFile, setSyllabusFile] = useState(null);
  const [pyqFiles, setPyqFiles] = useState([]); 
  const [subjectName, setSubjectName] = useState('');
  const [subjectId, setSubjectId] = useState('');
  
  const [examName, setExamName] = useState('');
  const [targetDate, setTargetDate] = useState('');

  // --- PHASE 1: Send Syllabus File ---
  const handleSyllabusSubmit = async () => {
    if (!syllabusFile) return alert("Please select a file first!");
    
    setIsAnalyzing(true);
    const formData = new FormData();
    formData.append('syllabus', syllabusFile);

    try {
      // 🌐 Use uploadFiles helper
      const result = await uploadFiles('upload/syllabus', formData);
      if (result) {
        setSubjectName(result.subject || "Unnamed Course");
        setSubjectId(String(result.subjectId));
        setCurrentStep(2);
      }
    } catch (error) {
      alert(`🚨 Syllabus Upload Failed: ${error.message}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // --- PHASE 2: Send PYQ Files ---
  const handlePYQSubmit = async () => {
    if (pyqFiles.length === 0) return alert("Please select at least one past paper PDF!");
    
    setIsAnalyzing(true);
    const formData = new FormData();
    pyqFiles.forEach((file) => formData.append('pyqFiles', file));
    formData.append('subjectId', subjectId); 

    try {
      // 🌐 Use uploadFiles helper
      await uploadFiles('pyqs/upload-pdf', formData);
      setCurrentStep(3);
    } catch (error) {
      alert(`🚨 PYQ Upload Failed: ${error.message}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // --- PHASE 3: Save Meta and Initialize ---
  const handleFinalSubmit = async () => {
    if (!examName || !targetDate) return alert("Please fill in your exam targets!");
    
    setIsAnalyzing(true);
    try {
      // 🌐 Use postData helper
      await postData('exams/initialize', {
        examName,
        targetDate,
        subjectId
      });
      onComplete(); 
    } catch (error) {
      alert(`🚨 Dashboard Initialization Failed: ${error.message}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0f1d] text-white flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-2xl mb-12 flex justify-between items-center relative">
        <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-800 -z-10 transform -translate-y-1/2"></div>
        <div className="absolute top-1/2 left-0 h-1 bg-purple-500 -z-10 transform -translate-y-1/2 transition-all duration-500"
          style={{ width: currentStep === 1 ? '0%' : currentStep === 2 ? '50%' : '100%' }}></div>
        {[1, 2, 3].map((step) => (
          <div key={step} className={`h-10 w-10 rounded-full flex items-center justify-center border-2 font-bold ${currentStep >= step ? 'bg-purple-600 border-purple-500' : 'bg-[#1a2035] border-gray-700'}`}>
            {step}
          </div>
        ))}
      </div>

      <div className="bg-[#0f1422] border border-gray-800 rounded-2xl p-10 w-full max-w-2xl shadow-2xl relative overflow-hidden">
        {isAnalyzing && (
          <div className="absolute inset-0 bg-[#0f1422]/90 flex flex-col items-center justify-center z-10 backdrop-blur-sm">
            <div className="h-12 w-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-purple-400 font-medium animate-pulse">ExamOS Engine Processing Uploads...</p>
          </div>
        )}

        {currentStep === 1 && (
          <div>
            <h2 className="text-2xl font-bold text-center mb-2">Step 1: Curriculum Intake</h2>
            <p className="text-gray-400 text-sm text-center mb-8">Upload your syllabus to break down your course schedule.</p>
            <div className="border-2 border-dashed border-gray-700 rounded-xl p-8 bg-[#1a2035] hover:border-purple-500 transition-colors text-center cursor-pointer mb-6">
              <input type="file" className="hidden" id="syllabus-file-input" accept="application/pdf" onChange={(e) => setSyllabusFile(e.target.files[0])}/>
              <label htmlFor="syllabus-file-input" className="cursor-pointer block">
                <div className="text-4xl mb-2">📋</div>
                <p className="text-sm font-medium">{syllabusFile ? syllabusFile.name : "Select Syllabus PDF"}</p>
              </label>
            </div>
            <button onClick={handleSyllabusSubmit} className="bg-purple-600 hover:bg-purple-500 w-full py-3 rounded-xl font-bold transition-all">Process & Extract Chapters</button>
          </div>
        )}

        {currentStep === 2 && (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Step 2: Upload Assessment History</h2>
            <p className="text-gray-400 text-sm mb-2">Analyzing target: <span className="text-purple-400 font-semibold">{subjectName}</span></p>
            <div className="border-2 border-dashed border-gray-700 rounded-xl p-12 bg-[#1a2035] hover:border-purple-500 transition-colors cursor-pointer mb-8">
              <input type="file" className="hidden" id="pyq-file-input" accept="application/pdf" multiple onChange={(e) => setPyqFiles(Array.from(e.target.files))}/>
              <label htmlFor="pyq-file-input" className="cursor-pointer block">
                <div className="text-4xl mb-3">📚</div>
                <p className="font-semibold text-sm">{pyqFiles.length > 0 ? `${pyqFiles.length} papers selected` : "Upload PYQ Papers (PDF)"}</p>
              </label>
            </div>
            <button onClick={handlePYQSubmit} className="bg-purple-600 hover:bg-purple-500 w-full py-3 rounded-xl font-bold transition-all">Extract & Index Questions</button>
          </div>
        )}

        {currentStep === 3 && (
          <div>
            <h2 className="text-2xl font-bold text-center mb-2">Step 3: Target Matrix</h2>
            <p className="text-gray-400 text-sm text-center mb-8">Establish your deadlines to calculate task constraints.</p>
            <div className="space-y-4 mb-8">
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Exam / Assessment Scope</label>
                <input type="text" value={examName} onChange={(e) => setExamName(e.target.value)} className="w-full bg-[#1a2035] border border-gray-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Target Date (D-Day)</label>
                <input type="date" value={targetDate} onChange={(e) => setTargetDate(e.target.value)} className="w-full bg-[#1a2035] border border-gray-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500" />
              </div>
            </div>
            <button onClick={handleFinalSubmit} className="bg-purple-600 hover:bg-purple-500 w-full py-3 rounded-xl font-bold transition-all">Initialize Dashboard Engine</button>
          </div>
        )}
      </div>
    </div>
  );
}