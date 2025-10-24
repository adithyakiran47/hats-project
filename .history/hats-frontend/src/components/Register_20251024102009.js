import React, { useState } from 'react';
import api from '../api/api';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
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
      setError(err.response?.data?.error || 'Registration failed');
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="m-4 p-4 border rounded" style={{ maxWidth: 400 }}>
      <h3>Register</h3>
      <input type="text" placeholder="Name" className="form-control mb-2" value={name} onChange={e => setName(e.target.value)} required />
      <input type="email" placeholder="Email" className="form-control mb-2" value={email} onChange={e => setEmail(e.target.value)} required />
      <input type="password" placeholder="Password" className="form-control mb-2" value={password} onChange={e => setPassword(e.target.value)} required />
      <input type="password" placeholder="Confirm Password" className="form-control mb-2" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
      <button className="btn btn-secondary w-100" disabled={loading}>{loading ? 'Registering...' : 'Register'}</button>
      {error && <div className="alert alert-danger mt-2">{error}</div>}
    </form>
  );
}
