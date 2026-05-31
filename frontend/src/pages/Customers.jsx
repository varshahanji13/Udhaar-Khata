import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../services/api';
import CustomerCard from '../components/CustomerCard';
import Loader from '../components/Loader';
import { toast } from 'react-toastify';
import { FaPlus, FaSearch, FaUserPlus, FaUsers, FaTrash, FaEdit } from 'react-icons/fa';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('add'); // 'add' or 'edit'
  const [editingId, setEditingId] = useState(null);
  const location = useLocation();
  
  const [customerForm, setCustomerForm] = useState({
    customerName: '',
    phoneNumber: '',
    address: '',
    notes: ''
  });

  const fetchCustomers = async () => {
    try {
      const response = await api.get('/customers');
      setCustomers(response.data);
      setFilteredCustomers(response.data);
    } catch (error) {
      // Error handled by api.js
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
    
    // Check if we arrived here to edit a specific customer
    if (location.state?.edit) {
      handleOpenEdit(location.state.edit);
      // Clear state so it doesn't re-open on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  useEffect(() => {
    const results = customers.filter(c =>
      (c.customerName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.phoneNumber || '').includes(searchTerm)
    );
    setFilteredCustomers(results);
  }, [searchTerm, customers]);

  const handleOpenAdd = () => {
    setModalType('add');
    setCustomerForm({ customerName: '', phoneNumber: '', address: '', notes: '' });
    setShowModal(true);
  };

  const handleOpenEdit = (customer) => {
    setModalType('edit');
    setEditingId(customer._id);
    setCustomerForm({
      customerName: customer.customerName,
      phoneNumber: customer.phoneNumber,
      address: customer.address || '',
      notes: customer.notes || ''
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modalType === 'add') {
        await api.post('/customers/add', customerForm);
        toast.success('Customer added successfully');
      } else {
        await api.put(`/customers/${editingId}`, customerForm);
        toast.success('Customer updated successfully');
      }
      setShowModal(false);
      fetchCustomers();
    } catch (error) {
      // Error handled by api.js
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this customer? All data will be lost.')) {
      try {
        await api.delete(`/customers/${id}`);
        toast.success('Customer deleted successfully');
        fetchCustomers();
      } catch (error) {
        // Error handled by api.js
      }
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="fade-in container-fluid px-4 pb-5">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h2 className="mb-1 fw-bold">Customers</h2>
          <p className="text-muted">Manage your digital credit book connections.</p>
        </div>
        <button
          className="btn btn-primary d-flex align-items-center justify-content-center gap-2 py-3 px-4 shadow-sm"
          style={{ borderRadius: '12px' }}
          onClick={handleOpenAdd}
        >
          <FaPlus /> Add New Customer
        </button>
      </div>

      <div className="card border-0 mb-4 shadow-sm" style={{ borderRadius: '15px' }}>
        <div className="card-body p-3">
          <div className="input-group search-bar">
            <span className="input-group-text bg-white border-end-0 text-muted ps-3">
              <FaSearch />
            </span>
            <input
              type="text"
              className="form-control border-start-0 ps-0"
              placeholder="Search by name or phone number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>
<div className="row g-4">
  {filteredCustomers.length > 0 ? (
    filteredCustomers.map((customer) => (
      <div className="col-md-6 col-xl-4" key={customer._id}>
        <div
          className="card shadow-sm border-0 h-100"
          style={{
            borderRadius: "20px",
            overflow: "hidden",
          }}
        >
          {/* Action Buttons */}
          <div className="d-flex justify-content-end gap-2 p-3">
            <button
              className="btn btn-light btn-sm shadow-sm text-primary"
              onClick={() => handleOpenEdit(customer)}
              title="Edit Customer"
            >
              <FaEdit />
            </button>

            <button
              className="btn btn-light btn-sm shadow-sm text-danger"
              onClick={() => handleDelete(customer._id)}
              title="Delete Customer"
            >
              <FaTrash />
            </button>
          </div>

          {/* Customer Card Content */}
          <div className="px-3 pb-3">
            <CustomerCard customer={customer} />
          </div>
        </div>
      </div>
    ))
  ) : (
    <div className="col-12 text-center py-5">
      <div className="text-muted opacity-25 mb-3">
        <FaUsers size={64} />
      </div>

      <h4>No Customers Found</h4>

      <p>
        Ready to start? Add your first customer to get going.
      </p>
    </div>
  )}
</div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '1.5rem' }}>
              <div className="modal-header border-0 pt-4 px-4">
                <h5 className="modal-title fw-bold">
                  {modalType === 'add' ? 'Add New Customer' : 'Edit Customer'}
                </h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body px-4 pb-4">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label fw-medium">Customer Name</label>
                    <input
                      type="text"
                      className="form-control py-2"
                      value={customerForm.customerName}
                      onChange={(e) => setCustomerForm({ ...customerForm, customerName: e.target.value })}
                      required
                      placeholder="e.g. Anjana"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-medium">Phone Number</label>
                    <input
                      type="tel"
                      className="form-control py-2"
                      value={customerForm.phoneNumber}
                      onChange={(e) => setCustomerForm({ ...customerForm, phoneNumber: e.target.value })}
                      required
                      placeholder="e.g. 9876543210"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-medium">Address</label>
                    <input
                      type="text"
                      className="form-control py-2"
                      value={customerForm.address}
                      onChange={(e) => setCustomerForm({ ...customerForm, address: e.target.value })}
                      placeholder="e.g. Hyderabad"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="form-label fw-medium">Notes (Optional)</label>
                    <textarea
                      className="form-control"
                      rows="2"
                      value={customerForm.notes}
                      onChange={(e) => setCustomerForm({ ...customerForm, notes: e.target.value })}
                      placeholder="e.g. Regular customer"
                    ></textarea>
                  </div>
                  <button type="submit" className="btn btn-primary w-100 py-3 fw-bold shadow-sm" style={{ borderRadius: '12px' }}>
                    {modalType === 'add' ? 'Save Customer' : 'Update Customer'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .search-bar .form-control:focus {
          box-shadow: none;
          border-color: #dee2e6;
        }
        .search-bar {
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid #dee2e6;
        }
      `}</style>
    </div>
  );
};

export default Customers;