// components/common/Sidebar.jsx - الكود الكامل المُحدث
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../../assets/styles/Sidebar.css'
import profileIcon from '../../assets/images/profile.svg';
import recordIcon from '../../assets/images/Recordsicon.svg';
import settingIcon from '../../assets/images/setting.svg';
import deleteACCIcon from '../../assets/images/delACC.svg';
import logoutIcon from '../../assets/images/logout.svg';
import darkIcon from '../../assets/images/dark.svg';
import logo from '../../assets/images/Logo  3.svg'
import DeleteAccountModal from '../profile/DeleteAccountModal';
import ConfirmModal from './ConfirmModal';
import { logout, deleteAccount } from '../../services/auth';


const Sidebar = () => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  // Check if device is mobile/tablet
  const checkIsMobile = () => {
    return window.innerWidth <= 1024;
  };

  // Initialize mobile state
  useEffect(() => {
    setIsMobile(checkIsMobile());
  }, []);

  // Toggle desktop sidebar
  const toggleSidebar = () => {
    if (!isMobile) {
      setIsCollapsed(!isCollapsed);
    }
  };

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    if (isMobile) {
      if (isMobileOpen) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    }
  };

  // Open mobile menu
  const openMobileMenu = () => {
    setIsMobileOpen(true);
    document.body.style.overflow = 'hidden';
  };

  // Close mobile menu
  const closeMobileMenu = () => {
    setIsMobileOpen(false);
    document.body.style.overflow = '';
  };

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isMobileOpen && isMobile) {
        closeMobileMenu();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isMobileOpen, isMobile]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = checkIsMobile();
      setIsMobile(mobile);
      
      if (!mobile) {
        // Desktop mode - close mobile menu and restore body scroll
        if (isMobileOpen) {
          setIsMobileOpen(false);
          document.body.style.overflow = '';
        }
      } else {
        // Mobile mode - reset collapsed state
        if (isCollapsed) {
          setIsCollapsed(false);
        }
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobileOpen, isCollapsed]);

  // Handle navigation link clicks
  const handleNavClick = (e, section) => {
    e.preventDefault();
    
    // Close mobile menu if open
    if (isMobile && isMobileOpen) {
      closeMobileMenu();
    }
    
    // Update active section if function provided
    if (setActiveSection && section) {
      setActiveSection(section);
    }
  };

  const handleDeleteAccountClick = (e) => {
    e.preventDefault();
    if (isMobile && isMobileOpen) {
      closeMobileMenu();
    }
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => setShowDeleteModal(false);

  const handleConfirmDelete = async () => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (!token) throw new Error('No authentication token found.');
      await deleteAccount(token);
      // Log out user and redirect to login
      await logout();
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      setShowDeleteModal(false);
      navigate('/');
      // Optionally show a success popup/modal here
    } catch (error) {
      setShowDeleteModal(false);
      alert(error.message || 'Failed to delete account.');
    }
  };

  const handleLogoutClick = (e) => {
    e.preventDefault();
    if (isMobile && isMobileOpen) {
      closeMobileMenu();
    }
    setShowLogoutModal(true);
  };

  const handleCloseLogoutModal = () => setShowLogoutModal(false);

  const handleConfirmLogout = async () => {
    try {
      await logout();
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      setShowLogoutModal(false);
      navigate('/');
    } catch (error) {
      alert('Logout failed: ' + (error.message || 'Unknown error'));
    }
  };

  // Navigation items configuration
  const navItems = [
    {
      id: 'home',
      icon: 'home',
      label: 'Home',
      path: '/',
      isActive: location.pathname === '/'
    },
    {
      id: 'profile',
      icon: 'account_circle',
      label: 'Profile',
      path: '/profile',
      isActive: location.pathname === '/profile'
    },
    {
      id: 'records',
      icon: 'description',
      label: 'Record',
      path: '/profile/records',
      isActive: location.pathname === '/profile/records'
    },
    {
      id: 'settings',
      icon: 'settings',
      label: 'Setting',
      path: '/profile/settings',
      isActive: location.pathname === '/profile/settings'
    },
    {
      id: 'darkmode',
      icon: 'dark_mode',
      label: 'Dark Mode',
      path: '#',
      isActive: false
    }
  ];

  return (
    <>
      <aside className={`sidebar ${isCollapsed && !isMobile ? 'collapsed' : ''} ${isMobileOpen && isMobile ? 'mobile-open' : ''}`}>
        {/* Sidebar header */}
        <header className="sidebar-header">
          <Link to="/" className="header-logo">
            <img src={logo} alt="logo" />
          </Link>
          {!isMobile && (
            <button className="toggler sidebar-toggler" onClick={toggleSidebar}>
              <span className="material-symbols-rounded">chevron_left</span>
            </button>
          )}
        </header>

        <nav className="sidebar-nav">
          {/* Primary top nav */}
          <ul className="nav-list primary-nav">
            {navItems.filter(item => item.id !== 'darkmode').map(item => (
              <li key={item.id} className={`nav-item${item.isActive ? ' active' : ''}`}> 
                <Link to={item.path} className="nav-link">
                  <span className="material-symbols-rounded">{item.icon}</span>
                  <span className="nav-label">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>

          {/* Secondary bottom nav */}
          <ul className="nav-list secondary-nav">
            <li className="nav-item">
              <a href="#" className="nav-link" onClick={handleDeleteAccountClick}>
                <span className="nav-icon material-symbols-rounded">person_cancel</span>
                <span className="nav-label">Delete Account</span>
              </a>
              {!isMobile && <span className="nav-tooltip">Delete Account</span>}
            </li>
            <li className="nav-item">
              <a href="#" className="nav-link" onClick={handleLogoutClick}>
                <span className="nav-icon material-symbols-rounded">logout</span>
                <span className="nav-label">Logout</span>
              </a>
              {!isMobile && <span className="nav-tooltip">Logout</span>}
            </li>
          </ul>
        </nav>
      </aside>

      {/* Mobile menu button */}
      {isMobile && (
        <button 
          className={`mobile-menu-btn ${isMobileOpen ? 'active' : ''}`} 
          onClick={toggleMobileMenu}
          aria-label={isMobileOpen ? 'Close menu' : 'Open menu'}
        >
          <span className="material-symbols-rounded">
            {isMobileOpen ? 'close' : 'menu'}
          </span>
        </button>
      )}

      {/* Overlay for mobile */}
      {isMobile && (
        <div
          className={`mobile-overlay ${isMobileOpen ? 'active' : ''}`}
          onClick={closeMobileMenu}
        ></div>
      )}

      {/* Modals */}
      <DeleteAccountModal
        isOpen={showDeleteModal}
        onClose={handleCloseDeleteModal}
        onDelete={handleConfirmDelete}
      />

      <ConfirmModal
        isOpen={showLogoutModal}
        onClose={handleCloseLogoutModal}
        onConfirm={handleConfirmLogout}
        title="Log out"
        message="Are you sure you want to log out?"
        confirmLabel="Log out"
      />
    </>
  );
};

export default Sidebar;