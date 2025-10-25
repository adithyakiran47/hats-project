import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import api from '../api/api';

export default function BotMimicDashboard() {
  const [stats, setStats] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [automating, setAutomating] = useState(false);
  const [automationResult, setAutomationResult] = useState(null);

  useEffect(() => {
    fetchStats();
    fetchLogs();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get('/dashboard/stats');
      setStats(res.data);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
    setLoading(false);
  };

  const fetchLogs = async () => {
    try {
      const res = await api.get('/automation/logs');
      setLogs(res.data.logs || []);
    } catch (err) {
      console.error('Failed to fetch logs:', err);
    }
  };

  const handleRunAutomation = async () => {
  console.log('Button clicked'); 
  
  if (!window.confirm('Run automation for all technical applications with "Applied" status?')) {
    return;
  }

  setAutomating(true);
  setAutomationResult(null);

  try {
    console.log('Sending automation request...'); 
    const res = await api.post('/automation/run');
    console.log('Automation response:', res.data); 
    
    setAutomationResult({
      success: true,
      message: res.data.message,
      count: res.data.updatedCount
    });
    
    
    setTimeout(() => {
      fetchStats();
      fetchLogs();
    }, 1000);
  } catch (err) {
    console.error('Automation error:', err); 
    console.error('Error response:', err.response?.data); 
    
    setAutomationResult({
      success: false,
      message: err.response?.data?.error || 'Automation failed'
    });
  }
  setAutomating(false);
};


  if (loading) return <div className="container my-4">Loading dashboard...</div>;
  if (!stats) return <div className="container my-4 text-danger">Failed to load dashboard</div>;

  const statusData = Object.entries(stats.statusCounts).map(([name, value]) => ({ name, value }));

  return (
    <div className="container my-4">
      <h2 className="mb-4">Bot Mimic Dashboard - Technical Applications</h2>

      {/* automation result alert */}
      {automationResult && (
        <div className={`alert alert-${automationResult.success ? 'success' : 'danger'} alert-dismissible fade show`}>
          <strong>{automationResult.success ? 'Success!' : 'Error:'}</strong> {automationResult.message}
          {automationResult.success && ` (${automationResult.count} applications updated)`}
          <button type="button" className="btn-close" onClick={() => setAutomationResult(null)}></button>
        </div>
      )}

      {/* stats card */}
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
              <small>Applications with "Applied" status</small>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-center bg-success text-white">
            <div className="card-body">
              <h5 className="card-title">Processed</h5>
              <h2>{stats.totalApplications - stats.statusCounts.Applied}</h2>
              <small>Reviewed, Interview, Offer</small>
            </div>
          </div>
        </div>
      </div>

      {/*main content row*/}
      <div className="row mb-4">
        {/* status chart */}
        <div className="col-md-8">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Technical Applications Status Distribution</h5>
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

        {/* automation ctrls */}
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Automation Controls</h5>
              <div className="d-grid gap-2">
                <button 
                  className="btn btn-success btn-lg" 
                  onClick={handleRunAutomation}
                  disabled={automating || stats.statusCounts.Applied === 0}
                >
                  {automating ? 'Running...' : 'Run Automation'}
                </button>
                <button 
                  className="btn btn-info"
                  onClick={fetchLogs}
                >
                  Refresh Logs
                </button>
              </div>
              <div className="alert alert-info mt-3 mb-0">
                <small>
                  <strong>Automation will:</strong>
                  <ul className="mb-0 mt-1">
                    <li>Update status: Applied → Reviewed</li>
                    <li>Add automated comments</li>
                    <li>Log all actions</li>
                  </ul>
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* automation logs */}
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Recent Automation Logs</h5>
          {logs.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-sm table-hover">
                <thead>
                  <tr>
                    <th>Timestamp</th>
                    <th>Application ID</th>
                    <th>Job Role</th>
                    <th>Action</th>
                    <th>Current Status</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.slice(0, 10).map((log, idx) => (
                    <tr key={idx}>
                      <td><small>{new Date(log.timestamp).toLocaleString()}</small></td>
                      <td><small>{log.applicationId.substring(0, 8)}...</small></td>
                      <td>{log.jobRole}</td>
                      <td><small>{log.action}</small></td>
                      <td>
                        <span className="badge bg-info">{log.currentStatus}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center text-muted">No automation logs yet. Run automation to see logs here.</p>
          )}
        </div>
      </div>
    </div>
  );
}
