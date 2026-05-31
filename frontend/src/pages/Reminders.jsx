import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Loader from '../components/Loader';
import { toast } from 'react-toastify';
import { FaBell, FaWhatsapp, FaUser, FaClock, FaPaperPlane } from 'react-icons/fa';

const Reminders = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(null);

  const fetchPendingCustomers = async () => {
    try {
      const response = await api.get('/customers');
      // Filter for customers with actual debt
      const pending = response.data.filter(c => c.currentBalance > 0);
      setCustomers(pending);
    } catch (error) {
      // Error handled by api.js
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingCustomers();
  }, []);

  const handleSendReminder = async (id) => {
    setSending(id);
    try {
      await api.post(`/reminders/${id}`);
      toast.success('SMS Reminder Sent Successfully');
      fetchPendingCustomers();
    } catch (error) {
      toast.error('Failed to send SMS reminder');
    } finally {
      setSending(null);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="fade-in container-fluid px-4 pb-5">
      <div className="mb-4">
        <h2 className="mb-1 fw-bold">Payment Reminders</h2>
        <p className="text-muted">Reach out to customers with pending balances to clear dues.</p>
      </div>

      <div className="row g-4">
        {customers.length > 0 ? (
          customers.map(customer => (
            <div className="col-md-6 col-xl-4" key={customer._id}>
              <div className="card border-0 h-100 shadow-sm overflow-hidden" style={{ borderRadius: '1.5rem' }}>
                <div className="card-body p-4">
                  <div className="d-flex align-items-center gap-3 mb-4">
                    <div className="bg-primary-subtle rounded-circle p-3 text-primary" style={{ backgroundColor: '#F5F3FF' }}>
                      <FaUser size={20} />
                    </div>
                    <div className="overflow-hidden">
                      <h5 className="mb-0 fw-bold text-truncate">{customer.customerName}</h5>
                      <p className="text-muted small mb-0">{customer.phoneNumber}</p>
                    </div>
                  </div>
                  
                  <div className="bg-light rounded-4 p-3 mb-4">
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="text-muted small fw-medium">Pending Amount</span>
                      <span className="fw-bold text-danger fs-5">₹{customer.currentBalance}</span>
                    </div>
                  </div>

                  <div className="d-grid gap-2">
                    <button 
                      onClick={() => handleSendReminder(customer._id)}
                      disabled={sending === customer._id}
                      className="btn btn-primary py-2 fw-bold d-flex align-items-center justify-content-center gap-2 shadow-sm"
                      style={{ borderRadius: '12px' }}
                    >
                      {sending === customer._id ? (
                        <span className="spinner-border spinner-border-sm"></span>
                      ) : (
                        <><FaPaperPlane /> Send SMS Reminder</>
                      )}
                    </button>
                    
                    <a 
                      href={`https://wa.me/91${customer.phoneNumber}?text=Hello ${customer.customerName}, this is a reminder from Udhaar Khata regarding your pending balance of ₹${customer.currentBalance}. Please clear your dues at the earliest. Thank you.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline-success py-2 fw-bold d-flex align-items-center justify-content-center gap-2"
                      style={{ borderRadius: '12px' }}
                    >
                      <FaWhatsapp /> Send via WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12 text-center py-5">
            <div className="text-muted opacity-25 mb-3">
              <FaBell size={64} />
            </div>
            <h4>No Pending Payments</h4>
            <p className="text-muted">Excellent! All your customer accounts are currently settled.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reminders;
