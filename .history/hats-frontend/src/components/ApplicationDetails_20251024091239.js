import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/api';
import { AuthContext } from '../context/AuthContext';

const ApplicationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { authData } = useContext(AuthContext);

  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchApplication = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await api.get(`/application/${id}`);
        setApplication(res.data);
      } catch {
        setError('Failed to load application data');
      }
      setLoading(false);
    };

    fetchApplication();
  }, [id]);

  if (!authData) {
    return <p>Please login to view application details.</p>;
  }

  if (loading) return <p>Loading application details...</p>;
  if (error) return <p className="text-danger">{error}</p>;
  if (!application) return <p>No application found.</p>;

  const { jobRole, jobType, status, comments, lastUpdatedBy, applicant } = application;

  return (
    <div className="container mt-4" style={{ maxWidth: '700px' }}>
      <h2>Application Details</h2>
      <div className="card p-3">
        <p><strong>Job Role:</strong> {jobRole}</p>
        <p><strong>Job Type:</strong> {jobType}</p>
        <p><strong>Status:</strong> {status}</p>
        <p><strong>Last Updated By:</strong> {lastUpdatedBy || 'N/A'}</p>
        <hr />
        <h5>Applicant Information</h5>
        {applicant ? (
          <>
            <p><strong>Name:</strong> {applicant.name || 'N/A'}</p>
            <p><strong>Email:</strong> {applicant.email || 'N/A'}</p>
          </>
        ) : (
          <p>No applicant info available</p>
        )}
        <hr />
        <h5>Comments / Activity Log</h5>
        {comments && comments.length > 0 ? (
          <ul>
            {comments.map((cmt, idx) => (
              <li key={idx}>{cmt}</li>
            ))}
          </ul>
        ) : (
          <p>No comments yet</p>
        )}
        <hr />
        <button className="btn btn-secondary" onClick={() => navigate(-1)}>Back</button>
      </div>
    </div>
  );
};

export default ApplicationDetails
