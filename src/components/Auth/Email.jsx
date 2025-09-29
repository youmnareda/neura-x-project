// Email.jsx
import { useState, useEffect } from 'react'
import '../../assets/styles/Email.css'
import bgImage from '../../assets/images/bglog.jpg'



function Email() {

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


  const [email, setEmail] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Email submitted:', email)
    // Here you would typically handle the form submission
    // For example, sending the email to your backend
  }

  return (
    <div className="verify-email-wrapper">
      <div className="verify-email-card">
        <h1 className="verify-email-heading">Please enter your registered email ID</h1>
        <p className="verify-email-subtext">We will send a verification code to your registered email ID</p>
        
        <form className="verify-email-form" onSubmit={handleSubmit}>
          <div className="verify-email-field-wrapper">
            <input 
              type="email" 
              className="verify-email-input"
              placeholder="Email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button className="verify-email-submit-btn" type="submit">Send</button>
        </form>
      </div>
    </div>
  )
}
export default Email;