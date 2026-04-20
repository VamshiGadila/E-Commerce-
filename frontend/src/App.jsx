import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider }           from './context/CartContext';
import Navbar       from './components/Navbar';
import Home         from './pages/Home';
import Login        from './pages/Login';
import Register     from './pages/Register';
import ProductDetail from './pages/ProductDetail';
import Cart         from './pages/Cart';
import Orders       from './pages/Orders';
import AdminDashboard from './pages/admin/AdminDashboard';

function PrivateRoute({ children }) {
  const { isLoggedIn } = useAuth();
  return isLoggedIn() ? children : <Navigate to="/login" replace />;
}

function AdminRoute({ children }) {
  const { isAdmin, isLoggedIn } = useAuth();
  if (!isLoggedIn()) return <Navigate to="/login" replace />;
  if (!isAdmin())    return <Navigate to="/"      replace />;
  return children;
}

function AppRoutes() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/"            element={<Home />} />
        <Route path="/login"       element={<Login />} />
        <Route path="/register"    element={<Register />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/cart"        element={<PrivateRoute><Cart /></PrivateRoute>} />
        <Route path="/orders"      element={<PrivateRoute><Orders /></PrivateRoute>} />
        <Route path="/admin/*"     element={<AdminRoute><AdminDashboard /></AdminRoute>} />
      </Routes>
      <ToastContainer position="bottom-right" autoClose={3000} />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}