"use client"

import { createContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  loggedIn: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

interface User {
  email: string;
  name: string;
}

export const AuthContext = createContext<AuthContextType>({
  loggedIn: false,
  login: async () => false,
  logout: () => { },
  isLoading: true
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(true);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (!email || !password) {
        throw new Error('Email and password are required');
      }
      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }
      const dummyUser: User = {
        email,
        name: email.split('@')[0]
      };
      localStorage.setItem('user', JSON.stringify(dummyUser));
      setUser(true);
      router.push('/dashboard');
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(false);
    router.push('/');
  };

  return (
    <AuthContext.Provider
      value={{
        loggedIn: user,
        login,
        logout,
        isLoading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};