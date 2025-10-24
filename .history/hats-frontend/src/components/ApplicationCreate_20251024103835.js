import React, { useContext, useState } from 'react';
import api from '../api/api';
import { AuthContext } from '../context/AuthContext';

export default function ApplicationCreate() {
  const { authData } = useContext(AuthContext);
  const [jobRole, setJobRole] = useState('');
  const [jobType, setJobType] = useState('Non-Technical');
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!authData || authData.user.role === 'admin' || authData.user.role === 'botmimic') {
    return (
      <div className="container my-4">
        <p className="text-center text-danger">You do not have permission to apply.</p>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/application/create', {
        jobRole,
        jobType,
        comments: comment ? [comment] : [],
      });
      alert('Application submitted!');
      setJobRole('');
      setJobType('Non-Technical');
      setComment('');
    } catch {
      setError('Failed to submit application.');
    }
    setLoading(false);
  };

  return (
    <div className="container my-4">
      <form onSubmit={handleSubmit} className="mx-auto p-4 border rounded shadow" style={{ maxWidth: 500 }}>
        <h3 className="mb-4 text-center">Create Application</h3>
        <input className="form-control mb-3" placeholder="Job Role" value={jobRole} onChange={(e) => setJobRole(e.target.value)} required />
        <select className="form-select mb-3" value={jobType} onChange={(e) => setJobType(e.target.value)} required>
          <option value="Non-Technical">Non-Technical</option>
          <option value="Technical">Technical</option>
        </select>
        <textarea
          className="form-control mb-3"
          placeholder="Initial Comment (optional)"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
        ></textarea>
        <button className="btn btn-primary w-100" type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit'}
        </button>
        {error && <div className="alert alert-danger mt-3">{error}</div>}
      </form>
    </div>
  );
}
