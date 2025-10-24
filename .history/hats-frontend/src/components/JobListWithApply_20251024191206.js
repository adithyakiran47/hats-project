import React, { useState, useEffect } from 'react';

const JobListWithApply = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState('');
  const [comments, setComments] = useState('');
  const [message, setMessage] = useState('');

  const token = localStorage.getItem('token'); // Assume JWT saved here

  // Fetch jobs on component mount
  useEffect(() => {
    fetch('/api/job/list', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setJobs(data.jobs))
      .catch(err => console.error(err));
  }, [token]);

  // Handle apply submission
  const applyForJob = async () => {
    if (!selectedJobId) {
      setMessage('Please select a job to apply');
      return;
    }

    const applicationData = {
      jobId: selectedJobId,
      jobRole: jobs.find(job => job._id === selectedJobId)?.title,
      jobType: 'technical', // Or fetch dynamically if you want
      comments: [comments || 'No comment']
    };

    try {
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
    } catch (error) {
      setMessage('Error applying for job');
    }
  };

  return (
    <div className="container mt-4">
      <h2>Available Jobs</h2>
      <select
        className="form-select"
        value={selectedJobId}
        onChange={e => setSelectedJobId(e.target.value)}
      >
        <option value="">Select a job</option>
        {jobs.map(job => (
          <option key={job._id} value={job._id}>
            {job.title} - {job.roleType}
          </option>
        ))}
      </select>

      <div className="mt-3">
        <textarea
          className="form-control"
          placeholder="Add comments or motivation..."
          value={comments}
          onChange={e => setComments(e.target.value)}
        />
      </div>

      <button className="btn btn-primary mt-3" onClick={applyForJob}>
        Apply
      </button>

      {message && <div className="alert alert-info mt-3">{message}</div>}
    </div>
  );
};

export default JobListWithApply;
