// EmailVerification.jsx
import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import '../../assets/styles/VerificationCode.css'
import bgImage from '../../assets/images/bglog.jpg'
import { apiRequest } from '../../services/api';

function EmailVerification({ email, password, rememberMe }) {
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', ''])
  const [error, setError] = useState('');
  const [showError, setShowError] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef([])
  const navigate = useNavigate();
  
  useEffect(() => {
    if (error) {
      setShowError(true);
    }
  }, [error]);

  // Focus on the first input when component mounts
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus()
    }
  }, [])

  useEffect(() => {
    // Set background
    document.body.style.backgroundColor = 'white';
    document.body.style.backgroundImage = `url(${bgImage})`;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
    document.body.style.backgroundRepeat = 'no-repeat';

    // Cleanup on unmount
    return () => {
      document.body.style.backgroundColor = '';
      document.body.style.backgroundImage = '';
      document.body.style.backgroundSize = '';
      document.body.style.backgroundPosition = '';
      document.body.style.backgroundRepeat = '';
    };
  }, []);

  const handleChange = (index, value) => {
    // Make sure the input is only one digit
    if (value.length > 1) {
      value = value.slice(-1)
    }
    
    // Only allow numbers
    if (value && !/^\d+$/.test(value)) {
      return
    }

    const newVerificationCode = [...verificationCode]
    newVerificationCode[index] = value
    setVerificationCode(newVerificationCode)
    
    // Move to next input if this one is filled
    if (value !== '' && index < 5) {
      inputRefs.current[index + 1].focus()
    }
  }

  const handleKeyDown = (index, e) => {
    // Move to previous input on backspace if current input is empty
    if (e.key === 'Backspace' && verificationCode[index] === '' && index > 0) {
      inputRefs.current[index - 1].focus()
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text/plain').trim()
    
    // Check if pasted content is 6 digits
    if (/^\d{6}$/.test(pastedData)) {
      const newVerificationCode = pastedData.split('')
      setVerificationCode(newVerificationCode)
      // Focus on the last input after paste
      inputRefs.current[5].focus()
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('');
    setLoading(true);
    const code = verificationCode.join('')
    try {
      await apiRequest('/auth/verify-code', {
        method: 'POST',
        body: { email, code }
      });
      // After verification, log the user in automatically
      const loginData = await apiRequest('/auth/login', {
        method: 'POST',
        body: { email, password }
      });
      if (rememberMe) {
        localStorage.setItem('token', loginData.token);
        localStorage.setItem('userId', loginData.user.id);
      } else {
        sessionStorage.setItem('token', loginData.token);
        sessionStorage.setItem('userId', loginData.user.id);
      }
      
      // For new users, always show onboarding
      // For existing users, check if they have completed onboarding
      try {
        const userProfile = await apiRequest('/profile/me', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${loginData.token}`,
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
  }

  const handleResendEmail = async (e) => {
    e.preventDefault()
    setError('');
    setLoading(true);
    try {
      await apiRequest('/auth/send-code', {
        method: 'POST',
        body: { email }
      });
      setError('Verification code resent! Please check your email.');
    } catch (err) {
      setError('Failed to resend code: ' + err.message);
    } finally {
      setLoading(false);
    }
  }

  const handleCloseError = () => {
    setShowError(false);
    setError('');
  };

  return (
    <div className="email-container">
      <div className="email-form-card verification-card">
        <h1>Please check your email</h1>
        <p>We have sent a reset code to your email. Enter 6 digit code that mentioned in the email</p>
        {showError && (
          <div className="popup-error-overlay">
            <div className="popup-error-box">
              <span>{error}</span>
              <button className="popup-error-close" onClick={handleCloseError}>OK</button>
            </div>
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="verification-inputs">
            {verificationCode.map((digit, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={index === 0 ? handlePaste : null}
                ref={(el) => (inputRefs.current[index] = el)}
                aria-label={`Digit ${index + 1}`}
                disabled={loading}
              />
            ))}
          </div>
          <button type="submit" className="verification-button" disabled={loading}>
            {loading ? 'Verifying...' : 'Verification'}
          </button>
        </form>
        
        <div className="resend-link">
          Haven't got the email yet?{' '}
          <a href="#" onClick={handleResendEmail} className="resend-link-text">
            {loading ? 'Resending...' : 'Resend email'}
          </a>
        </div>
      </div>
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
  )
}

export default EmailVerification;