'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Check if already logged in
  useEffect(() => {
    const token = localStorage.getItem('admin-token');
    if (token === 'kesl-admin-token-12345') {
      router.push('/admin/terms');
    }
  }, [router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Check credentials
    if (username === 'admin123' && password === '123456') {
      // Store token in localStorage
      localStorage.setItem('admin-token', 'kesl-admin-token-12345');
      // Redirect to admin panel
      router.push('/admin/terms');
    } else {
      setError('Invalid username or password');
      setUsername('');
      setPassword('');
    }

    setIsLoading(false);
  };

  return (
    <>
      <Header />
      <main style={{ minHeight: '100vh', backgroundColor: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <div style={{
          maxWidth: '400px',
          width: '100%',
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '40px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
        }}>
          {/* Logo/Title */}
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h1 style={{ fontSize: '28px', color: '#1e293b', margin: '0 0 10px 0', fontWeight: '700' }}>
              KESL Admin
            </h1>
            <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>
              Term Moderation Panel
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} style={{ display: 'grid', gap: '16px' }}>
            {/* Username Field */}
            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: '600',
                color: '#1e293b',
                fontSize: '14px'
              }}>
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin123"
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: error ? '2px solid #ef4444' : '1px solid #cbd5e1',
                  borderRadius: '6px',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                  fontFamily: 'inherit',
                  transition: 'border-color 0.2s'
                }}
              />
            </div>

            {/* Password Field */}
            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: '600',
                color: '#1e293b',
                fontSize: '14px'
              }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••"
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: error ? '2px solid #ef4444' : '1px solid #cbd5e1',
                  borderRadius: '6px',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                  fontFamily: 'inherit',
                  transition: 'border-color 0.2s'
                }}
              />
            </div>

            {error && (
              <div style={{
                backgroundColor: '#fee2e2',
                border: '1px solid #fca5a5',
                borderRadius: '6px',
                padding: '12px',
                color: '#991b1b',
                fontSize: '13px',
                textAlign: 'center'
              }}>
                ✗ {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !username.trim() || !password.trim()}
              style={{
                padding: '12px 24px',
                backgroundColor: (!username.trim() || !password.trim()) ? '#cbd5e1' : '#2d5a7b',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontWeight: '600',
                fontSize: '14px',
                cursor: (!username.trim() || !password.trim()) ? 'not-allowed' : 'pointer',
                transition: 'background-color 0.2s',
                marginTop: '10px'
              }}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          {/* Info */}
          <div style={{
            backgroundColor: '#f0f4f8',
            borderRadius: '6px',
            padding: '12px',
            marginTop: '30px',
            fontSize: '12px',
            color: '#64748b',
            textAlign: 'center'
          }}>
            🔐 Admin access only
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}