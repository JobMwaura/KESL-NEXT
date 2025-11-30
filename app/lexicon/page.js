'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TermCard from '@/components/TermCard';
import { fetchApprovedTerms } from '@/lib/supabase';

export default function LexiconPage() {
  const [terms, setTerms] = useState([]);
  const [filteredTerms, setFilteredTerms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
      setError(null);

      // Use the new helper function from lib/supabase.js
      const data = await fetchApprovedTerms({
        category: filterCategory !== 'all' ? filterCategory : null,
        language: filterLanguage !== 'all' ? filterLanguage : null,
        risk: filterRisk !== 'all' ? filterRisk : null
      });

      setTerms(data || []);
    } catch (err) {
      console.error('Error loading terms:', err);
      setError(err.message || 'Failed to load terms');
      setTerms([]);
    } finally {
      setLoading(false);
    }
  }

  function filterTerms() {
    let filtered = [...terms];

    // Search by term name, definition, or KEL ID
    if (searchTerm.trim()) {
      const query = searchTerm.toLowerCase();
      filtered = filtered.filter(t =>
        (t.term && t.term.toLowerCase().includes(query)) ||
        (t.meaning && t.meaning.toLowerCase().includes(query)) ||
        (t.kel_id && t.kel_id.toLowerCase().includes(query))
      );
    }

    // Category filter
    if (filterCategory !== 'all') {
      filtered = filtered.filter(t => t.category?.toLowerCase() === filterCategory.toLowerCase());
    }

    // Language filter
    if (filterLanguage !== 'all') {
      filtered = filtered.filter(t => t.language?.toLowerCase() === filterLanguage.toLowerCase());
    }

    // Risk filter
    if (filterRisk !== 'all') {
      filtered = filtered.filter(t => t.risk?.toLowerCase() === filterRisk.toLowerCase());
    }

    setFilteredTerms(filtered);
  }

  const handleFilterChange = (filterType, value) => {
    switch (filterType) {
      case 'category':
        setFilterCategory(value);
        break;
      case 'language':
        setFilterLanguage(value);
        break;
      case 'risk':
        setFilterRisk(value);
        break;
      default:
        break;
    }
  };

  return (
    <>
      <Header />
      <main style={{ minHeight: '100vh', paddingBottom: '80px', backgroundColor: '#f8fafc' }}>
        {/* Hero Section */}
        <section style={{
          background: 'linear-gradient(135deg, #1a3a52 0%, #2d5a7b 100%)',
          color: 'white',
          padding: '60px 20px',
          textAlign: 'center',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
        }}>
          <h1 style={{ 
            fontSize: '42px', 
            margin: '0 0 15px 0', 
            fontWeight: '700',
            lineHeight: '1.2'
          }}>
            Kenya Extreme Speech Lexicon
          </h1>
          <p style={{ 
            fontSize: '16px', 
            opacity: 0.95, 
            maxWidth: '600px', 
            margin: '0 auto',
            lineHeight: '1.6'
          }}>
            Documenting extreme speech patterns across Kenya's digital platforms
          </p>
        </section>

        {/* Search & Filters */}
        <section style={{ 
          backgroundColor: 'white', 
          padding: '40px 20px', 
          borderBottom: '1px solid #e2e8f0',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            {/* Header with Submit Button */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              marginBottom: '25px', 
              gap: '15px', 
              flexWrap: 'wrap'
            }}>
              <h2 style={{ 
                margin: 0, 
                fontSize: '20px', 
                color: '#1e293b', 
                fontWeight: '700'
              }}>
                Browse Terms
              </h2>
              <Link href="/submit" style={{ textDecoration: 'none' }}>
                <button style={{
                  padding: '12px 24px',
                  backgroundColor: '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '14px',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 2px 4px rgba(16, 185, 129, 0.2)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#059669';
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 4px 8px rgba(16, 185, 129, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#10b981';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 2px 4px rgba(16, 185, 129, 0.2)';
                }}>
                  + Submit Term
                </button>
              </Link>
            </div>

            {/* Search Bar */}
            <input
              type="text"
              placeholder="Search terms, definitions, or KEL IDs (e.g., KEL-0001)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                fontSize: '14px',
                boxSizing: 'border-box',
                marginBottom: '20px',
                transition: 'border-color 0.2s',
                outline: 'none'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#2d5a7b';
                e.target.style.boxShadow = '0 0 0 3px rgba(45, 90, 123, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#cbd5e1';
                e.target.style.boxShadow = 'none';
              }}
            />

            {/* Filters Grid */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
              gap: '15px'
            }}>
              {/* Category Filter */}
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '6px', 
                  fontWeight: '600', 
                  color: '#475569', 
                  fontSize: '12px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Category
                </label>
                <select
                  value={filterCategory}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #cbd5e1',
                    borderRadius: '6px',
                    fontSize: '13px',
                    boxSizing: 'border-box',
                    cursor: 'pointer',
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#2d5a7b'}
                  onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
                >
                  <option value="all">All Categories</option>
                  <option value="derogatory">Derogatory</option>
                  <option value="exclusionary">Exclusionary</option>
                  <option value="dangerous">Dangerous</option>
                  <option value="coded">Coded</option>
                </select>
              </div>

              {/* Language Filter */}
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '6px', 
                  fontWeight: '600', 
                  color: '#475569', 
                  fontSize: '12px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Language
                </label>
                <select
                  value={filterLanguage}
                  onChange={(e) => handleFilterChange('language', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #cbd5e1',
                    borderRadius: '6px',
                    fontSize: '13px',
                    boxSizing: 'border-box',
                    cursor: 'pointer',
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#2d5a7b'}
                  onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
                >
                  <option value="all">All Languages</option>
                  <option value="english">English</option>
                  <option value="swahili">Swahili</option>
                  <option value="sheng">Sheng</option>
                  <option value="mixed">Mixed</option>
                </select>
              </div>

              {/* Risk Level Filter */}
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '6px', 
                  fontWeight: '600', 
                  color: '#475569', 
                  fontSize: '12px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Risk Level
                </label>
                <select
                  value={filterRisk}
                  onChange={(e) => handleFilterChange('risk', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #cbd5e1',
                    borderRadius: '6px',
                    fontSize: '13px',
                    boxSizing: 'border-box',
                    cursor: 'pointer',
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#2d5a7b'}
                  onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
                >
                  <option value="all">All Risk Levels</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* Terms Grid */}
        <section style={{ padding: '60px 20px' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            {/* Error State */}
            {error && (
              <div style={{
                backgroundColor: '#fee2e2',
                border: '1px solid #fca5a5',
                borderRadius: '8px',
                padding: '16px',
                marginBottom: '30px',
                color: '#991b1b',
                fontWeight: '500'
              }}>
                ⚠️ Error loading terms: {error}
              </div>
            )}

            {/* Loading State */}
            {loading ? (
              <div style={{ 
                textAlign: 'center', 
                padding: '60px 20px', 
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
                <p style={{ fontSize: '16px', margin: 0 }}>Loading terms...</p>
                <style>{`
                  @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                  }
                `}</style>
              </div>
            ) : filteredTerms.length === 0 ? (
              /* Empty State */
              <div style={{
                backgroundColor: '#ecfdf5',
                border: '2px dashed #10b981',
                borderRadius: '8px',
                padding: '40px 20px',
                textAlign: 'center'
              }}>
                <p style={{ 
                  color: '#047857', 
                  fontSize: '16px', 
                  margin: '0 0 15px 0',
                  fontWeight: '600'
                }}>
                  {searchTerm || filterCategory !== 'all' || filterLanguage !== 'all' || filterRisk !== 'all'
                    ? '🔍 No terms match your filters'
                    : '📚 No approved terms yet'}
                </p>
                <Link href="/submit" style={{ textDecoration: 'none' }}>
                  <button style={{
                    padding: '12px 24px',
                    backgroundColor: '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '14px',
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
                    Be the first to submit →
                  </button>
                </Link>
              </div>
            ) : (
              /* Terms Grid */
              <>
                <p style={{ 
                  color: '#64748b', 
                  marginBottom: '25px', 
                  fontSize: '13px', 
                  fontWeight: '600'
                }}>
                  📊 Showing {filteredTerms.length} of {terms.length} terms
                </p>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
                  gap: '20px'
                }}>
                  {filteredTerms.map(term => (
                    <TermCard
                      key={term.id}
                      id={term.id}
                      term={term.term}
                      category={term.category}
                      risk={term.risk}
                      language={term.language}
                      confidence_level={term.confidence_level}
                      meaning={term.meaning}
                      examples={term.examples}
                      example_count={term.examples?.length || 0}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}