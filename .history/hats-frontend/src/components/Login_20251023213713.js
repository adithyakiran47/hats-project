import React, { useState, useContext } from 'react';
import api from '../api/api';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const { setAuthData } = useContext(AuthContext);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', form);
      setAuthData(res.data);
      alert('Login successful!');
    } catch (error) {
      alert('Login failed.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="email" placeholder="Email" onChange={handleChange} value={form.email} />
      <input type="password" name="password" placeholder="Password" onChange={handleChange} value={form.password} />
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
