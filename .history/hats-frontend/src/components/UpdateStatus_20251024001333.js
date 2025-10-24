import React, { useState } from 'react';

export default function UpdateStatus({ applicationId, onSuccess }) {
  const [status, setStatus] = useState('');
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function handleUpdate(e) {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/application/${applicationId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token,
        },
        body: JSON.stringify({
          status,
          comment,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update status');
      }

      const data = await response.json();
      setSuccess('Status updated successfully!');
      if (onSuccess) onSuccess(data);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <form onSubmit={handleUpdate}>
      <div>
        <label>New Status:</label>
        <input type="text" value={status} onChange={e => setStatus(e.target.value)} required />
      </div>
      <div>
        <label>Comment (optional):</label>
        <input type="text" value={comment} onChange={e => setComment(e.target.value)} />
      </div>
      <button type="submit">Update Status</button>
      {error && <div style={{color: 'red'}}>{error}</div>}
      {success && <div style={{color: 'green'}}>{success}</div>}
    </form>
  );
}
