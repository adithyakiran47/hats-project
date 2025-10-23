import React, { useState, useContext } from 'react';
import api from '../api/api';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const { setAuthData } = useContext(AuthContext);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/auth/login', form);
      setAuthData(res.data);
      alert('Login successful!');
    } catch {
      setError('Login failed');
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
  <input
    className="form-control mb-2"
    name="email"
    placeholder="Email"
    onChange={handleChange}
    value={form.email}
    type="email"
    required
  />
  <input
    className="form-control mb-2"
    type="password"
    name="password"
    placeholder="Password"
    onChange={handleChange}
    value={form.password}
    required
  />
  <button className="btn btn-success w-100" type="submit" disabled={loading}>
    {loading ? 'Logging in...' : 'Login'}
  </button>
  {error && <div className="text-danger mt-2">{error}</div>}
</form>

  );
};

export default Login;
