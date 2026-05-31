import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Loader from '../components/Loader';
import { toast } from 'react-toastify';
import { FaFilePdf, FaDownload, FaCalendarAlt, FaUser } from 'react-icons/fa';

const Reports = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await api.get('/customers');
        setCustomers(response.data);
        if (response.data.length > 0) {
          setSelectedCustomer(response.data[0]._id);
        }
      } catch (error) {
        // Error handled by api.js
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  const handleDownloadPDF = async () => {
    if (!selectedCustomer) {
      toast.warning('Please select a customer');
      return;
    }

    setDownloading(true);
    try {
      const response = await api.get(`/reports/pdf/${selectedCustomer}`, { 
        responseType: 'blob' 
      });
      
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      const customer = customers.find(c => c._id === selectedCustomer);
      link.setAttribute('download', `${customer?.customerName || 'ledger'}_statement.pdf`);
      
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      toast.success('Report downloaded successfully!');
    } catch (error) {
      toast.error('Failed to download PDF report');
    } finally {
      setDownloading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="fade-in container-fluid px-4 pb-5">
      <div className="mb-4">
        <h2 className="mb-1 fw-bold">Reports</h2>
        <p className="text-muted">Generate and download official PDF ledgers for your customers.</p>
      </div>

      <div className="row g-4">
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '1.5rem' }}>
            <div className="card-body p-4">
              <h5 className="card-title mb-4 fw-bold">Generate PDF Statement</h5>
              
              <div className="mb-4">
                <label className="form-label fw-medium d-flex align-items-center gap-2">
                  <FaUser size={14} className="text-muted" /> Select Customer
                </label>
                <select 
                  className="form-select py-3" 
                  style={{ borderRadius: '12px' }}
                  value={selectedCustomer}
                  onChange={(e) => setSelectedCustomer(e.target.value)}
                >
                  <option value="" disabled>Choose a customer...</option>
                  {customers.map(c => (
                    <option key={c._id} value={c._id}>{c.customerName}</option>
                  ))}
                </select>
              </div>

              <button 
                onClick={handleDownloadPDF}
                disabled={downloading || !selectedCustomer}
                className="btn btn-primary w-100 py-3 fw-bold d-flex align-items-center justify-content-center gap-2 shadow-sm"
                style={{ borderRadius: '12px' }}
              >
                {downloading ? (
                  <span className="spinner-border spinner-border-sm"></span>
                ) : (
                  <><FaFilePdf /> Download PDF Statement</>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card border-0 shadow-sm text-white" style={{ borderRadius: '1.5rem', background: 'linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)' }}>
            <div className="card-body p-5">
              <h3 className="mb-3 fw-bold">Business Transparency</h3>
              <p className="mb-4 opacity-75">Sharing digital ledgers builds trust with your customers. Generate a professional PDF statement in seconds and share it via WhatsApp or email.</p>
              <div className="d-flex align-items-center gap-3">
                <div className="bg-white bg-opacity-25 rounded-circle p-3">
                  <FaDownload size={24} />
                </div>
                <div className="small fw-medium">All reports are generated in real-time using live transaction data.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
