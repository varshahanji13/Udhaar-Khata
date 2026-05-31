import React, { useState, useEffect } from 'react';
import api from '../services/api';
import TransactionTable from '../components/TransactionTable';
import Loader from '../components/Loader';
import { toast } from 'react-toastify';
import { FaExchangeAlt, FaFilter, FaPlus } from 'react-icons/fa';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('all');
  const [filterCustomer, setFilterCustomer] = useState('all');

  const fetchData = async () => {
    try {
      const [txnResponse, custResponse] = await Promise.all([
        api.get('/transactions'),
        api.get('/customers')
      ]);
      setTransactions(txnResponse.data);
      setCustomers(custResponse.data);
    } catch (error) {
      // Error handled by api.js
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredTxns = transactions.filter(t => {
    const matchesType = filterType === 'all' || t.type === filterType;
    const matchesCustomer = filterCustomer === 'all' || t.customerId?._id === filterCustomer;
    return matchesType && matchesCustomer;
  });

  if (loading) return <Loader />;

  return (
    <div className="fade-in container-fluid px-4 pb-5">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h2 className="mb-1 fw-bold">Transactions</h2>
          <p className="text-muted">Master log of all business entries.</p>
        </div>
        <div className="d-flex flex-wrap gap-2">
          <select 
            className="form-select border-0 shadow-sm" 
            style={{ borderRadius: '10px', width: 'auto' }}
            value={filterCustomer}
            onChange={(e) => setFilterCustomer(e.target.value)}
          >
            <option value="all">All Customers</option>
            {customers.map(c => (
              <option key={c._id} value={c._id}>{c.customerName}</option>
            ))}
          </select>
          <select 
            className="form-select border-0 shadow-sm" 
            style={{ borderRadius: '10px', width: 'auto' }}
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="credit">Credit Only</option>
            <option value="payment">Payments Only</option>
          </select>
        </div>
      </div>

      <div className="card border-0 shadow-sm overflow-hidden" style={{ borderRadius: '15px' }}>
        <div className="card-body p-0">
          <TransactionTable transactions={filteredTxns} />
        </div>
      </div>
    </div>
  );
};

export default Transactions;