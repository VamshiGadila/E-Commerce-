import { useMemo }          from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast }             from 'react-toastify';
import { cartAPI }           from '../utils/api';
import { useAuth }           from '../context/AuthContext';
import { useCart }           from '../context/CartContext';

const PRODUCT_IMAGES = {
  'iphone 15':           'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&q=80',
  'samsung galaxy s23':  'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&q=80',
  'oneplus 12':          'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&q=80',
  'dell xps 13':         'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400&q=80',
  'hp pavilion':         'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&q=80',
  'macbook air m2':      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&q=80',
  'gaming mouse':        'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&q=80',
  'mechanical keyboard': 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&q=80',
  'bluetooth speaker':   'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&q=80',
  'smart watch':         'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80',
  'nike shoes':          'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80',
  'adidas t-shirt':      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80',
  'levis jeans':         'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&q=80',
  'puma jacket':         'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&q=80',
  'rayban sunglasses':   'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&q=80',
  'casio watch':         'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&q=80',
  'backpack':            'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80',
  'cap':                 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400&q=80',
  'formal shirt':        'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&q=80',
  'sneakers':            'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=400&q=80',
  'office chair':        'https://images.unsplash.com/photo-1589363460779-cd717d573ded?w=400&q=80',
  'dining table':        'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80',
  'sofa set':            'https://images.unsplash.com/photo-1493663284031-b7e3aaa4c36d?w=400&q=80',
  'bed frame':           'https://images.unsplash.com/photo-1505693314120-0d443867891c?w=400&q=80',
  'bookshelf':           'https://images.unsplash.com/photo-1594620302200-9a762244a156?w=400&q=80',
  'coffee table':        'https://images.unsplash.com/photo-1567016432779-094069958ea5?w=400&q=80',
  'wardrobe':            'https://images.unsplash.com/photo-1556909212-d5b604d0c90d?w=400&q=80',
  'study table':         'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=400&q=80',
  'tv unit':             'https://images.unsplash.com/photo-1593359677879-a4bb92f4834c?w=400&q=80',
  'recliner chair':      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&q=80',
  'football':            'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=400&q=80',
  'cricket bat':         'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=400&q=80',
  'tennis racket':       'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=400&q=80',
  'basketball':          'https://images.unsplash.com/photo-1546519638405-a9d1b1cdf21a?w=400&q=80',
  'gym gloves':          'https://images.unsplash.com/photo-1599058917765-a780eda07a3e?w=400&q=80',
  'yoga mat':            'https://images.unsplash.com/photo-1592432678016-e910b452f9a2?w=400&q=80',
  'dumbbells':           'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&q=80',
  'skipping rope':       'https://images.unsplash.com/photo-1434596922112-19c563067271?w=400&q=80',
  'helmet':              'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',
  'cycling shoes':       'https://images.unsplash.com/photo-1507398941214-572c25f4b1dc?w=400&q=80',
  'novel book':          'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&q=80',
  'science book':        'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&q=80',
  'notebook':            'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=400&q=80',
  'pen pack':            'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=400&q=80',
  'diary':               'https://images.unsplash.com/photo-1506784365847-bbad939e9335?w=400&q=80',
  'magazine':            'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&q=80',
  'comics':              'https://images.unsplash.com/photo-1612036781124-537b74caa99c?w=400&q=80',
  'dictionary':          'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&q=80',
  'sketch book':         'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&q=80',
  'color pencils':       'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=400&q=80',
};

const CATEGORY_FALLBACKS = {
  Electronics: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=80',
  Fashion:     'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&q=80',
  Furniture:   'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80',
  Sports:      'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&q=80',
  Books:       'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&q=80',
  Kitchen:     'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80',
  Toys:        'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=400&q=80',
  Health:      'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=400&q=80',
  Beauty:      'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&q=80',
  Automotive:  'https://images.unsplash.com/photo-1550355291-bbee04a92027?w=400&q=80',
};

function resolveImage(product) {
  const url = product.imageUrl;
  if (url && url !== 'img' && url.startsWith('http')) return url;
  const nameKey = (product.name || '').toLowerCase().trim();
  if (PRODUCT_IMAGES[nameKey]) return PRODUCT_IMAGES[nameKey];
  if (product.category && CATEGORY_FALLBACKS[product.category]) {
    return CATEGORY_FALLBACKS[product.category];
  }
  return `https://picsum.photos/seed/${product.id}/400/300`;
}

export default function ProductCard({ product }) {
  const { isLoggedIn } = useAuth();
  const { refreshCount } = useCart();
  const navigate = useNavigate();

  const imageSrc = useMemo(() => resolveImage(product), [product]);

  const handleAddToCart = async () => {
    if (!isLoggedIn) { navigate('/login'); return; }
    try {
      await cartAPI.addToCart({ productId: product.id, quantity: 1 });
      await refreshCount();
      toast.success(`${product.name} added to cart!`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add to cart');
    }
  };

  return (
    <div className="card h-100 border-0 shadow-sm product-card"
      style={{ borderRadius: 12, overflow: 'hidden', transition: 'transform 0.2s, box-shadow 0.2s' }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '';
      }}
    >
      <div style={{ position: 'relative', overflow: 'hidden', height: 210 }}>
        <Link to={`/products/${product.id}`}>
          <img
            src={imageSrc}
            alt={product.name}
            loading="lazy"
            style={{
              width:      '100%',
              height:     '100%',
              objectFit:  'cover',
              transition: 'transform 0.4s ease',
            }}
            onMouseEnter={(e) => { e.target.style.transform = 'scale(1.08)'; }}
            onMouseLeave={(e) => { e.target.style.transform = 'scale(1)'; }}
            onError={(e) => {
              e.target.onerror = null;
              const fallback = CATEGORY_FALLBACKS[product.category]
                || `https://picsum.photos/seed/${product.id}/400/300`;
              if (e.target.src !== fallback) e.target.src = fallback;
            }}
          />
        </Link>

        {product.stock === 0 && (
          <div style={{
            position:   'absolute', inset: 0,
            background: 'rgba(0,0,0,0.5)',
            display:    'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span className="badge bg-danger px-3 py-2" style={{ fontSize: '0.85rem' }}>
              Out of Stock
            </span>
          </div>
        )}

        {product.stock > 0 && product.stock <= 5 && (
          <div style={{ position: 'absolute', top: 8, right: 8 }}>
            <span className="badge bg-warning text-dark" style={{ fontSize: '0.7rem' }}>
              Only {product.stock} left!
            </span>
          </div>
        )}
      </div>

      <div className="card-body d-flex flex-column p-3">
        {product.category && (
          <span
            className="badge mb-2 align-self-start"
            style={{
              fontSize:   '0.68rem',
              fontWeight: 600,
              background: getCategoryColor(product.category).bg,
              color:      getCategoryColor(product.category).text,
            }}
          >
            {product.category}
          </span>
        )}

        <h6 className="fw-bold mb-1" style={{ fontSize: '0.92rem', lineHeight: 1.3 }}>
          <Link
            to={`/products/${product.id}`}
            className="text-dark text-decoration-none"
            style={{ transition: 'color 0.2s' }}
            onMouseEnter={(e) => { e.target.style.color = '#0d6efd'; }}
            onMouseLeave={(e) => { e.target.style.color = ''; }}
          >
            {product.name}
          </Link>
        </h6>

        <p className="text-muted flex-grow-1 mb-2" style={{ fontSize: '0.8rem', lineHeight: 1.4 }}>
          {product.description?.slice(0, 65) || 'Quality product at great price'}
        </p>

        <div className="d-flex justify-content-between align-items-center mb-2">
          <span className="fw-bold text-primary" style={{ fontSize: '1.05rem' }}>
            ₹{product.price?.toLocaleString('en-IN')}
          </span>
          <small className={product.stock > 0 ? 'text-success' : 'text-danger'}
            style={{ fontSize: '0.75rem', fontWeight: 500 }}>
            {product.stock > 0
              ? product.stock <= 10 ? `⚡ ${product.stock} left` : `✓ In stock`
              : '✕ Sold out'}
          </small>
        </div>

        <button
          className="btn btn-primary btn-sm w-100 fw-semibold"
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          style={{ borderRadius: 8, padding: '8px 0', fontSize: '0.85rem' }}
        >
          {product.stock === 0 ? 'Out of Stock' : '🛒 Add to Cart'}
        </button>
      </div>
    </div>
  );
}

function getCategoryColor(category) {
  const map = {
    Electronics: { bg: '#e3f2fd', text: '#1565c0' },
    Fashion:     { bg: '#fce4ec', text: '#880e4f' },
    Furniture:   { bg: '#e8f5e9', text: '#1b5e20' },
    Sports:      { bg: '#fff3e0', text: '#e65100' },
    Books:       { bg: '#f3e5f5', text: '#4a148c' },
    Kitchen:     { bg: '#e0f7fa', text: '#006064' },
    Toys:        { bg: '#fffde7', text: '#f57f17' },
    Health:      { bg: '#e8f5e9', text: '#2e7d32' },
    Beauty:      { bg: '#fce4ec', text: '#c62828' },
    Automotive:  { bg: '#eeeeee', text: '#212121' },
  };
  return map[category] || { bg: '#f5f5f5', text: '#424242' };
}