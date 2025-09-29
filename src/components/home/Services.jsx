import React, { useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import '../../assets/styles/Services.css';

const Services = () => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    const header = document.querySelector(".services-header");
    if (header) observer.observe(header);

    document.querySelectorAll(".service-card").forEach((card) => {
      observer.observe(card);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section className="services-section">
      <div className="container">
        <div className="services-header">
          <h2 className="services-title">Our Service</h2>
          <p className="services-description">
            We offer AI-driven diagnostic solutions to support medical professionals in detecting
            life-threatening conditions efficiently. Our key services include:
          </p>
        </div>

        <div className="row">
          {/* Left Card */}
          <div className="col-lg-4 col-md-6 card-container">
            <div className="service-card card-left">
              <div className="service-icon">
             
             <i class="fas fa-brain icon"></i>

              </div>
              <h3 className="service-title">Medical Image Analysis</h3>
              <div className="service-divider"></div>
              <p className="service-description">
              Upload X-ray or CT scan images, and our AI model will analyze and detect potential abnormalities.
              </p>
            </div>
          </div>

          {/* Bottom Card */}
          <div className="col-lg-4 col-md-6 card-container">
            <div className="service-card card-bottom">
              <div className="service-icon">
         
               <i class="fas fa-notes-medical icon"></i>
              </div>
              <h3 className="service-title">Early Disease Detection</h3>
              <div className="service-divider"></div>
              <p className="service-description">
               Our system identifies conditions such as brain cancer, tumors, and aneurysms, enabling timely medical intervention.
              </p>
            </div>
          </div>

          {/* Right Card */}
          <div className="col-lg-4 col-md-6 card-container">
            <div className="service-card card-right">
              <div className="service-icon">
               <i class="fas fa-tachometer-alt icon"></i>

              </div>
              <h3 className="service-title">Fast and Accurate Results</h3>
              <div className="service-divider"></div>
              <p className="service-description">
               With advanced algorithms, we provide rapid and reliable diagnostics to support healthcare decisions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;