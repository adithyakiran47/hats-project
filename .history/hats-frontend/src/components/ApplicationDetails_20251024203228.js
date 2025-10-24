import React, { useEffect, useState } from 'react';
import api from '../api/api'; // Axios or your custom API client
import ActivityLogs from './ActivityLogs'; // Import the activity log component

const ApplicationDetails = ({ applicationId, onClose }) => {
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const res = await api.get(`/application/${applicationId}`);
        setApplication(res.data.application);
        setLoading(false);
      } catch (err) {
        setError('Failed to load application details.');
        setLoading(false);
      }
    };

    fetchApplication();
  }, [applicationId]);

  if (loading) return <p>Loading application details...</p>;
  if (error) return <p className="text-danger">{error}</p>;
  if (!application) return <p>No application data found.</p>;

  return (
    <div className="card mt-3 p-3">
      <button className="btn btn-sm btn-secondary mb-3" onClick={onClose}>Back</button>

      <h3>Application Details</h3>

      <p><strong>Job Role:</strong> {application.jobRole}</p>
      <p><strong>Job Type:</strong> {application.jobType}</p>
      <p><strong>Status:</strong> {application.status}</p>

      <h5>Comments</h5>
      {application.comments.length === 0 ? (
        <p>No comments yet.</p>
      ) : (
        <ul className="list-group mb-3">
          {application.comments.map((c, idx) => (
            <li key={idx} className="list-group-item">
              <strong>{c.by}:</strong> {c.text}<br />
              <small>{new Date(c.timestamp).toLocaleString()}</small>
            </li>
          ))}
        </ul>
      )}

      {/* Activity Logs */}
      <ActivityLogs logs={application.activityLogs} />
    </div>
  );
};

export default ApplicationDetails;
