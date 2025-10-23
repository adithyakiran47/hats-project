import React, { useState } from 'react';
import api from '../api/api';
import StatusUpdateForm from './StatusUpdateForm';


const ApplicationDetails = ({ applicationId, onClose }) => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    if (!applicationId) return;
    const fetchLogs = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/application/${applicationId}/logs`);
        setLogs(res.data.logs);
      } catch {
        setLogs([]);
      }
      setLoading(false);
    };
    fetchLogs();
  }, [applicationId]);

  if (!applicationId) return null;
  if (loading) return <p>Loading logs...</p>;

  return (
    <div style={{ border: '1px solid gray', margin: 8, padding: 8 }}>
      <button onClick={onClose}>Close</button>
      <h3>Application Log History</h3>
      {logs.length === 0 ? (
        <p>No activity yet</p>
      ) : (
        <ul>
          {logs.map(log => (
            <li key={log._id}>
              [{new Date(log.createdAt).toLocaleString()}] Changed by: <b>{log.changedBy}</b> — 
              <i> {log.oldStatus} → {log.newStatus}</i> {log.comment && `— "${log.comment}"`}
            </li>
          ))}
        </ul>
      )}
      <StatusUpdateForm application={{ _id: applicationId, status: logs[0]?.newStatus || 'Applied' }} afterUpdate={() => {
  // refresh logs after update
  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/application/${applicationId}/logs`);
      setLogs(res.data.logs);
    } catch {
      setLogs([]);
    }
    setLoading(false);
  };
  fetchLogs();
}} />

    </div>
  );
};

export default ApplicationDetails;
