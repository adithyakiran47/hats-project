import React, { useEffect, useState } from 'react';
import api from '../api/api'; // Your Axios or fetch wrapper
import ApplicationDetails from './ApplicationDetails';

const ApplicationList = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedApp, setSelectedApp] = useState(null); // For details view

  useEffect(() => {
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
                <td>{app.applicant?.name}</td>
                <td>{app.jobRole}</td>
                <td>{app.status}</td>
                <td>{new Date(app.createdAt).toLocaleString()}</td>
                <td>
                  {/* Update status dropdown or controls here if needed */}
                  {app.status}
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

      {/* Details view */}
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
