// App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'; 
import HomePage from './pages/Home';
import AnalysisPage from './pages/Analysis';
import ContactPage from './pages/Contact';
import ProfilePage from './pages/Profile';
import AnalysisResult from './components/analysis/Result';
import AuthForm from './components/Auth/AuthForm';
import Email from './components/Auth/Email';
import GenderSelection from './components/home/GenderSelection';
import ScrollSnapDatePicker from './components/home/ScrollSnapDatePicker';
import EmailVerification from './components/Auth/VerificationCode';
import ResetPassword from './components/Auth/ForgetPass';
import { useNavigate } from 'react-router-dom';
import ConfirmModal from './components/common/ConfirmModal';
import { AuthProvider } from './contexts/AuthContext';

function EmailVerificationRouteWrapper() {
  const location = useLocation();
  const { email, password, rememberMe } = location.state || {};
  return <EmailVerification email={email} password={password} rememberMe={rememberMe} />;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AuthForm />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/analysis" element={<AnalysisPage />} />
          <Route path="/result" element={<AnalysisResult />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/profile/*" element={<ProfilePage />} />
          <Route path="/emailverification" element={<EmailVerificationRouteWrapper />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
