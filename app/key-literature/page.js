'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header style={{
      backgroundColor: 'white',
      borderBottom: '1px solid #e2e8f0',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '0 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '70px'
      }}>
        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none' }}>
          <div style={{
            fontSize: '24px',
            fontWeight: '700',
            color: '#1a3a52',
            cursor: 'pointer',
            transition: 'color 0.2s'
          }}
          onMouseEnter={(e) => e.target.style.color = '#2d5a7b'}
          onMouseLeave={(e) => e.target.style.color = '#1a3a52'}>
            KESL
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav style={{
          display: 'flex',
          gap: '40px',
          alignItems: 'center'
        }} className="desktop-nav">
          <Link href="/" style={{ textDecoration: 'none' }}>
            <div style={{
              color: '#475569',
              fontWeight: '500',
              fontSize: '15px',
              cursor: 'pointer',
              transition: 'color 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.color = '#1a3a52'}
            onMouseLeave={(e) => e.target.style.color = '#475569'}>
              Home
            </div>
          </Link>

          <Link href="/lexicon" style={{ textDecoration: 'none' }}>
            <div style={{
              color: '#475569',
              fontWeight: '500',
              fontSize: '15px',
              cursor: 'pointer',
              transition: 'color 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.color = '#1a3a52'}
            onMouseLeave={(e) => e.target.style.color = '#475569'}>
              Lexicon
            </div>
          </Link>

          <Link href="/understanding-extreme-speech" style={{ textDecoration: 'none' }}>
            <div style={{
              color: '#475569',
              fontWeight: '500',
              fontSize: '15px',
              cursor: 'pointer',
              transition: 'color 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.color = '#1a3a52'}
            onMouseLeave={(e) => e.target.style.color = '#475569'}>
              Framework
            </div>
          </Link>

          <Link href="/key-literature" style={{ textDecoration: 'none' }}>
            <div style={{
              color: '#475569',
              fontWeight: '500',
              fontSize: '15px',
              cursor: 'pointer',
              transition: 'color 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.color = '#1a3a52'}
            onMouseLeave={(e) => e.target.style.color = '#475569'}>
              Literature
            </div>
          </Link>

          <Link href="/submit" style={{ textDecoration: 'none' }}>
            <button style={{
              backgroundColor: '#10b981',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '6px',
              fontWeight: '600',
              fontSize: '14px',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#059669';
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#10b981';
              e.target.style.transform = 'translateY(0)';
            }}>
              + Submit
            </button>
          </Link>
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            display: 'none',
            backgroundColor: 'transparent',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            color: '#1a3a52'
          }}
          className="mobile-menu-btn"
        >
          ☰
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <nav style={{
          backgroundColor: '#f8fafc',
          borderTop: '1px solid #e2e8f0',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '15px'
        }}>
          <Link href="/" onClick={() => setMobileMenuOpen(false)} style={{ textDecoration: 'none' }}>
            <div style={{
              color: '#475569',
              fontWeight: '500',
              padding: '10px',
              cursor: 'pointer'
            }}>
              Home
            </div>
          </Link>

          <Link href="/lexicon" onClick={() => setMobileMenuOpen(false)} style={{ textDecoration: 'none' }}>
            <div style={{
              color: '#475569',
              fontWeight: '500',
              padding: '10px',
              cursor: 'pointer'
            }}>
              Lexicon
            </div>
          </Link>

          <Link href="/understanding-extreme-speech" onClick={() => setMobileMenuOpen(false)} style={{ textDecoration: 'none' }}>
            <div style={{
              color: '#475569',
              fontWeight: '500',
              padding: '10px',
              cursor: 'pointer'
            }}>
              Framework
            </div>
          </Link>

          <Link href="/key-literature" onClick={() => setMobileMenuOpen(false)} style={{ textDecoration: 'none' }}>
            <div style={{
              color: '#475569',
              fontWeight: '500',
              padding: '10px',
              cursor: 'pointer'
            }}>
              Literature
            </div>
          </Link>

          <Link href="/submit" onClick={() => setMobileMenuOpen(false)} style={{ textDecoration: 'none' }}>
            <button style={{
              backgroundColor: '#10b981',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '6px',
              fontWeight: '600',
              fontSize: '14px',
              cursor: 'pointer',
              width: '100%'
            }}>
              + Submit
            </button>
          </Link>
        </nav>
      )}

      {/* Mobile Responsive Styles */}
      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: block !important; }
        }
      `}</style>
    </header>
  );
}