import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import api from '../api/api';

const STATUS_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#00C851', '#FF4444'];
const JOB_TYPE_COLORS = ['#0088FE', '#00C49F'];

export default function AdminDashboard() {
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

  const statusData = Object.entries(stats.statusCounts).map(([name, value]) => ({ name, value }));
  const jobTypeData = Object.entries(stats.jobTypeCounts).map(([name, value]) => ({ 
    name: name === 'technical' ? 'Technical' : 'Non-Technical', 
    value 
  }));

  return (
    <div className="container my-4">
      <h2 className="mb-4">Admin Dashboard</h2>

      {/* stats cards */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card text-center bg-primary text-white">
            <div className="card-body">
              <h5 className="card-title">Total Applications</h5>
              <h2>{stats.totalApplications}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center bg-success text-white">
            <div className="card-body">
              <h5 className="card-title">Technical</h5>
              <h2>{stats.jobTypeCounts.technical}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center bg-info text-white">
            <div className="card-body">
              <h5 className="card-title">Non-Technical</h5>
              <h2>{stats.jobTypeCounts['non-technical']}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center bg-warning text-white">
            <div className="card-body">
              <h5 className="card-title">Pending Review</h5>
              <h2>{stats.statusCounts.Applied}</h2>
            </div>
          </div>
        </div>
      </div>

      {/* charts row */}
      <div className="row mb-4">
        {/* status bar chart */}
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Applications by Status</h5>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={statusData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* job yype pie chart */}
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Technical vs Non-Technical</h5>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={jobTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {jobTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={JOB_TYPE_COLORS[index % JOB_TYPE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
