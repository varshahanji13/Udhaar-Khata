import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import TransactionTable from '../components/TransactionTable';
import Loader from '../components/Loader';
import { toast } from 'react-toastify';
import { 
  FaPhoneAlt, 
  FaMapMarkerAlt, 
  FaPlus, 
  FaMinus, 
  FaFilePdf, 
  FaWhatsapp,
  FaArrowLeft,
  FaEdit,
  FaTrash,
  FaPaperPlane
} from 'react-icons/fa';

const CustomerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('credit'); // 'credit' or 'payment'
  const [txnData, setTxnData] = useState({ amount: '', description: '' });
  const [downloading, setDownloading] = useState(false);
  const [sendingSMS, setSendingSMS] = useState(false);

  const fetchDetails = async () => {
    try {
      const [custResp, txnResp] = await Promise.all([
        api.get(`/customers/${id}`),
        api.get(`/transactions/${id}`)
      ]);
      setCustomer(custResp.data);
      setTransactions(txnResp.data);
    } catch (error) {
      // Handled by api.js
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const handleTransaction = async (e) => {
    e.preventDefault();
    try {
      await api.post('/transactions/add', {
        customerId: id,
        amount: Number(txnData.amount),
        type: modalType,
        description: txnData.description
      });
      toast.success(`${modalType === 'credit' ? 'Credit' : 'Payment'} added successfully`);
      setShowModal(false);
      setTxnData({ amount: '', description: '' });
      fetchDetails();
    } catch (error) {
      toast.error('Failed to add transaction');
    }
  };

  const handleDownloadPDF = async () => {
    setDownloading(true);
    try {
      const response = await api.get(`/reports/pdf/${id}`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${customer.customerName}_ledger.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Ledger downloaded successfully');
    } catch (error) {
      toast.error('Failed to generate PDF');
    } finally {
      setDownloading(false);
    }
  };

  const handleSendSMS = async () => {
    setSendingSMS(true);
    try {
      await api.post(`/reminders/${id}`);
      toast.success('SMS Reminder Sent Successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send SMS reminder');
    } finally {
      setSendingSMS(false);
    }
  };

  const handleDeleteCustomer = async () => {
    if (window.confirm(`Are you sure you want to delete ${customer.customerName}? This action cannot be undone.`)) {
      try {
        await api.delete(`/customers/${id}`);
        toast.success('Customer deleted successfully');
        navigate('/customers');
      } catch (error) {
        toast.error('Failed to delete customer');
      }
    }
  };

  if (loading) return <Loader />;
  if (!customer) return <div className="container py-5 text-center"><h4>Customer not found</h4></div>;

  return (
    <div className="fade-in container-fluid px-4 pb-5">
      <button onClick={() => navigate('/customers')} className="btn btn-link text-muted text-decoration-none p-0 mb-4 d-flex align-items-center gap-2 fw-medium">
        <FaArrowLeft /> Back to Customers
      </button>

      <div className="row g-4">
        {/* Customer Info Card */}
        <div className="col-lg-4">
          <div className="card border-0 mb-4 h-100 shadow-sm" style={{ borderRadius: '1.5rem' }}>
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-start mb-4">
                <div className="rounded-circle p-3 text-white d-flex align-items-center justify-content-center" style={{ backgroundColor: '#F5F3FF', color: '#7C3AED', width: '64px', height: '64px' }}>
                  <h2 className="mb-0 fw-bold">{customer.customerName.charAt(0)}</h2>
                </div>
              </div>
              <h3 className="mb-1 fw-bold">{customer.customerName}</h3>
              <p className="text-muted mb-4 d-flex align-items-center gap-2">
                <FaPhoneAlt size={14} /> {customer.phoneNumber}
              </p>

              <hr className="my-4 opacity-50" />

              <div className="mb-3">
                <label className="text-muted small fw-bold text-uppercase d-block mb-1">Address</label>
                <div className="d-flex align-items-start gap-2">
                  <FaMapMarkerAlt className="text-muted mt-1" />
                  <span>{customer.address || 'No address provided'}</span>
                </div>
              </div>
              <div>
                <label className="text-muted small fw-bold text-uppercase d-block mb-1">Notes</label>
                <p className="mb-0 text-muted">{customer.notes || 'No notes available'}</p>
              </div>

              <div className="mt-5 pt-3 d-grid gap-2">
                <button 
                  onClick={handleDownloadPDF} 
                  disabled={downloading}
                  className="btn btn-outline-primary d-flex align-items-center justify-content-center gap-2 py-2 fw-bold"
                  style={{ borderRadius: '12px' }}
                >
                  {downloading ? <span className="spinner-border spinner-border-sm"></span> : <><FaFilePdf /> Download Ledger</>}
                </button>
                <button 
                  onClick={handleSendSMS} 
                  disabled={sendingSMS}
                  className="btn btn-primary d-flex align-items-center justify-content-center gap-2 py-2 fw-bold"
                  style={{ borderRadius: '12px' }}
                >
                  {sendingSMS ? <span className="spinner-border spinner-border-sm"></span> : <><FaPaperPlane /> Send SMS Reminder</>}
                </button>
                <a 
                  href={`https://wa.me/91${customer.phoneNumber}?text=Hello ${customer.customerName}, your current pending balance is ₹${customer.currentBalance}.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline-success d-flex align-items-center justify-content-center gap-2 py-2 fw-bold"
                  style={{ borderRadius: '12px' }}
                >
                  <FaWhatsapp /> WhatsApp Reminder
                </a>
              </div>

              <div className="mt-4 pt-2 border-top d-flex gap-2">
                <button 
                  onClick={() => navigate(`/customers`, { state: { edit: customer } })}
                  className="btn btn-light flex-grow-1 d-flex align-items-center justify-content-center gap-2"
                  style={{ borderRadius: '10px' }}
                >
                  <FaEdit /> Edit
                </button>
                <button 
                  onClick={handleDeleteCustomer}
                  className="btn btn-light flex-grow-1 d-flex align-items-center justify-content-center gap-2 text-danger"
                  style={{ borderRadius: '10px' }}
                >
                  <FaTrash /> Delete
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Transaction Summary & History */}
        <div className="col-lg-8">
          <div className="card border-0 p-4 text-center shadow-sm mb-4" style={{ borderRadius: '1.5rem' }}>
            <p className="text-muted small fw-bold text-uppercase mb-1">PENDING BALANCE</p>
            <h1 className={`mb-0 display-4 fw-bold ${customer.currentBalance > 0 ? 'text-danger' : 'text-success'}`}>
              ₹{customer.currentBalance || 0}
            </h1>
            <p className="text-muted mt-2 small">
              {customer.currentBalance > 0 ? 'Outstanding amount to be collected' : 'Account is fully settled'}
            </p>
          </div>

          <div className="card border-0 mb-4 shadow-sm overflow-hidden" style={{ borderRadius: '1.5rem' }}>
            <div className="card-body p-4">
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
                <h5 className="mb-0 fw-bold">Recent Activity</h5>
                <div className="d-flex gap-2">
                  <button 
                    onClick={() => { setModalType('credit'); setShowModal(true); }}
                    className="btn btn-danger d-flex align-items-center gap-2 px-3 fw-bold"
                    style={{ borderRadius: '10px' }}
                  >
                    <FaPlus /> Got udhaar
                  </button>
                  <button 
                    onClick={() => { setModalType('payment'); setShowModal(true); }}
                    className="btn btn-success d-flex align-items-center gap-2 px-3 fw-bold"
                    style={{ borderRadius: '10px' }}
                  >
                    <FaMinus /> Got payment
                  </button>
                </div>
              </div>
              <TransactionTable transactions={transactions} showCustomer={false} />
            </div>
          </div>
        </div>
      </div>

      {/* Transaction Model */}
      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '1.5rem' }}>
              <div className={`modal-header border-0 pt-4 px-4 ${modalType === 'credit' ? 'text-danger' : 'text-success'}`}>
                <h5 className="modal-title fw-bold">
                  {modalType === 'credit' ? 'Add Credit Entry' : 'Add Payment Entry'}
                </h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body px-4 pb-4">
                <form onSubmit={handleTransaction}>
                  <div className="mb-4">
                    <label className="form-label fw-medium">Amount (₹)</label>
                    <input
                      type="number"
                      className="form-control form-control-lg fw-bold"
                      value={txnData.amount}
                      onChange={(e) => setTxnData({ ...txnData, amount: e.target.value })}
                      required
                      placeholder="0.00"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="form-label fw-medium">Description (Optional)</label>
                    <input
                      type="text"
                      className="form-control"
                      value={txnData.description}
                      onChange={(e) => setTxnData({ ...txnData, description: e.target.value })}
                      placeholder="e.g. Paid via UPI, Grocery list..."
                    />
                  </div>
                  <button 
                    type="submit" 
                    className={`btn w-100 py-3 fw-bold shadow-sm ${modalType === 'credit' ? 'btn-danger' : 'btn-success'}`}
                    style={{ borderRadius: '12px' }}
                  >
                    {modalType === 'credit' ? 'Confirm Credit Entry' : 'Confirm Payment Entry'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerDetails;
