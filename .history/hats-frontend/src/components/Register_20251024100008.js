import React, { useState } from 'react';
import api from '../api/api';
import { useNavigate } from 'react-router-dom';

function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await api.post('/auth/register', { name, email, password });
      alert('Registration successful! Please login.');
      navigate('/login');
    } catch (err) {
      setError('Registration failed. ' + (err.response?.data?.error || ''));
    }
    setLoading(false);
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <form onSubmit={handleRegister} className="bg-white p-4 rounded shadow" style={{ maxWidth: 400, width: '100%' }}>
        <h3 className="mb-4 text-center">Register</h3>
        <div className="mb-3">
          <input
            type="text"
            placeholder="Name"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <input
            type="email"
            placeholder="Email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <input
            type="password"
            placeholder="Password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <input
            type="password"
            placeholder="Confirm Password"
            className="form-control"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button className="btn btn-secondary w-100" type="submit" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>
        {error && <div className="alert alert-danger mt-3">{error}</div>}
      </form>
    </div>
  );
}

export default Register;
