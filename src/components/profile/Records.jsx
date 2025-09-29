import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../assets/styles/Record.css';
import emptyRec from '../../assets/images/emptyRec.svg';
import useAuth from '../../hooks/useAuth';
import { fetchRecords, deleteRecord } from '../../services/analysis';

const Record = () => {
  const navigate = useNavigate();
  const { token, setToken } = useAuth();
  const [openMenuId, setOpenMenuId] = useState(null);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedRecords, setSelectedRecords] = useState([]);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token && localStorage.getItem('token')) {
      setToken(localStorage.getItem('token'));
    }
  }, [token, setToken]);

  useEffect(() => {
    const loadRecords = async () => {
      if (!token) {
        console.log('No token available, skipping records fetch');
        return;
      }
      
      setLoading(true);
      setError(null);
      try {
        console.log('Fetching records with token:', token.substring(0, 20) + '...');
        const response = await fetchRecords(token);
        console.log('Fetched records response:', response);
        // Backend returns { message: "...", data: scans }
        const recordsData = response.data || [];
        console.log('Setting records:', recordsData);
        setRecords(recordsData);
      } catch (err) {
        console.error('Error fetching records:', err);
        setError(err.message || 'Failed to load records');
      } finally {
        setLoading(false);
      }
    };
    loadRecords();
  }, [token]);

  const handleMenuClick = (recordId) => {
    setOpenMenuId(openMenuId === recordId ? null : recordId);
  };

  const handleDelete = async (recordId) => {
    try {
      await deleteRecord(recordId, token);
      setRecords(prev => prev.filter(record => record._id !== recordId && record.id !== recordId));
    } catch (err) {
      alert(err.message || 'Failed to delete record');
    }
    setOpenMenuId(null);
  };

  const handleEditName = (recordId) => {
    console.log('Edit name for record:', recordId);
    setOpenMenuId(null);
  };

  const handleSelectClick = () => {
    setIsSelectionMode(!isSelectionMode);
    if (isSelectionMode) {
      setSelectedRecords([]);
    }
  };

  const handleCheckboxChange = (recordId) => {
    setSelectedRecords(prev => 
      prev.includes(recordId) 
        ? prev.filter(id => id !== recordId)
        : [...prev, recordId]
    );
  };

  const handleDeleteSelected = () => {
    setRecords(prev => prev.filter(record => !selectedRecords.includes(record._id)));
    setSelectedRecords([]);
    setIsSelectionMode(false);
  };

  const handleDeleteAll = () => {
    setRecords([]);
    setSelectedRecords([]);
    setIsSelectionMode(false);
  };

  const handleRecordClick = (recordId, event) => {
    // Prevent navigation if clicking on checkbox or menu button
    if (event.target.type === 'checkbox' || 
        event.target.closest('.menu-btn') || 
        event.target.closest('.menu-dropdown')) {
      return;
    }
    
    // Navigate to single record page
    navigate(`/profile/records/${recordId}`);
  };

  const handleCellClick = (recordId, event) => {
    // Prevent event bubbling to avoid double navigation
    event.stopPropagation();
    
    // Navigate to single record page
    navigate(`/profile/records/${recordId}`);
  };

  console.log('loading:', loading, 'error:', error, 'records:', records, 'token:', !!token);
  console.log('Token from useAuth:', token);

  return (
    <div className="record-container">
      <div className="record-header">
        <h2>Record</h2>
        <div className="header-buttons">
          <button 
            className={`select-btn ${isSelectionMode ? 'active' : ''}`}
            onClick={handleSelectClick}
            disabled={records.length === 0}
          >
            {isSelectionMode ? 'Cancel' : 'Select'}
          </button>
          <button 
            className={`delete-btn ${isSelectionMode ? 'delete-selected' : ''}`}
            onClick={isSelectionMode ? handleDeleteSelected : handleDeleteAll}
            disabled={records.length === 0}
          >
            {isSelectionMode ? 'Delete' : 'Delete all'}
          </button>
        </div>
      </div>
      
      {loading ? (
        <div className="empty-state">
          <p>Loading records...</p>
        </div>
      ) : error ? (
        <div className="empty-state">
          <p>Error: {error}</p>
        </div>
      ) : records.length === 0 ? (
        <div className="empty-state">
          <img src={emptyRec} alt="No records" className="empty-icon" />
          <p className="empty-text">Your record list is empty</p>
          <p className="empty-subtext">Upload your first scan to see it here!</p>
        </div>
      ) : (
        <div className="record-table">
          <div className="table-header">
            <div className="header-cell checkbox-header"></div>
            <div className="header-cell record-name-header">Record Name</div>
            <div className="header-cell date-header">Date</div>
            <div className="header-cell description-header">Description</div>
          </div>
          
          <div className="table-body">
            {records.map((record) => (
              <div 
                key={record._id} 
                className="table-row"
                onClick={(e) => handleRecordClick(record._id, e)}
                style={{ cursor: 'pointer' }}
              >
                <div className="table-cell checkbox-cell">
                  {isSelectionMode && (
                    <input
                      type="checkbox"
                      checked={selectedRecords.includes(record._id)}
                      onChange={() => handleCheckboxChange(record._id)}
                      className="record-checkbox"
                    />
                  )}
                </div>
                <div 
                  className="table-cell record-name-cell"
                  onClick={(e) => handleCellClick(record._id, e)}
                >
                  {record.label || 'Scan'}
                </div>
                <div 
                  className="table-cell date-cell"
                  onClick={(e) => handleCellClick(record._id, e)}
                >
                  {new Date(record.createdAt).toLocaleDateString()}
                </div>
                <div 
                  className="table-cell description-cell"
                  onClick={(e) => handleCellClick(record._id, e)}
                >
                  Probability: {record.probability}
                </div>
                <div className="table-cell menu-cell">
                  <button 
                    className="menu-btn" 
                    onClick={() => handleMenuClick(record._id)}
                  >
                    ⋮
                  </button>
                  {openMenuId === record._id && (
                    <div className="menu-dropdown">
                      <button 
                        className="dropdown-item edit-item"
                        onClick={() => handleEditName(record._id)}
                      >
                        Edit Name
                      </button>
                      <hr className="dropdown-divider" />
                      <button 
                        className="dropdown-item delete-item"
                        onClick={() => handleDelete(record._id)}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Record;