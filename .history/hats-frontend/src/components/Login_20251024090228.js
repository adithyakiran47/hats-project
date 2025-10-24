import React, { useState, useContext } from 'react';
import api from '../api/api';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const { setAuthData } = useContext(AuthContext);
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
      alert('Login successful');
    } catch {
      setError('Login failed');
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
      <button className="btn btn-primary w-100" type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
      {error && <div className="text-danger mt-2">{error}</div>}
    </form>
  );
};

export default Login;
