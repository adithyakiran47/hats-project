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
      <input name="name" placeholder="Name" onChange={handleChange} value={form.name} />
      <input name="email" placeholder="Email" onChange={handleChange} value={form.email} />
      <input type="password" name="password" placeholder="Password" onChange={handleChange} value={form.password} />
      <select name="role" onChange={handleChange} value={form.role}>
        <option value="applicant">Applicant</option>
        <option value="botmimic">Bot Mimic
