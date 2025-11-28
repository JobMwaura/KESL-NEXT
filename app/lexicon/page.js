'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { fetchTermById } from '@/lib/supabase';
import CommunityContributionForm from '@/components/CommunityContributionForm';

export default function TermPage() {
  const params = useParams();
  const [term, setTerm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [votes, setVotes] = useState(0);
  const [userVote, setUserVote] = useState(0);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    async function loadTerm() {
      try {
        setLoading(true);
        const data = await fetchTermById(params.id);
        setTerm(data);
        setVotes(data.votes || 0);
      } catch (err) {
        console.error('Error loading term:', err);
        setError('Failed to load term');
      } finally {
        setLoading(false);
      }
    }

    if (params.id) {
      loadTerm();
    }
  }, [params.id]);

  if (loading) {
    return (
      <>
        <Header />
        <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p>Loading...</p>
        </main>
        <Footer />
      </>
    );
  }

  if (error || !term) {
    return (
      <>
        <Header />
        <main style={{ padding: '60px 20px', textAlign: 'center' }}>
          <h2>Term not found</h2>
          <p><a href="/lexicon" style={{ color: '#2d5a7b' }}>← Back to Lexicon</a></p>
        </main>
        <Footer />
      </>
    );
  }

  const handleVote = (value) => {
    if (userVote === value) {
      setVotes(votes - value);
      setUserVote(0);
    } else {
      setVotes(votes - userVote + value);
      setUserVote(value);
    }
  };

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

  const migrationArray = Array.isArray(term.migration) ? term.migration : [];

  return (
    <>
      <Header />
      <main style={{ minHeight: '100vh', paddingBottom: '80px', backgroundColor: '#f8fafc' }}>
        {/* Breadcrumb */}
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '20px', color: '#94a3b8', fontSize: '14px' }}>
          <a href="/lexicon" style={{ color: '#2d5a7b', textDecoration: 'none' }}>Lexicon</a> / {term.term}
        </div>

        {/* Main Content */}
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 20px 40px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '30px' }}>
            {/* Main Column */}
            <div>
              {/* Header */}
              <div style={{
                backgroundColor: 'white',
                borderRadius: '10px',
                padding: '40px',
                marginBottom: '30px',
                border: '1px solid #cbd5e1'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '20px' }}>
                  <div style={{ flex: 1 }}>
                    <h1 style={{ margin: '0 0 10px 0', fontSize: '48px', color: '#1e293b', fontWeight: '700' }}>
                      {term.term}
                    </h1>
                    <p style={{ margin: 0, color: '#94a3b8', fontSize: '14px' }}>
                      {term.language}
                    </p>
                  </div>
                </div>

                {/* Tags */}
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <span style={{
                    backgroundColor: getCategoryColor(term.category),
                    color: 'white',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: '700'
                  }}>
                    {term.category}
                  </span>
                  <span style={{
                    backgroundColor: getRiskColor(term.risk),
                    color: 'white',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: '700'
                  }}>
                    Risk: {term.risk}
                  </span>
                </div>
              </div>

              {/* Tabs */}
              <div style={{
                display: 'flex',
                gap: '0',
                borderBottom: '2px solid #cbd5e1',
                marginBottom: '30px'
              }}>
                {['overview', 'context', 'contribute'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    style={{
                      padding: '16px 24px',
                      backgroundColor: 'transparent',
                      border: 'none',
                      borderBottom: activeTab === tab ? '3px solid #2d5a7b' : 'none',
                      cursor: 'pointer',
                      color: activeTab === tab ? '#1e293b' : '#94a3b8',
                      fontWeight: activeTab === tab ? '700' : '600',
                      fontSize: '14px',
                      transition: 'all 0.3s ease',
                      textTransform: 'capitalize'
                    }}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div style={{
                  backgroundColor: 'white',
                  borderRadius: '10px',
                  padding: '40px',
                  border: '1px solid #cbd5e1',
                  marginBottom: '30px'
                }}>
                  <h2 style={{ margin: '0 0 20px 0', fontSize: '24px', color: '#1e293b' }}>Definition</h2>
                  <p style={{ fontSize: '16px', lineHeight: '1.8', color: '#475569', margin: 0 }}>
                    {term.meaning}
                  </p>

                  {term.literal_gloss && (
                    <>
                      <h3 style={{ margin: '30px 0 10px 0', fontSize: '16px', color: '#1e293b' }}>Literal Gloss</h3>
                      <p style={{ fontSize: '14px', color: '#475569', margin: 0 }}>
                        {term.literal_gloss}
                      </p>
                    </>
                  )}
                </div>
              )}

              {/* Context Tab */}
              {activeTab === 'context' && (
                <div style={{
                  backgroundColor: 'white',
                  borderRadius: '10px',
                  padding: '40px',
                  border: '1px solid #cbd5e1',
                  marginBottom: '30px'
                }}>
                  <h2 style={{ margin: '0 0 20px 0', fontSize: '24px', color: '#1e293b' }}>Context & Examples</h2>

                  {term.examples && term.examples.length > 0 && (
                    <div style={{ marginBottom: '30px' }}>
                      <h3 style={{ margin: '0 0 15px 0', fontSize: '16px', color: '#1e293b' }}>Examples</h3>
                      {term.examples.map((ex, idx) => (
                        <div key={idx} style={{
                          backgroundColor: '#f8fafc',
                          border: '1px solid #e2e8f0',
                          borderRadius: '6px',
                          padding: '16px',
                          marginBottom: '12px'
                        }}>
                          <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#94a3b8', fontWeight: '600' }}>
                            {ex.platform} • {ex.date ? new Date(ex.date).toLocaleDateString() : 'Date unknown'}
                          </p>
                          <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#475569', fontStyle: 'italic' }}>
                            "{ex.short_quote}"
                          </p>
                          {ex.context && (
                            <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>
                              Context: {ex.context}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {migrationArray.length > 0 && (
                    <div>
                      <h3 style={{ margin: '0 0 15px 0', fontSize: '16px', color: '#1e293b' }}>Platform Migration</h3>
                      <p style={{ fontSize: '14px', color: '#475569', marginBottom: '12px' }}>
                        This term appears across these platforms:
                      </p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {migrationArray.map((platform, idx) => (
                          <span key={idx} style={{
                            backgroundColor: '#e2e8f0',
                            color: '#1e293b',
                            padding: '6px 12px',
                            borderRadius: '20px',
                            fontSize: '13px',
                            fontWeight: '600'
                          }}>
                            {platform}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Contribute Tab */}
              {activeTab === 'contribute' && (
                <div style={{
                  backgroundColor: 'white',
                  borderRadius: '10px',
                  padding: '40px',
                  border: '1px solid #cbd5e1',
                  marginBottom: '30px'
                }}>
                  <h2 style={{ margin: '0 0 20px 0', fontSize: '24px', color: '#1e293b' }}>Add More Examples</h2>
                  <p style={{ color: '#475569', marginBottom: '20px' }}>
                    Help us document more examples of this term across platforms.
                  </p>
                  <CommunityContributionForm relatedTermId={term.id} relatedTermName={term.term} />
                </div>
              )}
            </div>

            {/* Sidebar - ULTRA COMPACT */}
            <aside style={{ display: 'grid', gap: '20px', alignContent: 'start' }}>
              {/* HELPFUL CARD - NO EXTRA SPACE */}
              <div style={{
                backgroundColor: 'white',
                border: '1px solid #cbd5e1',
                borderRadius: '10px',
                padding: '10px',
                position: 'sticky',
                top: '20px'
              }}>
                <h4 style={{ margin: '0 0 8px 0', color: '#1e293b', textAlign: 'center', fontSize: '12px', fontWeight: '600' }}>
                  Is this helpful?
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginBottom: '8px' }}>
                  <button
                    onClick={() => handleVote(1)}
                    style={{
                      padding: '6px',
                      backgroundColor: userVote === 1 ? '#10b981' : '#f1f5f9',
                      color: userVote === 1 ? 'white' : '#475569',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontWeight: '600',
                      fontSize: '11px',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      if (userVote !== 1) e.target.style.backgroundColor = '#e2e8f0';
                    }}
                    onMouseLeave={(e) => {
                      if (userVote !== 1) e.target.style.backgroundColor = '#f1f5f9';
                    }}
                  >
                    👍 Yes
                  </button>
                  <button
                    onClick={() => handleVote(-1)}
                    style={{
                      padding: '6px',
                      backgroundColor: userVote === -1 ? '#ef4444' : '#f1f5f9',
                      color: userVote === -1 ? 'white' : '#475569',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontWeight: '600',
                      fontSize: '11px',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      if (userVote !== -1) e.target.style.backgroundColor = '#e2e8f0';
                    }}
                    onMouseLeave={(e) => {
                      if (userVote !== -1) e.target.style.backgroundColor = '#f1f5f9';
                    }}
                  >
                    👎 No
                  </button>
                </div>
                <div style={{ textAlign: 'center', fontSize: '11px', color: '#94a3b8', margin: 0 }}>
                  <strong style={{ color: '#475569', fontSize: '13px' }}>{votes}</strong> found this helpful
                </div>
              </div>

              {/* Metadata */}
              <div style={{
                backgroundColor: 'white',
                border: '1px solid #cbd5e1',
                borderRadius: '10px',
                padding: '15px',
                position: 'sticky',
                top: '220px'
              }}>
                <h4 style={{ margin: '0 0 12px 0', color: '#1e293b', fontSize: '12px', fontWeight: '700' }}>
                  Metadata
                </h4>
                <div style={{ display: 'grid', gap: '10px', fontSize: '12px' }}>
                  <div>
                    <p style={{ margin: '0 0 4px 0', color: '#94a3b8', fontWeight: '600' }}>Submitted</p>
                    <p style={{ margin: 0, color: '#475569', fontSize: '11px' }}>
                      {term.created_at ? new Date(term.created_at).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                  {term.status && (
                    <div>
                      <p style={{ margin: '0 0 4px 0', color: '#94a3b8', fontWeight: '600' }}>Status</p>
                      <p style={{ margin: 0, color: '#475569', fontSize: '11px', textTransform: 'capitalize' }}>
                        {term.status}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}