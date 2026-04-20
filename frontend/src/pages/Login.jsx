import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { authAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await authAPI.login(form);

      // Store full user (important for role)
      login(data);

      toast.success(`Welcome back, ${data.name}!`);

      // Redirect based on role
      if (data.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/');
      }

    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
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
                <h3 className="fw-bold">Sign In</h3>
                <p className="text-muted">Welcome back to ShopEase</p>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="your@email.com"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100 py-2"
                  disabled={loading}
                >
                  {loading && (
                    <span className="spinner-border spinner-border-sm me-2" />
                  )}
                  {loading ? 'Signing in…' : 'Sign In'}
                </button>
              </form>

              <hr />

              <p className="text-center text-muted mb-2">
                Demo credentials:
              </p>

              <div className="d-flex gap-2 justify-content-center">
                <button
                  className="btn btn-sm btn-outline-secondary"
                  onClick={() =>
                    setForm({
                      email: 'john@example.com',
                      password: 'password123',
                    })
                  }
                >
                  User Login
                </button>

                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={() =>
                    setForm({
                      email: 'admin@shopease.com',
                      password: 'password123',
                    })
                  }
                >
                  Admin Login
                </button>
              </div>

              <p className="text-center mt-3 mb-0">
                Don't have an account?{' '}
                <Link className="text-primary fw-semibold" to="/register">
                  Register
                </Link>
              </p>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}