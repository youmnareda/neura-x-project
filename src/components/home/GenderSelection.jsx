import React, { useState, useEffect } from "react";
import "../../assets/styles/GenderSelection.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { updateGender } from '../../services/auth';

const GenderSelection = ({ onNext, onBack }) => {
  const [selectedGender, setSelectedGender] = useState("female");
  const [loading, setLoading] = useState(false);

  const selectGender = (gender) => {
    setSelectedGender(gender);
    console.log("Selected gender:", gender);
  };

  const goBack = () => {
    if (onBack) onBack();
    console.log("Going back to previous step");
  };

  const nextStep = async () => {
    if (selectedGender && !loading) {
      setLoading(true);
      try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        const userId = localStorage.getItem('userId') || sessionStorage.getItem('userId');
        
        if (!token) {
          throw new Error('No authentication token found');
        }
        
        if (!userId) {
          throw new Error('No user ID found');
        }
        
        console.log('Sending gender update request:', { 
          gender: selectedGender, 
          userId: userId,
          url: `/admin/users/gender/${userId}`,
          token: token.substring(0, 20) + '...' 
        });
        
        await updateGender(token, selectedGender);
        console.log("Gender saved successfully:", selectedGender);
        
        if (onNext) onNext();
      } catch (error) {
        console.error('Failed to save gender:', error);
        console.error('Error details:', {
          message: error.message,
          status: error.status,
          response: error.response
        });
        alert('Failed to save gender: ' + error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    console.log("Gender selection page loaded");
  }, []);

  return (
    <div className="gender">
      <div className="container-custom">
        <div className="header">
          <span className="step-indicator">1/2</span>
        </div>

        <h1 className="title">What's is your gender?</h1>

        <div className="gender-options">
          {["male", "female"].map((gender) => (
            <div
              key={gender}
              className={`gender-option ${
                selectedGender === gender ? "selected" : ""
              }`}
              onClick={() => selectGender(gender)}
            >
              <div className="gender-icon">
                <i className="fas fa-user"></i>
              </div>
              <p className="gender-label">
                {gender.charAt(0).toUpperCase() + gender.slice(1)}
              </p>
            </div>
          ))}
        </div>
<button className="next-btn" onClick={nextStep} disabled={loading}>
  {loading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-chevron-right"></i>}
</button>

      </div>
    </div>
  );
};

export default GenderSelection;