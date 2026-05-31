import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast, ToastContainer } from 'react-toastify';
import { FaEnvelope, FaLock, FaWallet } from 'react-icons/fa';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Login successful!');
      navigate('/');
    } catch (error) {
      // Error handled by api.js or toast manually if status is not 401/404/500
      if (![401, 404, 500].includes(error.response?.status)) {
        toast.error(error.response?.data?.message || 'Login failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid bg-light min-vh-100 d-flex align-items-center justify-content-center py-5">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="card shadow-md border-0" style={{ maxWidth: '450px', width: '100%', borderRadius: '1.5rem' }}>
        <div className="card-body p-5">
          <div className="text-center mb-5">
            <div className="bg-primary d-inline-flex p-3 rounded-circle text-white mb-3" style={{ backgroundColor: '#7C3AED' }}>
              <FaWallet size={32} />
            </div>
            <h2 className="fw-bold text-dark">Welcome Back</h2>
            <p className="text-muted">Enter your credentials to access your account</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="form-label fw-medium">Email Address</label>
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0 text-muted">
                  <FaEnvelope />
                </span>
                <input
                  type="email"
                  className="form-control border-start-0 ps-0 py-2"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="mb-5">
              <div className="d-flex justify-content-between">
                <label className="form-label fw-medium">Password</label>
              </div>
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0 text-muted">
                  <FaLock />
                </span>
                <input
                  type="password"
                  className="form-control border-start-0 ps-0 py-2"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100 py-3 mb-4 shadow-sm fw-bold"
              disabled={loading}
              style={{ borderRadius: '1rem', background: 'linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)' }}
            >
              {loading ? (
                <span className="spinner-border spinner-border-sm me-2"></span>
              ) : 'Sign In'}
            </button>

            <div className="text-center">
              <p className="text-muted small mb-0">
                Don't have an account? <Link to="/register" className="text-primary fw-bold text-decoration-none">Create Account</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;