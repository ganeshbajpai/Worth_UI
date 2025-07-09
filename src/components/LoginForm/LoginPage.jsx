import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // 👁️ toggle state
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post('http://localhost:8089/auth/login', {
        username,
        password,
      });
      const token = response.data.token;
      localStorage.setItem('token', token);
      navigate('/main/home');
    } catch (err) {
      setError('Invalid username or password');
    }
  };

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-page">
      <div className="login-left">
        <img src="/icon.png" alt="Company Logo" />
        <h1>Logistics Portal</h1>
        <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>
          Streamlining deliveries across the nation.
        </p>
      </div>

      <div className="login-right">
        <div className="login-box">
          <h2>Login</h2>
          <form onSubmit={handleLogin}>
            <input
              type="text"
              value={username}
              placeholder="Username"
              onChange={(e) => setUsername(e.target.value)}
              required
              className="form-control mb-2"
            />

            <div className="password-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                required
                className="form-control"
              />
              <span onClick={togglePassword} className="toggle-password">
                {showPassword ? '🙈' : '👁️'}
              </span>
            </div>

            {error && <div className="text-danger mb-2">{error}</div>}

            <button type="submit" className="btn btn-primary w-100">
              Login
            </button>

            
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
