import React, { useState, useEffect } from 'react';

const JobListWithApply = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState('');
  const [comments, setComments] = useState('');
  const [message, setMessage] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetch('/api/job/list', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setJobs(data.jobs))
      .catch(console.error);
  }, [token]);

  const applyForJob = async () => {
    if (!selectedJobId) {
      setMessage('Please select a job to apply');
      return;
    }

    const applicationData = {
      jobId: selectedJobId,
      jobRole: jobs.find(job => job._id === selectedJobId)?.title,
      jobType: 'technical',
      comments: [comments || 'No comment']
    };

    const res = await fetch('/api/application/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(applicationData)
    });

    const result = await res.json();

    if (res.ok) {
      setMessage('Application submitted successfully');
      setComments('');
      setSelectedJobId('');
    } else {
      setMessage(result.error || 'Failed to apply');
    }
  };

  return (
    <div className="container mt-4">
      <h2>Available Jobs</h2>
      <select className="form-select" value={selectedJobId} onChange={e => setSelectedJobId(e.target.value)}>
        <option value="">Select a job</option>
        {jobs.map(job => (
          <option key={job._id} value={job._id}>
            {job.title} - {job.roleType}
          </option>
        ))}
      </select>
      <textarea
        className="form-control mt-3"
        placeholder="Add comments or motivation..."
        value={comments}
        onChange={e => setComments(e.target.value)}
      />
      <button className="btn btn-primary mt-3" onClick={applyForJob}>
        Apply
      </button>
      {message && <div className="alert alert-info mt-3">{message}</div>}
    </div>
  );
};

export default JobListWithApply;
