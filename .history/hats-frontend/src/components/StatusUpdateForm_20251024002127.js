import React, { useState, useContext } from 'react';
import api from '../api/api';
import { AuthContext } from '../context/AuthContext';

const AVAILABLE_STATUSES = [
  { value: "Applied", label: "Applied" },
  { value: "Reviewed", label: "Reviewed" },
  { value: "Interview", label: "Interview" },
  { value: "Offer", label: "Offer" }
];

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
      // adapt endpoint as needed; here is PATCH but your backend can also allow POST
      await api.patch(`/application/${application._id}/status`, {
        status: newStatus,
        comment,
        changedBy: authData.user.role,
        botMimic
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
    <form onSubmit={handleSubmit} className="border rounded p-3 mt-3">
      <div className="mb-2">
        <label>Status: </label>
        <select
          className="form-select"
          value={newStatus}
          onChange={e => setNewStatus(e.target.value)}
        >
          {AVAILABLE_STATUSES.map(status => (
            <option key={status.value} value={status.value}>
              {status.label}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-2">
        <label>Comment: </label>
        <input
          type="text"
          className="form-control"
          placeholder="Add comment (optional)"
          value={comment}
          onChange={e => setComment(e.target.value)}
        />
      </div>
      <div className="form-check mb-2">
        <input
          className="form-check-input"
          type="checkbox"
          checked={botMimic}
          onChange={e => setBotMimic(e.target.checked)}
          id="botMimic"
        />
        <label className="form-check-label" htmlFor="botMimic">
          Bot Mimic
        </label>
      </div>
      <button className="btn btn-warning w-100" type="submit" disabled={loading}>
        {loading ? "Updating..." : "Update Status"}
      </button>
      {error && <div className="text-danger mt-2">{error}</div>}
    </form>
  );
};

export default StatusUpdateForm;
