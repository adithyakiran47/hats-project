import React, { useEffect, useState, useContext } from 'react';
import api from '../api/api';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function JobListWithApply() {
  const { authData } = useContext(AuthContext);
  const navigate = useNavigate();
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

  const handleApply = (jobId, jobTitle, jobType) => {
    navigate(`/apply?jobId=${jobId}&jobRole=${jobTitle}&jobType=${jobType}`);
  };

  if (loading) return <div className="container my-4">Loading available jobs...</div>;

  return (
    <div className="container my-4">
      <h3 className="mb-4">Available Job Openings</h3>
      {jobs.length === 0 ? (
        <div className="alert alert-info">
          No jobs available at the moment. Please check back later.
        </div>
      ) : (
        <div className="row">
          {jobs.map(job => (
            <div key={job._id} className="col-md-6 mb-3">
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">{job.title}</h5>
                  <p className="card-text">
                    <span className={`badge ${job.jobType === 'technical' ? 'bg-primary' : 'bg-success'}`}>
                      {job.jobType === 'technical' ? 'Technical Role' : 'Non-Technical Role'}
                    </span>
                  </p>
                  {authData?.user.role === 'applicant' && (
                    <button 
                      className="btn btn-primary btn-sm"
                      onClick={() => handleApply(job._id, job.title, job.jobType)}
                    >
                      Apply Now
                    </button>
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
