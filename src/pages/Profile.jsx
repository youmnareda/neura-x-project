
import React from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import Chatbot from '../components/chatbot/Chatbot';
import Profile from '../components/profile/ProfileInfo';
import Record from '../components/profile/Records';
import Setting from '../components/profile/Settings';
import SingleRecord from '../components/profile/Single-Record';
import '../assets/styles/ProfilePage.css'; 

const ProfileLayout = () => (
  <div className="profile-page">
    <Sidebar />
    <div className="profile-content">
      <div className="content-wrapper">
        <Outlet />
      </div>
      <Chatbot />
    </div>
  </div>
);

const ProfilePage = () => {
  return (
    <Routes>
      <Route element={<ProfileLayout />}>
        <Route index element={<Profile />} />
        <Route path="records" element={<Record />} />
        <Route path="records/:recordId" element={<SingleRecord />} />
        <Route path="settings" element={<Setting />} />
      </Route>
    </Routes>
  );
};

export default ProfilePage;