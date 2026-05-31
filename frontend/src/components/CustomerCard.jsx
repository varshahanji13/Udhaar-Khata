import React from 'react';
import { Link } from 'react-router-dom';
import { FaPhoneAlt, FaMapMarkerAlt, FaChevronRight } from 'react-icons/fa';

const CustomerCard = ({ customer }) => {
  const pendingAmount = (customer.totalCredit || 0) - (customer.totalPaid || 0);

  return (
    <div className="card border-0 mb-3 overflow-hidden h-100">
      <div className="card-body p-4">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div>
            <h5 className="card-title mb-1 text-truncate" style={{ maxWidth: '200px' }}>{customer.customerName}</h5>
            <div className="d-flex align-items-center gap-2 text-muted small">
              <FaPhoneAlt size={12} />
              <span>{customer.phoneNumber}</span>
            </div>
          </div>
          <span className={`badge rounded-pill ${customer.currentBalance > 0 ? 'bg-danger-subtle text-danger' : 'bg-success-subtle text-success'}`}>
            {customer.currentBalance > 0 ? 'Pending' : 'Settled'}
          </span>
        </div>

        <div className="row g-2 mb-4">
          <div className="col-12 text-center">
            <p className="text-muted small mb-0 font-weight-bold">PENDING AMOUNT</p>
            <p className={`mb-0 fw-bold fs-4 ${customer.currentBalance > 0 ? 'text-danger' : 'text-success'}`}>
              ₹{customer.currentBalance || 0}
            </p>
          </div>
        </div>

        <Link to={`/customers/${customer._id}`} className="btn btn-outline-primary w-100 d-flex align-items-center justify-content-center gap-2">
          View Details <FaChevronRight size={12} />
        </Link>
      </div>
    </div>
  );
};

export default CustomerCard;
