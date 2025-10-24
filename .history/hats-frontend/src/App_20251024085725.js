import React from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import ApplicationCreate from './components/ApplicationCreate';
import ApplicationList from './components/ApplicationList';

function App() {
  return (
    <div className="container py-4">
      <nav className="mb-4 d-flex justify-content-center gap-4">
        <Link to="/login" className="btn btn-outline-primary">Login</Link>
        <Link to="/register" className="btn btn-outline-secondary">Register</Link>
        <Link to="/applications" className="btn btn-outline-success">Applications</Link>
        <Link to="/apply" className="btn btn-outline-info">Apply</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/applications" element={<ApplicationList />} />
        <Route path="/apply" element={<ApplicationCreate />} />
      </Routes>
    </div>
  );
}

export default App;
