import React, { useContext } from 'react';
import { Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Login from './components/Login';
import Register from './components/Register';
import ApplicationList from './components/ApplicationList';
import JobListWithApply from './components/JobListWithApply';
import AdminJobPost from './components/AdminJobPost';
import ApplicationCreate from './components/ApplicationCreate';
import ApplicantDashboard from './components/ApplicantDashboard';
import AdminDashboard from './components/AdminDashboard';
import BotMimicDashboard from './components/BotMimicDashboard';

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
        <Link to="/" className="navbar-brand fw-bold text-primary">
          HATS - Application Tracker
        </Link>
        <div className="d-flex align-items-center">
          {!authData ? (
            <>
              <Link to="/login" className="btn btn-outline-primary me-2">Login</Link>
              <Link to="/register" className="btn btn-outline-secondary">Register</Link>
            </>
          ) : (
            <>
              <span className="me-3 text-muted">
                Welcome, <strong>{authData.user.name}</strong> ({userRole})
              </span>

              {/* applicant navigation */}
              {userRole === 'applicant' && (
                <>
                  <Link to="/dashboard" className="btn btn-success me-2">Dashboard</Link>
                  <Link to="/jobs" className="btn btn-primary me-2">Browse Jobs</Link>
                  <Link to="/applications" className="btn btn-info me-2">My Applications</Link>
                </>
              )}

              {/* admin navigation */}
              {userRole === 'admin' && (
                <>
                  <Link to="/dashboard" className="btn btn-success me-2">Dashboard</Link>
                  <Link to="/admin/jobs" className="btn btn-warning me-2">Manage Jobs</Link>
                  <Link to="/applications" className="btn btn-info me-2">All Applications</Link>
                </>
              )}

              {/* bot mimic navigation */}
              {userRole === 'botmimic' && (
                <>
                  <Link to="/dashboard" className="btn btn-success me-2">Dashboard</Link>
                  <Link to="/applications" className="btn btn-info me-2">Applications</Link>
                </>
              )}

              <button onClick={handleLogout} className="btn btn-danger btn-sm">Logout</button>
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

  return (
    <Routes>
      {/* public routes */}
      <Route path="/login" element={!authData ? <Login /> : <Navigate to="/" />} />
      <Route path="/register" element={!authData ? <Register /> : <Navigate to="/" />} />

      {/* home redirect based on role */}
      <Route 
        path="/" 
        element={
          !authData ? <Navigate to="/login" /> :
          userRole === 'applicant' ? <Navigate to="/dashboard" /> :
          userRole === 'admin' ? <Navigate to="/dashboard" /> :
          userRole === 'botmimic' ? <Navigate to="/dashboard" /> :
          <Navigate to="/login" />
        } 
      />

      {/* dashboard - rolebased */}
      <Route 
        path="/dashboard" 
        element={
          !authData ? <Navigate to="/login" /> :
          userRole === 'applicant' ? <ApplicantDashboard /> :
          userRole === 'admin' ? <AdminDashboard /> :
          userRole === 'botmimic' ? <BotMimicDashboard /> :
          <Navigate to="/login" />
        } 
      />

      {/* applicant routes */}
      <Route 
        path="/jobs" 
        element={authData && userRole === 'applicant' ? <JobListWithApply /> : <Navigate to="/login" />} 
      />
      <Route 
        path="/apply" 
        element={authData && userRole === 'applicant' ? <ApplicationCreate /> : <Navigate to="/login" />} 
      />

      {/* applications list - all authenticated users */}
      <Route 
        path="/applications" 
        element={authData ? <ApplicationList /> : <Navigate to="/login" />} 
      />

      {/* admin routes */}
      <Route 
        path="/admin/jobs" 
        element={authData && userRole === 'admin' ? <AdminJobPost /> : <Navigate to="/" />} 
      />

      {/* catch all redirect */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <NavigationBar />
      <div className="py-4">
        <AppRoutes />
      </div>
    </AuthProvider>
  );
}
