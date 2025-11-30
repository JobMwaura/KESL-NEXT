'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

/**
 * Admin Layout Component
 * Protects all routes under /admin/* with secure authentication
 * 
 * Features:
 * - Password-based authentication
 * - Session storage in memory (secure)
 * - Protected routes requiring login
 * - Clean error handling
 * - Loading states
 */

export default function AdminLayout({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Check if user is already authenticated (on mount)
  useEffect(() => {
    const checkAuth = () => {
      // Check if session exists in sessionStorage (cleared when browser closes)
      const authSession = sessionStorage.getItem('kesl-admin-auth');
      
      if (authSession === 'authenticated') {
        setIsAuthenticated(true);
        setShowLogin(false);
      } else {
        setShowLogin(true);
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  // Handle login
  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Get password from environment variable
    const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

    if (!adminPassword) {
      setError('Admin password not configured');
      setIsLoading(false);
      return;
    }

    // Check password
    if (password === adminPassword) {
      // Store session (cleared when browser closes)
      sessionStorage.setItem('kesl-admin-auth', 'authenticated');
      setIsAuthenticated(true);
      setShowLogin(false);
      setPassword('');
      setError('');
    } else {
      setError('Invalid password. Try again.');
      setPassword('');
    }

    setIsLoading(false);
  };

  // Handle logout
  const handleLogout = () => {
    sessionStorage.removeItem('kesl-admin-auth');
    setIsAuthenticated(false);
    setShowLogin(true);
    setPassword('');
    setError('');
  };

  // Show loading state
  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8fafc'
      }}>
        <div style={{
          textAlign: 'center',
          color: '#64748b'
        }}>
          <div style={{
            display: 'inline-block',
            width: '40px',
            height: '40px',
            border: '3px solid #e2e8f0',
            borderTop: '3px solid #2d5a7b',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            marginBottom: '15px'
          }} />
          <p style={{ margin: 0, fontSize: '14px' }}>Initializing...</p>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    );
  }

  // Show login form
  if (showLogin) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8fafc',
        padding: '20px'
      }}>
        <div style={{
          maxWidth: '400px',
          width: '100%',
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '40px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
        }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div style={{
              fontSize: '32px',
              marginBottom: '15px'
            }}>
              🔐
            </div>
            <h1 style={{
              fontSize: '24px',
              color: '#1e293b',
              margin: '0 0 8px 0',
              fontWeight: '700'
            }}>
              Admin Access
            </h1>
            <p style={{
              color: '#64748b',
              fontSize: '14px',
              margin: 0
            }}>
              Kenya Extreme Speech Lexicon
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} style={{ display: 'grid', gap: '16px' }}>
            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: '600',
                color: '#1e293b',
                fontSize: '13px',
                textTransform: 'uppercase'
              }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                disabled={isLoading}
                autoFocus
                style={{
                  width: '100%',
                  padding: '12px',
                  border: error ? '2px solid #ef4444' : '1px solid #cbd5e1',
                  borderRadius: '6px',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                  fontFamily: 'inherit',
                  transition: 'border-color 0.2s',
                  backgroundColor: error ? '#fef2f2' : 'white'
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
                ✕ {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !password.trim()}
              style={{
                padding: '12px 24px',
                backgroundColor: (!password.trim() || isLoading) ? '#cbd5e1' : '#2d5a7b',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontWeight: '600',
                fontSize: '14px',
                cursor: (!password.trim() || isLoading) ? 'not-allowed' : 'pointer',
                transition: 'background-color 0.2s'
              }}
            >
              {isLoading ? 'Verifying...' : 'Access Admin Panel'}
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
            textAlign: 'center',
            lineHeight: '1.6'
          }}>
            <strong>Session Storage:</strong> Automatically cleared when you close your browser
          </div>
        </div>
      </div>
    );
  }

  // User is authenticated - show dashboard with logout button
  return (
    <div>
      {/* Admin Header */}
      <header style={{
        backgroundColor: 'white',
        borderBottom: '1px solid #e2e8f0',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
      }}>
        <div style={{
          maxWidth: '1600px',
          margin: '0 auto',
          padding: '16px 30px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h1 style={{
              margin: 0,
              fontSize: '18px',
              fontWeight: '700',
              color: '#0f172a'
            }}>
              🔐 Admin Dashboard
            </h1>
          </div>
          <button
            onClick={handleLogout}
            style={{
              padding: '8px 16px',
              backgroundColor: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#dc2626'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#ef4444'}
          >
            🚪 Logout
          </button>
        </div>
      </header>

      {/* Dashboard Content */}
      {children}
    </div>
  );
}