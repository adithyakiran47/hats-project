import React, { useState } from 'react';
import api from '../api/api';
import { useNavigate } from 'react-router-dom';

const roles = ['applicant', 'botmimic', 'admin'];

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('applicant');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await api.post('/auth/register', { name, email, role, password });
      alert('Registration successful! Please login.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed.');
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto mt-5 p-4 border rounded shadow-sm" style={{ maxWidth: 400 }}>
      <h3 className="mb-4 text-center">Register</h3>
      <input type="text" value={name} placeholder="Name" onChange={e => setName(e.target.value)} required className="form-control mb-3" />
      <input type="email" value={email} placeholder="Email" onChange={e => setEmail(e.target.value)} required className="form-control mb-3" />
      <select value={role} onChange={e => setRole(e.target.value)} className="form-select mb-3" required>
        {roles.map(r => (
          <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>
        ))}
      </select>
      <input type="password" value={password} placeholder="Password" onChange={e => setPassword(e.target.value)} required className="form-control mb-3" />
      <input type="password" value={confirmPassword} placeholder="Confirm Password" onChange={e => setConfirmPassword(e.target.value)} required className="form-control mb-3" />
      <button className="btn btn-secondary w-100" type="submit" disabled={loading}>{loading ? 'Registering...' : 'Register'}</button>
      {error && <div className="alert alert-danger mt-3">{error}</div>}
    </form>
  );
}
