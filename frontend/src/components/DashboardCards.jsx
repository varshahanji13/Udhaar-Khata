import React from 'react';
import { FaUsers, FaArrowUp, FaArrowDown, FaPlusCircle, FaClock } from 'react-icons/fa';

const DashboardCards = ({ stats = {} }) => {
  const cards = [
    {
      title: 'Total Customers',
      value: stats.totalCustomers || 0,
      icon: <FaUsers />,
      color: '#7C3AED',
      bg: '#F5F3FF'
    },
    {
      title: 'Total Credit',
      value: `₹${stats.totalCredit || 0}`,
      icon: <FaArrowUp />,
      color: '#EF4444',
      bg: '#FEF2F2'
    },
    {
      title: 'Total Paid',
      value: `₹${stats.totalPaid || 0}`,
      icon: <FaArrowDown />,
      color: '#10B981',
      bg: '#ECFDF5'
    },
    {
      title: 'Pending Amount',
      value: `₹${stats.pendingAmount || 0}`,
      icon: <FaClock />,
      color: '#F59E0B',
      bg: '#FFFBEB'
    }
  ];

  return (
    <div className="row g-4">
      {cards.map((card, index) => (
        <div className="col-md-3" key={index}>
          <div className="card h-100 border-0 p-4 shadow-sm">
            <div className="d-flex align-items-start justify-content-between">
              <div>
                <p className="text-muted small fw-bold text-uppercase mb-1">{card.title}</p>
                <h3 className="mb-0 fw-bold">{card.value}</h3>
              </div>
              <div 
                className="rounded-3 p-3 d-flex align-items-center justify-content-center"
                style={{ backgroundColor: card.bg, color: card.color }}
              >
                <span className="fs-4">{card.icon}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardCards;
