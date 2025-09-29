import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../../assets/styles/Single-Record.css';


const SingleRecord  = () => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate('/profile/records');
  };

  return (
    <div className="single-record-wrapper">
      <div className="single-record-container">
        <div className="single-record-header">
          <i className="fas fa-arrow-left single-record-back-icon" onClick={handleBackClick}></i>
          <h4 className="single-record-title">Name</h4>
        </div>

        <div className="single-record-image-preview"></div>
        <p className="single-record-date">Uploaded: July 25,2025</p>

        <h5 className="single-record-results-title">Analysis Results</h5>

        <div className="single-record-result-box">
          <span>Primary Condition</span>
          <span className="single-record-tag">Tumor (71.52%)</span>
        </div>

        <div className="single-record-result-box">
          <span>Tumor Subtype</span>
          <span className="single-record-tag">Glioblastoma (99.88%)</span>
        </div>

        <div className="single-record-save-button-container">
          <button className="single-record-save-btn">
            Download
          </button>
        </div>
      </div>
    </div>
  );
};

export default SingleRecord ;