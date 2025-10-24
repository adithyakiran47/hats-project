import React, { useState, useContext } from 'react';
import api from '../api/api';
import { AuthContext } from '../context/AuthContext';

const StatusUpdateForm = ({ application, afterUpdate }) => {
  const { authData } = useContext(AuthContext);
  const [newStatus, setNewStatus] = useState(application.status);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const roleCanUpdate = ["admin", "botmimic"].includes(authData?.user?.role);
  if (!roleCanUpdate) return null;

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.patch(`/application/${application._id}/status`, {
        status: newStatus,
        comment,
      });
      setComment('');
      if (afterUpdate) afterUpdate();
      alert('Status updated!');
    } catch {
      setError('Failed to update status');
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="p-3 border rounded shadow-sm mt-3" style={{ maxWidth: '400px' }}>
      <div className="mb-3">
        <label className="form-label">New Status</label>
        <select className="form-select" value={newStatus} onChange={e => setNewStatus(e.target.value)}>
          <option value="Applied">Applied</option>
          <option value="Reviewed">Reviewed</option>
          <option value="Interview">Interview</option>
          <option value="Offer">Offer</option>
        </select>
      </div>
      <div className="mb-3">
        <label className="form-label">Add Comment (optional)</label>
        <input 
          type="text" 
          className="form-control" 
          value={comment} 
          onChange={e => setComment(e.target.value)} 
        />
      </div>
      <button type="submit" className="btn btn-warning w-100" disabled={loading}>
        {loading ? (<><span className="spinner-border spinner-border-sm me-2"></span>Updating...</>) : 'Update Status'}
      </button>
      {error && <div className="alert alert-danger mt-2">{error}</div>}
    </form>
  );
};

export default StatusUpdateForm;
