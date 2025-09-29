// routes/AppRoutes.jsx
import React, { useState } from 'react';
import HomePage from '../pages/Home';
import AnalysisPage from '../pages/Analysis';
import ContactPage from '../pages/Contact';
import ProfilePage from '../pages/Profile';

const AppRoutes = ({ currentPage, setCurrentPage }) => {
  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage setCurrentPage={setCurrentPage} />;
      case 'analysis':
        return <AnalysisPage setCurrentPage={setCurrentPage} />;
      case 'contact':
        return <ContactPage setCurrentPage={setCurrentPage} />;
      case 'profile':
        return <ProfilePage setCurrentPage={setCurrentPage} />;
      default:
        return <HomePage setCurrentPage={setCurrentPage} />;
    }
  };

  return renderPage();
};

export default AppRoutes;