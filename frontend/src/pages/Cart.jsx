import { useState, useEffect } from 'react';
import { Link, useNavigate }   from 'react-router-dom';
import { toast }    from 'react-toastify';
import { cartAPI }  from '../utils/api';
import { useCart }  from '../context/CartContext';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Cart() {
  const [items,    setItems]    = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [checkout, setCheckout] = useState(false);
  const [address,  setAddress]  = useState('');
  const { refreshCount }        = useCart();
  const navigate                = useNavigate();

  const loadCart = async () => {
    try {
      const { data } = await cartAPI.getCart();
      setItems(data);
    } catch { toast.error('Failed to load cart'); }
    finally  { setLoading(false); }
  };

  useEffect(() => { loadCart(); }, []);

  const updateQty = async (itemId, qty) => {
    if (qty < 1) return;
    try {
      await cartAPI.updateQuantity(itemId, qty);
      await loadCart();
      await refreshCount();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    }
  };

  const removeItem = async (itemId) => {
    try {
      await cartAPI.removeItem(itemId);
      await loadCart();
      await refreshCount();
      toast.success('Item removed');
    } catch { toast.error('Remove failed'); }
  };

  const total = items.reduce((sum, i) => sum + i.subtotal, 0);

  const placeOrder = async () => {
    if (!address.trim()) { toast.error('Please enter shipping address'); return; }
    try {
      const { default: orderAPI } = await import('../utils/api').then(m => ({
        default: m.orderAPI
      }));
      await orderAPI.placeOrder({ shippingAddress: address });
      await refreshCount();
      toast.success('Order placed successfully! 🎉');
      navigate('/orders');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Order failed');
    }
  };

  if (loading) return <LoadingSpinner />;

  if (items.length === 0) return (
    <div className="container py-5 text-center">
      <div style={{ fontSize: '5rem' }}>🛒</div>
      <h3 className="text-muted mt-3">Your cart is empty</h3>
      <Link to="/" className="btn btn-primary mt-3">Continue Shopping</Link>
    </div>
  );

  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-4">🛒 Shopping Cart ({items.length} items)</h2>

      <div className="row g-4">
        <div className="col-lg-8">
          {items.map((item) => (
            <div key={item.id} className="card mb-3 border-0 shadow-sm">
              <div className="card-body">
                <div className="row align-items-center g-3">
                  <div className="col-3 col-md-2">
                    <img src={item.productImage || 'https://via.placeholder.com/80'}
                      className="img-fluid rounded" alt={item.productName}
                      style={{ maxHeight: '80px', objectFit: 'cover' }} />
                  </div>
                  <div className="col-9 col-md-4">
                    <h6 className="fw-bold mb-1">{item.productName}</h6>
                    <p className="text-primary fw-bold mb-0">
                      ₹{item.price?.toLocaleString('en-IN')}
                    </p>
                  </div>
                  <div className="col-6 col-md-3">
                    <div className="input-group input-group-sm">
                      <button className="btn btn-outline-secondary"
                        onClick={() => updateQty(item.id, item.quantity - 1)}>−</button>
                      <input className="form-control text-center" value={item.quantity} readOnly/>
                      <button className="btn btn-outline-secondary"
                        onClick={() => updateQty(item.id, item.quantity + 1)}>+</button>
                    </div>
                  </div>
                  <div className="col-4 col-md-2 text-end">
                    <p className="fw-bold text-success mb-0">
                      ₹{item.subtotal?.toLocaleString('en-IN')}
                    </p>
                  </div>
                  <div className="col-2 col-md-1 text-end">
                    <button className="btn btn-sm btn-outline-danger"
                      onClick={() => removeItem(item.id)}>✕</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="col-lg-4">
          <div className="card border-0 shadow-sm sticky-top" style={{ top: '80px' }}>
            <div className="card-body">
              <h5 className="fw-bold mb-3">Order Summary</h5>
              {items.map((i) => (
                <div key={i.id} className="d-flex justify-content-between mb-1 small">
                  <span className="text-muted">{i.productName} × {i.quantity}</span>
                  <span>₹{i.subtotal?.toLocaleString('en-IN')}</span>
                </div>
              ))}
              <hr/>
              <div className="d-flex justify-content-between fw-bold fs-5">
                <span>Total</span>
                <span className="text-primary">₹{total.toLocaleString('en-IN')}</span>
              </div>
              <hr/>
              <div className="mb-3">
                <label className="form-label fw-semibold">Shipping Address</label>
                <textarea className="form-control" rows="3"
                  placeholder="Enter your full shipping address…"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)} />
              </div>
              <button className="btn btn-success w-100 py-2 fw-bold"
                onClick={placeOrder}>
                ✅ Place Order
              </button>
              <Link to="/" className="btn btn-outline-secondary w-100 mt-2">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}