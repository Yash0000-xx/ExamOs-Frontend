import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar'; 
import DashboardOverview from './DashboardOverview'; 
import FlashcardsPage from './FlashcardsPage'; 
import Subjects from './Subjects';
import PanicMode from './PanicMode'; 
import Analytics from './Analytics';
import Revision from './Revision'; 
import Settings from './Settings'; 
import AuthPage from './AuthPage'; 
import LandingPage from './LandingPage'; 
import OnboardingWizard from './components/onboarding/OnboardingWizard'; 
import QuizPage from './QuizPage'; 
import NotesArena from './NotesArena'; 
import Workspace from './Workspace'; 
import { fetchData } from './api.js';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  
  // 1. Initialize setup status from storage for instant UI snap
  const [isSetupComplete, setIsSetupComplete] = useState(localStorage.getItem('examos-setup-done') === 'true');
  
  // 2. THIS IS THE GATEKEEPER: The app only renders content when this is true
  const [isAppReady, setIsAppReady] = useState(false); 
  
  const [currentPage, setCurrentPage] = useState('Dashboard'); 
  const [activeDocumentId, setActiveDocumentId] = useState(null);
  const [showAuthWall, setShowAuthWall] = useState(false);

  useEffect(() => {
    const verifyUserDataFootprint = async () => {
      // If not authenticated, we are "ready" to show the landing page
      if (!isAuthenticated) {
        setIsAppReady(true);
        return;
      }

      try {
        const result = await fetchData('subjects/tree');

        if (result && result.data && result.data.length > 0) {
          setIsSetupComplete(true);
          localStorage.setItem('examos-setup-done', 'true'); 
        } else {
          setIsSetupComplete(false);
          localStorage.removeItem('examos-setup-done'); 
        }
      } catch (err) {
        // Keep existing storage state on failure
        console.log("Database offline; relying on local cache.");
      } finally {
        // Only mark app as ready AFTER the check is done
        setIsAppReady(true); 
      }
    };

    verifyUserDataFootprint();
  }, [isAuthenticated]);

  const handleLogout = () => {
    localStorage.clear();
    setIsSetupComplete(false);
    setIsAuthenticated(false);
    setShowAuthWall(false);
    setCurrentPage('Dashboard'); 
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'Dashboard': return <DashboardOverview />; 
      case 'Subjects': return <Subjects onTriggerNewOnboarding={() => setIsSetupComplete(false)} />; 
      case 'Flashcards': return <FlashcardsPage />;
      case 'Analytics': return <Analytics />;
      case 'Revision': return <Revision />; 
      case 'Panic Mode': return <PanicMode />; 
      case 'Quiz Arena': return <QuizPage />; 
      case 'Notes Arena': return <NotesArena documentId={activeDocumentId} />;
      case 'Workspace':
        return <Workspace 
                setCurrentPage={setCurrentPage} 
                setActiveDocumentId={setActiveDocumentId} 
              />;
      case 'Settings': return <Settings onLogout={handleLogout} />; 
      default: return <DashboardOverview />;
    }
  };

  // 3. SHOW LOADING UNTIL APP IS READY
  if (!isAppReady) {
    return (
      <div className="min-h-screen bg-[#0a0f1d] flex flex-col items-center justify-center text-gray-400 font-mono text-xs">
        <div className="h-6 w-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        Syncing Environment Terminal Context...
      </div>
    );
  }

  // 4. NOW HANDLE THE AUTH/SETUP FLOWS
  if (!isAuthenticated) {
    if (showAuthWall) {
      return <AuthPage onLoginSuccess={() => {
        setIsAuthenticated(true);
        setIsAppReady(false); // Force re-trigger of the check for the new user
      }} />;
    }
    return <LandingPage onGetStarted={() => setShowAuthWall(true)} />;
  }

  if (!isSetupComplete) {
    return <OnboardingWizard onComplete={() => setIsSetupComplete(true)} />;
  }

  // 5. FINALLY, THE MAIN APP
  return (
    <div className="flex min-h-screen bg-[var(--bg-workspace)] transition-colors duration-200">
      <Sidebar 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage} 
        onLogout={handleLogout} 
      />
      <div className="flex-1 overflow-y-auto">
        {renderPage()}
      </div>
    </div>
  );
}