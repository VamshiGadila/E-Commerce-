import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  timeout: 15000,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login:    (data) => API.post('/auth/login', data),
};

export const productAPI = {
  getAll:        (params) => API.get('/products', { params }),
  getById:       (id)     => API.get(`/products/${id}`),
  getCategories: ()       => API.get('/products/categories'),
};

export const cartAPI = {
  getCart:        ()        => API.get('/cart'),
  addToCart:      (data)    => API.post('/cart', data),
  updateQuantity: (id, qty) => API.put(`/cart/${id}`, { quantity: qty }),
  removeItem:     (id)      => API.delete(`/cart/${id}`),
  clearCart:      ()        => API.delete('/cart'),
  getCount:       ()        => API.get('/cart/count'),
};

export const orderAPI = {
  placeOrder:  (data) => API.post('/orders', data),
  getMyOrders: ()     => API.get('/orders'),
  getById:     (id)   => API.get(`/orders/${id}`),
};

export const adminAPI = {
  createProduct:     (data)      => API.post('/admin/products', data),
  updateProduct:     (id, data)  => API.put(`/admin/products/${id}`, data),
  deleteProduct:     (id)        => API.delete(`/admin/products/${id}`),
  getAllOrders:       ()          => API.get('/admin/orders'),
  updateOrderStatus: (id, status) =>
    API.patch(`/admin/orders/${id}/status`, { status }),
  uploadImage: (formData) =>
    API.post('/admin/upload/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};

export default API;