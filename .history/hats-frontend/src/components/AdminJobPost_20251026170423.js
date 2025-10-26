import React, { useContext, useState, useEffect } from 'react';
import api from '../api/api';
import { AuthContext } from '../context/AuthContext';

export default function AdminJobPost() {
  const { authData } = useContext(AuthContext);
  const [jobs, setJobs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    jobType: 'technical'  
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await api.get('/job/list');
      setJobs(res.data.jobs);
    } catch (err) {
      console.error('Failed to fetch jobs:', err);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting job data:', formData); // debug log
    
    try {
      if (editingJob) {
        await api.put(`/job/update/${editingJob._id}`, formData);
        alert('Job updated successfully!');
      } else {
        await api.post('/job/create', formData);
        alert('Job created successfully!');
      }
      setFormData({ title: '', jobType: 'technical' });
      setShowForm(false);
      setEditingJob(null);
      fetchJobs();
    } catch (err) {
      console.error('Error saving job:', err.response?.data || err.message);
      alert('Failed to save job: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleEdit = (job) => {
    setEditingJob(job);
    setFormData({
      title: job.title,
      jobType: job.jobType  
    });
    setShowForm(true);
  };

  const handleDelete = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job?')) return;
    try {
      await api.delete(`/job/delete/${jobId}`);
      alert('Job deleted successfully!');
      fetchJobs();
    } catch (err) {
      alert('Failed to delete job: ' + err.message);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingJob(null);
    setFormData({ title: '', jobType: 'technical' });
  };

  if (authData?.user.role !== 'admin') {
    return <div className="container my-4 text-danger">Access Denied: Admin only</div>;
  }

  return (
    <div className="container my-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Manage Job Postings</h3>
        {!showForm && (
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>
            + Create New Job
          </button>
        )}
      </div>

      {showForm && (
        <div className="card mb-4">
          <div className="card-body">
            <h5>{editingJob ? 'Edit Job' : 'Create New Job'}</h5>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Job Title *</label>
                <input
                  type="text"
                  className="form-control"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., Senior Web Developer"
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Job Type *</label>
                <select
                  className="form-select"
                  name="jobType"
                  value={formData.jobType}
                  onChange={handleInputChange}
                  required
                >
                  <option value="technical">Technical</option>
                  <option value="non-technical">Non-Technical</option>
                </select>
                <small className="text-muted">Selected: {formData.jobType}</small>
              </div>
              <button type="submit" className="btn btn-success me-2">
                {editingJob ? 'Update Job' : 'Create Job'}
              </button>
              <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="table-responsive">
        <table className="table table-bordered table-hover">
          <thead className="table-light">
            <tr>
              <th>Job Title</th>
              <th>Type</th>
              <th>Created Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center text-muted">
                  No jobs posted yet. Create your first job!
                </td>
              </tr>
            ) : (
              jobs.map(job => (
                <tr key={job._id}>
                  <td>{job.title}</td>
                  <td>
                    <span className={`badge ${job.jobType === 'technical' ? 'bg-primary' : 'bg-success'}`}>
                      {job.jobType === 'technical' ? 'Technical' : 'Non-Technical'}
                    </span>
                  </td>
                  <td>{new Date(job.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(job)}>
                      Edit
                    </button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(job._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
