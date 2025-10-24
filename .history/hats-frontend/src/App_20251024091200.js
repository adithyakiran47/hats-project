import React, { useContext } from 'react';
import { Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import ApplicationCreate from './components/ApplicationCreate';
import ApplicationList from './components/ApplicationList';
import ApplicationDetails from './components/ApplicationDetails';

function App() {
  const { authData, setAuthData } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    setAuthData(null);
    navigate('/login');
  };

  return (
    <div className="container py-4">
      <nav className="mb-4 d-flex justify-content-center gap-4">
        {!authData && (
          <>
            <Link to="/login" className="btn btn-outline-primary">Login</Link>
            <Link to="/register" className="btn btn-outline-secondary">Register</Link>
          </>
        )}
        {authData && (
          <>
            <Link to="/applications" className="btn btn-outline-success">Applications</Link>
            <Link to="/apply" className="btn btn-outline-info">Apply</Link>
            <button onClick={handleLogout} className="btn btn-outline-danger">Logout</button>
          </>
        )}
      </nav>

      <Routes>
        <Route path="/" element={<Navigate to={authData ? "/applications" : "/login"} />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/applications" element={authData ? <ApplicationList /> : <Navigate to="/login" />} />
        <Route path="/applications/:id" element={authData ? <ApplicationDetails /> : <Navigate to="/login" />} />
        <Route path="/apply" element={authData ? <ApplicationCreate /> : <Navigate to="/login" />} />
      </Routes>
    </div>
  );
}

export default App;
