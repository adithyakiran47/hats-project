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
      localStorage.setItem('token', res.data.token);
      navigate('/applications');
    } catch {
      setError('Invalid email or password');
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="m-4 p-4 border rounded" style={{ maxWidth: 400 }}>
      <h3>Login</h3>
      <input type="email" placeholder="Email" className="form-control mb-2" value={email} onChange={e => setEmail(e.target.value)} required />
      <input type="password" placeholder="Password" className="form-control mb-2" value={password} onChange={e => setPassword(e.target.value)} required />
      <button className="btn btn-primary w-100" type="submit" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
      {error && <div className="alert alert-danger mt-2">{error}</div>}
    </form>
  );
}
