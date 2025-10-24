import React, { useEffect, useState } from 'react';

const ApplicationStatusTimeline = ({ applicationId }) => {
  const [application, setApplication] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetch(`/api/application/${applicationId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setApplication(data.application))
      .catch(console.error);
  }, [applicationId, token]);

  if (!application) return <p>Loading timeline...</p>;

  return (
    <div className="timeline mt-3">
      <h4>Status Timeline</h4>
      <ul className="list-group">
        {application.statusTimeline.map((item, index) => (
          <li key={index} className="list-group-item">
            <strong>{item.status}</strong> - {new Date(item.updatedAt).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ApplicationStatusTimeline;
