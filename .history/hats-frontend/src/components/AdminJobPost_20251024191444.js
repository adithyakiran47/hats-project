import React, { useState } from 'react';

const AdminJobPost = () => {
  const [title, setTitle] = useState('');
  const [roleType, setRoleType] = useState('technical');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');
  const token = localStorage.getItem('token');

  const createJob = async () => {
    if (!title || !description) {
      setMessage('Title and description are required.');
      return;
    }

    const res = await fetch('/api/job/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ title, roleType, description })
    });

    const result = await res.json();

    if (res.ok) {
      setMessage('Job posted successfully');
      setTitle('');
      setDescription('');
      setRoleType('technical');
    } else {
      setMessage(result.error || 'Failed to post job');
    }
  };

  return (
    <div className="container mt-4">
      <h2>Post a New Job</h2>
      <input
        className="form-control mb-2"
        placeholder="Job Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <select className="form-select mb-2" value={roleType} onChange={e => setRoleType(e.target.value)}>
        <option value="technical">Technical</option>
        <option value="non-technical">Non-Technical</option>
      </select>
      <textarea
        className="form-control mb-2"
        placeholder="Job Description"
        rows={5}
        value={description}
        onChange={e => setDescription(e.target.value)}
      />
      <button className="btn btn-success" onClick={createJob}>
        Post Job
      </button>
      {message && <div className="alert alert-info mt-3">{message}</div>}
    </div>
  );
};

export default AdminJobPost;
