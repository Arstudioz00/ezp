"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

interface User {
  id: number;
  username: string;
  email: string | null;
}

interface AuthResponse {
  user: User;
  token: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      validateToken(token);
    } else {
      setLoading(false);
    }
  }, []);

  const validateToken = async (token: string) => {
    try {
      const response = await fetch('/api/auth/validate', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        Cookies.remove('token');
        router.push('/auth/login');
      }
    } catch (error) {
      console.error('Token validation error:', error);
      Cookies.remove('token');
      router.push('/auth/login');
    } finally {
      setLoading(false);
    }
  };

  const login = async (username: string, password: string) => {
    try {
      console.log('🔑 Attempting login for:', username);
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password })
      });
      
      console.log('📥 Login response status:', response.status);
      const data = await response.json();
      console.log('📦 Login response data:', data);
      
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      Cookies.set('token', data.token);
      setUser(data.user);
      return { success: true };
    } catch (error: any) {
      console.error('❌ Login error:', error);
      return { 
        success: false, 
        error: error.message || 'Login failed'
      };
    }
  };

  const signup = async (username: string, password: string, email?: string) => {
    try {
      console.log('🚀 Attempting signup for:', username);
      
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, email })
      });
      
      console.log('📥 Signup response status:', response.status);
      const data = await response.json();
      console.log('📦 Signup response data:', data);
      
      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      Cookies.set('token', data.token);
      setUser(data.user);
      return { success: true };
    } catch (error: any) {
      console.error('❌ Signup error:', error);
      return { 
        success: false, 
        error: error.message || 'Registration failed'
      };
    }
  };

  const logout = () => {
    Cookies.remove('token');
    setUser(null);
    router.push('/auth/login');
  };

  return {
    user,
    loading,
    login,
    signup,
    logout
  };
};