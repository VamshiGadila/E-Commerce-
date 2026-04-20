import { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import AdminProducts from './AdminProducts';
import AdminOrders from './AdminOrders';
import { productAPI, adminAPI } from '../../utils/api';

function AdminStats() {
  const [stats, setStats] = useState({ products: 0, orders: 0, revenue: 0 });

  useEffect(() => {
    Promise.all([
      productAPI.getAll(),
      adminAPI.getAllOrders()
    ])
      .then(([{ data: products }, { data: orders }]) => {
        const revenue = orders.reduce((s, o) => s + (o.totalAmount || 0), 0);
        setStats({
          products: products.length,
          orders: orders.length,
          revenue
        });
      })
      .catch(() => {});
  }, []);

  return (
    <div className="row g-3 mb-4">
      {[
        { label: 'Total Products', value: stats.products, icon: '📦', color: 'primary' },
        { label: 'Total Orders', value: stats.orders, icon: '🛒', color: 'success' },
        { label: 'Total Revenue', value: `₹${stats.revenue.toLocaleString('en-IN')}`, icon: '💰', color: 'warning' },
      ].map(({ label, value, icon, color }) => (
        <div key={label} className="col-md-4">
          <div className={`card border-0 bg-${color} bg-opacity-10`}>
            <div className="card-body d-flex align-items-center gap-3">
              <div style={{ fontSize: '2.5rem' }}>{icon}</div>
              <div>
                <p className="text-muted mb-0 small">{label}</p>
                <h4 className="fw-bold mb-0">{value}</h4>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function AdminDashboard() {
  const location = useLocation();

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2 admin-sidebar p-0">
          <div className="p-3 text-white border-bottom">
            <h5 className="mb-0">⚙ Admin Panel</h5>
          </div>
          <nav className="mt-2">
            <Link to="/admin" className={location.pathname === '/admin' ? 'active' : ''}>
              📊 Dashboard
            </Link>
            <Link to="/admin/products"
              className={location.pathname.includes('products') ? 'active' : ''}>
              📦 Products
            </Link>
            <Link to="/admin/orders"
              className={location.pathname.includes('orders') ? 'active' : ''}>
              🛒 Orders
            </Link>
            <Link to="/">🏠 Back to Store</Link>
          </nav>
        </div>

        <div className="col-md-10 p-4">
          <Routes>
            <Route
              index
              element={
                <>
                  <h4 className="fw-bold mb-4">Dashboard Overview</h4>
                  <AdminStats />
                </>
              }
            />
            <Route path="products" element={<AdminProducts />} />
            <Route path="orders" element={<AdminOrders />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;