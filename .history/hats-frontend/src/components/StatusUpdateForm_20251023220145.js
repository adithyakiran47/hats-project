import React, { useState, useContext } from 'react';
import api from '../api/api';
import { AuthContext } from '../context/AuthContext';

const StatusUpdateForm = ({ application, afterUpdate }) => {
  const { authData } = useContext(AuthContext);
  const [newStatus, setNewStatus] = useState(application.status);
  const [comment, setComment] = useState('');
  const [botMimic, setBotMimic] = useState(authData?.user?.role === 'botmimic');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post(`/application/${application._id}/update-status`, {
        newStatus,
        comment,
        changedBy: authData.user.role,
        botMimic,
      });
      alert('Status updated!');
      setComment('');
      if (afterUpdate) afterUpdate();
    } catch {
      alert('Failed to update status');
    }
    setLoading(false);
  };

  const roleCanUpdate = ["admin", "botmimic"].includes(authData?.user?.role);

  if (!roleCanUpdate) return null;

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: 8 }}>
      <label>
        Status:{" "}
        <select value={newStatus} onChange={e => setNewStatus(e.target.value)}>
          <option value="Applied">Applied</option>
          <option value="Reviewed">Reviewed</option>
          <option value="Interview">Interview</option>
          <option value="Offer">Offer</option>
        </select>
      </label>
      <br />
      <input
        value={comment}
        onChange={e => setComment(e.target.value)}
        placeholder="Comment"
      />
      <label>
        Bot Mimic
        <input
          type="checkbox"
          checked={botMimic}
          onChange={e => setBotMimic(e.target.checked)}
        />
      </label>
      <button type="submit" disabled={loading}>
        {loading ? "Updating..." : "Update Status"}
      </button>
    </form>
  );
};

export default StatusUpdateForm;
