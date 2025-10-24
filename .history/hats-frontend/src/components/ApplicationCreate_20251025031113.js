import React, { useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../api/api';
import { AuthContext } from '../context/AuthContext';

export default function ApplicationCreate() {
  const { authData } = useContext(AuthContext);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await api.get('/job/list');
        const activeJobs = res.data.jobs.filter(j => j.status === 'active');
        setJobs(activeJobs);
        
        // Auto-select job if coming from job list
        const jobId = queryParams.get('jobId');
        if (jobId) {
          const job = activeJobs.find(j => j._id === jobId);
          if (job) setSelectedJob(job._id);
        }
      } catch (err) {
        console.error('Failed to fetch jobs:', err);
      }
    };
    fetchJobs();
  }, []);

  if (!authData || authData.user.role === 'admin' || authData.user.role === 'botmimic') {
    return (
      <div className="container my-4">
        <p className="text-center text-danger">You do not have permission to apply.</p>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedJob) {
      setError('Please select a job to apply');
      return;
    }

    setError('');
    setLoading(true);
    
    const job = jobs.find(j => j._id === selectedJob);
    
    try {
      await api.post('/application/create', {
        jobId: selectedJob,
        jobRole: job.title,
        jobType: job.jobType,
        comments: comment ? [comment] : [],
      });
      alert('Application submitted successfully!');
      setSelectedJob(null);
      setComment('');
    } catch {
      setError('Failed to submit application.');
    }
    setLoading(false);
  };

  return (
    <div className="container my-4">
      <form onSubmit={handleSubmit} className="mx-auto p-4 border rounded shadow" style={{ maxWidth: 600 }}>
        <h3 className="mb-4 text-center">Apply for a Job</h3>
        
        <div className="mb-3">
          <label className="form-label">Select Job *</label>
          <select
            className="form-select"
            value={selectedJob || ''}
            onChange={(e) => setSelectedJob(e.target.value)}
            required
          >
            <option value="">-- Select a Job --</option>
            {jobs.map(job => (
              <option key={job._id} value={job._id}>
                {job.title} ({job.jobType})
              </option>
            ))}
          </select>
        </div>

        {selectedJob && (
          <div className="alert alert-info">
            <strong>Job Type:</strong> {jobs.find(j => j._id === selectedJob)?.jobType}
          </div>
        )}

        <textarea
          className="form-control mb-3"
          placeholder="Cover Letter / Comments (optional)"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
        ></textarea>

        <button className="btn btn-primary w-100" type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Application'}
        </button>
        
        {error && <div className="alert alert-danger mt-3">{error}</div>}
      </form>
    </div>
  );
}
