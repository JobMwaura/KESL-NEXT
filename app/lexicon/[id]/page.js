'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ContributeModal from '@/components/ContributeModal';
import { fetchTermById } from '@/lib/supabase';

export default function TermPage() {
  const params = useParams();
  const [term, setTerm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [votes, setVotes] = useState(0);
  const [userVote, setUserVote] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [expandedSections, setExpandedSections] = useState({
    harms: true,
    examples: true,
    variants: true,
    platforms: true
  });

  useEffect(() => {
    async function loadTerm() {
      try {
        setLoading(true);
        const data = await fetchTermById(params.id);
        setTerm(data);
        setVotes(data?.helpful_count || 0);
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

  const openContributionModal = (type) => {
    setModalType(type);
    setModalOpen(true);
  };

  const closeContributionModal = () => {
    setModalOpen(false);
    setModalType(null);
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleVote = (value) => {
    if (userVote === value) {
      setVotes(votes - value);
      setUserVote(0);
    } else {
      setVotes(votes - userVote + value);
      setUserVote(value);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center' }}>
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
            <p style={{ color: '#94a3b8', fontSize: '16px', margin: 0 }}>Loading term...</p>
            <style>{`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}</style>
          </div>
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
            onMouseEnter={(e) => e.target.style.backgroundColor = '#1a3a52'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#2d5a7b'}>
              Back to Lexicon
            </button>
          </a>
        </main>
        <Footer />
      </>
    );
  }

  const harms = Array.isArray(term.harms) ? term.harms : Object.values(term.harms || {}).filter(h => h);
  const examples = Array.isArray(term.examples) ? term.examples : [];
  const variants = Array.isArray(term.variants) ? term.variants : [];

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
              transition: 'color 0.2s'
            }}>
              Home
            </a>
            <span style={{ color: '#cbd5e1' }}>/</span>
            <a href="/lexicon" style={{
              textDecoration: 'none',
              color: '#2d5a7b',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'color 0.2s'
            }}>
              Lexicon
            </a>
            <span style={{ color: '#cbd5e1' }}>/</span>
            <span style={{ color: '#64748b', fontSize: '14px', fontWeight: '500' }}>
              {term.term}
            </span>
          </div>
        </nav>

        {/* Main Content */}
        <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '0 20px', display: 'grid', gridTemplateColumns: '1fr 320px', gap: '40px' }}>
          
          {/* Left Column */}
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
                margin: '0 0 20px 0',
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

              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '16px' }}>
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
                {term.confidence_level && (
                  <span style={{
                    backgroundColor: getConfidenceColor(term.confidence_level),
                    color: 'white',
                    padding: '8px 14px',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontWeight: '700'
                  }}>
                    {getConfidenceIcon(term.confidence_level)} {capitalizeFirst(term.confidence_level)}
                  </span>
                )}
              </div>
            </div>

            {/* Definition Section */}
            <div style={{
              backgroundColor: 'white',
              border: '1px solid #cbd5e1',
              borderRadius: '10px',
              padding: '40px',
              marginBottom: '40px'
            }}>
              <h2 style={{ fontSize: '20px', color: '#1e293b', margin: '0 0 20px 0', fontWeight: '700' }}>
                Definition
              </h2>
              <p style={{
                fontSize: '16px',
                color: '#475569',
                lineHeight: '1.8',
                margin: 0
              }}>
                {term.meaning}
              </p>

              {term.literal_gloss && (
                <>
                  <h3 style={{ fontSize: '16px', color: '#1e293b', marginTop: '30px', marginBottom: '12px', fontWeight: '700' }}>
                    Literal Gloss
                  </h3>
                  <p style={{
                    fontSize: '15px',
                    color: '#475569',
                    lineHeight: '1.7',
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    padding: '16px',
                    margin: 0
                  }}>
                    {term.literal_gloss}
                  </p>
                </>
              )}
            </div>

            {/* Documented Harms */}
            {harms && harms.length > 0 && (
              <div style={{ marginBottom: '40px' }}>
                <div style={{
                  backgroundColor: 'white',
                  border: '1px solid #cbd5e1',
                  borderRadius: '10px',
                  padding: '20px',
                  cursor: 'pointer'
                }}
                onClick={() => toggleSection('harms')}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#1e293b' }}>
                      Heart Documented Harms ({harms.length})
                    </h3>
                    <span style={{ color: '#94a3b8', fontSize: '16px' }}>{expandedSections.harms ? '▼' : '▶'}</span>
                  </div>
                </div>
                {expandedSections.harms && (
                  <div style={{ marginTop: '12px', backgroundColor: '#fff5f5', border: '1px solid #fed7d7', borderRadius: '8px', padding: '16px' }}>
                    {harms.map((harm, idx) => (
                      <div key={idx} style={{ marginBottom: idx < harms.length - 1 ? '16px' : 0, paddingBottom: idx < harms.length - 1 ? '16px' : 0, borderBottom: idx < harms.length - 1 ? '1px solid #fed7d7' : 'none' }}>
                        <h4 style={{ margin: '0 0 8px 0', color: '#991b1b', fontWeight: '600' }}>
                          {typeof harm === 'object' ? harm.title || harm.harm || 'Documented Harm' : harm}
                        </h4>
                        <p style={{ margin: 0, color: '#742a2a', fontSize: '14px', lineHeight: '1.5' }}>
                          {typeof harm === 'object' ? harm.description || harm.details || harm.context || JSON.stringify(harm).slice(0, 200) : harm}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Examples */}
            {examples && examples.length > 0 && (
              <div style={{ marginBottom: '40px' }}>
                <div style={{
                  backgroundColor: 'white',
                  border: '1px solid #cbd5e1',
                  borderRadius: '10px',
                  padding: '20px',
                  cursor: 'pointer'
                }}
                onClick={() => toggleSection('examples')}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#1e293b' }}>
                      Chat Bubble Examples ({examples.length})
                    </h3>
                    <span style={{ color: '#94a3b8', fontSize: '16px' }}>{expandedSections.examples ? '▼' : '▶'}</span>
                  </div>
                </div>
                {expandedSections.examples && (
                  <div style={{ marginTop: '12px', backgroundColor: '#dbeafe', border: '1px solid #93c5fd', borderRadius: '8px', padding: '16px' }}>
                    {examples.map((example, idx) => (
                      <div key={idx} style={{ marginBottom: idx < examples.length - 1 ? '16px' : 0, paddingBottom: idx < examples.length - 1 ? '16px' : 0, borderBottom: idx < examples.length - 1 ? '1px solid #93c5fd' : 'none' }}>
                        <p style={{ margin: '0 0 8px 0', color: '#1e40af', fontSize: '14px', fontStyle: 'italic', lineHeight: '1.6' }}>
                          "{typeof example === 'object' ? example.text || example.quote || example.example || JSON.stringify(example).slice(0, 150) : example}"
                        </p>
                        {typeof example === 'object' && example.source && (
                          <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '12px' }}>
                            {example.source}
                            {example.date && ` - ${example.date}`}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Variants */}
            {variants && variants.length > 0 && (
              <div style={{ marginBottom: '40px' }}>
                <div style={{
                  backgroundColor: 'white',
                  border: '1px solid #cbd5e1',
                  borderRadius: '10px',
                  padding: '20px',
                  cursor: 'pointer'
                }}
                onClick={() => toggleSection('variants')}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#1e293b' }}>
                      Memo Variants & Related ({variants.length})
                    </h3>
                    <span style={{ color: '#94a3b8', fontSize: '16px' }}>{expandedSections.variants ? '▼' : '▶'}</span>
                  </div>
                </div>
                {expandedSections.variants && (
                  <div style={{ marginTop: '12px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {variants.map((variant, idx) => (
                      <span key={idx} style={{
                        backgroundColor: '#f0f9ff',
                        border: '1px solid #bfdbfe',
                        color: '#1e40af',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        fontSize: '13px'
                      }}>
                        {typeof variant === 'object' ? variant.name || variant.term || JSON.stringify(variant).slice(0, 50) : variant}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* No Content State */}
            {(!harms || harms.length === 0) && (!examples || examples.length === 0) && (!variants || variants.length === 0) && (
              <div style={{
                backgroundColor: '#f8fafc',
                border: '2px dashed #cbd5e1',
                borderRadius: '10px',
                padding: '40px',
                textAlign: 'center',
                marginBottom: '40px'
              }}>
                <p style={{ fontSize: '16px', color: '#64748b', margin: '0 0 16px 0' }}>
                  No additional content documented yet.
                </p>
                <button
                  onClick={() => openContributionModal('example')}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '14px',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#2563eb'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#3b82f6'}
                >
                  Help improve this entry
                </button>
              </div>
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

              <div style={{ display: 'flex', gap: '8px' }}>
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
                  Thumbs Up Yes
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
                  Thumbs Down No
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
              padding: '24px',
              marginBottom: '20px'
            }}>
              <h3 style={{
                fontSize: '14px',
                fontWeight: '700',
                color: '#1e293b',
                marginBottom: '16px'
              }}>
                Information
              </h3>

              <div style={{ display: 'grid', gap: '14px' }}>
                {term.kel_id && (
                  <div>
                    <p style={{
                      fontSize: '11px',
                      fontWeight: '700',
                      color: '#94a3b8',
                      textTransform: 'uppercase',
                      margin: '0 0 4px 0'
                    }}>
                      KEL ID
                    </p>
                    <p style={{
                      fontSize: '14px',
                      color: '#2d5a7b',
                      margin: 0,
                      fontWeight: '700',
                      fontFamily: 'monospace'
                    }}>
                      {term.kel_id}
                    </p>
                  </div>
                )}

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

                {term.version_number && (
                  <div>
                    <p style={{
                      fontSize: '11px',
                      fontWeight: '700',
                      color: '#94a3b8',
                      textTransform: 'uppercase',
                      margin: '0 0 4px 0'
                    }}>
                      Version
                    </p>
                    <p style={{
                      fontSize: '14px',
                      color: '#1e293b',
                      margin: 0,
                      fontWeight: '500'
                    }}>
                      v{term.version_number}
                    </p>
                  </div>
                )}

                {term.confidence_level && (
                  <div>
                    <p style={{
                      fontSize: '11px',
                      fontWeight: '700',
                      color: '#94a3b8',
                      textTransform: 'uppercase',
                      margin: '0 0 4px 0'
                    }}>
                      Data Confidence
                    </p>
                    <p style={{
                      fontSize: '14px',
                      color: '#1e293b',
                      margin: 0,
                      fontWeight: '500'
                    }}>
                      {capitalizeFirst(term.confidence_level)}
                    </p>
                  </div>
                )}

                {term.created_at && (
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
                )}
              </div>
            </div>

            {/* Quick Contribute Card */}
            <div style={{
              backgroundColor: '#f8fafc',
              border: '2px solid #3b82f6',
              borderRadius: '10px',
              padding: '20px'
            }}>
              <h3 style={{
                fontSize: '14px',
                fontWeight: '700',
                color: '#1e293b',
                marginBottom: '12px'
              }}>
                Quick Contribute
              </h3>
              <p style={{
                fontSize: '12px',
                color: '#64748b',
                margin: '0 0 12px 0',
                lineHeight: '1.5'
              }}>
                Help improve this entry by adding examples or context.
              </p>
              <div style={{ display: 'grid', gap: '8px' }}>
                <button
                  onClick={() => openContributionModal('example')}
                  style={{
                    width: '100%',
                    padding: '10px',
                    backgroundColor: 'white',
                    color: '#0c4a6e',
                    border: '1px solid #cbd5e1',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '12px',
                    transition: 'all 0.2s',
                    textAlign: 'center'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#dbeafe';
                    e.target.style.borderColor = '#0c4a6e';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'white';
                    e.target.style.borderColor = '#cbd5e1';
                  }}
                >
                  Chat Bubble Add Example
                </button>
                <button
                  onClick={() => openContributionModal('context')}
                  style={{
                    width: '100%',
                    padding: '10px',
                    backgroundColor: 'white',
                    color: '#0c4a6e',
                    border: '1px solid #cbd5e1',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '12px',
                    transition: 'all 0.2s',
                    textAlign: 'center'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#dbeafe';
                    e.target.style.borderColor = '#0c4a6e';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'white';
                    e.target.style.borderColor = '#cbd5e1';
                  }}
                >
                  Book Add Context
                </button>
                <button
                  onClick={() => openContributionModal('harm')}
                  style={{
                    width: '100%',
                    padding: '10px',
                    backgroundColor: 'white',
                    color: '#991b1b',
                    border: '1px solid #cbd5e1',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '12px',
                    transition: 'all 0.2s',
                    textAlign: 'center'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#fee2e2';
                    e.target.style.borderColor = '#991b1b';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'white';
                    e.target.style.borderColor = '#cbd5e1';
                  }}
                >
                  Alarm Describe Harm
                </button>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* Contribution Modal */}
      <ContributeModal
        isOpen={modalOpen}
        onClose={closeContributionModal}
        termId={term?.id}
        termName={term?.term}
        type={modalType}
      />

      <Footer />
    </>
  );
}

// Helper functions
function getCategoryColor(cat) {
  const colors = {
    'derogatory': '#dc2626',
    'exclusionary': '#f97316',
    'dangerous': '#991b1b',
    'coded': '#7c3aed',
    'Derogatory': '#dc2626',
    'Exclusionary': '#f97316',
    'Dangerous': '#991b1b',
    'Coded': '#7c3aed'
  };
  return colors[cat] || '#2d5a7b';
}

function getRiskColor(risk) {
  const colors = {
    'low': '#10b981',
    'medium': '#f59e0b',
    'high': '#ef4444',
    'Low': '#10b981',
    'Medium': '#f59e0b',
    'High': '#ef4444'
  };
  return colors[risk] || '#94a3b8';
}

function getConfidenceColor(confidence) {
  const colors = {
    'low': '#f59e0b',
    'medium': '#3b82f6',
    'high': '#10b981',
    'Low': '#f59e0b',
    'Medium': '#3b82f6',
    'High': '#10b981'
  };
  return colors[confidence] || '#94a3b8';
}

function getConfidenceIcon(confidence) {
  if (!confidence) return 'Circle';
  const icons = {
    'low': 'Yellow Circle',
    'medium': 'Orange Circle',
    'high': 'Green Circle',
    'Low': 'Yellow Circle',
    'Medium': 'Orange Circle',
    'High': 'Green Circle'
  };
  return icons[confidence] || 'Circle';
}

function capitalizeFirst(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}