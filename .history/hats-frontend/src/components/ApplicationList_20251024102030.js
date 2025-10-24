import React, { useContext, useEffect, useState } from 'react';
import api from '../api/api';
import { AuthContext } from '../context/AuthContext';

export default function ApplicationList() {
  const { authData } = useContext(AuthContext);
  const [applications, setApplications] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authData) return;
    const fetchApplications = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await api.get('/application/list');
        setApplications(res.data.applications);
      } catch {
        setError('Failed to load applications');
      }
      setLoading(false);
    };
    fetchApplications();
  }, [authData]);

  if (!authData) return <p>Please login to view applications</p>;
  if (loading) return <p>Loading applications...</p>;

  return (
    <div className="m-4">
      <h2>Applications</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {applications.length === 0 ? (
        <p>No applications found</p>
      ) : (
        <ul className="list-group">
          {applications.map(app => (
            <li key={app._id} className="list-group-item">
              <strong>{app.jobRole}</strong> ({app.jobType}) - Status: {app.status}<br />
              Applicant: {app.applicant?.name || 'N/A'} ({app.applicant?.email || 'N/A'})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
