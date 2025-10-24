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
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow" style={{ width: '100%', maxWidth: 400 }}>
        <h3 className="mb-4 text-center">Register</h3>
        <div className="mb-3">
          <input
            type="email"
            className="form-control"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <input
            type="password"
            className="form-control"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <input
            type="password"
            className="form-control"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-secondary w-100" disabled={loading}>
          {loading ? <><span className="spinner-border spinner-border-sm me-2"></span>Registering...</> : 'Register'}
        </button>
        {error && <div className="alert alert-danger mt-3">{error}</div>}
      </form>
    </div>
  );
};

export default Register;
