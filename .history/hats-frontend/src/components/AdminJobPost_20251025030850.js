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
    jobType: 'technical',
    description: '',
    requirements: '',
    location: '',
    status: 'active'
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
    try {
      if (editingJob) {
        await api.put(`/job/update/${editingJob._id}`, formData);
        alert('Job updated successfully!');
      } else {
        await api.post('/job/create', formData);
        alert('Job created successfully!');
      }
      setFormData({ title: '', jobType: 'technical', description: '', requirements: '', location: '', status: 'active' });
      setShowForm(false);
      setEditingJob(null);
      fetchJobs();
    } catch (err) {
      alert('Failed to save job: ' + err.message);
    }
  };

  const handleEdit = (job) => {
    setEditingJob(job);
    setFormData({
      title: job.title,
      jobType: job.jobType,
      description: job.description || '',
      requirements: job.requirements || '',
      location: job.location || '',
      status: job.status
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
    setFormData({ title: '', jobType: 'technical', description: '', requirements: '', location: '', status: 'active' });
  };

  if (authData?.user.role !== 'admin') {
    return <div className="container my-4 text-danger">Access Denied: Admin only</div>;
  }

  return (
    <div className="container my-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Job Postings Management</h3>
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
              </div>
              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Requirements</label>
                <textarea
                  className="form-control"
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleInputChange}
                  rows="3"
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Location</label>
                <input
                  type="text"
                  className="form-control"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Status</label>
                <select
                  className="form-select"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                >
                  <option value="active">Active</option>
                  <option value="closed">Closed</option>
                </select>
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
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Title</th>
              <th>Type</th>
              <th>Location</th>
              <th>Status</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map(job => (
              <tr key={job._id}>
                <td>{job.title}</td>
                <td>
                  <span className={`badge ${job.jobType === 'technical' ? 'bg-primary' : 'bg-success'}`}>
                    {job.jobType}
                  </span>
                </td>
                <td>{job.location || '-'}</td>
                <td>
                  <span className={`badge ${job.status === 'active' ? 'bg-success' : 'bg-secondary'}`}>
                    {job.status}
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
