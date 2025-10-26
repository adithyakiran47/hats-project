import React, { useEffect, useState } from 'react';
import api from '../api/api';
import ApplicationDetails from './ApplicationDetails';

//  to check if current user role can update status
const allowedToUpdate = (role) => role === 'admin' || role === 'botmimic';

const ApplicationList = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedApp, setSelectedApp] = useState(null);
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    // decode jwt for the user role
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const [, payload] = token.split('.');
        const decoded = JSON.parse(atob(payload));
        setUserRole(decoded.role);
      } catch {}
    }
    
    const fetchApplications = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await api.get('/application/list');
        setApplications(res.data.applications || []);
      } catch (err) {
        setError('Failed to load applications.');
      }
      setLoading(false);
    };
    fetchApplications();
  }, []);

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await api.put(`/application/update-status/${id}`, { status: newStatus });
      setApplications(applications =>
        applications.map(app => app._id === id ? { ...app, status: newStatus } : app)
      );
    } catch {
      alert('Failed to update status');
    }
  };

  return (
    <div className="container mt-4">
      <h2>Applications</h2>
      {error && <div className="text-danger">{error}</div>}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <table className="table table-bordered table-hover">
          <thead className="table-light">
            <tr>
              <th>ID</th>
              <th>Job Role</th>
              <th>Job Type</th>
              <th>Status</th>
              <th>Applied On</th>
              <th>Update Status</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {applications.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center text-muted">
                  No applications found
                </td>
              </tr>
            ) : (
              applications.map(app => (
                <tr key={app._id}>
                  <td>{app._id.substring(0, 8)}...</td>
                  <td>{app.jobRole}</td>
                  <td>
                    <span className={`badge ${app.jobType === 'technical' ? 'bg-primary' : 'bg-success'}`}>
                      {app.jobType === 'technical' ? 'Technical' : 'Non-Technical'}
                    </span>
                  </td>
                  <td>
                    <span className="badge bg-info">{app.status}</span>
                  </td>
                  <td>{new Date(app.createdAt).toLocaleDateString()}</td>
                  <td>
                    {allowedToUpdate(userRole) ? (
                      <select
                        className="form-select form-select-sm"
                        value={app.status}
                        onChange={e => handleStatusUpdate(app._id, e.target.value)}
                      >
                        <option value="Applied">Applied</option>
                        <option value="Reviewed">Reviewed</option>
                        <option value="Interview">Interview</option>
                        <option value="Offer">Offer</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    ) : (
                      <span className="text-muted">View Only</span>
                    )}
                  </td>
                  <td>
                    <button
                      className="btn btn-info btn-sm"
                      onClick={() => setSelectedApp(app._id)}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
      {selectedApp && (
        <ApplicationDetails
          applicationId={selectedApp}
          onClose={() => setSelectedApp(null)}
        />
      )}
    </div>
  );
};

export default ApplicationList;
