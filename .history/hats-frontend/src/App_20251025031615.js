import React, { useContext } from 'react';
import { Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Login from './components/Login';
import Register from './components/Register';
import ApplicationList from './components/ApplicationList';
import JobListWithApply from './components/JobListWithApply';
import AdminJobPost from './components/AdminJobPost';


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
        <Link to="/" className="navbar-brand fw-bold">HATS</Link>
        <div className="d-flex">
          {!authData ? (
            <>
              <Link to="/login" className="btn btn-outline-primary me-2">Login</Link>
              <Link to="/register" className="btn btn-outline-secondary">Register</Link>
            </>
          ) : (
            <>
              <Link to="/jobs" className="btn btn-success me-2">Jobs</Link>
              <Link to="/applications" className="btn btn-info me-2">My Applications</Link>
              {userRole !== 'admin' && userRole !== 'botmimic' && (
                <Link to="/apply" className="btn btn-primary me-2">Apply</Link>
              )}
              {userRole === 'admin' && (
                <Link to="/admin/jobs" className="btn btn-warning me-2">Manage Jobs</Link>
              )}
              <button onClick={handleLogout} className="btn btn-danger">Logout</button>
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
      <Route path="/" element={<Navigate to={authData ? '/jobs' : '/login'} />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Jobs listing (available to all) */}
      <Route path="/jobs" element={<JobListWithApply />} />
      
      {/* Applications list (authenticated users) */}
      <Route 
        path="/applications" 
        element={authData ? <ApplicationList /> : <Navigate to="/login" />} 
      />
      
      {/* Apply for job (applicants only) */}
      <Route
        path="/apply"
        element={authData && userRole === 'applicant' ? <ApplicationCreate /> : <Navigate to="/login" />}
      />
      
      {/* Admin job management */}
      <Route
        path="/admin/jobs"
        element={authData?.user?.role === 'admin' ? <AdminJobPost /> : <Navigate to="/" />}
      />
    </Routes>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <NavigationBar />
      <div className="container py-4">
        <AppRoutes />
      </div>
    </AuthProvider>
  );
}
