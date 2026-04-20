import { useState, useEffect } from 'react';
import { orderAPI } from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';

const STATUS_COLORS = {
  PENDING:   'warning',
  CONFIRMED: 'info',
  SHIPPED:   'primary',
  DELIVERED: 'success',
  CANCELLED: 'danger',
};

export default function Orders() {
  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded,setExpanded]= useState(null);

  useEffect(() => {
    orderAPI.getMyOrders()
      .then(({ data }) => setOrders(data))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  if (orders.length === 0) return (
    <div className="container py-5 text-center">
      <div style={{ fontSize: '5rem' }}>📦</div>
      <h3 className="text-muted mt-3">No orders yet</h3>
      <a href="/" className="btn btn-primary mt-3">Start Shopping</a>
    </div>
  );

  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-4">📦 My Orders</h2>
      {orders.map((order) => (
        <div key={order.id} className="card mb-3 border-0 shadow-sm order-card">
          <div className="card-body">
            <div className="row align-items-center">
              <div className="col-md-3">
                <small className="text-muted">Order ID</small>
                <p className="fw-bold mb-0">#ORD-{String(order.id).padStart(4, '0')}</p>
              </div>
              <div className="col-md-3">
                <small className="text-muted">Date</small>
                <p className="mb-0">{new Date(order.createdAt).toLocaleDateString('en-IN', {
                  day:'numeric', month:'short', year:'numeric'
                })}</p>
              </div>
              <div className="col-md-2">
                <small className="text-muted">Total</small>
                <p className="fw-bold text-success mb-0">
                  ₹{order.totalAmount?.toLocaleString('en-IN')}
                </p>
              </div>
              <div className="col-md-2">
                <span className={`badge bg-${STATUS_COLORS[order.status] || 'secondary'} fs-6`}>
                  {order.status}
                </span>
              </div>
              <div className="col-md-2 text-end">
                <button className="btn btn-sm btn-outline-primary"
                  onClick={() => setExpanded(expanded === order.id ? null : order.id)}>
                  {expanded === order.id ? 'Hide' : 'Details'}
                </button>
              </div>
            </div>

            {expanded === order.id && (
              <div className="mt-3 pt-3 border-top">
                <p className="text-muted mb-2">
                  <strong>Ship to:</strong> {order.shippingAddress}
                </p>
                <div className="table-responsive">
                  <table className="table table-sm">
                    <thead className="table-light">
                      <tr>
                        <th>Product</th>
                        <th>Price</th>
                        <th>Qty</th>
                        <th>Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.items?.map((item) => (
                        <tr key={item.id}>
                          <td>{item.productName}</td>
                          <td>₹{item.price?.toLocaleString('en-IN')}</td>
                          <td>{item.quantity}</td>
                          <td className="fw-semibold">
                            ₹{item.subtotal?.toLocaleString('en-IN')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="fw-bold">
                        <td colSpan="3" className="text-end">Total:</td>
                        <td className="text-success">
                          ₹{order.totalAmount?.toLocaleString('en-IN')}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}