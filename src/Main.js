import React, { useState } from 'react';
import Header from "./components/Header";
import Sidebar from "./Sidebar";
import { Outlet, Navigate } from 'react-router-dom';
import './Main.css';
import Footer from './Footer';

// Utility to check token validity
const isLoggedIn = () => {
  const token = localStorage.getItem('token');
  if (!token) return false;

  try {
    const payload = JSON.parse(atob(token.split('.')[1])); // Decode JWT payload
    const expiry = payload.exp * 1000;
    return Date.now() < expiry;
  } catch (e) {
    return false;
  }
};

const Main = () => {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(true);

  const toggleSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  if (!isLoggedIn()) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="main-layout">
      {openSidebarToggle && (
        <div className="sidebar-wrapper">
          <Sidebar openSidebarToggle={openSidebarToggle} setOpenSidebarToggle={setOpenSidebarToggle} />
        </div>
      )}
      <div className="content-wrapper">
        <Header companyName="Logistics Portal" toggleSidebar={toggleSidebar} />
        
        {/* 👇 Add padding so content is not hidden behind fixed header */}
       <div className="main-outlet">
  <Outlet />
  <Footer />
</div>
      </div>
    </div>
  );
};

export default Main;
