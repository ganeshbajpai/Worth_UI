import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserAndRoleRegister = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [rolesList, setRolesList] = useState([]);
  const [newRole, setNewRole] = useState('');

  // Fetch roles on component mount
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axios.get('http://localhost:8089/auth/findRoles'); // Adjust URL if needed
        setRolesList(response.data);
      } catch (err) {
        console.error('Error fetching roles:', err);
        alert('Failed to load roles');
      }
    };

    fetchRoles();
  }, []);

  const handleUserRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8089/auth/register', {
        username,
        password,
        roles: [selectedRole]
      });
      alert('User registered!');
      setUsername('');
      setPassword('');
      setSelectedRole('');
    } catch (err) {
      alert('Error registering user: ' + err.message);
    }
  };

  const handleRoleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8089/auth/role', { name: newRole });
      alert('Role created!');
      setNewRole('');
    } catch (err) {
      alert('Error creating role: ' + err.message);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto' }}>
      <h2>User Registration</h2>
      <form onSubmit={handleUserRegister}>
        <input
          type="text"
          value={username}
          placeholder="Username"
          onChange={e => setUsername(e.target.value)}
          required
          className="form-control mb-2"
        />
        <input
          type="password"
          value={password}
          placeholder="Password"
          onChange={e => setPassword(e.target.value)}
          required
          className="form-control mb-2"
        />
        <select
          value={selectedRole}
          onChange={e => setSelectedRole(e.target.value)}
          required
          className="form-control mb-2"
        >
          <option value="">Select Role</option>
          {rolesList.map(role => (
            <option key={role.id} value={role.name}>{role.name}</option>
          ))}
        </select>
        <button type="submit" className="btn btn-primary w-100">Register User</button>
      </form>

      <hr />

      <h2>Create Role</h2>
      <form onSubmit={handleRoleRegister}>
        <input
          type="text"
          value={newRole}
          placeholder="Role Name"
          onChange={e => setNewRole(e.target.value)}
          required
          className="form-control mb-2"
        />
        <button type="submit" className="btn btn-secondary w-100">Create Role</button>
      </form>
    </div>
  );
};

export default UserAndRoleRegister;
