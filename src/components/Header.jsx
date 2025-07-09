import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';
import './Header.css';


const Header = ({ companyName, toggleSidebar }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const navigate = useNavigate();
const [username, setUsername] = useState('');
 useEffect(() => {
  const token = localStorage.getItem('token');
  if (token) {
    try {
      const decoded = jwtDecode(token); // ✅ Correct usage
      setUsername(decoded.sub || decoded.username || "User");
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  }
}, []);

 // Logout function
const handleLogout = () => {
  const confirmLogout = window.confirm("Are you sure you want to logout?");
  if (confirmLogout) {
    localStorage.removeItem('token'); // Clear token
    toast.success("You are logged out!!");
   
    navigate('/'); // Redirect to login
  }
};
  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer); // Cleanup timer on unmount
  }, []);

  // Format the date with month in word format
  const formatDate = (date) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  };

  // Navigate to home on logo or company name click
  const goToHome = () => {
    navigate('/main/home'); // Change this to your actual home route if different
  };

  return (
   <header className="header d-flex justify-content-between align-items-center fixed-top px-2 py-2">

      <div className="d-flex align-items-center">
        {/* Toggle Button */}
        <button
          onClick={toggleSidebar}
          className="btn btn-sm btn-outline-light me-3"
          title="Toggle Sidebar"
        >
          <i className="bi bi-list fs-4"></i> {/* Bootstrap icon or ☰ fallback */}
        </button>

        {/* Clickable Logo & Company Name */}
        <div onClick={goToHome} style={{ cursor: 'pointer' }} className="d-flex align-items-center">
          <img 
            src="/icon.png" 
            alt="Company Logo" 
            className="logo me-2" 
            style={{ width: '30px', height: '30px' }} 
          />
          <h1 className="m-0 fs-5">{companyName}</h1>
        </div>
      </div>

     <h2 className="m-0 fs-5 text-center">
  Welcome, {username}
</h2>

      <div className="d-flex align-items-center">
        <div className="me-3 small">
          {formatDate(currentTime)} {currentTime.toLocaleTimeString()}
        </div>
        <button onClick={handleLogout} className="btn btn-sm btn-outline-light">
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
