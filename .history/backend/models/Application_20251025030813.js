import React, { useEffect, useState, useContext } from 'react';
import api from '../api/api';
import { AuthContext } from '../context/AuthContext';

export default function JobListWithApply() {
  const { authData } = useContext(AuthContext);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await api.get('/job/list');
        setJobs(res.data.jobs);
      } catch (err) {
        console.error('Failed to fetch jobs:', err);
      }
      setLoading(false);
    };
    fetchJobs();
  }, []);

  const handleApply = (jobId, jobRole, jobType) => {
    // Navigate to application form with job details
    window.location.href = `/apply?jobId=${jobId}&jobRole=${jobRole}&jobType=${jobType}`;
  };

  if (loading) return <div className="container my-4">Loading jobs...</div>;

  return (
    <div className="container my-4">
      <h3>Available Job Openings</h3>
      {jobs.length === 0 ? (
        <p>No jobs available at the moment.</p>
      ) : (
        <div className="row">
          {jobs.map(job => (
            <div key={job._id} className="col-md-6 mb-3">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{job.title}</h5>
                  <p className="card-text">
                    <span className={`badge ${job.jobType === 'technical' ? 'bg-primary' : 'bg-success'}`}>
                      {job.jobType}
                    </span>
                    {job.location && <span className="ms-2">📍 {job.location}</span>}
                  </p>
                  {job.description && <p className="card-text">{job.description}</p>}
                  {job.status === 'active' && authData?.user.role === 'applicant' && (
                    <button 
                      className="btn btn-primary btn-sm"
                      onClick={() => handleApply(job._id, job.title, job.jobType)}
                    >
                      Apply Now
                    </button>
                  )}
                  {job.status === 'closed' && (
                    <span className="badge bg-secondary">Closed</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
