import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('token');
      const storedUser  = localStorage.getItem('user');

      if (storedToken && storedUser && storedToken !== "null") {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (err) {
      console.error("Auth load error:", err);
      localStorage.clear();
    }
  }, []);

  const login = (authData) => {
    localStorage.setItem('token', authData.token);
    localStorage.setItem('user', JSON.stringify({
      name: authData.name,
      email: authData.email,
      role: authData.role,
    }));

    setToken(authData.token);
    setUser({
      name: authData.name,
      email: authData.email,
      role: authData.role,
    });
  };

  const logout = () => {
    localStorage.clear();
    setToken(null);
    setUser(null);
  };

  // ✅ DERIVED VALUES (IMPORTANT)
  const isLoggedIn = !!token;
  const isAdmin    = user?.role === 'ADMIN';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isLoggedIn,
        isAdmin
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);