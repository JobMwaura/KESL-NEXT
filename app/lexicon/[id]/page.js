'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { fetchApprovedTerms } from '@/lib/supabase';

export default function LexiconPage() {
  const [terms, setTerms] = useState([]);
  const [filteredTerms, setFilteredTerms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterLanguage, setFilterLanguage] = useState('all');
  const [filterRisk, setFilterRisk] = useState('all');

  useEffect(() => {
    loadTerms();
  }, []);

  useEffect(() => {
    filterTerms();
  }, [terms, searchTerm, filterCategory, filterLanguage, filterRisk]);

  async function loadTerms() {
    try {
      setLoading(true);
      const data = await fetchApprovedTerms();
      setTerms(data || []);
    } catch (err) {
      console.error('Error loading terms:', err);
      setTerms([]);
    } finally {
      setLoading(false);
    }
  }

  function filterTerms() {
    let filtered = terms;

    if (searchTerm) {
      filtered = filtered.filter(t =>
        t.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.meaning.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterCategory !== 'all') {
      filtered = filtered.filter(t => t.category === filterCategory);
    }

    if (filterLanguage !== 'all') {
      filtered = filtered.filter(t => t.language === filterLanguage);
    }

    if (filterRisk !== 'all') {
      filtered = filtered.filter(t => t.risk === filterRisk);
    }

    setFilteredTerms(filtered);
  }

  return (
    <>
      <Header />
      <main style={{ minHeight: '100vh', paddingBottom: '80px' }}>
        {/* Hero Section */}
        <section style={{
          background: 'linear-gradient(135deg, #1a3a52 0%, #2d5a7b 100%)',
          color: 'white',
          padding: '80px 20px',
          textAlign: 'center'
        }}>
          <h1 style={{ fontSize: '48px', margin: '0 0 20px 0', fontWeight: 'bold' }}>
            Kenya Extreme Speech Lexicon
          </h1>
          <p style={{ fontSize: '18px', opacity: 0.95, maxWidth: '600px', margin: '0 auto' }}>
            Browse {terms.length}+ documented terms. Help us expand the lexicon by submitting new terms.
          </p>
        </section>

        {/* Search & Filters Section */}
        <section style={{ background: '#f8fafc', padding: '40px 20px', borderBottom: '1px solid #e2e8f0' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '15px' }}>
              <h2 style={{ margin: 0, fontSize: '24px', color: '#1e293b', fontWeight: '700' }}>
                Search & Filter
              </h2>
              <a href="/submit" style={{ textDecoration: 'none' }}>
                <button style={{
                  padding: '12px 24px',
                  backgroundColor: '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  transition: 'all 0.3s ease',
                  whiteSpace: 'nowrap'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#059669';
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#10b981';
                  e.target.style.transform = 'translateY(0)';
                }}>
                  + Submit New Term
                </button>
              </a>
            </div>

            {/* Search Bar */}
            <div style={{ marginBottom: '30px' }}>
              <input
                type="text"
                placeholder="Search by term or meaning..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '14px 20px',
                  border: '2px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '16px',
                  boxSizing: 'border-box',
                  transition: 'all 0.3s ease'
                }}
                onFocus={(e) => e.target.style.borderColor = '#2d5a7b'}
                onBlur={(e) => e.target.style.borderColor = '#ddd'}
              />
            </div>

            {/* Filter Controls */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#1e293b', fontSize: '13px' }}>
                  Category
                </label>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                >
                  <option value="all">All Categories</option>
                  <option value="Derogatory">Derogatory</option>
                  <option value="Exclusionary">Exclusionary</option>
                  <option value="Dangerous">Dangerous</option>
                  <option value="Coded">Coded</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#1e293b', fontSize: '13px' }}>
                  Language
                </label>
                <select
                  value={filterLanguage}
                  onChange={(e) => setFilterLanguage(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                >
                  <option value="all">All Languages</option>
                  <option value="English">English</option>
                  <option value="Swahili">Swahili</option>
                  <option value="Sheng">Sheng</option>
                  <option value="Mixed">Mixed</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#1e293b', fontSize: '13px' }}>
                  Risk Level
                </label>
                <select
                  value={filterRisk}
                  onChange={(e) => setFilterRisk(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                >
                  <option value="all">All Risk Levels</option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Very High">Very High</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* Terms Display Section */}
        <section style={{ padding: '60px 20px' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            {loading ? (
              <p style={{ textAlign: 'center', color: '#64748b', fontSize: '16px' }}>Loading terms...</p>
            ) : filteredTerms.length === 0 ? (
              <div style={{
                backgroundColor: '#f0f9ff',
                border: '2px dashed #0ea5e9',
                borderRadius: '8px',
                padding: '40px 20px',
                textAlign: 'center'
              }}>
                <p style={{ color: '#0369a1', fontSize: '16px', margin: '0 0 15px 0' }}>
                  {searchTerm || filterCategory !== 'all' || filterLanguage !== 'all' || filterRisk !== 'all'
                    ? 'No terms match your filters'
                    : 'No terms documented yet'}
                </p>
                <a href="/submit" style={{ textDecoration: 'none' }}>
                  <button style={{
                    padding: '12px 24px',
                    backgroundColor: '#0ea5e9',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '14px'
                  }}>
                    Submit the first term →
                  </button>
                </a>
              </div>
            ) : (
              <>
                <p style={{ color: '#64748b', marginBottom: '30px', fontSize: '14px' }}>
                  Showing {filteredTerms.length} of {terms.length} terms
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '25px' }}>
                  {filteredTerms.map((term) => (
                    <TermCard key={term.id} term={term} />
                  ))}
                </div>
              </>
            )}
          </div>
        </section>

        {/* Contribution CTA */}
        <section style={{
          background: '#ecfdf5',
          borderTop: '4px solid #10b981',
          padding: '40px 20px',
          textAlign: 'center'
        }}>
          <h2 style={{ color: '#065f46', fontSize: '24px', marginBottom: '10px' }}>
            See a term we missed?
          </h2>
          <p style={{ color: '#047857', marginBottom: '20px' }}>
            Help us document extreme speech patterns across Kenya's digital platforms.
          </p>
          <a href="/submit" style={{ textDecoration: 'none' }}>
            <button style={{
              padding: '14px 40px',
              backgroundColor: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '16px',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#059669';
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#10b981';
              e.target.style.transform = 'translateY(0)';
            }}>
              + Submit a Term
            </button>
          </a>
        </section>
      </main>
      <Footer />
    </>
  );
}

function TermCard({ term }) {
  const getCategoryColor = (cat) => {
    const colors = {
      'Derogatory': '#dc2626',
      'Exclusionary': '#f97316',
      'Dangerous': '#991b1b',
      'Coded': '#7c3aed'
    };
    return colors[cat] || '#2d5a7b';
  };

  const getRiskColor = (risk) => {
    const colors = {
      'Low': '#10b981',
      'Medium': '#f59e0b',
      'High': '#ef4444',
      'Very High': '#991b1b'
    };
    return colors[risk] || '#64748b';
  };

  return (
    <a href={`/lexicon/${term.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div style={{
        border: '1px solid #cbd5e1',
        borderRadius: '12px',
        padding: '25px',
        backgroundColor: 'white',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.12)';
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.borderColor = '#2d5a7b';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.borderColor = '#cbd5e1';
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '15px' }}>
          <div style={{ flex: 1 }}>
            <h3 style={{ margin: '0 0 6px 0', fontSize: '22px', color: '#1e293b', fontWeight: '700' }}>
              {term.term}
            </h3>
            <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8', fontWeight: '600' }}>
              {term.language}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px', marginBottom: '15px', flexWrap: 'wrap' }}>
          <span style={{
            backgroundColor: getCategoryColor(term.category),
            color: 'white',
            padding: '5px 10px',
            borderRadius: '4px',
            fontSize: '11px',
            fontWeight: '700',
            textTransform: 'uppercase'
          }}>
            {term.category}
          </span>
          <span style={{
            backgroundColor: getRiskColor(term.risk),
            color: 'white',
            padding: '5px 10px',
            borderRadius: '4px',
            fontSize: '11px',
            fontWeight: '700'
          }}>
            {term.risk}
          </span>
        </div>

        <p style={{ 
          margin: '0 0 20px 0', 
          fontSize: '14px', 
          color: '#475569', 
          lineHeight: '1.6',
          flex: 1
        }}>
          {term.meaning.substring(0, 120)}...
        </p>

        <div style={{ display: 'flex', gap: '10px', paddingTop: '15px', borderTop: '1px solid #f1f5f9' }}>
          <button style={{
            flex: 1,
            padding: '10px 16px',
            backgroundColor: '#f8fafc',
            color: '#2d5a7b',
            border: '1px solid #cbd5e1',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '12px',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#f1f5f9';
            e.target.style.borderColor = '#2d5a7b';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = '#f8fafc';
            e.target.style.borderColor = '#cbd5e1';
          }}>
            Read More →
          </button>
        </div>
      </div>
    </a>
  );
}