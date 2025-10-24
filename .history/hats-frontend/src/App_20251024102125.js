import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
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
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light px-3">
      <Link to="/" className="navbar-brand">HATS</Link>
      <div className="collapse navbar-collapse">
        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
          {authData ? (
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/applications">Applications</Link>
              </li>
              {/* Show Apply button only for non-admin and non-bot */}
              {userRole !== 'admin' && userRole !== 'botmimic' && (
                <li className="nav-item">
                  <Link className="nav-link" to="/apply">Apply</Link>
                </li>
              )}
              <li className="nav-item">
                <button className="btn btn-link nav-link" onClick={handleLogout}>Logout</button>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/login">Login</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/register">Register</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

const AppRoutes = () => {
  const { authData } = useContext(AuthContext);
  const userRole = authData?.user?.role;

  return (
    <Routes>
      <Route path="/" element={<Navigate to={authData ? "/applications" : "/login"} />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/applications" element={authData ? <ApplicationList /> : <Navigate to="/login" />} />
      <Route path="/apply" element={
        authData && userRole !== 'admin' && userRole !== 'botmimic' 
          ? <ApplicationCreate />
          : <Navigate to="/applications" />
      } />
      {/* Add other routes as needed */}
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <NavigationBar />
        <div className="container mt-3">
          <AppRoutes />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
