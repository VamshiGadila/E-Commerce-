import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast }   from 'react-toastify';
import { authAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [form,    setForm]    = useState({ name:'', email:'', password:'' });
  const [loading, setLoading] = useState(false);
  const { login }  = useAuth();
  const navigate   = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters'); return;
    }
    setLoading(true);
    try {
      const { data } = await authAPI.register(form);
      login(data);
      toast.success('Account created successfully!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-5">
          <div className="card shadow border-0">
            <div className="card-body p-4">
              <div className="text-center mb-4">
                <div style={{ fontSize: '3rem' }}>🛍</div>
                <h3 className="fw-bold">Create Account</h3>
                <p className="text-muted">Join ShopEase today</p>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Full Name</label>
                  <input type="text" className="form-control" placeholder="John Doe"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Email</label>
                  <input type="email" className="form-control" placeholder="your@email.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Password</label>
                  <input type="password" className="form-control" placeholder="Min. 6 characters"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required />
                </div>
                <button type="submit" className="btn btn-success w-100 py-2" disabled={loading}>
                  {loading ? <span className="spinner-border spinner-border-sm me-2"/> : null}
                  {loading ? 'Creating account…' : 'Create Account'}
                </button>
              </form>

              <p className="text-center mt-3 mb-0">
                Already have an account?{' '}
                <Link to="/login" className="text-primary fw-semibold">Sign In</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}