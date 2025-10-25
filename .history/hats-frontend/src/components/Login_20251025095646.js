import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/api';
import { AuthContext } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { setAuthData } = useContext(AuthContext);
  const [formData, setFormData] = useState({ email: '', password: '', companyId: '' });
  const [showCompanyId, setShowCompanyId] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/auth/login', formData);
      const { token, user } = res.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('authData', JSON.stringify({ token, user }));
      setAuthData({ token, user });
      
      if (user.role === 'admin') {
        navigate('/admin/jobs');
      } else if (user.role === 'applicant') {
        navigate('/jobs');
      } else {
        navigate('/applications');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
    setLoading(false);
  };

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-md-5">
          <div className="card shadow">
            <div className="card-body p-4">
              <h3 className="text-center mb-4">Login</h3>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="mb-3 form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="adminCheck"
                    checked={showCompanyId}
                    onChange={(e) => setShowCompanyId(e.target.checked)}
                  />
                  <label className="form-check-label" htmlFor="adminCheck">
                    Login as Admin/Bot Mimic
                  </label>
                </div>

                {showCompanyId && (
                  <div className="mb-3">
                    <label className="form-label">Company ID</label>
                    <input
                      type="text"
                      className="form-control"
                      name="companyId"
                      value={formData.companyId}
                      onChange={handleChange}
                      placeholder="Enter company ID"
                      required={showCompanyId}
                    />
                    <small className="text-muted">Required for admin/bot access</small>
                  </div>
                )}

                {error && <div className="alert alert-danger">{error}</div>}
                <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                  {loading ? 'Logging in...' : 'Login'}
                </button>
              </form>
              <p className="text-center mt-3">
                Don't have an account? <Link to="/register">Register</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
