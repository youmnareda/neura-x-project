import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import '../../assets/styles/UploadPhotos.css';
import uploadImg from '../../assets/images/upload-IMG.svg';
import trashIcon from '../../assets/images/delete.svg';
import fileIcon from '../../assets/images/fileIcon.svg';
import { apiRequest } from '../../services/api';

const UploadPhotos = ({ onFileChange }) => {
    const wrapperRef = useRef(null);
    const fileInputRef = useRef(null);
    const [fileList, setFileList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
    const navigate = useNavigate();

    const onDragEnter = (e) => {
        e.preventDefault();
        e.stopPropagation();
        wrapperRef.current.classList.add('dragover');
    };

    const onDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        wrapperRef.current.classList.remove('dragover');
    };

    const onDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    // Only allow one file
    const onFileDrop = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            setFileList([{ id: Date.now() + Math.random(), file: files[0] }]);
            setImagePreviewUrl(URL.createObjectURL(files[0]));
        }
    };

    const onDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        wrapperRef.current.classList.remove('dragover');
        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) {
            setFileList([{ id: Date.now() + Math.random(), file: files[0] }]);
            setImagePreviewUrl(URL.createObjectURL(files[0]));
        }
    };

    const fileRemove = (fileToRemove) => {
        setFileList([]);
        setImagePreviewUrl(null);
    };

    const getFileIcon = (fileType) => {
        const type = fileType.split('/')[0];
        switch (type) {
            case 'image':
                return <img src={fileIcon} alt="File" />;
            case 'video':
                return <img src={fileIcon} alt="File" />;
            case 'audio':
                return <img src={fileIcon} alt="File" />;
            case 'application':
                // Check for PDF specifically
                if (fileType === 'application/pdf') {
                    return <img src={fileIcon} alt="File" />;
                }
                return <img src={fileIcon} alt="File" />;
            case 'text':
                return <img src={fileIcon} alt="File" />;
            default:
                return <img src={fileIcon} alt="File" />;
        }
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const handleAIReadClick = async () => {
        if (fileList.length === 0) {
            setError('Please select a file to upload.');
            return;
        }
        setLoading(true);
        setError('');
        try {
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');
            const formData = new FormData();
            formData.append('scanImage', fileList[0].file);
            // Optionally add scanType, analysisType, aiProvider, detailed if needed
            const result = await apiRequest('/scan/upload', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });
            // Navigate to /result with result data and image preview
            navigate('/result', { state: { analysis: result.scan, imagePreviewUrl } });
        } catch (err) {
            let errorMsg = err.message;
            if (err.error) errorMsg += `: ${err.error}`;
            setError(errorMsg || 'Upload failed.');
        } finally {
            setLoading(false);
        }
    };

    const handleCloseError = () => {
        setError('');
    };

    return (
        <div className="upload-photos-container">
            {/* Error Popup Modal */}
            {error && (
                <div className="popup-error-overlay">
                    <div className="popup-error-box">
                        <span>{error}</span>
                        <button className="popup-error-close" onClick={handleCloseError}>OK</button>
                    </div>
                </div>
            )}
            <h2 className="upload-header">X-ray, CT, and MRI Scans</h2>
            <div
                ref={wrapperRef}
                className="drop-file-input"
                onDragEnter={onDragEnter}
                onDragLeave={onDragLeave}
                onDragOver={onDragOver}
                onDrop={onDrop}
                onClick={() => fileInputRef.current && fileInputRef.current.click()}
            >
                <div className="drop-file-input__label">
                    <img src={uploadImg} alt="Upload" className="upload-icon" />
                    <p>Click to upload or drag and drop</p>
                    <p className="or-text">JPG, JPEG, PNG or DICOM files supported</p>
                </div>
                <input 
                    type="file" 
                    onChange={onFileDrop}
                    className="file-input"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    accept="image/jpeg,image/png,image/jpg"
                />
            </div>
            {fileList.length > 0 && (
                <div className="drop-file-preview">
                    <p className="drop-file-preview__title">
                        File Uploader (1 file)
                    </p>
                    {fileList.map((item) => (
                        <div key={item.id} className="drop-file-preview__item">
                            <div className="drop-file-preview__item__info">
                                <div className="file-visual-details">
                                    <div className="file-icon">
                                        {getFileIcon(item.file.type)}
                                    </div>
                                    <div className="file-text-details">
                                        <p className="file-name">{item.file.name}</p>
                                        <div className="file-info-row">
                                            <p className="file-size">
                                                Size: {formatFileSize(item.file.size)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <span 
                                className="drop-file-preview__item__del" 
                                onClick={() => fileRemove(item)}
                                title="Remove file"
                            >
                                <img src={trashIcon} alt="Remove" className="trash-icon" />
                            </span>
                        </div>
                    ))}
                </div>
            )}
            <button className="ai-read-button" onClick={handleAIReadClick} disabled={loading}>
                {loading ? 'Uploading & Analyzing...' : 'AI Read'}
            </button>
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
    );
};

UploadPhotos.propTypes = {
    onFileChange: PropTypes.func
};

export default UploadPhotos;