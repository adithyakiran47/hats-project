import React, { useState } from 'react';

export default function StatusUpdateForm({ application, afterUpdate }) {
  const [status, setStatus] = useState(application.status || '');
  const [comment, setComment] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/application/${application._id}/status`, {
        method: 'PATCH',
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token,
        },
        body: JSON.stringify({
          status,
          comment,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update status");
      }
      setMessage("Status updated successfully");
      setComment('');
      if (typeof afterUpdate === 'function') afterUpdate();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>New Status: </label>
        <input
          value={status}
          onChange={e => setStatus(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Comment: </label>
        <input
          value={comment}
          onChange={e => setComment(e.target.value)}
        />
      </div>
      <button type="submit">Update Status</button>
      {message && <span style={{color: 'green', marginLeft: 8}}>{message}</span>}
      {error && <span style={{color: 'red', marginLeft: 8}}>{error}</span>}
    </form>
  );
}
