import React, { useEffect, useState } from 'react';

const AdminMetricsDashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetch('/api/application/metrics', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setMetrics(data))
      .catch(console.error);
  }, [token]);

  if (!metrics) return <p>Loading metrics...</p>;

  return (
    <div className="container mt-4">
      <h2>Admin Metrics Summary</h2>
      <p>Total Applications: {metrics.totalApplications}</p>
      <h5>Application Status Counts:</h5>
      <ul>
        {metrics.statusCounts.map(({ _id, count }) => (
          <li key={_id}>
            { _id }: {count}
          </li>
        ))}
      </ul>
      <h5>Recent Activity:</h5>
      <ul>
        {metrics.recentActivity.map(app => (
          <li key={app._id}>
            {app.jobRole} applied by {app.applicantId} at {new Date(app.updatedAt).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminMetricsDashboard;
