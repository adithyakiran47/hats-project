import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import api from '../api/api';

export default function BotMimicDashboard() {
    console.log('BotMimicDashboard component loaded');
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

  return (
    <div className="container my-4">
      <h2 className="mb-4">Bot Mimic Dashboard - Technical Applications</h2>

      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card text-center bg-primary text-white">
            <div className="card-body">
              <h5 className="card-title">Total Technical Applications</h5>
              <h2>{stats.totalApplications}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-center bg-warning text-white">
            <div className="card-body">
              <h5 className="card-title">Pending Automation</h5>
              <h2>{stats.statusCounts.Applied}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-center bg-success text-white">
            <div className="card-body">
              <h5 className="card-title">Processed</h5>
              <h2>{stats.totalApplications - stats.statusCounts.Applied}</h2>
            </div>
          </div>
        </div>
      </div>

      {/* Status Chart */}
      <div className="row mb-4">
        <div className="col-md-8">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Technical Applications Status</h5>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={statusData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#0088FE" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Automation Controls */}
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Automation Controls</h5>
              <div className="d-grid gap-2">
                <button className="btn btn-success">
                  Run Automation
                </button>
                <button className="btn btn-info">
                  View Logs
                </button>
                <button className="btn btn-secondary">
                  Schedule Automation
                </button>
              </div>
              <div className="alert alert-info mt-3">
                <small>Automation will process all "Applied" technical applications</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
