import React, { useEffect, useState, useContext } from 'react';
import api from '../api/api';
import { AuthContext } from '../context/AuthContext';
import ApplicationDetails from './ApplicationDetails';

const ApplicationList = () => {
  const { authData } = useContext(AuthContext);
  const [applications, setApplications] = useState([]);
  const [selected, setSelected] = useState(null);

  const fetchApplications = async () => {
    try {
      let params = {};
      if (authData.user.role === 'applicant') {
        params.applicant = authData.user.id;
      }
      const res = await api.get('/application/list', { params });
      setApplications(res.data.applications);
    } catch {
      alert('Failed to fetch applications');
    }
  };

  useEffect(() => {
    if (!authData) return;
    fetchApplications();
    // eslint-disable-next-line
  }, [authData]);

  if (!authData) return <p>Please login to view applications.</p>;

  return (
    <div>
      <h2>
        {authData.user.role === 'admin'
          ? 'All Applications (Admin View)'
          : 'Your Applications'}
      </h2>
      {applications.length === 0 ? (
        <p>No applications found</p>
      ) : (
        <ul>
          {applications.map(app => (
            <li key={app._id}>
              Role: {app.jobRole} | Status: {app.status} | Last Updated By: {app.lastUpdatedBy || 'N/A'}
              <button onClick={() => setSelected(app._id)}>View Details</button>
            </li>
          ))}
        </ul>
      )}
      {selected && (
        <ApplicationDetails applicationId={selected} onClose={() => setSelected(null)} afterUpdate={fetchApplications} />
      )}
    </div>
  );
};

export default ApplicationList;
