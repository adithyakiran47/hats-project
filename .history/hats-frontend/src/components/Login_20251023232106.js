import React, { useState, useContext } from 'react';
import api from '../api/api';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const { setAuthData } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await api.post('/auth/login', { email, password });
      // Save token to localStorage for JWT auth
      localStorage.setItem('token', response.data.token);
      setAuthData({ user: response.data.user, token: response.data.token });
      // You can redirect here or simply reload UI
      // window.location.reload();
    } catch (err) {
      setError(
        err.response && err.response.data && err.response.data.message
          ? err.response.data.message
          : 'Login failed.'
      );
    }
  };

  return (
    <form onSubmit={handleLogin} style={{ maxWidth: 400, margin: '2rem auto' }}>
      <h2>Login</h2>
      <input
        type="email"
        className="form-control mb-2"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        className="form-control mb-2"
        value={password}
        onChange={e => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <button className="btn btn-success w-100" type="submit">Login</button>
      {error && <p className="text-danger mt-2">{error}</p>}
    </form>
  );
};

export default Login;
