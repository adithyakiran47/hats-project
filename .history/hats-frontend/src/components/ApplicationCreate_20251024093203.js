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
    <form onSubmit={handleSubmit} className="mx-auto p-4 border rounded shadow-sm" style={{ maxWidth: 500 }}>
      <h3 className="mb-4 text-center">Create Application</h3>
      <input
        className="form-control mb-3"
        placeholder="Job Role"
        value={jobRole}
        onChange={e => setJobRole(e.target.value)}
        required
      />
      <select
        className="form-select mb-3"
        value={jobType}
        onChange={e => setJobType(e.target.value)}
        required
      >
        <option value="Non-Technical">Non-Technical</option>
        <option value="Technical">Technical</option>
      </select>
      <textarea
        className="form-control mb-3"
        placeholder="Initial Comment (optional)"
        value={comment}
        onChange={e => setComment(e.target.value)}
        rows="3"
      ></textarea>
      <button type="submit" className="btn btn-primary w-100" disabled={loading}>
        {loading ? <><span className="spinner-border spinner-border-sm me-2"></span>Submitting...</> : 'Submit'}
      </button>
      {error && <div className="alert alert-danger mt-3">{error}</div>}
    </form>
  );
};

export default ApplicationCreate;
