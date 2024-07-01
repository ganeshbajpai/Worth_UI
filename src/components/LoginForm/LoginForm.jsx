import React, { useState } from 'react';
import './LoginForm.css';
import { FaUser, FaLock } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import login_url from '../../api/loginApi';

const LoginForm = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
   
    setIsLoading(true); // Set loading state to true when form is submitted

    try {
      // Send the user's email and password to the authentication API.
      const response = await fetch(`${login_url}/login/verifyLoginDetails`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (!response.ok) {
        throw new Error('Login failed. Please check your email and password.');
      }

      // If the user is authenticated, set isLoggedIn to true and redirect to the dashboard page.
      localStorage.setItem('isLoggedIn', true);
      navigate('/main/home');
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false); // Set loading state to false after verification completes
    }
  };

  const handleReset = () => {
    setEmail('');
    setPassword('');
    setError('');
  };

  return (
    <div className='wrapper'>
      <form onSubmit={handleSubmit}>
        <h1>Admin Login</h1>
        {error && <p className="error">{error}</p>}
        <div className='input-box'>
          <input
            type='email'
            placeholder='Email'
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <FaUser className='icon' />
        </div>
        <div className='input-box'>
          <input
            type='password'
            placeholder='Password'
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <FaLock className='icon' />
        </div>
        <div className="remember-forgot">
          {/* <label><input type='checkbox' />Remember me</label> */}
          {/* <a href='#'>Forgot password?</a> */}
        </div>
        <button type='submit' disabled={isLoading}>
          {isLoading ? 'Verifying...' : 'Login'}
        </button>
        <button type='button' onClick={handleReset}>Reset</button>
        <div className="register-link">
          {/* <p>Don't have an account?<a href='/register'>Register</a></p> */}
        </div>
      </form>
    </div>
  );
};

const isLoggedIn = () => {
  // Check if the user is logged in by checking the localStorage flag.
  // Return true if logged in, false otherwise.
  return localStorage.getItem('isLoggedIn') === 'true';
};

export { LoginForm, isLoggedIn };
