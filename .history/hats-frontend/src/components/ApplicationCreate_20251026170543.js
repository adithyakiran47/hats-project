import React, { useContext, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../api/api';
import { AuthContext } from '../context/AuthContext';

export default function ApplicationCreate() {
  const { authData } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState('');
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await api.get('/job/list');
        setJobs(res.data.jobs);
        
        // auto selects job if comming from apply now 
        const jobId = queryParams.get('jobId');
        if (jobId) {
          setSelectedJob(jobId);
        }
      } catch (err) {
        console.error('Failed to fetch jobs:', err);
        setError('Failed to load jobs');
      }
    };
    fetchJobs();
  }, []);

  if (!authData || authData.user.role !== 'applicant') {
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
      navigate('/applications'); // redirect to "My Applications" 
    } catch (err) {
      setError('Failed to submit application: ' + (err.response?.data?.error || err.message));
    }
    setLoading(false);
  };

  const selectedJobDetails = jobs.find(j => j._id === selectedJob);

  return (
    <div className="container my-4">
      <div className="mx-auto p-4 border rounded shadow bg-white" style={{ maxWidth: 600 }}>
        <h3 className="mb-4 text-center">Apply for a Job</h3>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Select Job *</label>
            <select
              className="form-select"
              value={selectedJob}
              onChange={(e) => setSelectedJob(e.target.value)}
              required
            >
              <option value="">-- Select a Job --</option>
              {jobs.map(job => (
                <option key={job._id} value={job._id}>
                  {job.title} ({job.jobType === 'technical' ? 'Technical' : 'Non-Technical'})
                </option>
              ))}
            </select>
          </div>

          {selectedJobDetails && (
            <div className="alert alert-info mb-3">
              <strong>Job:</strong> {selectedJobDetails.title}<br />
              <strong>Type:</strong> <span className={`badge ${selectedJobDetails.jobType === 'technical' ? 'bg-primary' : 'bg-success'}`}>
                {selectedJobDetails.jobType === 'technical' ? 'Technical Role' : 'Non-Technical Role'}
              </span>
            </div>
          )}

          <div className="mb-3">
            <label className="form-label">Cover Letter / Comments (optional)</label>
            <textarea
              className="form-control"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              placeholder="Write your cover letter or any additional comments..."
            />
          </div>

          <button className="btn btn-primary w-100" type="submit" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Application'}
          </button>
          
          {error && <div className="alert alert-danger mt-3">{error}</div>}
        </form>
      </div>
    </div>
  );
}
