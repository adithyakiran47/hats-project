import React, { useState, useContext } from 'react';
import api from '../api/api';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
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
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow" style={{ maxWidth: 400, width: '100%' }}>
        <h3 className="mb-4 text-center">Login</h3>
        <input className="form-control mb-3" placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        <input className="form-control mb-3" placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        <button type="submit" className="btn btn-primary w-100" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
        {error && <div className="alert alert-danger mt-3">{error}</div>}
      </form>
    </div>
  );
};

export default Login;
