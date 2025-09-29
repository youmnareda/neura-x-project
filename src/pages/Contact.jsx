// pages/ContactPage.jsx - صفحة التواصل المُحدثة
import React from 'react';
import Navbar from '../components/common/Navbar';
import Contact from '../components/contact/ContactForm';
import Footer from '../components/common/Footer';

const ContactPage = ({ setCurrentPage }) => {
  return (
    <div className="contact-page">
      <Navbar currentPage="contact" setCurrentPage={setCurrentPage} />
      <Contact />
      <Footer setCurrentPage={setCurrentPage} />
    </div>
  );
};

export default ContactPage;