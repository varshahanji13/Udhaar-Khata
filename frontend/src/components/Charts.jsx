import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

function Charts({ transactions }){

  // Prepare simple aggregates
  const labels = transactions.slice(0,7).map(t => t.date).reverse();
  const amounts = transactions.slice(0,7).map(t => parseFloat(String(t.amount).replace(/[^0-9.-]+/g, '')) || 0).reverse();

  const credit = transactions.filter(t => t.type==='credit').reduce((s,a)=> s + (parseFloat(String(a.amount).replace(/[^0-9.-]+/g, ''))||0),0);
  const payment = transactions.filter(t => t.type==='payment' || t.type==='debit').reduce((s,a)=> s + (parseFloat(String(a.amount).replace(/[^0-9.-]+/g, ''))||0),0);

  const barData = {
    labels,
    datasets: [{ label: 'Amount', data: amounts, backgroundColor: 'rgba(123,57,255,0.7)' }]
  };

  const pieData = {
    labels: ['Credit','Payment'],
    datasets: [{ data: [credit,payment], backgroundColor: ['#7b39ff','#caa9ff'] }]
  };

  return (
    <div className="row">
      <div className="col-md-8 mb-3">
        <div className="card p-3">
          <h6>Recent Activity</h6>
          <Bar data={barData} />
        </div>
      </div>
      <div className="col-md-4 mb-3">
        <div className="card p-3">
          <h6>Credit vs Payment</h6>
          <Pie data={pieData} />
        </div>
      </div>
    </div>
  )
}

export default Charts;
