
import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "../../assets/styles/footer.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

const Footer = ({ setCurrentPage }) => {
  const socialIconsRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const icons = entry.target.querySelectorAll('.social-icon');
            icons.forEach((icon, index) => {
              setTimeout(() => {
                icon.classList.add('animate-on-scroll');
              }, index * 200); // Stagger the animations
            });
          }
        });
      },
      {
        threshold: 0.3, // Trigger when 30% of the element is visible
        rootMargin: '0px 0px -50px 0px'
      }
    );

    if (socialIconsRef.current) {
      observer.observe(socialIconsRef.current);
    }

    return () => {
      if (socialIconsRef.current) {
        observer.unobserve(socialIconsRef.current);
      }
    };
  }, []);

  const handleNavigation = (page) => {
    if (setCurrentPage) {
      setCurrentPage(page);
    }
  };

  return (
    <footer>
      <div className="container">
        <div className="row">
          {/* Brand/Logo Column */}
          <div className="col-md-4 mb-4 mb-md-0">
            <div className="footer-brand">Neura-X</div>
            <div className="footer-tagline">
              "Revolutionizing Brain Scan Analysis with AI"
            </div>
          </div>

          {/* Navigation Links */}
          <div className="col-md-2 mb-4 mb-md-0">
            <div className="footer-links">
              <Link to="/">Home</Link>
              <Link to="/analysis">AI analysis</Link>
              <Link to="/contact">Contact us</Link>
            </div>
          </div>

          {/* Legal Links */}
          <div className="col-md-2 mb-4 mb-md-0">
            <div className="police-links">
              <a href="#">Terms & Condition</a>
              <a href="#">Privacy Policy</a>
            </div>
          </div>

          {/* Social Media Icons */}
          <div className="col-md-4" ref={socialIconsRef}>
            <div className="contact-heading">Get in touch</div>
            <div className="social-icons">
              <a href="#" className="social-icon">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="social-icon">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="social-icon">
                <i className="far fa-envelope"></i>
              </a>
              <a href="#" className="social-icon">
                <i className="fab fa-instagram"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;