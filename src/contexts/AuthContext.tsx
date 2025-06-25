'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import api from '@/utils/api'; // Axios instance with credentials

interface AuthContextType {
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
  role: string | null;
  setRole: (value: string | null) => void;
  loading: boolean; // <--- ADDED THIS LINE
}

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  setIsLoggedIn: () => {},
  role: null,
  setRole: () => {},
  loading: true, // <--- ADDED DEFAULT LOADING STATE
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); // <--- ADDED LOADING STATE

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const res = await api.get('/auth/check');
        if (res.data.success) {
          setIsLoggedIn(true);
          setRole(res.data.role);
          // Store in sessionStorage as fallback
          sessionStorage.setItem('isLoggedIn', 'true');
          sessionStorage.setItem('role', res.data.role || '');
        }
      } catch (err) {
        // Initialize from sessionStorage on failure
        setIsLoggedIn(sessionStorage.getItem('isLoggedIn') === 'true');
        setRole(sessionStorage.getItem('role'));
      } finally {
        setLoading(false); // <--- SET LOADING TO FALSE AFTER CHECK
      }
    };
    checkAuthStatus();
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, role, setRole, loading }}> {/* <--- PASSED LOADING HERE */}
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
