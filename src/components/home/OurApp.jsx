// src/components/Mobile.jsx
import React, { useEffect, useRef } from "react";
import "../../assets/styles/OurApp.css";
import "bootstrap/dist/css/bootstrap.min.css";
// import iphone13 from '../../assets/images/iPhone13.png'
import phoneImage from "../../assets/images/iphone13.png";
import { FaMobileAlt, FaClock, FaFileAlt, FaGlobe } from "react-icons/fa";



const OurApp = () => {
  const textRef = useRef(null);
  const imgRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate");
            observer.unobserve(entry.target); // to animate once
          }
        });
      },
      { threshold: 0.1 }
    );

    if (textRef.current) observer.observe(textRef.current);
    if (imgRef.current) observer.observe(imgRef.current);
  }, []);

  return (
   <div className="container d-flex flex-column flex-md-row align-items-center justify-content-between mobile min-vh-100">

      <div className="text-section col-lg-8 mb-4 mb-md-0 slide-left" ref={textRef}>
        <h2 className="title fw-bold">Our App</h2>
        <p className="lead mb-4">
          Our mobile and web applications bring AI-driven medical diagnostics right to your fingertips.
        </p>

        <div className="features mt-4">
          <div className="feature d-flex align-items-start mb-2">
            <FaMobileAlt className="icon me-3 " />
            <div>
              <h6 className="fw-bold features-title">Easy Image Upload :</h6>
              <p className="features-description">
                Patients and healthcare providers can quickly upload X-ray and CT scan images for instant analysis.
              </p>
            </div>
          </div>

          <div className="feature d-flex align-items-start mb-2">
            <FaClock className="icon me-3" />
            <div>
              <h6 className="fw-bold features-title">Fast & Reliable Results :</h6>
              <p className="features-description">
                Get diagnostic insights within seconds, enabling quicker medical decisions and reducing waiting times.
              </p>
            </div>
          </div>

          <div className="feature d-flex align-items-start mb-2">
            <FaFileAlt className="icon me-3" />
            <div>
              <h6 className="fw-bold features-title">Personalized Reports :</h6>
              <p className="features-description">
                View detailed AI-generated reports that provide insights into possible medical conditions.
              </p>
            </div>
          </div>

          <div className="feature d-flex align-items-start">
            <FaGlobe className="icon me-3 " />
            <div>
              <h6 className="fw-bold features-title">Accessible Anywhere :</h6>
              <p className="features-description">
                Whether you're at a hospital, clinic, or home, our AI-powered tool is available whenever you need it.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="image-section col-lg-3 text-center slide-right" ref={imgRef}>
        <img src={phoneImage} alt="App display" className="img-fluid phone-img" />
      </div>
     
    </div>
  );
};

export default OurApp;


