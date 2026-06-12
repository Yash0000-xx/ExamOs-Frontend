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
import { fetchData } from './api.js'; // 🔗 Imported your new master API bridge!

export default function App() {
  // 🎯 FIX: Syncing the key exactly with the Interceptor ('token')
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const [isCheckingDatabase, setIsCheckingDatabase] = useState(true); 
  const [currentPage, setCurrentPage] = useState('Dashboard'); 
  const [activeDocumentId, setActiveDocumentId] = useState(null);
  const [showAuthWall, setShowAuthWall] = useState(false);

  useEffect(() => {
    const verifyUserDataFootprint = async () => {
      if (!isAuthenticated) {
        setIsCheckingDatabase(false);
        return;
      }

      try {
        // 🌐 FIX: Use the central API bridge! It automatically attaches the token and uses the deployed URL.
        const result = await fetchData('subjects/tree');

        if (result && result.data && result.data.length > 0) {
          console.log(`🙋‍♂️ Existing user verified via DB tree. Core bypass active.`);
          setIsSetupComplete(true);
          // 🧹 Force sync local storage to truth
          localStorage.setItem('examos-setup-done', 'true'); 
        } else {
          console.log(`🐣 Brand-new user footprint detected. Routing to Onboarding Wizard.`);
          setIsSetupComplete(false);
          // 🧹 Purge ghost data from previous accounts
          localStorage.removeItem('examos-setup-done'); 
        }
      } catch (err) {
        console.log("⚠️ Database status validation cold boot. Falling back to local storage parameters.");
        if (localStorage.getItem('examos-setup-done') === 'true') {
          setIsSetupComplete(true);
        } else {
          setIsSetupComplete(false);
        }
      } finally {
        setIsCheckingDatabase(false);
      }
    };

    verifyUserDataFootprint();
  }, [isAuthenticated]);

  const handleLogout = () => {
    localStorage.clear(); // This safely wipes 'token', 'examos-setup-done', everything!
    setIsSetupComplete(false);
    setIsAuthenticated(false);
    setShowAuthWall(false);
    setCurrentPage('Dashboard'); 
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'Dashboard':
        return <DashboardOverview />; 
      case 'Subjects':
        return <Subjects onTriggerNewOnboarding={() => setIsSetupComplete(false)} />; 
      case 'Flashcards':
        return <FlashcardsPage />;
      case 'Analytics':
        return <Analytics />;
      case 'Revision':
        return <Revision />; 
      case 'Panic Mode':
        return <PanicMode />; 
      case 'Quiz Arena':
        return <QuizPage />; 
      case 'Notes Arena':
        return <NotesArena documentId={activeDocumentId} />;
      case 'Workspace':
      return <Workspace 
              setCurrentPage={setCurrentPage} 
              setActiveDocumentId={setActiveDocumentId} 
            />;
      case 'Settings':
        return <Settings onLogout={handleLogout} />; 
      default:
        return <DashboardOverview />;
    }
  };

  if (!isAuthenticated) {
    if (showAuthWall) {
      return <AuthPage onLoginSuccess={() => setIsAuthenticated(true)} />;
    }
    return <LandingPage onGetStarted={() => setShowAuthWall(true)} />;
  }

  if (isCheckingDatabase) {
    return (
      <div className="min-h-screen bg-[#0a0f1d] flex flex-col items-center justify-center text-gray-400 font-mono text-xs">
        <div className="h-6 w-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        Syncing Environment Terminal Context...
      </div>
    );
  }

  if (!isSetupComplete) {
    return <OnboardingWizard onComplete={() => setIsSetupComplete(true)} />;
  }

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