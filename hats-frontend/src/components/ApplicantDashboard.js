import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import api from '../api/api';

const COLORS = {
  Applied: '#0088FE',
  Reviewed: '#00C49F',
  Interview: '#FFBB28',
  Offer: '#00C851',
  Rejected: '#FF4444'
};

export default function ApplicantDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/dashboard/stats');
        setStats(res.data);
      } catch (err) {
        console.error('Failed to fetch stats:', err);
      }
      setLoading(false);
    };
    fetchStats();
  }, []);

  if (loading) return <div className="container my-4">Loading dashboard...</div>;
  if (!stats) return <div className="container my-4 text-danger">Failed to load dashboard</div>;

  const chartData = Object.entries(stats.statusCounts)
    .filter(([, count]) => count > 0)
    .map(([status, count]) => ({ name: status, value: count }));

  return (
    <div className="container my-4">
      <h2 className="mb-4">My Application Dashboard</h2>

      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title">Total Applications</h5>
              <h2 className="text-primary">{stats.totalApplications}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title">Applied</h5>
              <h2 className="text-info">{stats.statusCounts.Applied}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title">Interview</h5>
              <h2 className="text-warning">{stats.statusCounts.Interview}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title">Offers</h5>
              <h2 className="text-success">{stats.statusCounts.Offer}</h2>
            </div>
          </div>
        </div>
      </div>

      {/* Status Distribution Chart */}
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Application Status Distribution</h5>
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[entry.name]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-center text-muted">No applications yet</p>
              )}
            </div>
          </div>
        </div>

        {/* Recent Applications */}
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Recent Applications</h5>
              {stats.recentApplications.length > 0 ? (
                <ul className="list-group list-group-flush">
                  {stats.recentApplications.map(app => (
                    <li key={app._id} className="list-group-item d-flex justify-content-between align-items-center">
                      <div>
                        <strong>{app.jobRole}</strong>
                        <br />
                        <small className="text-muted">{new Date(app.createdAt).toLocaleDateString()}</small>
                      </div>
                      <span className={`badge bg-${
                        app.status === 'Offer' ? 'success' :
                        app.status === 'Interview' ? 'warning' :
                        app.status === 'Rejected' ? 'danger' : 'info'
                      }`}>
                        {app.status}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-center text-muted">No recent applications</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
