import React from "react";
import "../../assets/styles/Header.css";
 import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import BG from "../../assets/images/BG.jpeg"

const Header = () => {
  return (
    <section className="hero-section d-flex align-items-center">
      <img src={BG} alt="Background" className="bg-img" />
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-6">
            <div className="hero-content">
              <h1 className="hero-title">Start Your AI-Powered Diagnosis Today</h1>
              <p className="hero-description">
                Take advantage of cutting-edge AI technology to detect critical
                conditions early and make informed healthcare decisions. Upload
                your CT scans now and receive fast, accurate results
                within seconds. Join the future of medical diagnostics and
                empower yourself with AI-driven insights.
              </p>
              <a href="#" className="cta-button">
                <i className="fas fa-play me-2"></i>Get Started
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};


export default Header;
