import React, { useState, useContext } from 'react';
import api from '../api/api';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const { setAuthData } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await api.post('/auth/login', { email, password });
      setAuthData(response.data);
      navigate('/applications');
    } catch {
      setError('Invalid email or password');
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto p-4 border rounded" style={{ maxWidth: '400px', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
      <h3 className="mb-4 text-center">Login</h3>
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="Email"
        className="form-control mb-3"
        required
      />
      <input
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        placeholder="Password"
        className="form-control mb-3"
        required
      />
      <button type="submit" className="btn btn-primary w-100" disabled={loading}>
        {loading ? (<><span className="spinner-border spinner-border-sm me-2"></span>Logging in...</>) : 'Login'}
      </button>
      {error && <div className="alert alert-danger mt-3">{error}</div>}
    </form>
  );
};

export default Login;
