// ChangePassword.jsx
import React, { useState } from 'react';
import axios from 'axios';
import './ChangePassword.css';
import { toast } from 'react-toastify';

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { oldPassword, newPassword, confirmNewPassword } = formData;

    if (newPassword !== confirmNewPassword) {
      toast.error('New passwords do not match.');
      return;
    }

    try {
      const token = localStorage.getItem('token'); // Assumes JWT is stored in localStorage

      await axios.post(
        'http://localhost:8089/auth/change-password',
        {
          oldPassword,
          newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success('Password changed successfully!');
      setFormData({ oldPassword: '', newPassword: '', confirmNewPassword: '' });
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Failed to change password.'
      );
    }
  };

  return (
    <div className="change-password-container">
      <form className="change-password-form" onSubmit={handleSubmit}>
        <h3>Change Password</h3>

        <label>Old Password</label>
        <input
          type="password"
          name="oldPassword"
          value={formData.oldPassword}
          onChange={handleChange}
          required
        />

        <label>New Password</label>
        <input
          type="password"
          name="newPassword"
          value={formData.newPassword}
          onChange={handleChange}
          required
        />

        <label>Confirm New Password</label>
        <input
          type="password"
          name="confirmNewPassword"
          value={formData.confirmNewPassword}
          onChange={handleChange}
          required
        />

        <button type="submit">Update Password</button>
      </form>
    </div>
  );
};

export default ChangePassword;
