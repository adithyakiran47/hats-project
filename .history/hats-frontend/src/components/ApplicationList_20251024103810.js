import React, { useContext, useEffect, useState } from 'react';
import api from '../api/api';
import { AuthContext } from '../context/AuthContext';

export default function ApplicationList() {
  const { authData } = useContext(AuthContext);
  const [applications, setApplications] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authData) return;

    const fetchApplications = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await api.get('/application/list');
        setApplications(res.data.applications);
      } catch {
        setError('Failed to load applications.');
      }
      setLoading(false);
    };

    fetchApplications();
  }, [authData]);

  if (!authData) return <p className="text-center mt-4">Please login to view applications.</p>;
  if (loading) return <p className="text-center mt-4">Loading applications...</p>;

  return (
    <div className="container my-4">
      <h2 className="mb-4 text-center">Applications</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {applications.length === 0 ? (
        <p className="text-center">No applications found.</p>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 g-3">
          {applications.map((app) => (
            <div key={app._id} className="col">
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">{app.jobRole}</h5>
                  <h6 className="card-subtitle mb-2 text-muted">{app.jobType} &mdash; Status: {app.status}</h6>
                  <p className="card-text">
                    <strong>Applicant:</strong> {app.applicant?.name || 'N/A'} ({app.applicant?.email || 'N/A'})
                  </p>
                  {app.comments && app.comments.length > 0 && (
                    <>
                      <h6>Comments:</h6>
                      <ul className="list-group list-group-flush">
                        {app.comments.map((comment, idx) => (
                          <li key={idx} className="list-group-item">
                            {comment}
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
