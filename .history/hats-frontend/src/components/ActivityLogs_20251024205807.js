const ActivityLogs = ({ logs }) => {
  if (!logs || logs.length === 0) return <p>No activity logs available.</p>;
  return (
    <div>
      <h5>Activity Log (Traceability)</h5>
      <ul className="list-group">
        {logs.map((log, i) => (
          <li key={i} className="list-group-item">
            <b>{log.role}:</b> {log.comment}
            <br />
            <small>{new Date(log.timestamp).toLocaleString()}</small>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default Activity
