import React, { useEffect, useState } from 'react';
import api from '../api/api';
import ApplicationDetails from './ApplicationDetails';

// Helper to check if current user role can update statuses
const allowedToUpdate = (role) => role === 'admin' || role === 'botmimic';

const ApplicationList = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedApp, setSelectedApp] = useState(null);
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    // Decode JWT for the user role (assumes JWT is base64 with "role" property)
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
          <thead>
            <tr>
              <th>ID</th>
              <th>Applicant</th>
              <th>Job Role</th>
              <th>Status</th>
              <th>Applied On</th>
              <th>Update Status</th>
              <th>Traceability</th>
            </tr>
          </thead>
          <tbody>
            {applications.map(app => (
              <tr key={app._id}>
                <td>{app._id}</td>
                <td>{app.jobType?.name}</td>
                <td>{app.jobRole}</td>
                <td>{app.status}</td>
                <td>{new Date(app.createdAt).toLocaleString()}</td>
                <td>
                {allowedToUpdate(userRole) ? (
                  <select
                    className="form-select"
                    value={app.status}
                    onChange={e => handleStatusUpdate(app._id, e.target.value)}
                  >
                    <option value="Applied">Applied</option>
                    <option value="Shortlisted">Shortlisted</option>
                    <option value="Reviewed">Reviewed</option>
                    <option value="Interview">Interview</option>
                    <option value="Offer">Offer</option>
                  </select>
                ) : (
                  app.status
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
            ))}
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
