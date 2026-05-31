import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  FaThLarge, 
  FaUsers, 
  FaExchangeAlt, 
  FaFileAlt, 
  FaBell 
} from 'react-icons/fa';

const Sidebar = () => {
  const menuItems = [
    { name: 'Dashboard', icon: <FaThLarge />, path: '/' },
    { name: 'Customers', icon: <FaUsers />, path: '/customers' },
    { name: 'Transactions', icon: <FaExchangeAlt />, path: '/transactions' },
    { name: 'Reports', icon: <FaFileAlt />, path: '/reports' },
    { name: 'Reminders', icon: <FaBell />, path: '/reminders' },
  ];

  return (
    <div className="sidebar bg-white shadow-sm h-100 py-4 px-3" style={{ width: '260px', position: 'fixed', top: '70px', left: 0 }}>
      <div className="nav flex-column nav-pills mt-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) => 
              `nav-link d-flex align-items-center gap-3 mb-2 py-3 px-3 rounded-3 transition-all ${
                isActive ? 'active bg-primary text-white shadow-sm' : 'text-muted hover-bg-light'
              }`
            }
          >
            <span className="fs-5">{item.icon}</span>
            <span className="fw-medium">{item.name}</span>
          </NavLink>
        ))}
      </div>

      <style>{`
        .sidebar .nav-link:hover:not(.active) {
          background-color: #f3f4f6;
          color: var(--primary-color) !important;
        }
        .transition-all {
          transition: all 0.2s ease;
        }
      `}</style>
    </div>
  );
};

export default Sidebar;
