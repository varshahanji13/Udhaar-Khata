import React, { useState, useEffect } from 'react';
import api from '../services/api';
import DashboardCards from '../components/DashboardCards';
import TransactionTable from '../components/TransactionTable';
import Loader from '../components/Loader';
import { toast } from 'react-toastify';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend,
  ArcElement
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import { FaSyncAlt, FaArrowRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const response = await api.get('/dashboard');
      setData(response.data);
    } catch (error) {
      // Fault tolerance: error toasts handled by api interceptor
      setData({
        totalCustomers: 0,
        totalCredit: 0,
        totalPaid: 0,
        pendingAmount: 0,
        recentTransactions: []
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    
    // Refresh when window gets focus (e.g. after coming back from a transaction modal or another page)
    window.addEventListener('focus', fetchDashboardData);
    return () => window.removeEventListener('focus', fetchDashboardData);
  }, []);

  if (loading) return <Loader />;

  const stats = data || { 
    totalCustomers: 0, 
    totalCredit: 0, 
    totalPaid: 0, 
    pendingAmount: 0 
  };

  const pieData = {
    labels: ['Paid', 'Pending'],
    datasets: [
      {
        data: [stats.totalPaid, stats.pendingAmount],
        backgroundColor: ['#10B981', '#EF4444'],
        borderWidth: 0,
      },
    ],
  };

  const barData = {
    labels: ['Finances'],
    datasets: [
      {
        label: 'Total Credit',
        data: [stats.totalCredit],
        backgroundColor: '#EF4444',
        borderRadius: 8,
      },
      {
        label: 'Total Paid',
        data: [stats.totalPaid],
        backgroundColor: '#10B981',
        borderRadius: 8,
      },
    ],
  };

  return (
    <div className="fade-in container-fluid px-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">Dashboard</h2>
          <p className="text-muted">Business overview and financial summaries.</p>
        </div>
        <button onClick={fetchDashboardData} className="btn btn-white shadow-sm border d-flex align-items-center gap-2">
          <FaSyncAlt /> Refresh
        </button>
      </div>

      <DashboardCards stats={stats} />

      <div className="row mt-4">
        <div className="col-lg-8">
          <div className="card border-0 mb-4 h-100 shadow-sm">
            <div className="card-body p-4">
              <h5 className="card-title mb-4">Financial Overview</h5>
              <div style={{ height: '300px' }}>
                <Bar options={{ maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }} data={barData} />
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="card border-0 mb-4 h-100 shadow-sm">
            <div className="card-body p-4 d-flex flex-column">
              <h5 className="card-title mb-4">Recovery Status</h5>
              <div className="flex-grow-1 d-flex align-items-center justify-content-center">
                <div style={{ width: '200px', height: '200px' }}>
                  <Pie options={{ maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }} data={pieData} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card border-0 mt-4 shadow-sm mb-5">
        <div className="card-body p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5 className="mb-0">Recent Transactions</h5>
            <Link to="/transactions" className="btn btn-link text-primary text-decoration-none d-flex align-items-center gap-1 p-0 fw-bold">
              View All <FaArrowRight size={12} />
            </Link>
          </div>
          <TransactionTable transactions={data?.recentTransactions || []} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;