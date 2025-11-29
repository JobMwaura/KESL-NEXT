'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

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

      const { data, error: queryError } = await supabase
        .from('terms')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      if (queryError) {
        console.error('Query error:', queryError);
        setError(queryError.message);
        setTerms([]);
        return;
      }

      setTerms(data || []);
    } catch (err) {
      console.error('Error loading terms:', err);
      setError(err.message);
      setTerms([]);
    } finally {
      setLoading(false);
    }
  }

  function filterTerms() {
    let filtered = [...terms];

    if (searchTerm.trim()) {
      const query = searchTerm.toLowerCase();
      filtered = filtered.filter(t =>
        (t.term && t.term.toLowerCase().includes(query)) ||
        (t.meaning && t.meaning.toLowerCase().includes(query)) ||
        (t.kel_id && t.kel_id.toLowerCase().includes(query))
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
    <>
      <Header />
      <main style={{ minHeight: '100vh', paddingBottom: '80px', backgroundColor: '#f8fafc' }}>
        {/* Hero Section */}
        <section style={{
          background: 'linear-gradient(135deg, #1a3a52 0%, #2d5a7b 100%)',
          color: 'white',
          padding: '60px 20px',
          textAlign: 'center'
        }}>
          <h1 style={{ fontSize: '42px', margin: '0 0 15px 0', fontWeight: '700' }}>
            Kenya Extreme Speech Lexicon
          </h1>
          <p style={{ fontSize: '16px', opacity: 0.95, maxWidth: '600px', margin: '0 auto' }}>
            Documenting extreme speech patterns across Kenya's digital platforms
          </p>
        </section>

        {/* Search & Filters */}
        <section style={{ backgroundColor: 'white', padding: '40px 20px', borderBottom: '1px solid #e2e8f0' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', gap: '15px', flexWrap: 'wrap' }}>
              <h2 style={{ margin: 0, fontSize: '20px', color: '#1e293b', fontWeight: '700' }}>
                Browse Terms
              </h2>
              <Link href="/submit">
                <button style={{
                  padding: '12px 24px',
                  backgroundColor: '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '14px',
                  whiteSpace: 'nowrap'
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
                marginBottom: '20px'
              }}
            />

            {/* Filters */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#475569', fontSize: '12px' }}>
                  Category
                </label>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #cbd5e1',
                    borderRadius: '6px',
                    fontSize: '13px',
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
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#475569', fontSize: '12px' }}>
                  Language
                </label>
                <select
                  value={filterLanguage}
                  onChange={(e) => setFilterLanguage(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #cbd5e1',
                    borderRadius: '6px',
                    fontSize: '13px',
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
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#475569', fontSize: '12px' }}>
                  Risk Level
                </label>
                <select
                  value={filterRisk}
                  onChange={(e) => setFilterRisk(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #cbd5e1',
                    borderRadius: '6px',
                    fontSize: '13px',
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

        {/* Terms Grid */}
        <section style={{ padding: '60px 20px' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            {error && (
              <div style={{
                backgroundColor: '#fee2e2',
                border: '1px solid #fca5a5',
                borderRadius: '8px',
                padding: '16px',
                marginBottom: '30px',
                color: '#991b1b'
              }}>
                Error loading terms: {error}
              </div>
            )}

            {loading ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: '#64748b' }}>
                <p style={{ fontSize: '16px' }}>Loading terms...</p>
              </div>
            ) : filteredTerms.length === 0 ? (
              <div style={{
                backgroundColor: '#ecfdf5',
                border: '2px dashed #10b981',
                borderRadius: '8px',
                padding: '40px 20px',
                textAlign: 'center'
              }}>
                <p style={{ color: '#047857', fontSize: '16px', margin: '0 0 15px 0' }}>
                  {searchTerm || filterCategory !== 'all' || filterLanguage !== 'all' || filterRisk !== 'all'
                    ? 'No terms match your filters'
                    : 'No approved terms yet'}
                </p>
                <Link href="/submit">
                  <button style={{
                    padding: '12px 24px',
                    backgroundColor: '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: '600'
                  }}>
                    Be the first to submit →
                  </button>
                </Link>
              </div>
            ) : (
              <>
                <p style={{ color: '#64748b', marginBottom: '25px', fontSize: '13px', fontWeight: '600' }}>
                  Showing {filteredTerms.length} of {terms.length} terms
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
                  {filteredTerms.map(term => (
                    <TermCard key={term.id} term={term} getCategoryColor={getCategoryColor} getRiskColor={getRiskColor} />
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

function TermCard({ term, getCategoryColor, getRiskColor }) {
  return (
    <Link href={`/lexicon/${term.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div style={{
        backgroundColor: 'white',
        border: '1px solid #cbd5e1',
        borderRadius: '10px',
        padding: '20px',
        height: '100%',
        cursor: 'pointer',
        transition: 'all 0.2s',
        display: 'flex',
        flexDirection: 'column'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.1)';
        e.currentTarget.style.transform = 'translateY(-3px)';
        e.currentTarget.style.borderColor = '#2d5a7b';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.borderColor = '#cbd5e1';
      }}>
        {/* KEL ID Badge */}
        <div style={{
          display: 'inline-block',
          backgroundColor: '#f0f4f8',
          color: '#2d5a7b',
          padding: '4px 10px',
          borderRadius: '4px',
          fontSize: '11px',
          fontWeight: '700',
          fontFamily: 'monospace',
          marginBottom: '8px',
          width: 'fit-content'
        }}>
          {term.kel_id || 'KEL-????'}
        </div>

        <div style={{ marginBottom: '12px' }}>
          <h3 style={{ margin: '0 0 6px 0', fontSize: '20px', color: '#1e293b', fontWeight: '700' }}>
            {term.term}
          </h3>
          <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8', fontWeight: '500' }}>
            {term.language}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
          <span style={{
            backgroundColor: getCategoryColor(term.category),
            color: 'white',
            padding: '4px 10px',
            borderRadius: '4px',
            fontSize: '10px',
            fontWeight: '700',
            textTransform: 'uppercase'
          }}>
            {term.category}
          </span>
          <span style={{
            backgroundColor: getRiskColor(term.risk),
            color: 'white',
            padding: '4px 10px',
            borderRadius: '4px',
            fontSize: '10px',
            fontWeight: '700'
          }}>
            {term.risk}
          </span>
        </div>

        <p style={{
          margin: '0 0 12px 0',
          fontSize: '13px',
          color: '#475569',
          lineHeight: '1.6',
          flex: 1
        }}>
          {(term.meaning || '').substring(0, 100)}...
        </p>

        <div style={{
          paddingTop: '12px',
          borderTop: '1px solid #f1f5f9',
          color: '#2d5a7b',
          fontWeight: '600',
          fontSize: '12px'
        }}>
          Read more →
        </div>
      </div>
    </Link>
  );
}