// components/ActivityLogs.js
const ActivityLogs = ({ logs }) => {
  if (!logs || logs.length === 0) return <p>No activity logs available.</p>;

  return (
    <div className="mt-3">
      <h5>Application Activity Log</h5>
      <ul className="list-group">
        {logs.map((log, index) => (
          <li key={index} className="list-group-item">
            <strong>{log.role}:</strong> {log.comment} <br />
            <small>{new Date(log.timestamp).toLocaleString()}</small>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ActivityLogs;
