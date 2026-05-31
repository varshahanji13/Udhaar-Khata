import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast, ToastContainer } from 'react-toastify';
import { FaUser, FaEnvelope, FaLock, FaWallet } from 'react-icons/fa';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return toast.error('Passwords do not match');
    }

    setLoading(true);
    try {
      await register(formData.name, formData.email, formData.password);
      toast.success('Registration successful! Please login.');
      navigate('/login');
    } catch (error) {
      if (![401, 404, 500].includes(error.response?.status)) {
        toast.error(error.response?.data?.message || 'Registration failed');
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
          <div className="text-center mb-4">
            <div className="bg-primary d-inline-flex p-3 rounded-circle text-white mb-3" style={{ backgroundColor: '#7C3AED' }}>
              <FaWallet size={32} />
            </div>
            <h2 className="fw-bold text-dark">Join Udhaar Khata</h2>
            <p className="text-muted small">Start managing your business credits digitally</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-medium small">Full Name</label>
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0 text-muted ps-3">
                  <FaUser size={14} />
                </span>
                <input
                  type="text"
                  className="form-control border-start-0 ps-0 py-2"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label fw-medium small">Email Address</label>
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0 text-muted ps-3">
                  <FaEnvelope size={14} />
                </span>
                <input
                  type="email"
                  className="form-control border-start-0 ps-0 py-2"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label fw-medium small">Password</label>
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0 text-muted ps-3">
                  <FaLock size={14} />
                </span>
                <input
                  type="password"
                  className="form-control border-start-0 ps-0 py-2"
                  placeholder="Create Password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label fw-medium small">Confirm Password</label>
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0 text-muted ps-3">
                  <FaLock size={14} />
                </span>
                <input
                  type="password"
                  className="form-control border-start-0 ps-0 py-2"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
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
              ) : 'Register'}
            </button>

            <div className="text-center">
              <p className="text-muted small mb-0">
                Already have an account? <Link to="/login" className="text-primary fw-bold text-decoration-none">Log In</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;