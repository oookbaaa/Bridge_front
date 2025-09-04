'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { authService, type User } from '@/lib/auth';

interface AuthContextType {
  token: string | null;
  user: User | null;
  loading: boolean;
  setToken: (token: string | null) => void;
  setUser: (user: User | null) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get token and user from localStorage on mount
    const storedToken = localStorage.getItem('ftb_token');
    const storedUser = localStorage.getItem('ftb_user');

    if (storedToken) {
      setToken(storedToken);
    }

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('ftb_user');
      }
    }

    setLoading(false);
  }, []);

  const handleSetToken = (newToken: string | null) => {
    setToken(newToken);
    if (newToken) {
      localStorage.setItem('ftb_token', newToken);
    } else {
      localStorage.removeItem('ftb_token');
      localStorage.removeItem('ftb_user');
      setUser(null);
    }
  };

  const handleSetUser = (newUser: User | null) => {
    setUser(newUser);
    if (newUser) {
      localStorage.setItem('ftb_user', JSON.stringify(newUser));
    } else {
      localStorage.removeItem('ftb_user');
    }
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('ftb_token');
    localStorage.removeItem('ftb_user');
    // Redirect to login page
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        loading,
        setToken: handleSetToken,
        setUser: handleSetUser,
        logout: handleLogout,
        isAuthenticated: !!token && !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
