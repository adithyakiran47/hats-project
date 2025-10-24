import React, { useState } from 'react';
import api from '../api/api';

const Register = () => {
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
      alert('Registration successful');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    } catch {
      setError('Registration failed');
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        className="form-control mb-2"
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
      />
      <input
        className="form-control mb-2"
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
      />
      <input
        className="form-control mb-2"
        type="password"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={e => setConfirmPassword(e.target.value)}
        required
      />
      <button className="btn btn-secondary w-100" type="submit" disabled={loading}>
        {loading ? 'Registering...' : 'Register'}
      </button>
      {error && <div className="text-danger mt-2">{error}</div>}
    </form>
  );
};

export default Register;
