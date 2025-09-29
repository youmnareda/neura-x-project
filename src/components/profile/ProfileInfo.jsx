import React, { useEffect, useRef, useState } from "react";
import "../../assets/styles/Profile.css";
import profileImage from "../../assets/images/profile-pic.png";
import { getProfile, updateProfile, changeName } from '../../services/auth';

export default function Profile() {
  const [editing, setEditing] = useState(false);
  const [imageSrc, setImageSrc] = useState(profileImage);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state
  const firstNameRef = useRef(null);
  const lastNameRef = useRef(null);
  const fileInputRef = useRef(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [profileFile, setProfileFile] = useState(null);

  const formatBirthDate = (birthDate) => {
    if (!birthDate) return 'Not set';
    
    // If it's already a nicely formatted string like "Jun 17, 1982", return as is
    if (typeof birthDate === 'string' && birthDate.includes(',')) {
      return birthDate;
    }
    
    // If it's a Date object or ISO string, format it
    if (birthDate instanceof Date || typeof birthDate === 'string') {
      try {
        const date = new Date(birthDate);
        if (isNaN(date.getTime())) {
          // If it's already a formatted string, return as is
          return birthDate;
        }
        // Format as "Jun 17, 1982" format
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const month = months[date.getMonth()];
        const day = date.getDate();
        const year = date.getFullYear();
        return `${month} ${day}, ${year}`;
      } catch (error) {
        // If parsing fails, return as is
        return birthDate;
      }
    }
    
    return birthDate;
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (!token) return;
        const userData = await getProfile(token);
        console.log('Fetched user data:', userData); // Debug
        console.log('Birth date field:', userData.birthDate); // Debug birth date
        console.log('Gender field:', userData.gender); // Debug gender
        setUser(userData);
        setFirstName(userData.firstName || '');
        setLastName(userData.lastName || '');
      } catch (err) {
        console.error('Failed to fetch user profile:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    const inputs = document.querySelectorAll(
      "#firstName, #lastName, #email, #birthday, input[name='gender']"
    );
    inputs.forEach((input) => (input.disabled = true));
  }, []);

  const handleEdit = () => {
    if (!user) {
      console.log('Edit blocked: user not loaded', user); // Debug
      return; // Prevent editing if user data isn't loaded
    }
    setFirstName(user.firstName || '');
    setLastName(user.lastName || '');
    setEditing(true);
    if (firstNameRef.current) firstNameRef.current.disabled = false;
    if (lastNameRef.current) lastNameRef.current.disabled = false;
    console.log('Edit mode: firstName', user.firstName, 'lastName', user.lastName); // Debug
  };

  const handleSave = async () => {
    setEditing(false);
    if (firstNameRef.current) firstNameRef.current.disabled = true;
    if (lastNameRef.current) lastNameRef.current.disabled = true;
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    try {
      // Update name using dedicated endpoint
      const updatedUser = await changeName(token, { firstName, lastName });
      // Merge updated names into user state (in case backend doesn't return all fields)
      setUser(prev => ({
        ...prev,
        ...updatedUser,
        firstName: updatedUser.firstName || firstName,
        lastName: updatedUser.lastName || lastName,
      }));
      setFirstName(updatedUser.firstName || firstName);
      setLastName(updatedUser.lastName || lastName);
      // If there's a profile image, update it separately
      if (profileFile) {
        const imageData = new FormData();
        imageData.append('profileImage', profileFile);
        const userWithImage = await updateProfile(token, imageData);
        if (userWithImage.profileImage) {
          setImageSrc(userWithImage.profileImage);
          setUser(prev => ({ ...prev, profileImage: userWithImage.profileImage }));
        }
      }
    } catch (err) {
      window.alert('Failed to update profile.');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileFile(file);
      const reader = new FileReader();
      reader.onload = (event) => setImageSrc(event.target.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="container">
      <div className="profile-center">
        <div className="profile-container">
          <div className="profile-header">
            <div className="sec1">
              <div
                className={`profile-image-wrapper ${editing ? "editable" : ""}`}
              >
                <img src={imageSrc} alt="Profile" className="profile-image" />
                <div className="overlay">
                  <label htmlFor="fileUpload">📷</label>
                </div>
                <input
                  type="file"
                  id="fileUpload"
                  accept="image/*"
                  onChange={handleImageChange}
                  ref={fileInputRef}
                />
              </div>
            </div>
            <div className="sec2">
              <div className="profile-name">{user ? user.userName : '...'}</div>
              <div className="profile-email">{user ? user.email : '...'}</div>
              {!editing && !loading && (
                <button className="btn edit-btn" onClick={handleEdit} disabled={loading || !user}>
                  Edit
                </button>
              )}
            </div>
          </div>

          <form>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="firstName" className="form-label">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  ref={firstNameRef}
                  value={editing ? firstName : (user?.firstName || '')}
                  onChange={e => setFirstName(e.target.value)}
                  className={`form-control ${editing ? "editing-input" : ""}`}
                  disabled={loading || !editing}
                />
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="lastName" className="form-label">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  ref={lastNameRef}
                  value={editing ? lastName : (user?.lastName || '')}
                  onChange={e => setLastName(e.target.value)}
                  className={`form-control ${editing ? "editing-input" : ""}`}
                  disabled={loading || !editing}
                />
              </div>
            </div>

            <div className="row">
              <div className="col-12 mb-3">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={user ? user.email : ''}
                  className="form-control"
                  disabled
                />
              </div>
            </div>

            <div className="row">
              <div className="col-12 mb-3">
                <label htmlFor="birthday" className="form-label">
                  Birthday
                </label>
                <input
                  type="text"
                  id="birthday"
                  value={user ? formatBirthDate(user.birthDate) : ''}
                  className="form-control"
                  disabled
                />
              </div>
            </div>

            <div className="row">
              <div className="col-12">
                <label className="form-label">Gender (optional)</label>
                <div className="gender-section d-flex">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="gender"
                      id="female"
                      value="female"
                      checked={user && user.gender === 'female'}
                      disabled
                    />
                    <label className="form-check-label" htmlFor="female">
                      Female
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="gender"
                      id="male"
                      value="male"
                      checked={user && user.gender === 'male'}
                      disabled
                    />
                    <label className="form-check-label" htmlFor="male">
                      Male
                    </label>
                  </div>
                  {user && !user.gender && (
                    <div className="text-muted ms-3">
                      Not set
                    </div>
                  )}
                </div>
              </div>
            </div>

            {editing && (
              <div className="save-container ">
                <button
                  type="button"
                  className="btn save-btn"
                  onClick={handleSave}
                >
                  Save
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
      {loading && <div style={{textAlign:'center',marginTop:'2rem'}}>Loading profile...</div>}
    </div>
  );
}
