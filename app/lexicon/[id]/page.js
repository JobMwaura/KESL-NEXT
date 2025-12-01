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
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedContext, setExpandedContext] = useState(false);
  const [expandedPlatformDynamics, setExpandedPlatformDynamics] = useState(false);
  const [votes, setVotes] = useState(0);
  const [userVote, setUserVote] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);

  useEffect(() => {
    async function loadTerm() {
      try {
        setLoading(true);
        const data = await fetchTermById(params.id);
        if (!data) {
          setError('Term not found');
          return;
        }
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
            <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
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
            }}>
              Back to Lexicon
            </button>
          </a>
        </main>
        <Footer />
      </>
    );
  }

  // Safe data extraction
  const examples = Array.isArray(term.examples_detailed) ? term.examples_detailed : 
                   Array.isArray(term.examples) ? term.examples : [];
  const harms = Array.isArray(term.harms_detailed) ? term.harms_detailed : 
                Object.entries(term.harms || {}).filter(([, v]) => v).map(([k]) => ({ type: k }));
  const variants = Array.isArray(term.variants) ? term.variants : [];
  const platformDynamics = term.platform_dynamics || term.migration_path;

  return (
    <>
      <Header />
      <main style={{ minHeight: '100vh', paddingBottom: '60px', backgroundColor: '#f8fafc' }}>
        {/* Breadcrumb */}
        <nav style={{
          padding: '20px',
          backgroundColor: 'white',
          borderBottom: '1px solid #e2e8f0',
          marginBottom: '30px'
        }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <a href="/" style={{ textDecoration: 'none', color: '#2d5a7b', fontSize: '14px', fontWeight: '500' }}>Home</a>
            <span style={{ color: '#cbd5e1' }}>/</span>
            <a href="/lexicon" style={{ textDecoration: 'none', color: '#2d5a7b', fontSize: '14px', fontWeight: '500' }}>Lexicon</a>
            <span style={{ color: '#cbd5e1' }}>/</span>
            <span style={{ color: '#64748b', fontSize: '14px', fontWeight: '500' }}>{term.term}</span>
          </div>
        </nav>

        {/* Main Content Grid */}
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 20px', display: 'grid', gridTemplateColumns: '1fr 320px', gap: '30px' }}>
          
          {/* LEFT COLUMN - Main Content */}
          <div>
            {/* Header Card */}
            <div style={{
              backgroundColor: 'white',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '40px',
              marginBottom: '30px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
            }}>
              <h1 style={{
                fontSize: '48px',
                color: '#1e293b',
                margin: '0 0 12px 0',
                fontWeight: '700'
              }}>
                {term.term}
              </h1>
              
              <p style={{
                fontSize: '16px',
                color: '#94a3b8',
                margin: '0 0 20px 0',
                fontWeight: '500'
              }}>
                {term.language}
              </p>

              {/* Badges */}
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px' }}>
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
                    {capitalizeFirst(term.confidence_level)} Confidence
                  </span>
                )}
              </div>

              {/* Literal Gloss */}
              {term.literal_gloss && (
                <div style={{
                  backgroundColor: '#f0f9ff',
                  border: '2px solid #0284c7',
                  borderRadius: '8px',
                  padding: '16px',
                  color: '#0c4a6e',
                  fontSize: '15px'
                }}>
                  <strong style={{ color: '#0c4a6e' }}>Literal Gloss:</strong>
                  <p style={{ margin: '8px 0 0 0', lineHeight: '1.6' }}>
                    {term.literal_gloss}
                  </p>
                </div>
              )}
            </div>

            {/* Tabs */}
            <div style={{
              display: 'flex',
              gap: '0',
              borderBottom: '2px solid #e2e8f0',
              marginBottom: '30px',
              backgroundColor: 'white',
              borderRadius: '12px 12px 0 0',
              overflow: 'hidden'
            }}>
              {[
                { id: 'overview', label: 'Overview', icon: '📖' },
                { id: 'platforms', label: 'Platforms', icon: '🌐' },
                { id: 'examples', label: 'Examples', icon: '💬' },
                { id: 'harms', label: 'Harms', icon: '⚠️' },
                { id: 'variants', label: 'Variants', icon: '🔗' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    flex: 1,
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
                  {tab.icon} {tab.label}
                </button>
              ))}
            </div>

            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {/* Definition Section */}
                <div style={{
                  backgroundColor: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '24px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                }}>
                  <h2 style={{ fontSize: '18px', color: '#1e293b', margin: '0 0 12px 0', fontWeight: '700' }}>
                    📖 Definition
                  </h2>
                  <p style={{
                    fontSize: '16px',
                    color: '#475569',
                    lineHeight: '1.8',
                    margin: 0
                  }}>
                    {term.meaning}
                  </p>
                </div>

                {/* Context - Summary Paragraph First */}
                {term.context_full && (
                  <div style={{
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '24px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                  }}>
                    <h3 style={{ fontSize: '16px', color: '#1e293b', margin: '0 0 16px 0', fontWeight: '700' }}>
                      🎯 Context & Why It's Derogatory Here
                    </h3>
                    
                    {/* One Paragraph Summary */}
                    <div style={{
                      backgroundColor: '#f0f9ff',
                      border: '1px solid #bfdbfe',
                      borderRadius: '8px',
                      padding: '16px',
                      marginBottom: '16px',
                      color: '#1e40af',
                      fontSize: '15px',
                      lineHeight: '1.7'
                    }}>
                      <strong style={{ display: 'block', marginBottom: '8px' }}>Quick Summary:</strong>
                      {/* Extract first paragraph or first 300 chars */}
                      {term.context_full.split('\n')[0] || term.context_full.substring(0, 300)}...
                    </div>

                    {/* Detailed Context - Expandable */}
                    <div>
                      <button
                        onClick={() => setExpandedContext(!expandedContext)}
                        style={{
                          backgroundColor: 'transparent',
                          border: 'none',
                          color: '#0284c7',
                          padding: 0,
                          cursor: 'pointer',
                          fontSize: '14px',
                          fontWeight: '600',
                          marginBottom: '12px'
                        }}
                      >
                        {expandedContext ? '▼ Hide' : '▶ Show'} Full Context
                      </button>

                      {expandedContext && (
                        <div style={{
                          color: '#475569',
                          lineHeight: '1.8',
                          fontSize: '15px',
                          whiteSpace: 'pre-wrap',
                          wordWrap: 'break-word',
                          backgroundColor: '#f8fafc',
                          padding: '16px',
                          borderRadius: '8px'
                        }}>
                          {term.context_full}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* PLATFORM DYNAMICS TAB */}
            {activeTab === 'platforms' && (
              <div style={{
                backgroundColor: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
              }}>
                <div style={{ padding: '24px' }}>
                  <h2 style={{ margin: '0 0 24px 0', fontSize: '18px', fontWeight: '700', color: '#1e293b' }}>
                    🌐 Platform Dynamics & Migration Patterns
                  </h2>

                  {platformDynamics ? (
                    <div>
                      {/* Summary First */}
                      <div style={{
                        backgroundColor: '#f0f9ff',
                        border: '1px solid #bfdbfe',
                        borderRadius: '8px',
                        padding: '16px',
                        marginBottom: '24px',
                        color: '#1e40af',
                        fontSize: '15px',
                        lineHeight: '1.7'
                      }}>
                        <strong>How This Term Spreads Across Platforms:</strong>
                        <p style={{ margin: '12px 0 0 0' }}>
                          This term emerges on mainstream platforms (X/Twitter) with high engagement, then migrates to smaller, less-moderated spaces (Reddit, Telegram, KenyaTalk) where it intensifies and becomes more extreme. We track this migration to understand how discourse degrades as it moves from public to private spaces.
                        </p>
                      </div>

                      {/* Detailed Dynamics - Expandable */}
                      <button
                        onClick={() => setExpandedPlatformDynamics(!expandedPlatformDynamics)}
                        style={{
                          backgroundColor: 'transparent',
                          border: 'none',
                          color: '#0284c7',
                          padding: 0,
                          cursor: 'pointer',
                          fontSize: '14px',
                          fontWeight: '600',
                          marginBottom: '16px'
                        }}
                      >
                        {expandedPlatformDynamics ? '▼ Hide' : '▶ Show'} Detailed Platform Analysis
                      </button>

                      {expandedPlatformDynamics && (
                        <div style={{
                          color: '#475569',
                          lineHeight: '1.8',
                          fontSize: '15px',
                          whiteSpace: 'pre-wrap',
                          wordWrap: 'break-word',
                          backgroundColor: '#f8fafc',
                          padding: '16px',
                          borderRadius: '8px'
                        }}>
                          {typeof platformDynamics === 'string' ? platformDynamics : JSON.stringify(platformDynamics, null, 2)}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div style={{
                      backgroundColor: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      padding: '24px',
                      textAlign: 'center',
                      color: '#64748b'
                    }}>
                      <p style={{ margin: 0 }}>Platform dynamics analysis not yet documented.</p>
                      <p style={{ margin: '8px 0 0 0', fontSize: '13px' }}>
                        This would track how the term migrates from X → Reddit → Telegram → KenyaTalk, with discourse intensifying at each step.
                      </p>
                    </div>
                  )}

                  {/* Platform Distribution */}
                  {examples && examples.length > 0 && (
                    <div style={{ marginTop: '32px' }}>
                      <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#1e293b', marginBottom: '16px' }}>
                        Examples Distribution by Platform
                      </h3>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px' }}>
                        {getPlatformStats(examples).map((stat, idx) => (
                          <div key={idx} style={{
                            backgroundColor: '#f1f5f9',
                            border: `2px solid ${getPlatformColor(stat.platform)}`,
                            borderRadius: '8px',
                            padding: '16px',
                            textAlign: 'center'
                          }}>
                            <div style={{
                              fontSize: '24px',
                              fontWeight: '700',
                              color: getPlatformColor(stat.platform),
                              marginBottom: '8px'
                            }}>
                              {stat.count}
                            </div>
                            <div style={{
                              fontSize: '13px',
                              fontWeight: '600',
                              color: '#1e293b'
                            }}>
                              {stat.platform_name || stat.platform}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* EXAMPLES TAB */}
            {activeTab === 'examples' && (
              <div style={{
                backgroundColor: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
              }}>
                <div style={{ padding: '24px' }}>
                  <h2 style={{ margin: '0 0 24px 0', fontSize: '18px', fontWeight: '700', color: '#1e293b' }}>
                    💬 Examples from the Field ({examples.length})
                  </h2>
                  {examples.length === 0 ? (
                    <p style={{ color: '#94a3b8', margin: 0 }}>No examples documented yet.</p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                      {examples.map((example, idx) => (
                        <div key={idx} style={{
                          paddingTop: idx > 0 ? '32px' : 0,
                          borderTop: idx > 0 ? '2px solid #e2e8f0' : 'none'
                        }}>
                          {/* Platform Badge & Metadata */}
                          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap' }}>
                            {example.platform && (
                              <span style={{
                                backgroundColor: getPlatformColor(example.platform),
                                color: 'white',
                                padding: '6px 12px',
                                borderRadius: '6px',
                                fontSize: '12px',
                                fontWeight: '700',
                                textTransform: 'capitalize'
                              }}>
                                {example.platform_name || example.platform}
                              </span>
                            )}
                            {example.date && (
                              <span style={{ color: '#64748b', fontSize: '13px', fontWeight: '500' }}>
                                {new Date(example.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                              </span>
                            )}
                          </div>

                          {/* Engagement Metrics */}
                          {(example.engagement_metrics || example.likes || example.comments || example.reposts) && (
                            <div style={{
                              display: 'flex',
                              gap: '16px',
                              marginBottom: '16px',
                              padding: '12px 16px',
                              backgroundColor: '#f1f5f9',
                              borderRadius: '8px',
                              flexWrap: 'wrap',
                              fontSize: '13px',
                              color: '#64748b'
                            }}>
                              {(example.engagement_metrics?.views || example.views) && (
                                <span>👁️ <strong>{example.engagement_metrics?.views || example.views}</strong> views</span>
                              )}
                              {(example.engagement_metrics?.likes || example.likes) && (
                                <span>❤️ <strong>{example.engagement_metrics?.likes || example.likes}</strong> likes</span>
                              )}
                              {(example.engagement_metrics?.comments || example.comments) && (
                                <span>💬 <strong>{example.engagement_metrics?.comments || example.comments}</strong> comments</span>
                              )}
                              {(example.engagement_metrics?.reposts || example.reposts || example.shares) && (
                                <span>🔄 <strong>{example.engagement_metrics?.reposts || example.reposts || example.shares}</strong> reposts</span>
                              )}
                            </div>
                          )}

                          {/* Full Post Content */}
                          {(example.full_post || example.post_content) && (
                            <div style={{
                              backgroundColor: '#1e293b',
                              color: '#e2e8f0',
                              borderRadius: '8px',
                              padding: '16px',
                              marginBottom: '16px',
                              lineHeight: '1.6',
                              fontSize: '14px',
                              whiteSpace: 'pre-wrap',
                              wordWrap: 'break-word',
                              fontFamily: 'monospace',
                              overflowX: 'auto'
                            }}>
                              {example.full_post || example.post_content}
                            </div>
                          )}

                          {/* Direct Quote Highlight */}
                          {example.quote && (
                            <div style={{
                              backgroundColor: '#eff6ff',
                              borderLeft: '4px solid #0284c7',
                              padding: '12px 16px',
                              marginBottom: '16px',
                              color: '#1e40af',
                              fontSize: '14px',
                              fontStyle: 'italic',
                              lineHeight: '1.6'
                            }}>
                              <strong>Key Quote:</strong> "{example.quote}"
                            </div>
                          )}

                          {/* URL Link */}
                          {example.url && (
                            <div style={{
                              marginBottom: '16px'
                            }}>
                              <a href={example.url} target="_blank" rel="noopener noreferrer" style={{
                                display: 'inline-block',
                                color: '#0284c7',
                                fontSize: '13px',
                                textDecoration: 'underline',
                                fontWeight: '600'
                              }}>
                                View original post →
                              </a>
                            </div>
                          )}

                          {/* Context */}
                          {example.context && (
                            <div style={{
                              backgroundColor: '#fef3c7',
                              border: '1px solid #fcd34d',
                              borderRadius: '8px',
                              padding: '12px 16px',
                              color: '#92400e',
                              fontSize: '13px',
                              lineHeight: '1.6'
                            }}>
                              <strong>Context:</strong> {example.context}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* HARMS TAB */}
            {activeTab === 'harms' && (
              <div style={{
                backgroundColor: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
              }}>
                <div style={{ padding: '24px' }}>
                  <h2 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: '700', color: '#1e293b' }}>
                    ⚠️ Documented Harms ({harms.length})
                  </h2>
                  <p style={{
                    fontSize: '14px',
                    color: '#64748b',
                    marginBottom: '24px',
                    lineHeight: '1.6'
                  }}>
                    This section explains <strong>HOW</strong> this term causes harm. Rather than waiting for you to ask, we've documented the specific mechanisms of harm below so you understand the impact.
                  </p>

                  {harms.length === 0 ? (
                    <p style={{ color: '#94a3b8', margin: 0 }}>No harms documented yet.</p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                      {harms.map((harm, idx) => (
                        <div key={idx} style={{
                          paddingTop: idx > 0 ? '24px' : 0,
                          borderTop: idx > 0 ? '1px solid #e2e8f0' : 'none'
                        }}>
                          {/* Harm Type Badge */}
                          {harm.type && (
                            <span style={{
                              backgroundColor: '#fef3c7',
                              color: '#92400e',
                              padding: '6px 12px',
                              borderRadius: '4px',
                              fontSize: '12px',
                              fontWeight: '700',
                              textTransform: 'capitalize',
                              display: 'inline-block',
                              marginBottom: '12px'
                            }}>
                              {harm.type.replace(/_/g, ' ')}
                            </span>
                          )}

                          {/* Harm Title */}
                          <h4 style={{
                            margin: '8px 0 12px 0',
                            fontSize: '16px',
                            fontWeight: '700',
                            color: '#1e293b'
                          }}>
                            {harm.title || harm.type}
                          </h4>

                          {/* Harm Description - THE HOW */}
                          {harm.description && (
                            <div style={{
                              color: '#475569',
                              fontSize: '15px',
                              lineHeight: '1.7',
                              margin: '0 0 12px 0',
                              backgroundColor: '#f8fafc',
                              padding: '16px',
                              borderRadius: '8px',
                              borderLeft: '4px solid #ef4444'
                            }}>
                              <strong style={{ color: '#1e293b' }}>How it causes harm:</strong>
                              <p style={{ margin: '8px 0 0 0' }}>
                                {harm.description}
                              </p>
                            </div>
                          )}

                          {/* Impact */}
                          {harm.impact && (
                            <p style={{
                              color: '#1e293b',
                              fontSize: '14px',
                              margin: '0 0 12px 0',
                              padding: '12px 16px',
                              backgroundColor: '#fef2f2',
                              borderRadius: '8px'
                            }}>
                              <strong>Who is impacted:</strong> {harm.impact}
                            </p>
                          )}

                          {/* Evidence Quote */}
                          {harm.evidence && (
                            <p style={{
                              color: '#991b1b',
                              fontSize: '13px',
                              margin: 0,
                              padding: '8px 12px',
                              backgroundColor: '#fef2f2',
                              borderRadius: '4px',
                              borderLeft: '3px solid #dc2626'
                            }}>
                              <strong>Evidence from the field:</strong> "{harm.evidence}"
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* VARIANTS TAB */}
            {activeTab === 'variants' && (
              <div style={{
                backgroundColor: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '24px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
              }}>
                <h2 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: '700', color: '#1e293b' }}>
                  🔗 Related Terms & Variants
                </h2>
                {variants.length > 0 ? (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {variants.map((variant, idx) => (
                      <span key={idx} style={{
                        backgroundColor: '#f0f9ff',
                        border: '1px solid #bfdbfe',
                        color: '#1e40af',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        fontSize: '13px'
                      }}>
                        {typeof variant === 'object' ? variant.name || variant.term || JSON.stringify(variant) : variant}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: '#94a3b8', margin: 0 }}>No related terms documented yet.</p>
                )}
              </div>
            )}
          </div>

          {/* RIGHT SIDEBAR */}
          <aside>
            {/* Helpful Card */}
            <div style={{
              backgroundColor: 'white',
              border: '2px solid #e2e8f0',
              borderRadius: '12px',
              padding: '24px',
              marginBottom: '20px',
              position: 'sticky',
              top: '20px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
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
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '24px',
              marginBottom: '20px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
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

                {term.date_documented && (
                  <div>
                    <p style={{
                      fontSize: '11px',
                      fontWeight: '700',
                      color: '#94a3b8',
                      textTransform: 'uppercase',
                      margin: '0 0 4px 0'
                    }}>
                      Documented
                    </p>
                    <p style={{
                      fontSize: '14px',
                      color: '#1e293b',
                      margin: 0,
                      fontWeight: '500'
                    }}>
                      {new Date(term.date_documented).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Contribute Card */}
            <div style={{
              backgroundColor: '#f8fafc',
              border: '2px solid #3b82f6',
              borderRadius: '12px',
              padding: '20px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
            }}>
              <h3 style={{
                fontSize: '14px',
                fontWeight: '700',
                color: '#1e293b',
                marginBottom: '12px'
              }}>
                Contribute
              </h3>
              <p style={{
                fontSize: '12px',
                color: '#64748b',
                margin: '0 0 12px 0',
                lineHeight: '1.5'
              }}>
                Help improve this entry with more examples or context.
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
                  ⚠️ Describe Harm
                </button>
              </div>
            </div>
          </aside>
        </div>
      </main>

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

// Helper Functions
function getCategoryColor(cat) {
  const colors = {
    'derogatory': '#dc2626',
    'exclusionary': '#f97316',
    'dangerous': '#991b1b',
    'coded': '#7c3aed'
  };
  return colors[cat?.toLowerCase()] || '#2d5a7b';
}

function getRiskColor(risk) {
  const colors = {
    'low': '#10b981',
    'medium': '#f59e0b',
    'high': '#ef4444',
    'very high': '#991b1b'
  };
  return colors[risk?.toLowerCase()] || '#94a3b8';
}

function getConfidenceColor(confidence) {
  const colors = {
    'low': '#f59e0b',
    'medium': '#3b82f6',
    'high': '#10b981'
  };
  return colors[confidence?.toLowerCase()] || '#94a3b8';
}

function getPlatformColor(platform) {
  const colors = {
    'reddit': '#ff4500',
    'telegram': '#0088cc',
    'kenyatalk': '#8b5cf6',
    'x': '#000000',
    'tiktok': '#00f7ef'
  };
  return colors[platform?.toLowerCase()] || '#2d5a7b';
}

function capitalizeFirst(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function getPlatformStats(examples) {
  const stats = {};
  examples.forEach(ex => {
    const platform = ex.platform || 'unknown';
    if (!stats[platform]) {
      stats[platform] = {
        platform,
        platform_name: ex.platform_name || platform,
        count: 0
      };
    }
    stats[platform].count++;
  });
  return Object.values(stats).sort((a, b) => b.count - a.count);
}