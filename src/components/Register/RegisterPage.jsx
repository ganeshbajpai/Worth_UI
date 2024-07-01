import React, { useState } from 'react';
import './RegisterPage.css';
import { FaUser, FaLock, FaPhone } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import axios from 'axios'; // Import axios for making HTTP requests
import login_url from '../../api/loginApi';
import { Link, json, useNavigate } from "react-router-dom";
const RegisterPage = () => {
    // State variables to store form data
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const navigate = useNavigate();

    // Function to handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Make a POST request to add form data to the database
            const response = await axios.post(`${login_url}/login/addLoginDetails`, {
                email,
                password,
                firstName,
                lastName,
                phoneNumber
            });
            // Handle success response
            alert("User Registered Successfully..");
            console.log('User registered successfully:', response.data);
            // Reset form fields after successful submission
            setEmail('');
            setPassword('');
            setFirstName('');
            setLastName('');
            setPhoneNumber('');
            navigate("/");
        } catch (error) {
            // Handle error
            alert("Registeration Failed !!");
            console.error('Error registering user:', error);
        }
    };

    return (
        <div className='wrapper'>
            <form onSubmit={handleSubmit}>
                <h1>Sign Up</h1>
                <div className='input-box'>
                    <input type='email' placeholder='Email Id' value={email} onChange={(e) => setEmail(e.target.value)} required></input>
                    <MdEmail className='icon' />
                </div>
                <div className='input-box'>
                    <input type='password' placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} required></input>
                    <FaLock className='icon' />
                </div>
                <div className='input-box'>
                    <input type='text' placeholder='First Name' value={firstName} onChange={(e) => setFirstName(e.target.value)} required></input>
                    <FaUser className='icon' />
                </div>
                <div className='input-box'>
                    <input type='text' placeholder='Last Name' value={lastName} onChange={(e) => setLastName(e.target.value)} required></input>
                    <FaUser className='icon' />
                </div>
                <div className='input-box'>
                    <input type='number' placeholder='Contact Number' value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required></input>
                    <FaPhone className='icon' />
                </div>
                <button type='submit'>Submit</button>
                {/* <button type='reset'>Reset</button> */}
            </form>
        </div>
    );
};

export default RegisterPage;
