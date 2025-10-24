import React, { useContext } from 'react';
import { Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';

import Login from './components/Login';
import Register from './components/Register';
import ApplicationList from './components/ApplicationList';
import ApplicationCreate from './components/ApplicationCreate';

const NavigationBar = () => {
  const { authData, setAuthData } = useContext(AuthContext);
  const navigate = useNavigate();

  const userRole = authData?.user?.role;

  const handleLogout = () => {
    setAuthData(null);
    localStorage.removeItem('token');
    localStorage.removeItem('authData');
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom shadow-sm">
      <div className="container">
        <Link to="/" className="navbar-brand fw-bold">
          HATS
        </Link>
        <div className="d-flex">
          {!authData ? (
            <>
              <Link to="/login" className="btn btn-outline-primary me-2">
                Login
              </Link>
              <Link to="/register" className="btn btn-outline-secondary">
                Register
              </Link>
            </>
          ) : (
            <>
              <Link to="/applications" className="btn btn-success me-2">
                Applications
              </Link>
              {userRole !== 'admin' && userRole !== 'botmimic' && (
                <Link to="/apply" className="btn btn-info me-2">
                  Apply
                </Link>
              )}
              <button onClick={handleLogout} className="btn btn-danger">
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

const AppRoutes = () => {
  const { authData } = useContext(AuthContext);
  const userRole = authData?.user?.role;
