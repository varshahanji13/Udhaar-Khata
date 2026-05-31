import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaUserCircle, FaSignOutAlt, FaWallet } from 'react-icons/fa';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light fixed-top">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          <FaWallet size={24} />
          <span>Udhaar Khata</span>
        </Link>
        
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">
            {user && (
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle d-flex align-items-center gap-2" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown">
                  <FaUserCircle size={20} />
                  <span>{user.name}</span>
                </a>
                <ul className="dropdown-menu dropdown-menu-end shadow-sm border-0">
                  <li><button className="dropdown-item text-danger d-flex align-items-center gap-2" onClick={handleLogout}>
                    <FaSignOutAlt /> Logout
                  </button></li>
                </ul>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
