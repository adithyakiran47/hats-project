import React, { useState, useContext } from 'react';
import api from '../api/api';
import { AuthContext } from '../context/AuthContext';

const ApplicationCreate = ({ onAppCreated }) => {
  const { authData } = useContext(AuthContext);
  const [jobRole, setJobRole] = useState('');
  const [jobType, setJobType] = useState('Non-Technical');
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/application/create', {
        applicant: authData.user.id,
        jobRole,
        jobType,
        comments: comment ? [comment] : [],
      });
      setJobRole('');
      setJobType('Non-Technical');
      setComment('');
      if (onAppCreated) onAppCreated();
      alert('Application submitted!');
    } catch {
      setError('Failed to submit application');
    }
    setLoading(false);
  };

  if (!authData) return null;

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <input
        className="form-control mb-2"
        placeholder="Job Role"
        value={jobRole}
        onChange={e => setJobRole(e.target.value)}
        required
      />
      <select
        className="form-select mb-2"
        value={jobType}
        onChange={e => setJobType(e.target.value)}
      >
        <option value="Non-Technical">Non-Technical</option>
        <option value="Technical">Technical</option>
      </select>
      <input
        className="form-control mb-2"
        placeholder="Initial Comment"
        value={comment}
        onChange={e => setComment(e.target.value)}
      />
      <button className="btn btn-primary w-100" type="submit" disabled={loading}>
        {loading ? 'Submitting...' : 'Apply'}
      </button>
      {error && <div className="text-danger mt-2">{error}</div>}
    </form>
  );
};

export default ApplicationCreate;
