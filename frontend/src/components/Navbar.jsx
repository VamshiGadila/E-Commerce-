import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { user, isLoggedIn, isAdmin, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary sticky-top shadow">
      <div className="container-fluid px-4">
        {/* LOGO */}
        <Link className="navbar-brand fw-bold" to="/">
          🛍 ShopEase
        </Link>

        {/* TOGGLER */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navContent"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="navContent">
          {/* LEFT */}
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>

            {isAdmin && (
              <li className="nav-item">
                <Link className="nav-link" to="/admin">Admin</Link>
              </li>
            )}
          </ul>

          {/* RIGHT */}
          <ul className="navbar-nav ms-auto align-items-center gap-3">
            {isLoggedIn ? (
              <>
                {/* CART */}
                <li className="nav-item position-relative">
                  <Link className="nav-link" to="/cart">
                    🛒 Cart
                    {cartCount > 0 && (
                      <span
                        className="badge bg-danger position-absolute top-0 start-100 translate-middle rounded-pill"
                        style={{ fontSize: '0.7rem' }}
                      >
                        {cartCount}
                      </span>
                    )}
                  </Link>
                </li>

                {/* ORDERS */}
                <li className="nav-item">
                  <Link className="nav-link" to="/orders">
                    My Orders
                  </Link>
                </li>

                {/* USER DROPDOWN */}
                <li className="nav-item dropdown">
                  <button
                    className="btn btn-link nav-link dropdown-toggle text-white"
                    data-bs-toggle="dropdown"
                  >
                    👤 {user?.name}
                  </button>

                  <ul className="dropdown-menu dropdown-menu-end">
                    <li>
                      <button
                        className="dropdown-item text-danger"
                        onClick={handleLogout}
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="btn btn-outline-light btn-sm" to="/login">
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="btn btn-light btn-sm" to="/register">
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}