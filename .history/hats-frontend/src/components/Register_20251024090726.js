import React, { useState } from 'react';
import api from '../api/api';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await api.post('/auth/register', { email, password });
      alert('Registration successful, please login');
      navigate('/login'); // Redirect to login
    } catch {
      setError('Registration failed');
    }
    setLoading(false);
  };

  return (
    // same as before with inputs and button
  );
};

export default Register;
