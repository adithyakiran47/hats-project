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
    <div className="form-container">
      <form onSubmit={handleSubmit} className="form-box">
        <h2 className="form-title">Login</h2>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Email"
          className="form-input"
          required
        />
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Password"
          className="form-input"
          required
        />
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
        {error && <div className="form-error">{error}</div>}
      </form>
    </div>
  );
};

export default Login;
