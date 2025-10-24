import React, { useContext, useEffect, useState } from 'react';
import api from '../api/api';
import { AuthContext } from '../context/AuthContext';

const statusOptions = [
  'Applied',
  'Reviewed',
  'Interview Scheduled',
  'Interview Completed',
  'Offer Extended',
  'Selected',
  'Rejected'
];

export default function ApplicationList() {
  const { authData } = useContext(AuthContext);
  const [applications, setApplications] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [statusEdits, setStatusEdits] = useState({});

  const isAdminOrBot = authData && (authData.user.role === 'admin' || authData.user.role === 'botmimic');

  useEffect(() => {
    if (!authData) return;

    const fetchApplications = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await api.get('/application/list');
        setApplications(res.data.applications);
      } catch {
        setError('Failed to load applications.');
      }
      setLoading(false);
    };

    fetchApplications();
  }, [authData]);

  const handleStatusChange = (appId, status) => {
    setStatusEdits((prev) => ({ ...prev, [appId]: status }));
  };

  const handleUpdateStatus = async (appId) => {
    const newStatus = statusEdits[appId];
    try {
      await api.put(`/application/update-status/${appId}`, {
        status: newStatus,
        lastUpdatedBy: authData.user.name,
      });
      const res = await api.get('/application/list');
      setApplications(res.data.applications);
      setStatusEdits((prev) => ({ ...prev, [appId]: undefined }));
    } catch {
      alert('Failed to update status');
    }
  };

  if (!authData) return <p className="text-center mt-4">Please login to view applications.</p>;
  if (loading) return <p className="text-center mt-4">Loading applications...</p>;

  return (
    <div className="container my-4">
      <h2 className="mb-4 text-center">Applications</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {applications.length === 0 ? (
        <p className="text-center">No applications found.</p>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 g-3">
          {applications.map((app) => (
            <div key={app._id} className="col">
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">{app.jobRole}</h5>
                  <h6 className="card-subtitle mb-2 text-muted">
                    {app.jobType} &mdash; Status: <span className="fw-semibold">{app.status}</span>
                  </h6>
                  <p className="card-text">
                    <strong>Applicant:</strong> {app.applicant?.name || 'N/A'} ({app.applicant?.email || 'N/A'})
                  </p>
                  {app.comments && app.comments.length > 0 && (
                    <>
                      <h6>Update History:</h6>
                      <ul className="list-group list-group-flush">
                        {app.comments.map((comment, idx) => (
                          <li
                            key={idx}
                            className={`list-group-item ${comment.includes('Bot Mimic') ? 'text-info fst-italic' : ''}`}
                          >
                            {comment}
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                  {isAdminOrBot && (
                    <div className="mt-3">
                      <label className="form-label mb-1">Change Status:</label>
                      <div className="d-flex gap-2">
                        <select
                          className="form-select"
                          style={{ maxWidth: '200px' }}
                          value={statusEdits[app._id] ?? app.status}
                          onChange={(e) => handleStatusChange(app._id, e.target.value)}
                        >
                          {statusOptions.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                        <button
                          className="btn btn-primary"
                          onClick={() => handleUpdateStatus(app._id)}
                          disabled={statusEdits[app._id] === undefined || statusEdits[app._id] === app.status}
                        >
                          Update
                        </button>
                      </div>
                      {app.lastUpdatedBy && (
                        <div className="mt-1 text-muted" style={{ fontSize: '0.95em' }}>
                          Last updated by: {app.lastUpdatedBy}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
