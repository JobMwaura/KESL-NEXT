'use client';

import { useState, useEffect, useMemo } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { fetchApprovedTerms } from '@/lib/supabase';

export default function LexiconPage() {
  const [allTerms, setAllTerms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [selectedRisk, setSelectedRisk] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [sortBy, setSortBy] = useState('recent');

  // Fetch terms from Supabase
  useEffect(() => {
    async function loadTerms() {
      try {
        setLoading(true);
        const data = await fetchApprovedTerms();
        setAllTerms(data);
      } catch (err) {
        console.error('Error loading terms:', err);
        setError('Failed to load terms');
      } finally {
        setLoading(false);
      }
    }

    loadTerms();
  }, []);

  // Get unique values for filters
  const categories = [...new Set(allTerms.map(t => t.category))].sort();
  const platforms = [...new Set(allTerms.flatMap(t => t.migration || []))].sort();
  const riskLevels = [...new Set(allTerms.map(t => t.risk))].sort();
  const languages = [...new Set(allTerms.map(t => t.language))].sort();

  // Filter and search
  const filteredTerms = useMemo(() => {
    let result = allTerms.filter(term => {
      const matchesSearch = 
        term.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
        term.meaning.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (term.tags && term.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));
      
      const matchesCategory = !selectedCategory || term.category === selectedCategory;
      const matchesPlatform = !selectedPlatform || (term.migration && term.migration.includes(selectedPlatform));
      const matchesRisk = !selectedRisk || term.risk === selectedRisk;
      const matchesLanguage = !selectedLanguage || term.language === selectedLanguage;

      return matchesSearch && matchesCategory && matchesPlatform && matchesRisk && matchesLanguage;
    });

    // Sort
    if (sortBy === 'votes') {
      result.sort((a, b) => (b.votes || 0) - (a.votes || 0));
    } else if (sortBy === 'recent') {
      result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } else if (sortBy === 'term') {
      result.sort((a, b) => a.term.localeCompare(b.term));
    }

    return result;
  }, [allTerms, searchTerm, selectedCategory, selectedPlatform, selectedRisk, selectedLanguage, sortBy]);

  const hasFilters = selectedCategory || selectedPlatform || selectedRisk || selectedLanguage || searchTerm;

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedPlatform('');
    setSelectedRisk('');
    setSelectedLanguage('');
  };

  if (loading) {
    return (
      <>
        <Header />
        <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '40px', marginBottom: '20px' }}>📚</div>
            <p style={{ fontSize: '18px', color: '#475569' }}>Loading terms...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center', color: '#ef4444' }}>
            <div style={{ fontSize: '40px', marginBottom: '20px' }}>⚠️</div>
            <p style={{ fontSize: '18px' }}>{error}</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main style={{ minHeight: '100vh', paddingBottom: '80px', backgroundColor: '#f8fafc' }}>
        {/* Hero */}
        <section style={{
          background: 'linear-gradient(135deg, #1a3a52 0%, #2d5a7b 50%, #4a7ba7 100%)',
          color: 'white',
          padding: '80px 20px',
          textAlign: 'center'
        }}>
          <h1 style={{ fontSize: '48px', marginBottom: '15px', fontWeight: 'bold' }}>Extreme Speech Lexicon</h1>
          <p style={{ fontSize: '18px', opacity: 0.9, maxWidth: '800px', margin: '0 auto', lineHeight: '1.6' }}>
            Search and explore {allTerms.length} documented terms, coded language, and extreme speech patterns in Kenya's digital spaces
          </p>
        </section>

        {/* Search & Filters */}
        <section style={{ maxWidth: '1400px', margin: '0 auto', padding: '40px 20px' }}>
          <div style={{
            backgroundColor: 'white',
            padding: '40px',
            borderRadius: '12px',
            border: '1px solid #cbd5e1',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
          }}>
            {/* Search Bar */}
            <div style={{ marginBottom: '30px' }}>
              <input
                type="text"
                placeholder="Search terms, meanings, or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '16px 16px',
                  fontSize: '16px',
                  border: '2px solid #cbd5e1',
                  borderRadius: '8px',
                  boxSizing: 'border-box',
                  transition: 'all 0.3s ease',
                  fontFamily: 'inherit'
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
            </div>

            {/* Filter Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '25px' }}>
              <FilterSelect
                label="Category"
                value={selectedCategory}
                onChange={setSelectedCategory}
                options={['All', ...categories]}
              />
              <FilterSelect
                label="Platform"
                value={selectedPlatform}
                onChange={setSelectedPlatform}
                options={['All', ...platforms]}
              />
              <FilterSelect
                label="Risk Level"
                value={selectedRisk}
                onChange={setSelectedRisk}
                options={['All', ...riskLevels]}
              />
              <FilterSelect
                label="Language"
                value={selectedLanguage}
                onChange={setSelectedLanguage}
                options={['All', ...languages]}
              />
            </div>

            {/* Sort, Results Count & Clear Filters */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px', paddingTop: '20px', borderTop: '1px solid #cbd5e1' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div>
                  <label style={{ marginRight: '10px', fontWeight: '600', color: '#1e293b', fontSize: '14px' }}>Sort:</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    style={{
                      padding: '10px 14px',
                      border: '1px solid #cbd5e1',
                      borderRadius: '6px',
                      fontSize: '14px',
                      backgroundColor: 'white',
                      cursor: 'pointer',
                      fontWeight: '500'
                    }}
                  >
                    <option value="recent">Most Recent</option>
                    <option value="votes">Most Useful</option>
                    <option value="term">A-Z</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                {hasFilters && (
                  <button
                    onClick={handleClearFilters}
                    style={{
                      padding: '10px 16px',
                      backgroundColor: '#f1f5f9',
                      color: '#475569',
                      border: '1px solid #cbd5e1',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '500',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#e2e8f0';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = '#f1f5f9';
                    }}
                  >
                    Clear Filters ✕
                  </button>
                )}
                <div style={{ color: '#475569', fontSize: '14px', fontWeight: '500' }}>
                  <span style={{ color: '#2d5a7b', fontWeight: 'bold', fontSize: '16px' }}>{filteredTerms.length}</span> term{filteredTerms.length !== 1 ? 's' : ''}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Results */}
        <section style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 20px 60px' }}>
          {filteredTerms.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '80px 40px',
              backgroundColor: 'white',
              borderRadius: '12px',
              border: '1px solid #cbd5e1',
              marginTop: '20px'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '20px' }}>🔍</div>
              <p style={{ fontSize: '18px', color: '#1e293b', marginBottom: '10px', fontWeight: '600' }}>No terms found</p>
              <p style={{ fontSize: '14px', color: '#475569' }}>Try adjusting your search or filters</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '16px', marginTop: '20px' }}>
              {filteredTerms.map((term) => (
                <TermCard key={term.id} term={term} />
              ))}
            </div>
          )}
        </section>

        {/* Info Banner */}
        <section style={{
          background: '#fef3c7',
          borderLeft: '4px solid #f59e0b',
          padding: '20px',
          maxWidth: '1400px',
          margin: '0 auto 40px',
          borderRadius: '8px'
        }}>
          <p style={{ margin: 0, color: '#92400e', fontSize: '14px', lineHeight: '1.6' }}>
            <strong>⚠️ Research Content:</strong> This lexicon contains redacted references to abusive and extreme speech documented for research purposes. The terms and examples here are presented in an educational context to understand harmful speech patterns in Kenya's digital spaces. Viewer discretion is advised.
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}

function FilterSelect({ label, value, onChange, options }) {
  return (
    <div>
      <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px', color: '#1e293b' }}>
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value === 'All' ? '' : e.target.value)}
        style={{
          width: '100%',
          padding: '12px 14px',
          border: '1px solid #cbd5e1',
          borderRadius: '6px',
          fontSize: '14px',
          boxSizing: 'border-box',
          backgroundColor: 'white',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          fontWeight: '500'
        }}
        onFocus={(e) => {
          e.target.style.borderColor = '#2d5a7b';
          e.target.style.boxShadow = '0 0 0 3px rgba(45, 90, 123, 0.1)';
        }}
        onBlur={(e) => {
          e.target.style.borderColor = '#cbd5e1';
          e.target.style.boxShadow = 'none';
        }}
      >
        {options.map(opt => (
          <option key={opt} value={opt === 'All' ? '' : opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
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
      'High': '#ef4444'
    };
    return colors[risk] || '#94a3b8';
  };

  return (
    <a href={`/lexicon/${term.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div style={{
        border: '1px solid #cbd5e1',
        borderRadius: '10px',
        padding: '24px',
        backgroundColor: 'white',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.08)';
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.borderColor = '#2d5a7b';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)';
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.borderColor = '#cbd5e1';
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <h3 style={{ margin: '0 0 6px 0', fontSize: '22px', color: '#1e293b', fontWeight: '700' }}>
              {term.term}
            </h3>
            <p style={{ margin: 0, color: '#94a3b8', fontSize: '13px', fontWeight: '500' }}>
              {term.language} • {term.literal_gloss}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            <Badge text={term.category} color={getCategoryColor(term.category)} />
            <Badge text={term.risk} color={getRiskColor(term.risk)} />
          </div>
        </div>

        {/* Meaning */}
        <p style={{ margin: '16px 0', fontSize: '14px', color: '#475569', lineHeight: '1.6', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {term.meaning}
        </p>

        {/* Tags */}
        {term.tags && term.tags.length > 0 && (
          <div style={{ marginBottom: '16px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {term.tags.slice(0, 4).map(tag => (
              <span key={tag} style={{
                backgroundColor: '#f1f5f9',
                padding: '4px 10px',
                borderRadius: '14px',
                fontSize: '12px',
                color: '#475569',
                fontWeight: '500',
                border: '1px solid #cbd5e1'
              }}>
                #{tag}
              </span>
            ))}
            {term.tags.length > 4 && (
              <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '500' }}>
                +{term.tags.length - 4} more
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', color: '#94a3b8', borderTop: '1px solid #cbd5e1', paddingTop: '16px' }}>
          <div style={{ display: 'flex', gap: '24px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>👍 <span style={{ color: '#475569', fontWeight: '600' }}>{term.votes || 0}</span> useful</span>
          </div>
          <span style={{ color: '#2d5a7b', fontWeight: '700' }}>View Details →</span>
        </div>
      </div>
    </a>
  );
}

function Badge({ text, color }) {
  return (
    <span style={{
      backgroundColor: color,
      color: 'white',
      padding: '5px 11px',
      borderRadius: '5px',
      fontSize: '12px',
      fontWeight: '700',
      whiteSpace: 'nowrap',
      boxShadow: `0 2px 4px ${color}40`
    }}>
      {text}
    </span>
  );
}