import React, { useState, useContext } from 'react';
import api from '../api/api';
import { AuthContext } from '../context/AuthContext';

const StatusUpdateForm = ({ application, afterUpdate }) => {
  const { authData } = useContext(AuthContext);
  const [newStatus, setNewStatus] = useState(application.status);
  const [comment, setComment] = useState('');
  const [botMimic, setBotMimic] = useState(authData?.user?.role === 'botmimic');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Only admins and botmimics can update status
  const roleCanUpdate = ["admin", "botmimic"].includes(authData?.user?.role);
  if (!roleCanUpdate) return null;

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post(`/application/${application._id}/update-status`, {
        newStatus,
        comment,
        changedBy: authData.user.role,
        botMimic,
      });
      setComment('');
      if (afterUpdate) afterUpdate();
      alert('Status updated!');
    } catch (err) {
      setError('Failed to update status');
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: 12 }}>
      <div>
        <label>Status: </label>
        <select value={newStatus} onChange={e => setNewStatus(e.target.value)}>
          <option value="Applied">Applied</option>
          <option value="Reviewed">Reviewed</option>
          <option value="Interview">Interview</option>
          <option value="Offer">Offer</option>
        </select>
      </div>
      <div>
        <label>Comment: </label>
        <input
          type="text"
          placeholder="Add comment (optional)"
          value={comment}
          onChange={e => setComment(e.target.value)}
        />
      </div>
      <div>
        <label>
          Bot Mimic
          <input
            type="checkbox"
            checked={botMimic}
            onChange={e => setBotMimic(e.target.checked)}
          />
        </label>
      </div>
      <button type="submit" disabled={loading}>
        {loading ? "Updating..." : "Update Status"}
      </button>
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </form>
  );
};

export default StatusUpdateForm;
