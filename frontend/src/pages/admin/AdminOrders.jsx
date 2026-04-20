import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { adminAPI } from '../../utils/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const STATUSES = ['PENDING','CONFIRMED','SHIPPED','DELIVERED','CANCELLED'];

const STATUS_COLORS = {
  PENDING:'warning',
  CONFIRMED:'info',
  SHIPPED:'primary',
  DELIVERED:'success',
  CANCELLED:'danger'
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);


  const load = async () => {
    try {
      setLoading(true);
      const { data } = await adminAPI.getAllOrders();
      setOrders(data || []);
    } catch (error) {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const updateStatus = async (id, status) => {
    const previousOrders = [...orders];

    try {

      setOrders(prev =>
        prev.map(o => o.id === id ? { ...o, status } : o)
      );

      await adminAPI.updateOrderStatus(id, status);
      toast.success('Order status updated');
    } catch (error) {
  
      setOrders(previousOrders);
      toast.error('Update failed');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <h4 className="fw-bold mb-4">🛒 All Orders ({orders.length})</h4>

      {orders.length === 0 ? (
        <div className="text-center py-5 text-muted">
          <h5>No orders yet</h5>
          <p>Orders will appear here once users start purchasing.</p>
        </div>
      ) : (
        orders.map((order) => (
          <div key={order.id} className="card mb-3 border-0 shadow-sm">
            <div className="card-body">

              <div className="row align-items-center g-2">

                {/* Order ID */}
                <div className="col-md-2">
                  <small className="text-muted d-block">Order ID</small>
                  <strong>#ORD-{String(order.id).padStart(4,'0')}</strong>
                </div>

                {/* Date */}
                <div className="col-md-2">
                  <small className="text-muted d-block">Date</small>
                  {order.createdAt 
                    ? new Date(order.createdAt).toLocaleDateString('en-IN') 
                    : '-'}
                </div>

                {/* Amount */}
                <div className="col-md-2">
                  <small className="text-muted d-block">Amount</small>
                  <strong className="text-success">
                    ₹{order.totalAmount 
                      ? order.totalAmount.toLocaleString('en-IN') 
                      : 0}
                  </strong>
                </div>

                {/* Status Badge */}
                <div className="col-md-2">
                  <span className={`badge bg-${STATUS_COLORS[order.status] || 'secondary'}`}>
                    {order.status}
                  </span>
                </div>

                {/* Status Dropdown */}
                <div className="col-md-3">
                  <select
                    className="form-select form-select-sm"
                    value={order.status}
                    onChange={(e) => updateStatus(order.id, e.target.value)}
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                {/* Expand Button */}
                <div className="col-md-1 text-end">
                  <button
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() =>
                      setExpanded(expanded === order.id ? null : order.id)
                    }
                  >
                    {expanded === order.id ? '▲' : '▼'}
                  </button>
                </div>

              </div>

              {/* Expanded Section */}
              {expanded === order.id && (
                <div className="mt-3 pt-3 border-top">

                  <p>
                    <strong>Ship to:</strong> {order.shippingAddress || 'N/A'}
                  </p>

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
                      {order.items?.length > 0 ? (
                        order.items.map((item) => (
                          <tr key={item.id}>
                            <td>{item.productName}</td>
                            <td>₹{item.price?.toLocaleString('en-IN') || 0}</td>
                            <td>{item.quantity}</td>
                            <td>₹{item.subtotal?.toLocaleString('en-IN') || 0}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4" className="text-center text-muted">
                            No items found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>

                </div>
              )}

            </div>
          </div>
        ))
      )}
    </div>
  );
}