import React from 'react';
import '../../assets/styles/DeleteAccountModal.css';

const DeleteAccountModal = ({ isOpen, onClose, onDelete }) => {
  if (!isOpen) return null;
  return (
    <div className="delete-modal-overlay">
      <div className="delete-modal-box">
        <h2 className="delete-modal-title">Delete Account</h2>
        <p className="delete-modal-message">
          Please confirm that you'd like to permanently delete your Neura-X account.
        </p>
        <div className="delete-modal-actions">
          <button className="delete-modal-cancel" onClick={onClose}>Cancel</button>
          <button className="delete-modal-delete" onClick={onDelete}>Delete</button>
        </div>
      </div>
    </div>
  );
};

export default DeleteAccountModal; 