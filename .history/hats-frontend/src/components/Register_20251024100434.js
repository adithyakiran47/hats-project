import React, { useState } from 'react';
import api from '../api/api';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await api.post('/auth/register', { name, email, password });
      alert('Registration successful! Please login.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    }
    setLoading(false);
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow" style={{ maxWidth: 400, width: '100%' }}>
        <h3 className="mb-4 text-center">Register</h3>
        <input className="form-control mb-3" placeholder="Name" value={name} onChange={e => setName(e.target.value)} required />
        <input className="form-control mb-3" placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        <input className="form-control mb-3" placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        <input className="form-control mb-3" placeholder="Confirm Password" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
        <button type="submit" className="btn btn-secondary w-100" disabled={loading}>{loading ? 'Registering...' : 'Register'}</button>
        {error && <div className="alert alert-danger mt-3">{error}</div>}
      </form>
    </div>
  );
};

export default Register;
