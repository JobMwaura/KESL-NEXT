'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ApprovedContributions from '@/components/ApprovedContributions';
import CommunityContributionForm from '@/components/CommunityContributionForm';
import { fetchTermById } from '@/lib/supabase';

export default function TermPage() {
  const params = useParams();
  const [term, setTerm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [votes, setVotes] = useState(0);
  const [userVote, setUserVote] = useState(0);

  useEffect(() => {
    async function loadTerm() {
      try {
        setLoading(true);
        const data = await fetchTermById(params.id);
        setTerm(data);
        setVotes(data.helpful_count || 0);
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
          <p style={{ color: '#94a3b8', fontSize: '16px' }}>Loading term...</p>
        </main>
        <Footer />
      </>
    );
  }

  if (error || !term) {
    return (
      <>
        <Header />
        <main style={{ padding: '60px 20px', textAlign: 'center', maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ color: '#1e293b', marginBottom: '20px' }}>Term not found</h2>
          <p style={{ color: '#64748b', marginBottom: '30px' }}>The term you're looking for doesn't exist or has been removed.</p>
          <a href="/lexicon" style={{ textDecoration: 'none' }}>
            <button style={{
              padding: '12px 24px',
              backgroundColor: '#2d5a7b',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '14px',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#1a3a52';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#2d5a7b';
            }}>
              ← Back to Lexicon
            </button>
          </a>
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

  return (
    <>
      <Header />
      <main style={{ minHeight: '100vh', paddingBottom: '60px' }}>
        {/* Breadcrumb Navigation */}
        <nav style={{
          padding: '20px',
          backgroundColor: '#f8fafc',
          borderBottom: '1px solid #e2e8f0',
          marginBottom: '40px'
        }}>
          <div style={{ maxWidth: '1300px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <a href="/" style={{
              textDecoration: 'none',
              color: '#2d5a7b',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'color 0.2s',
              padding: '6px 0'
            }}
            onMouseEnter={(e) => e.target.style.color = '#1a3a52'}
            onMouseLeave={(e) => e.target.style.color = '#2d5a7b'}>
              🏠 Home
            </a>
            <span style={{ color: '#cbd5e1' }}>/</span>
            <a href="/lexicon" style={{
              textDecoration: 'none',
              color: '#2d5a7b',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'color 0.2s',
              padding: '6px 0'
            }}
            onMouseEnter={(e) => e.target.style.color = '#1a3a52'}
            onMouseLeave={(e) => e.target.style.color = '#2d5a7b'}>
              📖 Lexicon
            </a>
            <span style={{ color: '#cbd5e1' }}>/</span>
            <span style={{ color: '#64748b', fontSize: '14px', fontWeight: '500' }}>
              {term.term}
            </span>
          </div>
        </nav>

        {/* Main Content */}
        <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '0 20px', display: 'grid', gridTemplateColumns: '1fr 320px', gap: '40px' }}>
          
          {/* Left Column - Main Content */}
          <div>
            {/* Header Section */}
            <div style={{
              backgroundColor: 'white',
              border: '1px solid #cbd5e1',
              borderRadius: '10px',
              padding: '40px',
              marginBottom: '40px'
            }}>
              <h1 style={{
                fontSize: '52px',
                color: '#1e293b',
                margin: '0 0 10px 0',
                fontWeight: '700'
              }}>
                {term.term}
              </h1>
              
              <p style={{
                fontSize: '16px',
                color: '#94a3b8',
                margin: '0 0 20px 0'
              }}>
                {term.language}
              </p>

              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <span style={{
                  backgroundColor: getCategoryColor(term.category),
                  color: 'white',
                  padding: '8px 14px',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: '700',
                  textTransform: 'capitalize'
                }}>
                  {term.category}
                </span>
                <span style={{
                  backgroundColor: getRiskColor(term.risk),
                  color: 'white',
                  padding: '8px 14px',
                  borderRadius: '6px',
                  fontSize: '13px',
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
              borderBottom: '2px solid #e2e8f0',
              marginBottom: '30px',
              flexWrap: 'wrap'
            }}>
              {[
                { id: 'overview', label: '📖 Overview', icon: '📖' },
                { id: 'context', label: '📚 Context', icon: '📚' },
                { id: 'community', label: '💬 Community', icon: '💬' },
                { id: 'contribute', label: '✏️ Contribute', icon: '✏️' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    padding: '16px 20px',
                    backgroundColor: 'transparent',
                    border: 'none',
                    borderBottom: activeTab === tab.id ? '3px solid #2d5a7b' : '3px solid transparent',
                    color: activeTab === tab.id ? '#2d5a7b' : '#94a3b8',
                    cursor: 'pointer',
                    fontWeight: activeTab === tab.id ? '700' : '500',
                    fontSize: '14px',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (activeTab !== tab.id) e.target.style.color = '#64748b';
                  }}
                  onMouseLeave={(e) => {
                    if (activeTab !== tab.id) e.target.style.color = '#94a3b8';
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div style={{
                backgroundColor: 'white',
                border: '1px solid #cbd5e1',
                borderRadius: '10px',
                padding: '40px'
              }}>
                <h2 style={{ fontSize: '28px', color: '#1e293b', marginBottom: '20px', fontWeight: '700' }}>
                  Definition
                </h2>
                <p style={{
                  fontSize: '16px',
                  color: '#475569',
                  lineHeight: '1.8',
                  marginBottom: '30px'
                }}>
                  {term.meaning}
                </p>

                {term.literal_gloss && (
                  <>
                    <h3 style={{ fontSize: '18px', color: '#1e293b', marginTop: '30px', marginBottom: '15px', fontWeight: '700' }}>
                      Literal Gloss
                    </h3>
                    <p style={{
                      fontSize: '15px',
                      color: '#475569',
                      lineHeight: '1.7',
                      backgroundColor: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      padding: '16px'
                    }}>
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
                border: '1px solid #cbd5e1',
                borderRadius: '10px',
                padding: '40px'
              }}>
                <h2 style={{ fontSize: '28px', color: '#1e293b', marginBottom: '20px', fontWeight: '700' }}>
                  Context & Examples
                </h2>
                
                {term.context_history ? (
                  <p style={{
                    fontSize: '16px',
                    color: '#475569',
                    lineHeight: '1.8',
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    padding: '20px'
                  }}>
                    {term.context_history}
                  </p>
                ) : (
                  <p style={{ color: '#94a3b8', fontStyle: 'italic', fontSize: '15px' }}>
                    No context documented yet. Be the first to contribute!
                  </p>
                )}

                {/* Community contributions for context */}
                <ApprovedContributions termId={params.id} type="context" />
              </div>
            )}

            {/* Community Tab */}
            {activeTab === 'community' && (
              <div>
                <ApprovedContributions termId={params.id} />
              </div>
            )}

            {/* Contribute Tab */}
            {activeTab === 'contribute' && (
              <CommunityContributionForm termId={params.id} termName={term.term} />
            )}
          </div>

          {/* Right Sidebar */}
          <aside>
            {/* Helpful Card */}
            <div style={{
              backgroundColor: 'white',
              border: '2px solid #cbd5e1',
              borderRadius: '10px',
              padding: '24px',
              marginBottom: '20px',
              position: 'sticky',
              top: '20px'
            }}>
              <p style={{
                fontSize: '14px',
                fontWeight: '700',
                color: '#1e293b',
                marginBottom: '16px',
                textAlign: 'center'
              }}>
                Is this helpful?
              </p>

              <div style={{
                display: 'flex',
                gap: '8px'
              }}>
                <button
                  onClick={() => handleVote(1)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    backgroundColor: userVote === 1 ? '#10b981' : '#f1f5f9',
                    color: userVote === 1 ? 'white' : '#64748b',
                    border: `2px solid ${userVote === 1 ? '#10b981' : '#e2e8f0'}`,
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '14px',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    if (userVote !== 1) {
                      e.target.style.backgroundColor = '#e2e8f0';
                      e.target.style.borderColor = '#cbd5e1';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (userVote !== 1) {
                      e.target.style.backgroundColor = '#f1f5f9';
                      e.target.style.borderColor = '#e2e8f0';
                    }
                  }}
                >
                  👍 Yes
                </button>
                <button
                  onClick={() => handleVote(-1)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    backgroundColor: userVote === -1 ? '#ef4444' : '#f1f5f9',
                    color: userVote === -1 ? 'white' : '#64748b',
                    border: `2px solid ${userVote === -1 ? '#ef4444' : '#e2e8f0'}`,
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '14px',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    if (userVote !== -1) {
                      e.target.style.backgroundColor = '#e2e8f0';
                      e.target.style.borderColor = '#cbd5e1';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (userVote !== -1) {
                      e.target.style.backgroundColor = '#f1f5f9';
                      e.target.style.borderColor = '#e2e8f0';
                    }
                  }}
                >
                  👎 No
                </button>
              </div>

              <p style={{
                fontSize: '12px',
                color: '#94a3b8',
                margin: '12px 0 0 0',
                textAlign: 'center'
              }}>
                {votes} found helpful
              </p>
            </div>

            {/* Metadata Card */}
            <div style={{
              backgroundColor: 'white',
              border: '1px solid #cbd5e1',
              borderRadius: '10px',
              padding: '24px'
            }}>
              <h3 style={{
                fontSize: '14px',
                fontWeight: '700',
                color: '#1e293b',
                marginBottom: '16px'
              }}>
                Metadata
              </h3>

              <div style={{ display: 'grid', gap: '14px' }}>
                <div>
                  <p style={{
                    fontSize: '11px',
                    fontWeight: '700',
                    color: '#94a3b8',
                    textTransform: 'uppercase',
                    margin: '0 0 4px 0'
                  }}>
                    Language
                  </p>
                  <p style={{
                    fontSize: '14px',
                    color: '#1e293b',
                    margin: 0,
                    fontWeight: '500'
                  }}>
                    {term.language}
                  </p>
                </div>

                <div>
                  <p style={{
                    fontSize: '11px',
                    fontWeight: '700',
                    color: '#94a3b8',
                    textTransform: 'uppercase',
                    margin: '0 0 4px 0'
                  }}>
                    Category
                  </p>
                  <p style={{
                    fontSize: '14px',
                    color: '#1e293b',
                    margin: 0,
                    fontWeight: '500'
                  }}>
                    {term.category}
                  </p>
                </div>

                <div>
                  <p style={{
                    fontSize: '11px',
                    fontWeight: '700',
                    color: '#94a3b8',
                    textTransform: 'uppercase',
                    margin: '0 0 4px 0'
                  }}>
                    Risk Level
                  </p>
                  <p style={{
                    fontSize: '14px',
                    color: '#1e293b',
                    margin: 0,
                    fontWeight: '500'
                  }}>
                    {term.risk}
                  </p>
                </div>

                <div>
                  <p style={{
                    fontSize: '11px',
                    fontWeight: '700',
                    color: '#94a3b8',
                    textTransform: 'uppercase',
                    margin: '0 0 4px 0'
                  }}>
                    Submitted
                  </p>
                  <p style={{
                    fontSize: '14px',
                    color: '#1e293b',
                    margin: 0,
                    fontWeight: '500'
                  }}>
                    {new Date(term.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </>
  );
}

// Helper functions
function getCategoryColor(cat) {
  const colors = {
    'Derogatory': '#dc2626',
    'Exclusionary': '#f97316',
    'Dangerous': '#991b1b',
    'Coded': '#7c3aed'
  };
  return colors[cat] || '#2d5a7b';
}

function getRiskColor(risk) {
  const colors = {
    'Low': '#10b981',
    'Medium': '#f59e0b',
    'High': '#ef4444'
  };
  return colors[risk] || '#94a3b8';
}