import React from 'react';
import '../../assets/styles/ConfirmModal.css';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, confirmLabel, confirmClass, cancelLabel }) => {
  if (!isOpen) return null;
  return (
    <div className="confirm-modal-overlay">
      <div className="confirm-modal-box">
        <h2 className="confirm-modal-title">{title}</h2>
        <p className="confirm-modal-message">{message}</p>
        <div className="confirm-modal-actions">
          <button className="confirm-modal-cancel" onClick={onClose}>{cancelLabel || 'Cancel'}</button>
          <button className={`confirm-modal-confirm ${confirmClass || ''}`} onClick={onConfirm}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal; 