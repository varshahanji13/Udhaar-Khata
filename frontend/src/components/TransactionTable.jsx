import React from 'react';
import { format } from 'date-fns';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';

const TransactionTable = ({ transactions, showCustomer = true }) => {
  if (!transactions || transactions.length === 0) {
    return (
      <div className="text-center py-5">
        <p className="text-muted">No transactions found.</p>
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle mb-0">
        <thead className="bg-light text-muted uppercase small fw-bold">
          <tr>
            <th className="px-4 py-3 border-0">Date</th>
            {showCustomer && <th className="py-3 border-0">Customer</th>}
            <th className="py-3 border-0">Type</th>
            <th className="py-3 border-0">Description</th>
            <th className="py-3 border-0 text-end px-4">Amount</th>
          </tr>
        </thead>
        <tbody className="border-0">
          {transactions.map((t, idx) => (
            <tr key={t._id || idx}>
              <td className="px-4 py-3 border-0">
                {(t.createdAt || t.date) ? format(new Date(t.createdAt || t.date), 'dd MMM yyyy') : 'N/A'}
              </td>
              {showCustomer && (
                <td className="py-3 border-0 fw-medium">
                  {t.customerId?.customerName || t.customer?.name || 'N/A'}
                </td>
              )}
              <td className="py-3 border-0">
                <span className={`badge rounded-pill d-inline-flex align-items-center gap-1 ${
                  t.type === 'credit' ? 'bg-danger-subtle text-danger' : 'bg-success-subtle text-success'
                }`} style={{ padding: '0.5em 1em' }}>
                  {t.type === 'credit' ? <FaArrowUp size={10} /> : <FaArrowDown size={10} />}
                  <span className="text-capitalize">{t.type}</span>
                </span>
              </td>
              <td className="py-3 border-0 text-muted small">
                {t.description || '-'}
              </td>
              <td className={`py-3 border-0 text-end px-4 fw-bold ${
                t.type === 'credit' ? 'text-danger' : 'text-success'
              }`}>
                {t.type === 'credit' ? '-' : '+'}₹{t.amount}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionTable;
