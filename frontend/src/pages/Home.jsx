import { useState, useEffect } from 'react';
import { productAPI }   from '../utils/api';
import ProductCard      from '../components/ProductCard';
import LoadingSpinner   from '../components/LoadingSpinner';

const CATEGORY_ICONS = {
  Electronics: '💻', Fashion: '👗', Furniture: '🛋',
  Sports: '⚽', Books: '📚', Kitchen: '🍳',
  Toys: '🧸', Health: '💊', Beauty: '💄', Automotive: '🚗',
};

export default function Home() {
  const [products,   setProducts]   = useState([]);
  const [categories, setCategories] = useState([]);
  const [selected,   setSelected]   = useState('');
  const [search,     setSearch]     = useState('');
  const [query,      setQuery]      = useState('');
  const [loading,    setLoading]    = useState(true);

  useEffect(() => {
    productAPI.getCategories()
      .then(({ data }) => setCategories(data || []))
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (selected) params.category = selected;
    if (query)    params.search   = query;
    productAPI.getAll(params)
      .then(({ data }) => setProducts(data || []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [selected, query]);

  const handleSearch = (e) => {
    e.preventDefault();
    setQuery(search.trim());
    setSelected('');
  };

  const handleClear = () => {
    setSearch(''); setQuery(''); setSelected('');
  };

  return (
    <>
      <div style={{
        background: 'linear-gradient(135deg, #1a237e 0%, #283593 40%, #3949ab 100%)',
        padding:    '60px 0 50px',
        textAlign:  'center',
      }}>
        <div className="container">
          <h1 className="text-white fw-bold mb-2" style={{ fontSize: '2.4rem' }}>
            🛍 Welcome to Easy Cart
          </h1>
          <p className="text-white mb-4" style={{ opacity: 0.85, fontSize: '1.05rem' }}>
            Discover amazing products across all categories
          </p>
          <form
            className="d-flex justify-content-center gap-2 flex-wrap"
            onSubmit={handleSearch}
          >
            <div className="input-group shadow-sm"
              style={{ maxWidth: 480, borderRadius: 12, overflow: 'hidden' }}>
              <span className="input-group-text bg-white border-0">🔍</span>
              <input
                type="text"
                className="form-control border-0 py-2"
                placeholder="Search products, brands, categories…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ fontSize: '0.95rem' }}
              />
              <button
                type="submit"
                className="btn btn-warning fw-semibold px-4 border-0"
                style={{ borderRadius: 0 }}
              >
                Search
              </button>
            </div>
            {(query || selected) && (
              <button
                type="button"
                className="btn btn-outline-light px-4"
                style={{ borderRadius: 12 }}
                onClick={handleClear}
              >
                ✕ Clear
              </button>
            )}
          </form>
        </div>
      </div>

      <div className="container py-4">
        {categories.length > 0 && (
          <div className="d-flex gap-2 flex-wrap justify-content-center mb-4">
            <button
              className={`btn btn-sm fw-semibold px-3 ${!selected ? 'btn-primary' : 'btn-outline-secondary'}`}
              style={{ borderRadius: 20 }}
              onClick={handleClear}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                className={`btn btn-sm fw-semibold px-3 ${selected === cat ? 'btn-primary' : 'btn-outline-secondary'}`}
                style={{ borderRadius: 20 }}
                onClick={() => { setSelected(cat); setQuery(''); setSearch(''); }}
              >
                {CATEGORY_ICONS[cat] || '🏷'} {cat}
              </button>
            ))}
          </div>
        )}

        {(query || selected) && (
          <div className="alert alert-info border-0 py-2 mb-3" style={{ borderRadius: 10 }}>
            {query && <span>Results for <strong>"{query}"</strong> — </span>}
            {selected && <span>Category: <strong>{selected}</strong> — </span>}
            {products.length} product{products.length !== 1 ? 's' : ''} found
            <button className="btn btn-sm btn-link py-0 ms-2" onClick={handleClear}>
              Clear filter
            </button>
          </div>
        )}

        {loading ? (
          <LoadingSpinner text="Loading products…" />
        ) : products.length === 0 ? (
          <div className="text-center py-5">
            <div style={{ fontSize: '4rem' }}>🔍</div>
            <h4 className="text-muted mt-3">No products found</h4>
            <p className="text-muted">Try a different search term or browse all categories</p>
            <button className="btn btn-primary" onClick={handleClear}>
              Browse All Products
            </button>
          </div>
        ) : (
          <>
            {!query && !selected && (
              <p className="text-muted text-center mb-4" style={{ fontSize: '0.9rem' }}>
                Showing all {products.length} products
              </p>
            )}
            <div className="row g-4">
              {products.map((p) => (
                <div key={p.id} className="col-xl-3 col-lg-4 col-md-4 col-sm-6">
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}