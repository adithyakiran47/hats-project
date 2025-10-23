import React, { useEffect, useState, useContext, useCallback } from 'react';
import api from '../api/api';
import { AuthContext } from '../context/AuthContext';
import ApplicationDetails from './ApplicationDetails';

const ApplicationList = () => {
  const { authData } = useContext(AuthContext);
  const [applications, setApplications] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchApplications = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      let params = {};
      if (authData && authData.user.role === 'applicant') {
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

  if (!authData) return <p>Please login to view applications.</p>;
  if (loading) return <p>Loading applications...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div>
      <h2>
        {authData.user.role === 'admin'
          ? 'All Applications (Admin View)'
          : authData.user.role === 'botmimic'
          ? 'All Applications (Bot Mimic View)'
          : 'Your Applications'}
      </h2>
      {applications.length === 0 ? (
        <p>No applications found</p>
      ) : (
        <ul className="list-group">
          {applications.map(app => (
            <li key={app._id} className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <strong>Role:</strong> {app.jobRole} <br />
                <strong>Status:</strong> {app.status} <br />
                <strong>Last Updated By:</strong> {app.lastUpdatedBy || 'N/A'}
                {(authData.user.role === 'admin' || authData.user.role === 'botmimic') && app.applicant && (
                  <>
                    <br />
                    <strong>Applicant:</strong> {app.applicant.name} ({app.applicant.email})
                  </>
                )}
              </div>
              <button className="btn btn-info btn-sm" onClick={() => setSelected(app._id)}>View Details</button>
            </li>
          ))}
        </ul>
      )}
      {selected && (
        <ApplicationDetails applicationId={selected} onClose={() => setSelected(null)} fetchApplications={fetchApplications} />
      )}
    </div>
  );
};

export default ApplicationList;
