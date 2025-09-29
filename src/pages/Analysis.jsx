// pages/AnalysisPage.jsx - صفحة التحليل المُحدثة
import React from 'react';
import Navbar from '../components/common/Navbar';
import UploadPhotos from '../components/analysis/UploadPhotos';
import Timeline from '../components/analysis/Timeline';
import Chatbot from '../components/chatbot/Chatbot';
import Footer from '../components/common/Footer';

const AnalysisPage = ({ setCurrentPage }) => {
  return (
    <div className="analysis-page">
      <Navbar currentPage="analysis" setCurrentPage={setCurrentPage} />
      <UploadPhotos />
      <Timeline />
      <Chatbot />
      <Footer setCurrentPage={setCurrentPage} />
    </div>
  );
};

export default AnalysisPage;
