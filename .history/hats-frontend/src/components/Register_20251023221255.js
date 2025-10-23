import React, { useState } from 'react';
import api from '../api/api';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'applicant' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/auth/register', form);
      alert('Registration successful! Please login.');
      setForm({ name: '', email: '', password: '', role: 'applicant' });
    } catch {
      setError('Registration failed');
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        className="form-control mb-2"
        name="name"
        placeholder="Name"
        onChange={handleChange}
        value={form.name}
        required
      />
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
      <button className="btn btn-primary w-100" type="submit" disabled={loading}>
        {loading ? 'Registering...' : 'Register'}
      </button>
      {error && <div className="text-danger mt-2">{error}</div>}
    </form>
  );
};

export default Register;
