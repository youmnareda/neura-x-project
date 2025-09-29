import { useState, useEffect } from 'react';
import '../../assets/styles/ForgetPass.css';
import bgImage from '../../assets/images/bglog.jpg'



function ResetPassword() {

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
  
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle password reset logic here
    console.log('Password reset submitted');
  };

  const toggleNewPasswordVisibility = () => {
    setShowNewPassword(!showNewPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="reset-password-container">
      <div className="reset-password-form-card">
        <h1 className="reset-password-heading">Create New Password</h1>
        <p className="reset-password-instruction">This password should be different from the previous password</p>
        
        <form className="reset-password-form" onSubmit={handleSubmit}>
          <div className="reset-password-field">
            <input
              type={showNewPassword ? "text" : "password"}
              placeholder="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="reset-password-input"
              required
            />
            <button 
              type="button" 
              className="reset-password-toggle-visibility"
              onClick={toggleNewPasswordVisibility}
            >
              <img 
                src={showNewPassword 
                  ? " https://img.icons8.com/windows/24/visible--v1.png" 
                  : "https://img.icons8.com/windows/24/hide.png"}
                alt={showNewPassword ? "Hide password" : "Show password"}
                width="20"
                height="20"
                className="reset-password-toggle-icon"
              />
            </button>
          </div>
          
          <div className="reset-password-field">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="reset-password-input"
              required
            />
            <button 
              type="button" 
              className="reset-password-toggle-visibility"
              onClick={toggleConfirmPasswordVisibility}
            >
              <img 
                src={showConfirmPassword 
                  ? "https://img.icons8.com/windows/24/hide.png" 
                  : "https://img.icons8.com/windows/24/visible--v1.png"}
                alt={showConfirmPassword ? "Hide password" : "Show password"}
                width="20"
                height="20"
                className="reset-password-toggle-icon"
              />
            </button>
          </div>
          
          <button type="submit" className="reset-password-submit-button">
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;