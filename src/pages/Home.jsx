// pages/HomePage.jsx - الصفحة الرئيسية المُحدثة
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Header from '../components/home/Header';
import AboutUs from '../components/home/AboutUs';
import Services from '../components/home/Services';
import WhyChooseUs from '../components/home/WhyChooseUs';
import OurApp from '../components/home/OurApp';
import Chatbot from '../components/chatbot/Chatbot';
import Footer from '../components/common/Footer';
import GenderSelection from '../components/home/GenderSelection';
import ScrollSnapDatePicker from '../components/home/ScrollSnapDatePicker';

const HomePage = ({ setCurrentPage }) => {
  const location = useLocation();
  const [showStep, setShowStep] = useState(null); // null | 'gender' | 'date'

  useEffect(() => {
    const onboardingComplete = localStorage.getItem('onboardingComplete') === 'true';
    console.log('onboardingComplete:', onboardingComplete, 'location.state:', location.state);
    
    // For testing: always show onboarding for new users
    // Remove this condition later: !onboardingComplete && 
    if (location.state && location.state.showWelcomePopups) {
      console.log('Triggering onboarding popups');
      setShowStep('gender');
    }
  }, [location.state]);

  const handleGenderNext = () => setShowStep('date');
  const handleDateBack = () => setShowStep('gender');
  const handleDateDone = () => {
    localStorage.setItem('onboardingComplete', 'true');
    setShowStep(null);
  };
  const handleGenderBack = () => {
    // If user goes back from gender selection, close the onboarding
    localStorage.setItem('onboardingComplete', 'true');
    setShowStep(null);
  };

  // Temporary test function
  const testOnboarding = () => {
    localStorage.removeItem('onboardingComplete');
    setShowStep('gender');
  };

  return (
    <div className="home-page">
     
      {/* Temporary test button - remove this later */}
      {/* <button 
        onClick={testOnboarding}
        style={{
          position: 'fixed',
          top: 10,
          right: 10,
          zIndex: 10001,
          padding: '10px 20px',
          backgroundColor: '#5d66ea',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Test Onboarding
      </button> */}
     
      {/* Pop-up message for GenderSelection */}
      {showStep === 'gender' && (
        <div style={{ position: 'fixed', top: 0, bottom: 0, left: 0, right: 0, zIndex: 10000, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
          <div>
            <GenderSelection onNext={handleGenderNext} onBack={handleGenderBack} />
          </div>
        </div>
      )}
      {/* Pop-up message for ScrollSnapDatePicker */}
      {showStep === 'date' && (
        <div style={{ position: 'fixed', top: 0, bottom: 0, left: 0, right: 0, zIndex: 10000, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
          <div>
            <ScrollSnapDatePicker onDone={handleDateDone} onBack={handleDateBack} />
          </div>
        </div>
      )}
      <Navbar currentPage="home" setCurrentPage={setCurrentPage} />
      <Header />
      <AboutUs />
      <Services />
      <WhyChooseUs />
      <OurApp />
      <Chatbot />
      <Footer setCurrentPage={setCurrentPage} />
    </div>
  );
};

export default HomePage;