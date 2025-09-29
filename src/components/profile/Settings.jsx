import React, { useState } from 'react';
import '../../assets/styles/Setting.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { changePassword, changeEmail } from '../../services/auth';
import ConfirmModal from '../common/ConfirmModal';

const Setting = () => {
  const [showPassword, setShowPassword] = useState({});
  const [passwordEditing, setPasswordEditing] = useState(false);
  const [emailEditing, setEmailEditing] = useState(false);
  const [passwordFields, setPasswordFields] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [emailFields, setEmailFields] = useState({
    newEmail: '',
    confirmNewEmail: '',
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalTitle, setModalTitle] = useState('');

  const showMessage = (msg, type = 'success') => {
    setModalMessage(msg);
    setModalTitle(type === 'success' ? 'Success' : 'Error');
    setModalOpen(true);
  };

  const handlePasswordChange = (e) => {
    setPasswordFields({ ...passwordFields, [e.target.id]: e.target.value });
  };

  const handleEmailChange = (e) => {
    setEmailFields({ ...emailFields, [e.target.id]: e.target.value });
  };

  const handlePasswordSave = async () => {
    if (!passwordFields.currentPassword || !passwordFields.newPassword || !passwordFields.confirmNewPassword) {
      showMessage('Please fill in all password fields.', 'error');
      return;
    }
    if (passwordFields.newPassword !== passwordFields.confirmNewPassword) {
      showMessage('New passwords do not match.', 'error');
      return;
    }
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) {
      showMessage('You are not authenticated.', 'error');
      return;
    }
    try {
      await changePassword(token, {
        oldPassword: passwordFields.currentPassword,
        newPassword: passwordFields.newPassword,
        confirmNewPassword: passwordFields.confirmNewPassword,
      });
      showMessage('Password updated successfully.', 'success');
      setPasswordEditing(false);
      setPasswordFields({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
    } catch (err) {
      showMessage(err?.message || 'Failed to update password.', 'error');
    }
  };

  const handleEmailSave = async () => {
    if (!emailFields.newEmail || !emailFields.confirmNewEmail) {
      showMessage('Please fill in both email fields.', 'error');
      return;
    }
    if (emailFields.newEmail !== emailFields.confirmNewEmail) {
      showMessage('Emails do not match.', 'error');
      return;
    }
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) {
      showMessage('You are not authenticated.', 'error');
      return;
    }
    try {
      await changeEmail(token, { newEmail: emailFields.newEmail });
      showMessage('Email updated. Please verify your new email.', 'success');
      setEmailEditing(false);
      setEmailFields({ newEmail: '', confirmNewEmail: '' });
    } catch (err) {
      showMessage(err?.message || 'Failed to update email.', 'error');
    }
  };

  const toggleVisibility = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  return (
    <div className="form-container">
      <ConfirmModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={() => setModalOpen(false)}
        title={modalTitle}
        message={modalMessage}
        confirmLabel="OK"
        confirmClass={modalTitle === 'success' ? 'success' : 'error'}
      />
      {/* Password Change Section */}
      <div className="card mb-4">
        <div className="card-body">
          <form onSubmit={e => e.preventDefault()}>
            {['currentPassword', 'newPassword', 'confirmNewPassword'].map((field, i) => (
              <div className="mb-3" key={i}>
                <label htmlFor={field} className="form-label">
                  {field === 'currentPassword'
                    ? 'Current Password'
                    : field === 'newPassword'
                    ? 'New Password'
                    : 'Confirm New Password'}
                </label>
                <div className="input-group">
                  <input
                    type={showPassword[field] ? 'text' : 'password'}
                    id={field}
                    className={`form-control password-input ${passwordEditing ? 'edit-mode' : ''}`}
                    placeholder="••••••••••••"
                    disabled={!passwordEditing}
                    value={passwordFields[field]}
                    onChange={handlePasswordChange}
                  />
                  <span
                    className={`eye-toggle ${passwordEditing ? 'visible' : ''}`}
                    onClick={() => toggleVisibility(field)}
                  >
                    {showPassword[field] ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
              </div>
            ))}
            <div className="d-flex justify-content-end">
              <button
                type="button"
                className={`btn ${passwordEditing ? 'btn-success' : 'btn-primary'}`}
                onClick={passwordEditing ? handlePasswordSave : () => setPasswordEditing(true)}
              >
                {passwordEditing ? 'Save' : 'Change Password'}
              </button>
              {passwordEditing && (
                <button
                  type="button"
                  className="btn btn-secondary ms-2"
                  onClick={() => { setPasswordEditing(false); setPasswordFields({ currentPassword: '', newPassword: '', confirmNewPassword: '' }); }}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Email Change Section */}
      <div className="card">
        <div className="card-body">
          <form onSubmit={e => e.preventDefault()}>
            {['newEmail', 'confirmNewEmail'].map((field, i) => (
              <div className="mb-3" key={i}>
                <label htmlFor={field} className="form-label">
                  {field === 'newEmail' ? 'New Email' : 'Confirm New Email'}
                </label>
                <div className="input-group">
                  <input
                    type="email"
                    id={field}
                    className={`form-control email-input ${emailEditing ? 'edit-mode' : ''}`}
                    placeholder="user@example.com"
                    disabled={!emailEditing}
                    value={emailFields[field]}
                    onChange={handleEmailChange}
                  />
                </div>
              </div>
            ))}
            <div className="d-flex justify-content-end">
              <button
                type="button"
                className={`btn ${emailEditing ? 'btn-success' : 'btn-primary'}`}
                onClick={emailEditing ? handleEmailSave : () => setEmailEditing(true)}
              >
                {emailEditing ? 'Save' : 'Change Email'}
              </button>
              {emailEditing && (
                <button
                  type="button"
                  className="btn btn-secondary ms-2"
                  onClick={() => { setEmailEditing(false); setEmailFields({ newEmail: '', confirmNewEmail: '' }); }}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};


export default Setting;
