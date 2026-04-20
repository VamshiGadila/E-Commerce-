import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast }              from 'react-toastify';
import { productAPI, cartAPI } from '../utils/api';
import { useAuth }             from '../context/AuthContext';
import { useCart }             from '../context/CartContext';
import LoadingSpinner          from '../components/LoadingSpinner';

const PRODUCT_IMAGES = {
  'iphone 15':           'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&q=85',
  'samsung galaxy s23':  'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&q=85',
  'oneplus 12':          'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&q=85',
  'dell xps 13':         'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&q=85',
  'hp pavilion':         'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=600&q=85',
  'macbook air m2':      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=85',
  'gaming mouse':        'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&q=85',
  'mechanical keyboard': 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&q=85',
  'bluetooth speaker':   'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&q=85',
  'smart watch':         'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=85',
  'nike shoes':          'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=85',
  'adidas t-shirt':      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=85',
  'levis jeans':         'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&q=85',
  'puma jacket':         'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=85',
  'rayban sunglasses':   'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&q=85',
  'casio watch':         'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600&q=85',
  'backpack':            'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=85',
  'cap':                 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600&q=85',
  'formal shirt':        'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&q=85',
  'sneakers':            'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=600&q=85',
  'office chair':        'https://images.unsplash.com/photo-1589363460779-cd717d573ded?w=600&q=85',
  'dining table':        'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=85',
  'sofa set':            'https://images.unsplash.com/photo-1493663284031-b7e3aaa4c36d?w=600&q=85',
  'bed frame':           'https://images.unsplash.com/photo-1505693314120-0d443867891c?w=600&q=85',
  'bookshelf':           'https://images.unsplash.com/photo-1594620302200-9a762244a156?w=600&q=85',
  'coffee table':        'https://images.unsplash.com/photo-1567016432779-094069958ea5?w=600&q=85',
  'wardrobe':            'https://images.unsplash.com/photo-1556909212-d5b604d0c90d?w=600&q=85',
  'study table':         'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=600&q=85',
  'tv unit':             'https://images.unsplash.com/photo-1593359677879-a4bb92f4834c?w=600&q=85',
  'recliner chair':      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=85',
  'football':            'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=600&q=85',
  'cricket bat':         'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=600&q=85',
  'tennis racket':       'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=600&q=85',
  'basketball':          'https://images.unsplash.com/photo-1546519638405-a9d1b1cdf21a?w=600&q=85',
  'gym gloves':          'https://images.unsplash.com/photo-1599058917765-a780eda07a3e?w=600&q=85',
  'yoga mat':            'https://images.unsplash.com/photo-1592432678016-e910b452f9a2?w=600&q=85',
  'dumbbells':           'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&q=85',
  'skipping rope':       'https://images.unsplash.com/photo-1434596922112-19c563067271?w=600&q=85',
  'helmet':              'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=85',
  'cycling shoes':       'https://images.unsplash.com/photo-1507398941214-572c25f4b1dc?w=600&q=85',
  'novel book':          'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&q=85',
  'science book':        'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600&q=85',
  'notebook':            'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=600&q=85',
  'pen pack':            'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=600&q=85',
  'diary':               'https://images.unsplash.com/photo-1506784365847-bbad939e9335?w=600&q=85',
  'magazine':            'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600&q=85',
  'comics':              'https://images.unsplash.com/photo-1612036781124-537b74caa99c?w=600&q=85',
  'dictionary':          'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&q=85',
  'sketch book':         'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&q=85',
  'color pencils':       'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=600&q=85',
};

export default function ProductDetail() {
  const { id }           = useParams();
  const navigate         = useNavigate();
  const { isLoggedIn }   = useAuth();
  const { refreshCount } = useCart();

  const [product,  setProduct]  = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading,  setLoading]  = useState(true);
  const [adding,   setAdding]   = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    productAPI.getById(id)
      .then(({ data }) => setProduct(data))
      .catch(() => navigate('/'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const imageSrc = useMemo(() => {
    if (!product) return '';
    const url = product.imageUrl;
    if (url && url !== 'img' && url.startsWith('http')) return url;
    const key = product.name?.toLowerCase().trim();
    return PRODUCT_IMAGES[key]
      || `https://picsum.photos/seed/${product.id}/600/500`;
  }, [product]);

  const handleAddToCart = async () => {
    if (!isLoggedIn) { navigate('/login'); return; }
    setAdding(true);
    try {
      await cartAPI.addToCart({ productId: product.id, quantity });
      await refreshCount();
      toast.success(`Added ${quantity} × ${product.name} to cart!`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add to cart');
    } finally {
      setAdding(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!product) return null;

  const stockStatus = product.stock === 0 ? 'danger'
    : product.stock <= 5 ? 'warning' : 'success';

  return (
    <div className="container py-5">
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link to="/">Home</Link></li>
          {product.category && (
            <li className="breadcrumb-item">
              <Link to={`/?category=${product.category}`}>{product.category}</Link>
            </li>
          )}
          <li className="breadcrumb-item active">{product.name}</li>
        </ol>
      </nav>

      <div className="row g-5 align-items-start">
        <div className="col-md-6">
          <div style={{ borderRadius: 16, overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}>
            <img
              src={imageSrc}
              alt={product.name}
              style={{ width: '100%', maxHeight: 480, objectFit: 'cover', display: 'block' }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = `https://picsum.photos/seed/${product.id}/600/500`;
              }}
            />
          </div>
        </div>

        <div className="col-md-6">
          {product.category && (
            <span className="badge bg-primary bg-opacity-10 text-primary mb-3"
              style={{ fontSize: '0.8rem', padding: '6px 12px', borderRadius: 20 }}>
              {product.category}
            </span>
          )}

          <h1 className="fw-bold mb-3" style={{ fontSize: '2rem' }}>
            {product.name}
          </h1>

          <div className="d-flex align-items-center gap-3 mb-4">
            <span className="fw-bold text-primary" style={{ fontSize: '1.8rem' }}>
              ₹{product.price?.toLocaleString('en-IN')}
            </span>
            <span className={`badge bg-${stockStatus} bg-opacity-15 text-${stockStatus}`}
              style={{ fontSize: '0.85rem', padding: '6px 14px', borderRadius: 20 }}>
              {product.stock === 0 ? '✕ Out of Stock'
                : product.stock <= 5 ? `⚡ Only ${product.stock} left`
                : `✓ ${product.stock} in stock`}
            </span>
          </div>

          {product.description && (
            <div className="mb-4">
              <h6 className="fw-semibold text-muted mb-2 text-uppercase"
                style={{ fontSize: '0.75rem', letterSpacing: '0.08em' }}>
                Description
              </h6>
              <p className="text-muted mb-0" style={{ lineHeight: 1.7 }}>
                {product.description}
              </p>
            </div>
          )}

          {product.stock > 0 && (
            <div className="d-flex align-items-center gap-3 mb-4">
              <span className="fw-semibold">Quantity:</span>
              <div className="input-group" style={{ width: 140 }}>
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                >
                  −
                </button>
                <input
                  type="number"
                  className="form-control text-center fw-bold"
                  value={quantity}
                  readOnly
                />
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                >
                  +
                </button>
              </div>
              <small className="text-muted">Max: {product.stock}</small>
            </div>
          )}

          <div className="d-flex gap-3 mb-4">
            <button
              className="btn btn-primary btn-lg flex-grow-1 fw-semibold"
              onClick={handleAddToCart}
              disabled={product.stock === 0 || adding}
              style={{ borderRadius: 12, padding: '12px 0' }}
            >
              {adding
                ? <><span className="spinner-border spinner-border-sm me-2"/>Adding…</>
                : product.stock === 0 ? 'Out of Stock' : '🛒 Add to Cart'}
            </button>
            <button
              className="btn btn-outline-secondary btn-lg"
              onClick={() => navigate(-1)}
              style={{ borderRadius: 12 }}
            >
              ← Back
            </button>
          </div>

          <div className="card border-0 bg-light" style={{ borderRadius: 12 }}>
            <div className="card-body">
              <div className="d-flex gap-4">
                <div className="text-center">
                  <div style={{ fontSize: '1.5rem' }}>🚚</div>
                  <small className="text-muted">Free Delivery<br/>over ₹999</small>
                </div>
                <div className="text-center">
                  <div style={{ fontSize: '1.5rem' }}>↩</div>
                  <small className="text-muted">Easy Returns<br/>7 days</small>
                </div>
                <div className="text-center">
                  <div style={{ fontSize: '1.5rem' }}>🔒</div>
                  <small className="text-muted">Secure<br/>Payments</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}