import React, { useEffect, useState, useContext } from 'react';
import api from '../api/api';
import { AuthContext } from '../context/AuthContext';

const ApplicationList = () => {
  const { authData } = useContext(AuthContext);
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    if (!authData) return;

    const fetchApplications = async () => {
      try {
        const res = await api.get('/application/list', {
          params: { applicant: authData.user.id }
        });
        setApplications(res.data.applications);
      } catch (error) {
        alert('Failed to fetch applications.');
      }
    };

    fetchApplications();
  }, [authData]);

  if (!authData) return <p>Please login to view applications
