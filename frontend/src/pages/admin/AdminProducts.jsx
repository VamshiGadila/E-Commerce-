import { useState, useEffect, useRef } from 'react';
import { toast }               from 'react-toastify';
import { productAPI, adminAPI } from '../../utils/api';
import LoadingSpinner           from '../../components/LoadingSpinner';

const EMPTY = {
  name: '', description: '', price: '', stock: '', category: '', imageUrl: '',
};

const CATEGORY_OPTIONS = [
  'Electronics', 'Fashion', 'Furniture', 'Sports', 'Books',
  'Kitchen', 'Toys', 'Health', 'Beauty', 'Automotive',
];

export default function AdminProducts() {
  const [products,    setProducts]    = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [showForm,    setShowForm]    = useState(false);
  const [form,        setForm]        = useState(EMPTY);
  const [editing,     setEditing]     = useState(null);
  const [saving,      setSaving]      = useState(false);
  const [uploading,   setUploading]   = useState(false);
  const [previewUrl,  setPreviewUrl]  = useState('');
  const [dragOver,    setDragOver]    = useState(false);
  const fileInputRef                  = useRef(null);

  const load = () => {
    setLoading(true);
    productAPI.getAll()
      .then(({ data }) => setProducts(data || []))
      .catch(() => toast.error('Failed to load products'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const resetForm = () => {
    setForm(EMPTY);
    setEditing(null);
    setPreviewUrl('');
    setShowForm(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleImageUpload = async (file) => {
    if (!file) return;

    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowed.includes(file.type)) {
      toast.error('Only JPEG, PNG, WEBP, GIF images are allowed'); return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be under 5MB'); return;
    }

    const localPreview = URL.createObjectURL(file);
    setPreviewUrl(localPreview);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      const { data } = await adminAPI.uploadImage(formData);
      setForm((prev) => ({ ...prev, imageUrl: data.url }));
      toast.success('Image uploaded successfully!');
    } catch (err) {
      setPreviewUrl('');
      toast.error(err.response?.data?.message || 'Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handleImageUpload(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleImageUpload(file);
  };

  const handleUrlChange = (e) => {
    const url = e.target.value;
    setForm((prev) => ({ ...prev, imageUrl: url }));
    setPreviewUrl(url);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim())     { toast.error('Product name is required'); return; }
    if (!form.price)           { toast.error('Price is required'); return; }
    if (!form.stock && form.stock !== 0) { toast.error('Stock is required'); return; }

    setSaving(true);
    try {
      const payload = {
        name:        form.name.trim(),
        description: form.description.trim(),
        price:       parseFloat(form.price),
        stock:       parseInt(form.stock),
        category:    form.category.trim(),
        imageUrl:    form.imageUrl.trim(),
      };

      if (editing) {
        await adminAPI.updateProduct(editing, payload);
        toast.success('Product updated successfully!');
      } else {
        await adminAPI.createProduct(payload);
        toast.success('Product created successfully!');
      }
      resetForm();
      load();
    } catch (err) {
      const msg = err.response?.data;
      if (typeof msg === 'object') {
        Object.values(msg).forEach((v) => toast.error(v));
      } else {
        toast.error(msg || 'Save failed');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (p) => {
    setForm({
      name:        p.name        || '',
      description: p.description || '',
      price:       p.price       || '',
      stock:       p.stock       || '',
      category:    p.category    || '',
      imageUrl:    p.imageUrl    || '',
    });
    setPreviewUrl(p.imageUrl || '');
    setEditing(p.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await adminAPI.deleteProduct(id);
      toast.success(`"${name}" deleted`);
      load();
    } catch {
      toast.error('Delete failed');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-0">📦 Products</h4>
          <small className="text-muted">{products.length} total products</small>
        </div>
        <button
          className={`btn ${showForm ? 'btn-outline-secondary' : 'btn-primary'}`}
          onClick={() => { if (showForm) resetForm(); else setShowForm(true); }}
        >
          {showForm ? '✕ Cancel' : '+ Add Product'}
        </button>
      </div>

      {showForm && (
        <div className="card border-0 shadow mb-4">
          <div className="card-header bg-primary text-white py-3">
            <h5 className="mb-0">
              {editing ? '✏ Edit Product' : '➕ New Product'}
            </h5>
          </div>
          <div className="card-body p-4">
            <form onSubmit={handleSubmit}>
              <div className="row g-4">

                <div className="col-lg-4">
                  <label className="form-label fw-semibold">Product Image</label>

                  <div
                    className={`border rounded-3 p-3 text-center mb-3 ${dragOver ? 'border-primary bg-primary bg-opacity-10' : 'border-dashed'}`}
                    style={{
                      minHeight:    200,
                      cursor:       'pointer',
                      borderStyle:  'dashed',
                      position:     'relative',
                      transition:   'all 0.2s',
                    }}
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {uploading ? (
                      <div className="d-flex flex-column align-items-center justify-content-center"
                        style={{ minHeight: 170 }}>
                        <div className="spinner-border text-primary mb-2"/>
                        <small className="text-muted">Uploading…</small>
                      </div>
                    ) : previewUrl ? (
                      <div style={{ position: 'relative' }}>
                        <img
                          src={previewUrl}
                          alt="Preview"
                          className="img-fluid rounded-2"
                          style={{ maxHeight: 170, objectFit: 'cover', width: '100%' }}
                          onError={(e) => {
                            e.target.style.display = 'none';
                            setPreviewUrl('');
                          }}
                        />
                        <div className="mt-2">
                          <small className="text-success fw-semibold">✓ Image ready</small>
                        </div>
                      </div>
                    ) : (
                      <div className="d-flex flex-column align-items-center justify-content-center"
                        style={{ minHeight: 170, color: '#aaa' }}>
                        <div style={{ fontSize: '3rem' }}>🖼</div>
                        <p className="mb-1 fw-semibold text-muted">
                          Drag & drop or click to upload
                        </p>
                        <small className="text-muted">JPEG, PNG, WEBP, GIF · Max 5MB</small>
                      </div>
                    )}
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleFileChange}
                  />

                  <button
                    type="button"
                    className="btn btn-outline-primary w-100 mb-2"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                  >
                    {uploading ? 'Uploading…' : '📁 Browse Files'}
                  </button>

                  <div>
                    <label className="form-label small text-muted">
                      Or paste image URL:
                    </label>
                    <input
                      type="url"
                      className="form-control form-control-sm"
                      placeholder="https://example.com/image.jpg"
                      value={form.imageUrl}
                      onChange={handleUrlChange}
                    />
                  </div>
                </div>

                <div className="col-lg-8">
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label fw-semibold">
                        Product Name <span className="text-danger">*</span>
                      </label>
                      <input
                        className="form-control"
                        placeholder="e.g. iPhone 15 Pro Max"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        Price (₹) <span className="text-danger">*</span>
                      </label>
                      <div className="input-group">
                        <span className="input-group-text">₹</span>
                        <input
                          type="number"
                          className="form-control"
                          placeholder="0.00"
                          min="0"
                          step="0.01"
                          value={form.price}
                          onChange={(e) => setForm({ ...form, price: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        Stock <span className="text-danger">*</span>
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        placeholder="0"
                        min="0"
                        value={form.stock}
                        onChange={(e) => setForm({ ...form, stock: e.target.value })}
                        required
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label fw-semibold">Category</label>
                      <select
                        className="form-select"
                        value={form.category}
                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                      >
                        <option value="">Select category…</option>
                        {CATEGORY_OPTIONS.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>

                    <div className="col-12">
                      <label className="form-label fw-semibold">Description</label>
                      <textarea
                        className="form-control"
                        rows="3"
                        placeholder="Describe your product…"
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <hr className="my-4"/>

              <div className="d-flex gap-3">
                <button
                  type="submit"
                  className="btn btn-success px-4"
                  disabled={saving || uploading}
                >
                  {saving
                    ? <><span className="spinner-border spinner-border-sm me-2"/>Saving…</>
                    : editing ? '✓ Update Product' : '✓ Create Product'}
                </button>
                <button
                  type="button"
                  className="btn btn-outline-secondary px-4"
                  onClick={resetForm}
                  disabled={saving}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-dark">
                <tr>
                  <th style={{ width: 70 }}>Image</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th style={{ width: 140 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-5 text-muted">
                      No products yet. Click "+ Add Product" to get started.
                    </td>
                  </tr>
                ) : (
                  products.map((p) => (
                    <tr key={p.id}>
                      <td>
                        <img
                          src={
                            p.imageUrl && p.imageUrl !== 'img'
                              ? p.imageUrl
                              : `https://picsum.photos/seed/${p.id}/60/60`
                          }
                          width="55"
                          height="55"
                          className="rounded-2"
                          style={{ objectFit: 'cover' }}
                          alt={p.name}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = `https://picsum.photos/seed/${p.id}/60/60`;
                          }}
                        />
                      </td>
                      <td>
                        <div className="fw-semibold">{p.name}</div>
                        <small className="text-muted">
                          {p.description?.slice(0, 40) || '—'}
                        </small>
                      </td>
                      <td>
                        {p.category ? (
                          <span className="badge bg-secondary">{p.category}</span>
                        ) : '—'}
                      </td>
                      <td className="text-primary fw-bold">
                        ₹{p.price?.toLocaleString('en-IN')}
                      </td>
                      <td>
                        <span className={`badge ${
                          p.stock > 10 ? 'bg-success'
                          : p.stock > 0 ? 'bg-warning text-dark'
                          : 'bg-danger'
                        }`}>
                          {p.stock}
                        </span>
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => handleEdit(p)}
                          >
                            ✏ Edit
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDelete(p.id, p.name)}
                          >
                            🗑
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}