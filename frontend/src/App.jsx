import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import CustomerDetails from './pages/CustomerDetails';
import Transactions from './pages/Transactions';
import Reports from './pages/Reports';
import Reminders from './pages/Reminders';

const App = () => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <div className="app-container">
      <ToastContainer position="top-right" autoClose={3000} />
      
      {!isAuthPage && <Navbar />}

      <div className="container-fluid">
        <div className="row">
          {!isAuthPage && (
            <div className="col-md-auto p-0 d-none d-md-block">
              <Sidebar />
            </div>
          )}
          
          <main className={`col py-4 ${!isAuthPage ? 'main-content' : ''}`}>
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected Routes */}
              <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/customers" element={<ProtectedRoute><Customers /></ProtectedRoute>} />
              <Route path="/customers/:id" element={<ProtectedRoute><CustomerDetails /></ProtectedRoute>} />
              <Route path="/transactions" element={<ProtectedRoute><Transactions /></ProtectedRoute>} />
              <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
              <Route path="/reminders" element={<ProtectedRoute><Reminders /></ProtectedRoute>} />

              {/* Redirect any other route to Dashboard */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </div>

      <style>{`
        .main-content {
          margin-top: 70px;
          margin-left: 260px;
          min-height: calc(100vh - 70px);
          transition: all 0.3s ease;
        }
        @media (max-width: 768px) {
          .main-content {
            margin-left: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default App;