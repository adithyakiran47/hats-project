import React, { useState } from 'react';
import api from '../api/api';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'applicant' });

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await api.post('/auth/register', form);
      alert('Registration successful! Please login.');
    } catch (error) {
      alert('Registration failed.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
  <input
    className="form-control mb-2"
    name="name"
    placeholder="Name"
    onChange={handleChange}
    value={form.name}
  />
  <input
    className="form-control mb-2"
    name="email"
    placeholder="Email"
    onChange={handleChange}
    value={form.email}
  />
  <input
    type="password"
    className="form-control mb-2"
    name="password"
    placeholder="Password"
    onChange={handleChange}
    value={form.password}
  />
  <select
    className="form-select mb-2"
    name="role"
    onChange={handleChange}
    value={form.role}
  >
    <option value="applicant">Applicant</option>
    <option value="botmimic">Bot Mimic</option>
    <option value="admin">Admin</option>
  </select>
  <button className="btn btn-primary w-100" type="submit">Register</button>
</form>

  );
};

export default Register;
