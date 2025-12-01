'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ApprovedContributions from '@/components/ApprovedContributions';
import CommunityContributionForm from '@/components/CommunityContributionForm';
import ContributeModal from '@/components/ContributeModal';
import ExampleSection from '@/components/ExampleSection';
import HarmSection from '@/components/HarmSection';
import PlatformMigration from '@/components/PlatformMigration';
import VariantsSection from '@/components/VariantsSection';
import VersionBadge from '@/components/VersionBadge';
import { fetchTermById } from '@/lib/supabase';

export default function TermPage() {
  const params = useParams();
  const router = useRouter();
  const [term, setTerm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [votes, setVotes] = useState(0);
  const [userVote, setUserVote] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);

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

  const openContributionModal = (type) => {
    setModalType(type);
    setModalOpen(true);
  };

  const closeContributionModal = () => {
    setModalOpen(false);
    setModalType(null);
  };

  if (loading) {
    return (
      <>
        <Header />
        <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{
            textAlign: 'center'
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: '20px', marginBottom: '20px' }}>
                <div style={{ flex: 1 }}>
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
                </div>
                {/* Version Badge - PHASE 6 */}
                <VersionBadge 
                  versionNumber={term.version_number || 1}
                  termId={term.id}
                  size="medium"
                />
              </div>

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
                {term.confidence_level && (
                  <span style={{
                    backgroundColor: getConfidenceColor(term.confidence_level),
                    color: 'white',
                    padding: '8px 14px',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontWeight: '700'
                  }}>
                    {getConfidenceIcon(term.confidence_level)} Confidence
                  </span>
                )}
              </div>

              {/* View History Button - PHASE 6 */}
              <button
                onClick={() => router.push(`/lexicon/${term.id}/versions`)}
                style={{
                  marginTop: '16px',
                  padding: '10px 16px',
                  backgroundColor: '#dbeafe',
                  color: '#0c4a6e',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '13px',
                  transition: 'all 0.2s',
                  display: 'inline-block'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#bfdbfe';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#dbeafe';
                }}
              >
                📅 View Version History
              </button>
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
                display: 'flex',
                flexDirection: 'column',
                gap: '30px'
              }}>
                {/* Definition Section */}
                <div style={{
                  backgroundColor: 'white',
                  border: '1px solid #cbd5e1',
                  borderRadius: '10px',
                  padding: '40px'
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '20px'
                  }}>
                    <h2 style={{ fontSize: '28px', color: '#1e293b', margin: 0, fontWeight: '700' }}>
                      Definition
                    </h2>
                  </div>
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

                {/* Harms Section */}
                {term.harms && Object.values(term.harms).some(v => v) && (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#1e293b' }}>💔 Documented Harms</h3>
                      <button
                        onClick={() => openContributionModal('harm')}
                        style={{
                          padding: '8px 16px',
                          backgroundColor: '#fee2e2',
                          color: '#991b1b',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontWeight: '600',
                          fontSize: '13px',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = '#fecaca';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = '#fee2e2';
                        }}
                      >
                        + Add Harm
                      </button>
                    </div>
                    <HarmSection 
                      harms={term.harms}
                      harm_details={term.harm_details}
                    />
                  </div>
                )}

                {/* Platform Migration Section */}
                {term.examples && term.examples.length > 0 && (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#1e293b' }}>🌐 Platforms & Migration</h3>
                      <button
                        onClick={() => openContributionModal('example')}
                        style={{
                          padding: '8px 16px',
                          backgroundColor: '#dbeafe',
                          color: '#0c4a6e',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontWeight: '600',
                          fontSize: '13px',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = '#bfdbfe';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = '#dbeafe';
                        }}
                      >
                        + Add Example
                      </button>
                    </div>
                    <PlatformMigration 
                      examples={term.examples}
                      migration={term.migration}
                    />
                  </div>
                )}

                {/* Variants Section */}
                {(term.variants?.length > 0 || term.related_terms?.length > 0) && (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#1e293b' }}>🔤 Variants & Related</h3>
                      <button
                        onClick={() => openContributionModal('relation')}
                        style={{
                          padding: '8px 16px',
                          backgroundColor: '#e0e7ff',
                          color: '#3730a3',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontWeight: '600',
                          fontSize: '13px',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = '#c7d2e8';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = '#e0e7ff';
                        }}
                      >
                        + Add Related
                      </button>
                    </div>
                    <VariantsSection 
                      variants={term.variants}
                      related_terms={term.related_terms}
                      currentTermId={term.id}
                    />
                  </div>
                )}

                {/* Examples Section */}
                {term.examples && term.examples.length > 0 && (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#1e293b' }}>💬 Examples</h3>
                    </div>
                    <ExampleSection 
                      examples={term.examples}
                      termId={term.id}
                    />
                  </div>
                )}

                {/* Empty State - No Examples */}
                {(!term.examples || term.examples.length === 0) && (
                  <div style={{
                    backgroundColor: '#f8fafc',
                    border: '2px dashed #cbd5e1',
                    borderRadius: '10px',
                    padding: '40px',
                    textAlign: 'center'
                  }}>
                    <p style={{
                      fontSize: '16px',
                      color: '#64748b',
                      margin: '0 0 16px 0'
                    }}>
                      No examples documented yet. Help us by adding one!
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
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = '#2563eb';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = '#3b82f6';
                      }}
                    >
                      💬 Add First Example
                    </button>
                  </div>
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
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '20px'
                }}>
                  <h2 style={{ fontSize: '28px', color: '#1e293b', margin: 0, fontWeight: '700' }}>
                    Context & Examples
                  </h2>
                  <button
                    onClick={() => openContributionModal('context')}
                    style={{
                      padding: '10px 18px',
                      backgroundColor: '#dbeafe',
                      color: '#0c4a6e',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontWeight: '600',
                      fontSize: '13px',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#bfdbfe';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = '#dbeafe';
                    }}
                  >
                    + Add Context
                  </button>
                </div>
                
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
                <div style={{ marginTop: '30px' }}>
                  <ApprovedContributions termId={params.id} type="context" />
                </div>
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
                    Citation ID
                  </p>
                  <p style={{
                    fontSize: '16px',
                    color: '#2d5a7b',
                    margin: 0,
                    fontWeight: '700',
                    fontFamily: 'monospace',
                    letterSpacing: '0.5px'
                  }}>
                    {term.kel_id || 'KEL-0001'}
                  </p>
                  <p style={{
                    fontSize: '10px',
                    color: '#94a3b8',
                    margin: '4px 0 0 0',
                    fontStyle: 'italic'
                  }}>
                    Use this ID to cite
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

                {/* Version Info - PHASE 6 */}
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
                    v{term.version_number || 1}
                  </p>
                  <button
                    onClick={() => router.push(`/lexicon/${term.id}/versions`)}
                    style={{
                      marginTop: '8px',
                      fontSize: '12px',
                      color: '#0284c7',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontWeight: '600',
                      padding: '0',
                      textDecoration: 'underline'
                    }}
                  >
                    View all versions →
                  </button>
                </div>

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
                      {getConfidenceIcon(term.confidence_level)} {capitalizeFirst(term.confidence_level)}
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

            {/* Quick Contribute Card */}
            <div style={{
              backgroundColor: '#f8fafc',
              border: '2px solid #3b82f6',
              borderRadius: '10px',
              padding: '20px',
              marginTop: '20px'
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
                Help improve this entry by adding examples, context, or related terms.
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
                  💬 Add Example
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
                  📚 Add Context
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
                  💔 Describe Harm
                </button>
                <button
                  onClick={() => openContributionModal('relation')}
                  style={{
                    width: '100%',
                    padding: '10px',
                    backgroundColor: 'white',
                    color: '#3730a3',
                    border: '1px solid #cbd5e1',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '12px',
                    transition: 'all 0.2s',
                    textAlign: 'center'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#e0e7ff';
                    e.target.style.borderColor = '#3730a3';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'white';
                    e.target.style.borderColor = '#cbd5e1';
                  }}
                >
                  🔗 Add Related Term
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
  const icons = {
    'low': '🟡',
    'medium': '🟠',
    'high': '🟢',
    'Low': '🟡',
    'Medium': '🟠',
    'High': '🟢'
  };
  return icons[confidence] || '❓';
}

function capitalizeFirst(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}