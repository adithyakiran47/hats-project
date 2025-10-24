import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/api';
import { AuthContext } from '../context/AuthContext';
import StatusUpdateForm from './StatusUpdateForm';

const ApplicationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { authData } = useContext(AuthContext);

  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  useEffect(() => {
    fetchApplication();
  }, [id]);

  if (!authData) return <div className="text-center mt-5">Please login to view application details.</div>;
  if (loading) return <div className="text-center mt-5">Loading application details...</div>;
  if (error) return <div className="alert alert-danger mt-3">{error}</div>;
  if (!application) return <div>No application found.</div>;

  const { jobRole, jobType, status, comments, lastUpdatedBy, applicant } = application;

  return (
    <div className="container mt-4" style={{ maxWidth: 700 }}>
      <h2 className="mb-4">Application Details</h2>
      <div className="card shadow-sm p-4 mb-4">
        <p><strong>Job Role:</strong> {jobRole}</p>
        <p><strong>Job Type:</strong> {jobType}</p>
        <p><strong>Status:</strong> <span className="badge bg-primary">{status}</span></p>
        <p><strong>Last Updated By:</strong> {lastUpdatedBy || 'N/A'}</p>
        <hr />
        <h5>Applicant Information</h5>
        {applicant ? (
          <>
            <p><strong>Name:</strong> {applicant.name || 'N/A'}</p>
            <p><strong>Email:</strong> {applicant.email || 'N/A'}</p>
          </>
        ) : (
          <p>No applicant info available.</p>
        )}
        <hr />
        <h5>Comments / Activity Log</h5>
        {comments && comments.length > 0 ? (
          <ul className="list-group list-group-flush">
            {comments.map((cmt, idx) => (
              <li className="list-group-item" key={idx}>{cmt}</li>
            ))}
          </ul>
        ) : (
          <p>No comments yet.</p>
        )}
      </div>

      <StatusUpdateForm application={application} afterUpdate={fetchApplication} />

      <button className="btn btn-secondary mt-3" onClick={() => navigate(-1)}>Back</button>
    </div>
  );
};

export default ApplicationDetails;
