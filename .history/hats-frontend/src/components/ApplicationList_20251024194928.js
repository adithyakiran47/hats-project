import React, { useState, useEffect } from 'react';

const statusOptions = ["Applied", "Shortlisted", "Selected", "Rejected"];

const ApplicationList = () => {
  const [applications, setApplications] = useState([]);
  const [message, setMessage] = useState('');
  const [updating, setUpdating] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchApplications();
    // eslint-disable-next-line
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await fetch('/api/application/list', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch applications');
      const data = await res.json();
      setApplications(data.applications || data);
    } catch (err) {
      setMessage(err.message);
    }
  };

  const updateStatus = async (appId, status) => {
    setUpdating(appId);
    try {
      const res = await fetch(`/api/application/update-status/${appId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      if (!res.ok) throw new Error('Failed to update status');
      setMessage('Status updated!');
      fetchApplications();
    } catch (err) {
      setMessage(err.message);
    } finally {
      setUpdating(null);
    }
  };

  if (message) {
    setTimeout(() => setMessage(''), 2500);
  }

  return (
    <div className="container mt-4">
      <h2>Applications</h2>
      {message && <div className="alert alert-info">{message}</div>}
      {applications.length === 0 ? (
        <p>No applications found.</p>
      ) : (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>ID</th>
              <th>Applicant</th>
              <th>Job Role</th>
              <th>Status</th>
              <th>Applied On</th>
              <th>Update Status</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app._id}>
                <td>{app._id}</td>
                <td>{app.applicant?.name || 'N/A'}</td>
                <td>{app.jobRole}</td>
                <td>{app.status}</td>
                <td>{new Date(app.createdAt).toLocaleString()}</td>
                <td>
                  <select
                    value={app.status}
                    onChange={e => updateStatus(app._id, e.target.value)}
                    disabled={updating === app._id}
                    className="form-select"
                  >
                    {statusOptions.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ApplicationList;
