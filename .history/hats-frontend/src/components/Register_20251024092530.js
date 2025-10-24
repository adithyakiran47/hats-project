import React, { useState } from 'react';
import api from '../api/api';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
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
      await api.post('/auth/register', { email, password });
      alert('Registration successful! Please login.');
      navigate('/login');
    } catch {
      setError('Registration failed');
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto p-4 border rounded" style={{ maxWidth: '400px', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
      <h3 className="mb-4 text-center">Register</h3>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        className="form-control mb-3"
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        className="form-control mb-3"
        required
      />
      <input
        type="password"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={e => setConfirmPassword(e.target.value)}
        className="form-control mb-3"
        required
      />
      <button type="submit" className="btn btn-secondary w-100" disabled={loading}>
        {loading ? (<><span className="spinner-border spinner-border-sm me-2"></span>Registering...</>) : 'Register'}
      </button>
      {error && <div className="alert alert-danger mt-3">{error}</div>}
    </form>
  );
};

export default Register;
