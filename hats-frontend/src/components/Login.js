import React, { useState, useContext } from 'react';
import api from '../api/api';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const { setAuthData } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      setAuthData(res.data);
      navigate('/applications');
    } catch {
      setError('Invalid email or password.');
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto mt-5 p-4 border rounded shadow-sm" style={{ maxWidth: 400 }}>
      <h3 className="mb-4 text-center">Login</h3>
      <input type="email" value={email} placeholder="Email" onChange={e => setEmail(e.target.value)} required className="form-control mb-3" />
      <input type="password" value={password} placeholder="Password" onChange={e => setPassword(e.target.value)} required className="form-control mb-3" />
      <button type="submit" className="btn btn-primary w-100" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
      {error && <div className="alert alert-danger mt-3">{error}</div>}
    </form>
  );
}
