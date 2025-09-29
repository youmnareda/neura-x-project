import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import '../../assets/styles/Result.css';
import { FaArrowLeft, FaFileDownload, FaSave } from "react-icons/fa";

const AnalysisResult = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showModal, setShowModal] = useState(false);
  const [recordTitle, setRecordTitle] = useState("");

  // Get analysis result from navigation state or localStorage
  const [analysis, setAnalysis] = useState(() => {
    const stateAnalysis = location.state && location.state.analysis;
    if (stateAnalysis) return stateAnalysis;
    const stored = localStorage.getItem('analysis');
    return stored ? JSON.parse(stored) : null;
  });
  const [imagePreviewUrl, setImagePreviewUrl] = useState(() => {
    const stateUrl = location.state && location.state.imagePreviewUrl;
    if (stateUrl) return stateUrl;
    return localStorage.getItem('imagePreviewUrl') || null;
  });

  // On mount or when location.state changes, update localStorage if new data is present
  useEffect(() => {
    if (location.state && location.state.analysis) {
      localStorage.setItem('analysis', JSON.stringify(location.state.analysis));
    }
    if (location.state && location.state.imagePreviewUrl) {
      localStorage.setItem('imagePreviewUrl', location.state.imagePreviewUrl);
    }
  }, [location.state]);

  const handleBackClick = () => {
    navigate('/analysis');
  };

  const handleDownload = async (scanId) => {
    if (!scanId) {
      alert('No scan ID available for download.');
      return;
    }
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
      const response = await fetch(`${API_BASE_URL}/api/scan/export/${scanId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to download file');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'scan-result.pdf';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert('Download failed: ' + err.message);
    }
  };

  return (
    <div className="result-container">
      <div className="analysis-card">
        <div className="header">
          <button className="back-btn" onClick={handleBackClick}>
            <FaArrowLeft /> Back
          </button>
        </div>
        <div className="image-section">
          {imagePreviewUrl ? (
            <img src={imagePreviewUrl} alt="Uploaded scan" className="result-image" />
          ) : (
            <div className="no-image-placeholder">No image available</div>
          )}
        </div>
        <h2 className="results-title">Analysis Results</h2>
        {analysis ? (
          <div className="results-list">
            <div className="result-item">
              <span className="result-label">Diagnosis:</span>
              <span className="result-value">{analysis.label} {analysis.probability ? `(${analysis.probability})` : ''}</span>
            </div>
            {analysis.details && (
              <div className="result-item">
                <span className="result-label">Details:</span>
                <span className="result-value">{analysis.details}</span>
              </div>
            )}
            {analysis.recommendations && (
              <div className="result-item">
                <span className="result-label">Recommendations:</span>
                <span className="result-value">{analysis.recommendations}</span>
              </div>
            )}
            <div className="button-row">
              {analysis && analysis._id ? (
                <button className="action-btn" onClick={() => handleDownload(analysis._id)}>
                  <FaFileDownload /> Download PDF
                </button>
              ) : (
                <div className="no-result">Download not available: No scan ID.</div>
              )}
            </div>
          </div>
        ) : (
          <div className="no-result">No analysis result available. Please upload a scan first.</div>
        )}
      </div>
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3 className="modal-title">New Record</h3>
            <input
              className="modal-input"
              type="text"
              placeholder="Title/Name"
              value={recordTitle}
              onChange={e => setRecordTitle(e.target.value)}
            />
            <div className="modal-actions">
              <button className="modal-cancel" onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button className="modal-ok" onClick={async () => {
                if (!recordTitle.trim()) {
                  alert('Please enter a title for the record.');
                  return;
                }
                const token = localStorage.getItem('token') || sessionStorage.getItem('token');
                try {
                  const response = await fetch('https://brain-scan-nine.vercel.app/api/scan/save', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                      title: recordTitle,
                      analysis,
                      imageUrl: imagePreviewUrl,
                    }),
                  });
                  if (!response.ok) throw new Error('Failed to save record');
                  alert('Record saved successfully!');
                  setShowModal(false);
                  setRecordTitle("");
                } catch (err) {
                  alert('Save failed: ' + err.message);
                }
              }}>
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalysisResult;