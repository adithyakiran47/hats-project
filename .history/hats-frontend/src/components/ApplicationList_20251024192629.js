import React, { useState, useEffect } from 'react';

const ApplicationList = () => {
  const [applications, setApplications] = useState([]);
  const [message, setMessage] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
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

    fetchApplications();
  }, [token]);

  if (message) return <div className="alert alert-danger mt-3">{message}</div>;

  return (
    <div className="container mt-4">
      <h2>Applications</h2>
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
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app._id}>
                <td>{app._id}</td>
                <td>{app.applicantId?.name || app.applicantId || 'N/A'}</td>
                <td>{app.jobRole}</td>
                <td>{app.status}</td>
                <td>{new Date(app.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ApplicationList;
