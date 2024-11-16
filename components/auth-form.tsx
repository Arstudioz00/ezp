"use client";

import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';

export const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, signup } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('🚀 Form submission started', { isLogin, username, password, email });
    setError('');
    setLoading(true);

    try {
      const result = isLogin 
        ? await login(username, password)
        : await signup(username, password, email);

      console.log('📦 Auth result:', result);

      if (!result.success) {
        console.log('❌ Auth failed:', result.error);
        setError(result.error);
      } else {
        console.log('✅ Auth successful!');
        window.location.href = '/dashboard';
      }
    } catch (err) {
      console.error('💥 Form submission error:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="space-y-4 p-4"
      action="/api/auth/register"
      method="POST"
    >
      {error && (
        <div className="text-red-500 p-2 bg-red-50 rounded">
          {error}
        </div>
      )}
      
      <div className="space-y-2">
        <input
          type="text"
          value={username}
          onChange={(e) => {
            console.log('Username changed:', e.target.value);
            setUsername(e.target.value);
          }}
          placeholder="Username"
          className="w-full p-2 border rounded"
          required
          disabled={loading}
          minLength={3}
        />
        
        <input
          type="password"
          value={password}
          onChange={(e) => {
            console.log('Password changed:', e.target.value.length);
            setPassword(e.target.value);
          }}
          placeholder="Password"
          className="w-full p-2 border rounded"
          required
          disabled={loading}
          minLength={6}
        />
        
        {!isLogin && (
          <input
            type="email"
            value={email}
            onChange={(e) => {
              console.log('Email changed:', e.target.value);
              setEmail(e.target.value);
            }}
            placeholder="Email (optional)"
            className="w-full p-2 border rounded"
            disabled={loading}
          />
        )}
      </div>
      
      <button 
        type="submit"
        className={`w-full p-2 rounded ${
          loading 
            ? 'bg-blue-300 cursor-not-allowed' 
            : 'bg-blue-500 hover:bg-blue-600'
        } text-white`}
        disabled={loading}
        onClick={() => console.log('🔘 Submit button clicked')}
      >
        {loading ? 'Processing...' : (isLogin ? 'Login' : 'Sign Up')}
      </button>
      
      <button 
        type="button" 
        onClick={() => {
          console.log('🔄 Switching mode to:', !isLogin ? 'login' : 'signup');
          setIsLogin(!isLogin);
        }}
        className="w-full text-blue-500 p-2"
        disabled={loading}
      >
        {isLogin ? 'Need an account? Sign up' : 'Have an account? Login'}
      </button>
    </form>
  );
}; 