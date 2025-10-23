import React, { useEffect, useState, useContext } from 'react';
import api from '../api/api';
import { AuthContext } from '../context/AuthContext';
import ApplicationDetails from './ApplicationDetails';

const ApplicationList = () => {
  const { authData } = useContext(AuthContext);
  const [applications, setApplications] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (!authData) return;

    const fetchApplications = async () => {
      try {
        const res = await api.get('/application/list', {
          params: { applicant: authData.user.id }
        });
        setApplications(res.data.applications);
      } catch (error) {
        alert('Failed to fetch applications.');
      }
    };

    fetchApplications();
  }, [authData]);

  if (!authData) return <p>Please login to view applications.</p>;

  return (
    <div>
      <h2>Your Applications</h2>
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
        <ApplicationDetails applicationId={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
};

export default ApplicationList;
