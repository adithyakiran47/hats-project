import React, { useEffect, useState, useContext, useCallback } from 'react';
import api from '../api/api';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const ApplicationList = () => {
  const { authData } = useContext(AuthContext);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchApplications = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      let params = {};
      if (authData?.user?.role === 'applicant') {
        params.applicant = authData.user.id;
      }
      const res = await api.get('/application/list', { params });
      setApplications(res.data.applications);
    } catch {
      setError('Failed to fetch applications');
    }
    setLoading(false);
  }, [authData]);

  useEffect(() => {
    if (!authData) return;
    fetchApplications();
  }, [authData, fetchApplications]);

  if (!authData) return <div className="text-center mt-5">Please login to view applications.</div>;
  if (loading) return <div className="text-center mt-5">Loading applications...</div>;
  if (error) return <div className="alert alert-danger mt-3">{error}</div>;

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Applications</h2>
      {applications.length === 0 ? (
        <div>No applications found.</div>
      ) : (
        <div className="list-group">
          {applications.map(app => (
            <div key={app._id} className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <h5 className="mb-1">{app.jobRole}</h5>
                <small className="text-muted">Type: {app.jobType}</small><br />
                <small className="text-muted">Status: {app.status}</small><br />
                <small className="text-muted">Updated By: {app.lastUpdatedBy || 'N/A'}</small><br />
                {(authData.user.role === 'admin' || authData.user.role === 'botmimic') && app.applicant && (
                  <small className="text-muted">
                    Applicant: {app.applicant.name} ({app.applicant.email})
                  </small>
                )}
              </div>
              <Link to={`/applications/${app._id}`} className="btn btn-outline-primary btn-sm">
                View Details
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ApplicationList;
