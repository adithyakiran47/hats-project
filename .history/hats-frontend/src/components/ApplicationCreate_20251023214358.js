import React, { useState, useContext } from 'react';
import api from '../api/api';
import { AuthContext } from '../context/AuthContext';

const ApplicationCreate = ({ onAppCreated }) => {
  const { authData } = useContext(AuthContext);
  const [jobRole, setJobRole] = useState('');
  const [comment, setComment] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await api.post('/application/create', {
        applicant: authData.user.id,
        jobRole,
        comments: comment ? [comment] : [],
      });
      alert('Application submitted!');
      setJobRole('');
      setComment('');
      if (onAppCreated) onAppCreated();
    } catch {
      alert('Failed to submit application');
    }
  };

  if (!authData) return null;

  return (
    <form onSubmit={handleSubmit}>
      <input
        placeholder="Job Role"
        value={jobRole}
        onChange={e => setJobRole(e.target.value)}
        required
      />
      <input
        placeholder="Initial Comment"
        value={comment}
        onChange={e => setComment(e.target.value)}
      />
      <button type="submit">Apply</button>
    </form>
  );
};

export default ApplicationCreate;
