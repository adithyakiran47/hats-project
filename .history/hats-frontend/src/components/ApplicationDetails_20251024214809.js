import React, { useEffect, useState } from 'react';
import api from '../api/api';
import ActivityLogs from './ActivityLogs';

const ApplicationDetails = ({ applicationId, onClose }) => {
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);

  const formatJobType = (jobType) => {
    if (!jobType) return '';
    return jobType
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join('-');
  };

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const res = await api.get(`/application/${applicationId}`);
        console.log('Fetched application:', res.data.application); // Debug log
        setApplication(res.data.application);
      } catch (err) {
        setApplication(null);
        console.error('Failed to fetch application details:', err);
      }
      setLoading(false);
    };
    if (applicationId) fetchApplication();
  }, [applicationId]);

  if (loading) return <div>Loading...</div>;
  if (!application) return <div className="text-danger">Application not found.</div>;

  return (
    <div className="card mt-4 p-3">
      <button className="btn btn-secondary btn-sm mb-2" onClick={onClose}>Back</button>
      <h4>{application.jobRole}</h4>
      <p>
        <b>Status:</b> {application.status}
        <br />
        <b>Job Type:</b> {formatJobType(application.jobType)}
      </p>
      <h5>Status Timeline</h5>
      <ul className="list-group mb-3">
        {application.statusTimeline && application.statusTimeline.map((s, i) => (
          <li key={i} className="list-group-item">
            <b>{s.status}</b> — <small>{new Date(s.updatedAt).toLocaleString()}</small>
          </li>
        ))}
      </ul>
      <h5>Comments</h5>
      <ul className="list-group mb-3">
        {application.comments && application.comments.map((c, i) => (
          <li key={i} className="list-group-item">
            <b>{c.by}:</b> {c.text}<br />
            <small>{new Date(c.timestamp).toLocaleString()}</small>
          </li>
        ))}
      </ul>
      <ActivityLogs logs={application.activityLogs} />
    </div>
  );
};

export default ApplicationDetails;
