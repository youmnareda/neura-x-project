// Updated part of your Navbar component
import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { routes } from '../../routes/routes.config';
import { FaHome, FaChartBar, FaEnvelope, FaBell } from "react-icons/fa";
import '../../assets/styles/navbar.css';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Logo from "../../assets/images/Logo.svg";
import not from '../../assets/images/not.png';
import profile from '../../assets/images/profile-pic.png';


const Navbar = () => {
  const [showNotification, setShowNotification] = useState(false);
  const [bellAnimating, setBellAnimating] = useState(false); // Animation state
  const panelRef = useRef(null);
  const bellRefMobile = useRef(null);
  const bellRefDesktop = useRef(null);
  const location = useLocation(); // Add this to track current location

  const navRoutes = routes.filter(route => route.showInNav);

  // Function to determine if a route is active
  const isActiveRoute = (routePath) => {
    const path = routePath === 'home' ? '/' : `/${routePath}`;
    return location.pathname === path;
  };

  const getIcon = (iconName) => {
    const icons = {
      FaHome: FaHome,
      FaChartBar: FaChartBar,
      FaEnvelope: FaEnvelope
    };
    return icons[iconName] || FaHome;
  };

  const toggleNotification = (e) => {
    e.preventDefault();
    setShowNotification(!showNotification);
    setBellAnimating(true);
    setTimeout(() => setBellAnimating(false), 700); // Match animation duration
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      const isClickInside =
        (panelRef.current && panelRef.current.contains(event.target)) ||
        (bellRefMobile.current && bellRefMobile.current.contains(event.target)) ||
        (bellRefDesktop.current && bellRefDesktop.current.contains(event.target));

      if (!isClickInside) {
        setShowNotification(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light">
        <div className="container-fluid">
          <div className="d-flex align-items-center">
            <img src={Logo} alt="logo" className="icon-logo" />
            <Link className="navbar-brand" to="/">
              Neura-X
            </Link>
          </div>

          <div className="d-flex align-items-center d-lg-none">
            <div className="profile-group">
              <a href="#" ref={bellRefMobile} onClick={toggleNotification}>
                <FaBell className={`fa-2x not${bellAnimating ? ' bell-animate' : ''}`} />
              </a>
              <Link to="/profile">
                <img
                  src={profile}
                  className="rounded-circle"
                  width="40"
                  height="40"
                  alt="user"
                  style={{ cursor: 'pointer' }}
                />
              </Link>
              <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarNav"
              >
                <span className="navbar-toggler-icon"></span>
              </button>
            </div>
          </div>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
              {navRoutes.map(route => (
                <li key={route.path} className="nav-item">
                  <Link 
                    className={`nav-link ${isActiveRoute(route.path) ? 'active' : ''}`}
                    to={route.path === 'home' ? '/' : `/${route.path}`}
                  >
                    {route.name}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="profile-group d-none d-lg-flex">
              <a href="#" ref={bellRefDesktop} onClick={toggleNotification}>
                <FaBell className={`fa-2x not${bellAnimating ? ' bell-animate' : ''}`} />
              </a>
              <Link to="/profile">
                <img
                  src={profile}
                  className="rounded-circle"
                  width="50"
                  height="50"
                  alt="user"
                  style={{ cursor: 'pointer' }}
                />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {showNotification && (
        <div ref={panelRef} className="notification-box">
          <div className="header">Notification</div>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="notification-item">
              <img src={not} width="40" alt="notif" />
              <span className="fw-bold ms-2">Neura-X</span>
              <span className="date">Dec 12, 2025</span>
              <span className="dot"></span>
              <p className="mt-2 mb-0 small">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.
              </p>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default Navbar;