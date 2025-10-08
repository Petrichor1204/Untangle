import React, { useState } from 'react';
import Login from './components/Login';
import Signup from './components/Signup';
import Home from './components/Home';
import HairAnalysis from './components/HairAnalysis';
import CarePlans from './components/CarePlans';
import ProgressTracking from './components/ProgressTracking';

function App() {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState('login');

  // Global state that needs to be shared between components
  const [sessionId, setSessionId] = useState(null);
  const [analysis, setHairAnalysis] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [carePlan, setCarePlan] = useState(null);
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [activeReminders, setActiveReminders] = useState([]);

  // Navigation handler
  const navigateToPage = (page) => {
    setCurrentPage(page);
  };

  // Auth handlers
  const handleLogin = () => {
    setIsAuthenticated(true);
    navigateToPage('home');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setSessionId(null);
    setHairAnalysis(null);
    setCarePlan(null);
    setCapturedImage(null);
    navigateToPage('login');
  };

  // Render logic based on authentication and current page
  if (!isAuthenticated) {
    if (currentPage === 'signup') {
      return <Signup onSignup={handleLogin} navigateToPage={navigateToPage} />;
    }
    return <Login onLogin={handleLogin} navigateToPage={navigateToPage} />;
  }

  // Main app routing
  switch (currentPage) {
    case 'home':
      return (
        <Home
          currentPage={currentPage}
          navigateToPage={navigateToPage}
          handleLogout={handleLogout}
        />
      );

    case 'analysis':
      return (
        <HairAnalysis
          currentPage={currentPage}
          navigateToPage={navigateToPage}
          handleLogout={handleLogout}
          sessionId={sessionId}
          setSessionId={setSessionId}
          hairAnalysis={analysis}
          setHairAnalysis={setHairAnalysis}
          capturedImage={capturedImage}
          setCapturedImage={setCapturedImage}
        />
      );

    case 'plan':
      return (
        <CarePlans
          currentPage={currentPage}
          navigateToPage={navigateToPage}
          handleLogout={handleLogout}
          sessionId={sessionId}
          carePlan={carePlan}
          setCarePlan={setCarePlan}
          completedSteps={completedSteps}
          setCompletedSteps={setCompletedSteps}
          activeReminders={activeReminders}
          setActiveReminders={setActiveReminders}
        />
      );

    case 'tracking':
      return (
        <ProgressTracking
          currentPage={currentPage}
          navigateToPage={navigateToPage}
          handleLogout={handleLogout}
          sessionId={sessionId}
          completedSteps={completedSteps}
          activeReminders={activeReminders}
          setActiveReminders={setActiveReminders}
        />
      );

    default:
      return <Home 
        currentPage={currentPage}
        navigateToPage={navigateToPage}
        handleLogout={handleLogout}
      />;
  }
}

export default App;