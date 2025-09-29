// src/components/About.jsx
import React, { useEffect } from "react";
import "../../assets/styles/AboutUs.css";
import "bootstrap/dist/css/bootstrap.min.css";
import About1 from '../../assets/images/About1.jpg';
import AOS from 'aos';
import 'aos/dist/aos.css';

const About = () => {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  return (
    <section className="about-section">
      <div className="container">
        <div className="row align-items-center">
          {/* Image Column */}
          <div className="col-lg-6 mb-4 mb-lg-0" data-aos="fade-right">
            <div className="about-image-container">
              <img
                src={About1}
                alt="AI Medical Diagnosis"
                className="about-image"
              />
            </div>
          </div>

          {/* Text Column */}
          <div className="col-lg-6" data-aos="fade-left">
            <h2 className="about-title">About Us</h2>
            <div className="about-text">
              <p>
                At AI-Powered Medical Diagnosis, we are committed to
                transforming healthcare with cutting-edge artificial
                intelligence. Our mission is to enhance early disease detection
                by providing accurate and fast medical image analysis. By
                leveraging advanced machine
              </p>
              <p>
                learning algorithms, we assist healthcare professionals in
                identifying critical conditions such as brain cancer, tumors,
                and aneurysms. Our goal is to improve patient outcomes through
                innovation, precision, and accessibility.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;