import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../assets/styles/AuthForm.css';
import bgImage from '../../assets/images/bglog.jpg'
import { apiRequest } from '../../services/api';
import EmailVerification from './VerificationCode';
import { useAuthContext } from '../../contexts/AuthContext';


const AuthForm = () => {
  const navigate = useNavigate();
  const { setToken } = useAuthContext();

  useEffect(() => {
    // Set background
    document.body.style.backgroundColor = '#F4F5F9';
    // Redirect if already authenticated
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
      navigate('/home');
    }
    // Cleanup on unmount
    return () => {
      document.body.style.backgroundColor = '';
    };
  }, [navigate]);

  // State for handling the slide animation
  const [isSignUp, setIsSignUp] = useState(false);

  // Password visibility states
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  
  // Remember me state
  const [rememberMe, setRememberMe] = useState(false);

  // Form states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupData, setSignupData] = useState({
    firstName: '',
    lastName: '',
    userName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [showError, setShowError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState('auth'); // 'auth' | 'verify'
  const [verificationEmail, setVerificationEmail] = useState('');

  useEffect(() => {
    if (error) {
      setShowError(true);
    }
  }, [error]);

  // Toggle password visibility
  const togglePasswordVisibility = (field) => {
    if (field === 'password') {
      setPasswordVisible(!passwordVisible);
    } else if (field === 'confirmPassword') {
      setConfirmPasswordVisible(!confirmPasswordVisible);
    }
  };

  // Handle remember me change
  const handleRememberMeChange = (e) => {
    setRememberMe(e.target.checked);
  };

  // Handle login form submit
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await apiRequest('/auth/login', {
        method: 'POST',
        body: { email: loginEmail, password: loginPassword }
      });
      // Store token and user ID
      if (rememberMe) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data.user.id);
      } else {
        sessionStorage.setItem('token', data.token);
        sessionStorage.setItem('userId', data.user.id);
      }
      setToken(data.token); // <-- Update AuthContext with the token
      // For new users, always show onboarding
      // For existing users, check if they have completed onboarding
      try {
        const userProfile = await apiRequest('/profile/me', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${data.token}`,
          },
        });
        
        const hasCompletedOnboarding = userProfile.gender && userProfile.birthDate;
        
        if (!hasCompletedOnboarding) {
          // Navigate to home with onboarding flag for new users
          navigate('/home', { state: { showWelcomePopups: true } });
        } else {
          // Navigate to home normally for existing users
          navigate('/home');
        }
      } catch (profileError) {
        console.error('Failed to fetch user profile:', profileError);
        // If we can't fetch profile, assume new user and show onboarding
        navigate('/home', { state: { showWelcomePopups: true } });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle signup form submit
  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await apiRequest('/auth/register', {
        method: 'POST',
        body: signupData
      });
      // Redirect to email verification page with required data
      navigate('/emailverification', {
        state: {
          email: signupData.email,
          password: signupData.password,
          rememberMe: rememberMe
        }
      });
      setError('Registered successfully! Please check your email for the verification code.');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle signup input change
  const handleSignupChange = (e) => {
    setSignupData({ ...signupData, [e.target.name]: e.target.value });
  };

  const handleCloseError = () => {
    setShowError(false);
    setError('');
  };

  return (
    <div className={`auth-container ${isSignUp ? "auth-right-panel-active" : ""}`}>
      {showError && (
        <div className="popup-error-overlay">
          <div className="popup-error-box">
            <span>{error}</span>
            <button className="popup-error-close" onClick={handleCloseError}>OK</button>
          </div>
        </div>
      )}
      {mode === 'verify' ? (
        <EmailVerification
          email={verificationEmail}
          password={signupData.password}
          rememberMe={rememberMe}
        />
      ) : (
        <>
          {/* Sign Up Form Container */}
          <div className="auth-form-container auth-sign-up-container">
            <form className="auth-form" onSubmit={handleSignup}>
              <h1 className="auth-form-title">Create Account</h1>
              <div className="auth-form-row">
                <div className="auth-form-group">
                  <input type="text" name="firstName" className="auth-form-control" placeholder="First Name" required value={signupData.firstName} onChange={handleSignupChange} />
                </div>
                <div className="auth-form-group">
                  <input type="text" name="lastName" className="auth-form-control" placeholder="Last Name" required value={signupData.lastName} onChange={handleSignupChange} />
                </div>
              </div>
              <div className="auth-form-group">
                <input type="text" name="userName" className="auth-form-control" placeholder="User Name" required value={signupData.userName} onChange={handleSignupChange} />
              </div>
              <div className="auth-form-group">
                <input type="email" name="email" className="auth-form-control" placeholder="Email Address" required value={signupData.email} onChange={handleSignupChange} />
              </div>
              <div className="auth-form-group">
                <input type="text" name="phoneNumber" className="auth-form-control" placeholder="Phone Number" required value={signupData.phoneNumber} onChange={handleSignupChange} />
              </div>
              <div className="auth-form-group auth-password-container">
                <input
                  type={passwordVisible ? "text" : "password"}
                  name="password"
                  className="auth-form-control"
                  placeholder="Password"
                  required
                  value={signupData.password}
                  onChange={handleSignupChange}
                />
                <span
                  className="auth-toggle-password"
                  onClick={() => togglePasswordVisibility('password')}
                >
                  <img
                    width="20"
                    height="20"
                    src={passwordVisible ? "https://img.icons8.com/windows/24/visible--v1.png" : "https://img.icons8.com/windows/24/hide.png"}
                    alt="toggle password visibility"
                  />
                </span>
              </div>
              <div className="auth-form-group auth-password-container">
                <input
                  type={confirmPasswordVisible ? "text" : "password"}
                  name="confirmPassword"
                  className="auth-form-control"
                  placeholder="Confirm Password"
                  required
                  value={signupData.confirmPassword}
                  onChange={handleSignupChange}
                />
                <span
                  className="auth-toggle-password"
                  onClick={() => togglePasswordVisibility('confirmPassword')}
                >
                  <img
                    width="20"
                    height="20"
                    src={confirmPasswordVisible ? "https://img.icons8.com/windows/24/hide.png" : "https://img.icons8.com/windows/24/visible--v1.png"}
                    alt="toggle password visibility"
                  />
                </span>
              </div>
              <button type="submit" className="auth-form-button" disabled={loading}>{loading ? 'Signing Up...' : 'Sign Up'}</button>
              <div className="auth-divider">
                <span>Or Continue with</span>
              </div>
              <div className="auth-social-login">
                <button type="button" className="auth-social-button">
                  <img
                    width="20"
                    height="20"
                    src="https://img.icons8.com/color/24/google-logo.png"
                    alt="google-logo"
                  />
                  Google
                </button>
                <button type="button" className="auth-social-button">
                  <img
                    width="20"
                    height="20"
                    src="https://img.icons8.com/ios-filled/24/mac-os.png"
                    alt="mac-os"
                  />
                  Apple
                </button>
              </div>
              {/* Mobile toggle button - only visible on mobile */}
              <button 
                type="button" 
                className="auth-mobile-toggle auth-mobile-login-btn"
                onClick={() => setIsSignUp(false)}
              >
                Already have an account? Log In
              </button>
            </form>
          </div>

          {/* Sign In Form Container */}
          <div className="auth-form-container auth-sign-in-container">
            <form className="auth-form" onSubmit={handleLogin}>
              <h1 className="auth-form-title">Sign In</h1>
              <div className="auth-form-group">
                <input type="email" className="auth-form-control" placeholder="Email Address" required value={loginEmail} onChange={e => setLoginEmail(e.target.value)} />
              </div>
              <div className="auth-form-group auth-password-container">
                <input
                  type={passwordVisible ? "text" : "password"}
                  className="auth-form-control"
                  placeholder="Password"
                  required
                  value={loginPassword}
                  onChange={e => setLoginPassword(e.target.value)}
                />
                <span
                  className="auth-toggle-password"
                  onClick={() => togglePasswordVisibility('password')}
                >
                  <img
                    width="20"
                    height="20"
                    src={passwordVisible ? "https://img.icons8.com/windows/24/visible--v1.png" : "https://img.icons8.com/windows/24/hide.png"}
                    alt="toggle password visibility"
                  />
                </span>
              </div>
              <div className="auth-form-options">
                <div className="auth-remember-me">
                  <label className="auth-checkbox-container">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={handleRememberMeChange}
                    />
                    <span className="auth-checkmark"></span>
                    Remember me
                  </label>
                </div>
                <a href="#" className="auth-forgot-password">Forgot password?</a>
              </div>
              <button type="submit" className="auth-form-button" disabled={loading}>{loading ? 'Logging In...' : 'Log In'}</button>
              <div className="auth-divider">
                <span>Or Continue with</span>
              </div>
              <div className="auth-social-login">
                <button type="button" className="auth-social-button">
                  <img
                    width="20"
                    height="20"
                    src="https://img.icons8.com/color/24/google-logo.png"
                    alt="google-logo"
                  />
                  Google
                </button>
                <button type="button" className="auth-social-button">
                  <img
                    width="20"
                    height="20"
                    src="https://img.icons8.com/ios-filled/24/mac-os.png"
                    alt="mac-os"
                  />
                  Apple
                </button>
              </div>
              {/* Mobile toggle button - only visible on mobile */}
              <button 
                type="button" 
                className="auth-mobile-toggle auth-mobile-signup-btn"
                onClick={() => setIsSignUp(true)}
              >
                Don't have an account? Sign Up
              </button>
            </form>
          </div>

          {/* Overlay Container - hidden on mobile */}
          <div className="auth-overlay-container">
            <div className="auth-overlay">
              <div className="auth-overlay-panel auth-overlay-left">
                <h1 className="auth-heading">Welcome Back!</h1>
                <p className="auth-text">To keep connected with us please login with your personal info</p>
                <button className="auth-overlay-button auth-ghost" onClick={() => setIsSignUp(false)}>
                  Sign In
                </button>
              </div>
              <div className="auth-overlay-panel auth-overlay-right">
                <h1 className="auth-heading">Hello, Friend!</h1>
                <p className="auth-text">Enter your personal details and start your journey with us</p>
                <button className="auth-overlay-button auth-ghost" onClick={() => setIsSignUp(true)}>
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        </>
      )}
      {/* Popup error styles */}
      <style>{`
        .popup-error-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
        }
        .popup-error-box {
          background: #fff;
          padding: 2rem 2.5rem;
          border-radius: 8px;
          box-shadow: 0 2px 16px rgba(0,0,0,0.15);
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 500px;
        }
        .popup-error-box span {
          color: #d32f2f;
          margin-bottom: 1.2rem;
          font-size: 1.1rem;
        }
        .popup-error-close {
          background: #6A72E8;
          color: #fff;
          border: none;
          border-radius: 4px;
          padding: 0.5rem 1.5rem;
          font-size: 1rem;
          cursor: pointer;
        }
        .popup-error-close:hover {
          background: #4b51b6;
        }
      `}</style>
    </div>
  );
};

export default AuthForm;