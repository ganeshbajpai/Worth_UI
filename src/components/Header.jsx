import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';
import './Header.css';

const Header = ({ companyName, toggleSidebar }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [username, setUsername] = useState('');
  const [showBanner, setShowBanner] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUsername(decoded.sub || decoded.username || "User");
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (date) => {
    return date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem('token');
      toast.success("You are logged out!!");
      navigate('/');
    }
  };

  const goToHome = () => navigate('/main/home');

  return (
    <>
      <header className="header fixed-top d-flex justify-content-between align-items-center px-3 py-2">
        <div className="d-flex align-items-center">
          <div onClick={goToHome} style={{ cursor: 'pointer' }} className="d-flex align-items-center">
            <img src="/icon.png" alt="Logo" className="logo me-2" style={{ width: '30px', height: '30px' }} />
            <h1 className="m-0 fs-5">{companyName}</h1>
          </div>
        </div>

        <h2 className="m-0 fs-6 text-center">Welcome, {username}</h2>

        <div className="d-flex align-items-center">
          <div className="me-3 small">{formatDate(currentTime)} {currentTime.toLocaleTimeString()}</div>
          <button onClick={handleLogout} className="btn btn-sm btn-outline-light">Logout</button>
        </div>
      </header>

      {/* Banner placed below header */}
      {showBanner && (
  <div className="scroll-banner shimmer-banner text-dark d-flex align-items-center justify-content-between px-3 py-1">
    <div className="scroll-text">
      🚚 Welcome to the Logistics Portal! Stay tuned for updates and announcements.
    </div>
    <button
      onClick={() => setShowBanner(false)}
      className="btn btn-sm btn-close ms-3"
      aria-label="Close"
    ></button>
  </div>
)}
    </>
  );
};

export default Header;
