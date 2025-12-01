'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ContributeModal from '@/components/ContributeModal';
import { fetchTermById } from '@/lib/supabase';

export default function TermPage() {
  const params = useParams();
  const router = useRouter();
  const [term, setTerm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedSections, setExpandedSections] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);

  useEffect(() => {
    async function loadTerm() {
      try {
        setLoading(true);
        const data = await fetchTermById(params.id);
        setTerm(data);
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

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const openContributionModal = (type) => {
    setModalType(type);
    setModalOpen(true);
  };

  const closeContributionModal = () => {
    setModalOpen(false);
    setModalType(null);
  };

  // Helper functions for colors
  const getCategoryColor = (category) => {
    const colors = {
      'Derogatory': '#dc2626',
      'Exclusionary': '#f97316',
      'Dangerous': '#991b1b',
      'Coded': '#7c3aed'
    };
    return colors[category] || '#6b7280';
  };

  const getRiskColor = (risk) => {
    const colors = {
      'Low': '#10b981',
      'Medium': '#f59e0b',
      'High': '#ef4444',
      'Very High': '#991b1b'
    };
    return colors[risk] || '#6b7280';
  };

  const getPlatformColor = (platform) => {
    const colors = {
      'reddit': '#ff4500',
      'Reddit': '#ff4500',
      'telegram': '#0088cc',
      'Telegram': '#0088cc',
      'kenyatalk': '#8b5cf6',
      'KenyaTalk': '#8b5cf6',
      'x': '#000000',
      'X': '#000000',
      'tiktok': '#00f7ef',
      'TikTok': '#00f7ef'
    };
    return colors[platform] || '#6b7280';
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
              fontSize: '14px'
            }}>
              Back to Lexicon
            </button>
          </a>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main style={{ padding: '40px 20px', maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header Section */}
        <div style={{ marginBottom: '40px' }}>
          <h1 style={{ fontSize: '42px', fontWeight: 'bold', color: '#1e293b', marginBottom: '12px' }}>
            {term.term}
          </h1>
          <p style={{ fontSize: '16px', color: '#64748b', marginBottom: '20px' }}>
            {term.language || 'Language not specified'}
          </p>

          {/* Badges */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px' }}>
            {term.category && (
              <span style={{
                padding: '8px 16px',
                backgroundColor: getCategoryColor(term.category),
                color: 'white',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: '600'
              }}>
                {term.category}
              </span>
            )}
            {term.risk_level && (
              <span style={{
                padding: '8px 16px',
                backgroundColor: getRiskColor(term.risk_level),
                color: 'white',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: '600'
              }}>
                Risk: {term.risk_level}
              </span>
            )}
            {term.confidence_score && (
              <span style={{
                padding: '8px 16px',
                backgroundColor: '#f59e0b',
                color: 'white',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: '600'
              }}>
                Confidence: {term.confidence_score}%
              </span>
            )}
          </div>
        </div>

        {/* Quick Context Box */}
        {term.context_summary && (
          <div style={{
            backgroundColor: '#eff6ff',
            border: '2px solid #0284c7',
            borderRadius: '8px',
            padding: '20px',
            marginBottom: '30px'
          }}>
            <p style={{ fontSize: '16px', color: '#1e293b', lineHeight: '1.6', margin: 0 }}>
              <strong>Quick Context:</strong> {term.context_summary}
            </p>
          </div>
        )}

        {/* Tab Navigation */}
        <div style={{
          display: 'flex',
          gap: '30px',
          borderBottom: '2px solid #e2e8f0',
          marginBottom: '30px',
          overflowX: 'auto',
          paddingBottom: '0'
        }}>
          {[
            { id: 'overview', label: '📖 Overview', icon: '📖' },
            { id: 'platforms', label: '🌐 Platforms', icon: '🌐' },
            { id: 'examples', label: '💬 Examples', icon: '💬' },
            { id: 'harms', label: '⚠️ Harms', icon: '⚠️' },
            { id: 'variants', label: '🔗 Variants', icon: '🔗' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '12px 20px',
                backgroundColor: 'transparent',
                border: 'none',
                borderBottom: activeTab === tab.id ? '3px solid #2d5a7b' : '3px solid transparent',
                color: activeTab === tab.id ? '#2d5a7b' : '#94a3b8',
                cursor: 'pointer',
                fontWeight: activeTab === tab.id ? '600' : '400',
                fontSize: '14px',
                transition: 'all 0.3s ease',
                whiteSpace: 'nowrap'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div style={{ maxWidth: '900px' }}>
            {/* Literal Gloss */}
            {term.literal_gloss && (
              <div style={{
                backgroundColor: '#f0f9ff',
                border: '2px solid #0284c7',
                borderRadius: '8px',
                padding: '20px',
                marginBottom: '30px'
              }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1e293b', marginTop: 0 }}>Literal Gloss</h3>
                <p style={{ fontSize: '15px', color: '#1e293b', lineHeight: '1.6', margin: 0 }}>
                  {term.literal_gloss}
                </p>
              </div>
            )}

            {/* Definition */}
            <div style={{ marginBottom: '30px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1e293b', marginBottom: '12px' }}>
                📚 Definition
              </h3>
              <p style={{ fontSize: '15px', color: '#475569', lineHeight: '1.8', marginBottom: 0 }}>
                {term.definition || 'Definition not available'}
              </p>
            </div>

            {/* Full Context */}
            {term.context_full && (
              <div style={{ marginBottom: '30px' }}>
                <button
                  onClick={() => toggleSection('fullContext')}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '6px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontSize: '15px',
                    fontWeight: '600',
                    color: '#1e293b',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}
                >
                  {expandedSections.fullContext ? '▼' : '▶'} Show Full Context
                </button>
                {expandedSections.fullContext && (
                  <div style={{
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderTop: 'none',
                    borderRadius: '0 0 6px 6px',
                    padding: '16px',
                    marginTop: 0
                  }}>
                    <p style={{ fontSize: '14px', color: '#475569', lineHeight: '1.8', margin: 0 }}>
                      {term.context_full}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Registers/Tone */}
            {term.registers && (
              <div style={{ marginBottom: '30px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1e293b', marginBottom: '12px' }}>
                  🎭 Registers & Tone
                </h3>
                <div style={{
                  backgroundColor: '#fef2f2',
                  border: '1px solid #fee2e2',
                  borderRadius: '6px',
                  padding: '16px'
                }}>
                  <p style={{ fontSize: '14px', color: '#475569', lineHeight: '1.7', margin: 0 }}>
                    {term.registers}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* PLATFORMS TAB */}
        {activeTab === 'platforms' && (
          <div style={{ maxWidth: '900px' }}>
            {term.platform_dynamics ? (
              <>
                {/* Summary */}
                {term.platform_dynamics.summary && (
                  <div style={{
                    backgroundColor: '#f0fdf4',
                    border: '2px solid #16a34a',
                    borderRadius: '8px',
                    padding: '20px',
                    marginBottom: '30px'
                  }}>
                    <p style={{ fontSize: '15px', color: '#1e293b', lineHeight: '1.7', margin: 0 }}>
                      {term.platform_dynamics.summary}
                    </p>
                  </div>
                )}

                {/* Migration Pattern */}
                {term.platform_dynamics.migration_pattern && (
                  <div style={{ marginBottom: '30px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1e293b', marginBottom: '20px' }}>
                      📱 Platform Migration Pattern
                    </h3>

                    {term.platform_dynamics.migration_pattern.map((step, idx) => (
                      <div
                        key={idx}
                        style={{
                          backgroundColor: 'white',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                          padding: '20px',
                          marginBottom: '15px',
                          overflow: 'hidden'
                        }}
                      >
                        {/* Step Header */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                          <span style={{
                            display: 'inline-block',
                            width: '32px',
                            height: '32px',
                            backgroundColor: getPlatformColor(step.platform),
                            color: 'white',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 'bold',
                            fontSize: '14px'
                          }}>
                            {idx + 1}
                          </span>
                          <div>
                            <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#1e293b', margin: 0 }}>
                              {step.platform_name || step.platform}
                            </h4>
                            <p style={{ fontSize: '13px', color: '#94a3b8', margin: '4px 0 0 0' }}>
                              {step.date_range || step.date}
                            </p>
                          </div>
                        </div>

                        {/* Details Grid */}
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                          gap: '16px',
                          marginBottom: '16px'
                        }}>
                          {step.characteristics && (
                            <div style={{
                              backgroundColor: '#f8fafc',
                              padding: '12px',
                              borderRadius: '6px'
                            }}>
                              <p style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '600', margin: '0 0 8px 0' }}>CHARACTERISTICS</p>
                              <ul style={{ fontSize: '13px', color: '#475569', margin: 0, paddingLeft: '20px' }}>
                                {Object.entries(step.characteristics).map(([key, val]) => (
                                  <li key={key} style={{ marginBottom: '4px' }}>
                                    <strong>{key}:</strong> {val}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {step.discourse_level && (
                            <div style={{
                              backgroundColor: '#fef2f2',
                              padding: '12px',
                              borderRadius: '6px'
                            }}>
                              <p style={{ fontSize: '12px', color: '#991b1b', fontWeight: '600', margin: '0 0 8px 0' }}>DISCOURSE LEVEL</p>
                              <p style={{ fontSize: '13px', color: '#475569', margin: 0 }}>
                                {step.discourse_level}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Mechanism */}
                        {step.mechanism && (
                          <div style={{
                            backgroundColor: '#f0f9ff',
                            borderLeft: '4px solid #0284c7',
                            padding: '12px',
                            borderRadius: '4px'
                          }}>
                            <p style={{ fontSize: '12px', color: '#0284c7', fontWeight: '600', margin: '0 0 6px 0' }}>HOW IT SPREAD</p>
                            <p style={{ fontSize: '13px', color: '#475569', margin: 0 }}>
                              {step.mechanism}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Intensification Pattern */}
                {term.platform_dynamics.intensification_pattern && (
                  <div style={{ marginBottom: '30px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1e293b', marginBottom: '16px' }}>
                      📈 Intensification Pattern
                    </h3>
                    <p style={{ fontSize: '14px', color: '#475569', lineHeight: '1.7', marginBottom: '16px' }}>
                      {term.platform_dynamics.intensification_pattern.description}
                    </p>
                    {term.platform_dynamics.intensification_pattern.factors && (
                      <div>
                        {term.platform_dynamics.intensification_pattern.factors.map((factor, idx) => (
                          <div key={idx} style={{
                            backgroundColor: '#fef3c7',
                            border: '1px solid #fcd34d',
                            borderRadius: '6px',
                            padding: '12px',
                            marginBottom: '10px'
                          }}>
                            <p style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b', margin: '0 0 8px 0' }}>
                              {factor.factor}
                            </p>
                            <p style={{ fontSize: '12px', color: '#475569', margin: 0, lineHeight: '1.6' }}>
                              {factor.impact}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Key Mechanisms */}
                {term.platform_dynamics.key_mechanisms && (
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1e293b', marginBottom: '16px' }}>
                      🔑 Key Mechanisms
                    </h3>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                      gap: '12px'
                    }}>
                      {Object.entries(term.platform_dynamics.key_mechanisms).map(([key, val]) => (
                        <div key={key} style={{
                          backgroundColor: '#f3e8ff',
                          border: '1px solid #e9d5ff',
                          borderRadius: '6px',
                          padding: '12px'
                        }}>
                          <p style={{ fontSize: '12px', fontWeight: '600', color: '#7c3aed', margin: '0 0 6px 0' }}>
                            {key.replace(/_/g, ' ').toUpperCase()}
                          </p>
                          <p style={{ fontSize: '12px', color: '#475569', margin: 0 }}>
                            {val}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <p style={{ color: '#94a3b8' }}>Platform dynamics data not yet available for this term.</p>
            )}
          </div>
        )}

        {/* EXAMPLES TAB */}
        {activeTab === 'examples' && (
          <div style={{ maxWidth: '900px' }}>
            {term.examples_detailed && term.examples_detailed.length > 0 ? (
              term.examples_detailed.map((example, idx) => (
                <div
                  key={idx}
                  style={{
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    padding: '20px',
                    marginBottom: '20px'
                  }}
                >
                  {/* Platform Badge + Date */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    <span style={{
                      padding: '4px 12px',
                      backgroundColor: getPlatformColor(example.platform),
                      color: 'white',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}>
                      {example.platform_name || example.platform}
                    </span>
                    <span style={{ fontSize: '13px', color: '#94a3b8' }}>
                      {example.date}
                    </span>
                  </div>

                  {/* Engagement Metrics */}
                  {example.engagement_metrics && (
                    <div style={{
                      display: 'flex',
                      gap: '20px',
                      backgroundColor: '#f8fafc',
                      padding: '12px',
                      borderRadius: '6px',
                      marginBottom: '16px',
                      fontSize: '13px'
                    }}>
                      <div>👁️ <strong>{example.engagement_metrics.views}</strong> views</div>
                      <div>❤️ <strong>{example.engagement_metrics.likes}</strong> likes</div>
                      <div>💬 <strong>{example.engagement_metrics.comments}</strong> comments</div>
                      <div>🔄 <strong>{example.engagement_metrics.reposts}</strong> reposts</div>
                    </div>
                  )}

                  {/* Key Quote */}
                  {example.quote && (
                    <div style={{
                      backgroundColor: '#dbeafe',
                      borderLeft: '4px solid #0284c7',
                      padding: '12px',
                      borderRadius: '4px',
                      marginBottom: '16px'
                    }}>
                      <p style={{ fontSize: '14px', color: '#1e293b', fontStyle: 'italic', margin: 0 }}>
                        "{example.quote}"
                      </p>
                    </div>
                  )}

                  {/* Full Post */}
                  {example.full_post && (
                    <div style={{
                      backgroundColor: '#1e293b',
                      color: '#e2e8f0',
                      padding: '12px',
                      borderRadius: '6px',
                      fontFamily: 'monospace',
                      fontSize: '12px',
                      lineHeight: '1.6',
                      overflowX: 'auto',
                      marginBottom: '16px'
                    }}>
                      <p style={{ margin: 0, whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
                        {example.full_post}
                      </p>
                    </div>
                  )}

                  {/* Context */}
                  {example.context && (
                    <div style={{
                      backgroundColor: '#fef3c7',
                      border: '1px solid #fcd34d',
                      borderRadius: '6px',
                      padding: '12px'
                    }}>
                      <p style={{ fontSize: '13px', color: '#475569', lineHeight: '1.6', margin: 0 }}>
                        {example.context}
                      </p>
                    </div>
                  )}

                  {/* URL */}
                  {example.url && (
                    <div style={{ marginTop: '12px' }}>
                      <a
                        href={example.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          fontSize: '13px',
                          color: '#0284c7',
                          textDecoration: 'none',
                          fontWeight: '600'
                        }}
                      >
                        View original post →
                      </a>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p style={{ color: '#94a3b8' }}>No examples available yet for this term.</p>
            )}
          </div>
        )}

        {/* HARMS TAB */}
        {activeTab === 'harms' && (
          <div style={{ maxWidth: '900px' }}>
            <div style={{
              backgroundColor: '#fef3c7',
              border: '1px solid #fcd34d',
              borderRadius: '6px',
              padding: '16px',
              marginBottom: '30px'
            }}>
              <p style={{ fontSize: '14px', color: '#1e293b', lineHeight: '1.6', margin: 0 }}>
                <strong>How does this term cause harm?</strong> Rather than waiting for you to ask, we've documented the specific mechanisms of harm below so you understand the impact.
              </p>
            </div>

            {term.harms_detailed && term.harms_detailed.length > 0 ? (
              term.harms_detailed.map((harm, idx) => (
                <div
                  key={idx}
                  style={{
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    padding: '20px',
                    marginBottom: '20px'
                  }}
                >
                  {/* Harm Type Badge */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                    <span style={{
                      padding: '6px 12px',
                      backgroundColor: '#fbbf24',
                      color: '#78350f',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}>
                      {harm.type}
                    </span>
                  </div>

                  {/* Harm Title */}
                  <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#1e293b', marginBottom: '12px' }}>
                    {harm.title}
                  </h4>

                  {/* How it causes harm */}
                  {harm.description && (
                    <div style={{
                      backgroundColor: '#fef2f2',
                      borderLeft: '4px solid #dc2626',
                      padding: '12px',
                      borderRadius: '4px',
                      marginBottom: '16px'
                    }}>
                      <p style={{ fontSize: '12px', fontWeight: '600', color: '#991b1b', margin: '0 0 6px 0' }}>
                        HOW IT CAUSES HARM
                      </p>
                      <p style={{ fontSize: '14px', color: '#475569', lineHeight: '1.6', margin: 0 }}>
                        {harm.description}
                      </p>
                    </div>
                  )}

                  {/* Who is impacted */}
                  {harm.impact && (
                    <div style={{
                      backgroundColor: '#fce7f3',
                      padding: '12px',
                      borderRadius: '6px',
                      marginBottom: '16px'
                    }}>
                      <p style={{ fontSize: '12px', fontWeight: '600', color: '#831843', margin: '0 0 6px 0' }}>
                        WHO IS IMPACTED
                      </p>
                      <p style={{ fontSize: '13px', color: '#475569', margin: 0 }}>
                        {harm.impact}
                      </p>
                    </div>
                  )}

                  {/* Evidence */}
                  {harm.evidence && (
                    <div style={{
                      backgroundColor: '#fee2e2',
                      borderLeft: '4px solid #991b1b',
                      padding: '12px',
                      borderRadius: '4px'
                    }}>
                      <p style={{ fontSize: '12px', fontWeight: '600', color: '#991b1b', margin: '0 0 6px 0' }}>
                        EVIDENCE FROM THE FIELD
                      </p>
                      <p style={{ fontSize: '13px', color: '#475569', fontStyle: 'italic', margin: 0 }}>
                        "{harm.evidence}"
                      </p>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p style={{ color: '#94a3b8' }}>Harm analysis not yet available for this term.</p>
            )}
          </div>
        )}

        {/* VARIANTS TAB */}
        {activeTab === 'variants' && (
          <div style={{ maxWidth: '900px' }}>
            {term.variants && term.variants.length > 0 ? (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                gap: '16px'
              }}>
                {term.variants.map((variant, idx) => (
                  <div
                    key={idx}
                    style={{
                      backgroundColor: 'white',
                      border: '2px solid #e2e8f0',
                      borderRadius: '8px',
                      padding: '16px',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      hover: {
                        borderColor: '#2d5a7b',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                      }
                    }}
                  >
                    <h4 style={{ fontSize: '15px', fontWeight: '600', color: '#1e293b', marginBottom: '8px' }}>
                      {variant}
                    </h4>
                    <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>
                      Related variant of this term
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: '#94a3b8' }}>No variants documented yet for this term.</p>
            )}
          </div>
        )}

        {/* Contribute Section */}
        <div style={{
          marginTop: '50px',
          padding: '30px',
          backgroundColor: '#f0f9ff',
          border: '2px solid #0284c7',
          borderRadius: '8px',
          maxWidth: '900px'
        }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1e293b', marginTop: 0 }}>
            Contribute
          </h3>
          <p style={{ fontSize: '14px', color: '#475569', marginBottom: '16px' }}>
            Help improve this entry with more examples or context.
          </p>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button
              onClick={() => openContributionModal('example')}
              style={{
                padding: '10px 20px',
                backgroundColor: '#2d5a7b',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '14px'
              }}
            >
              💬 Add Example
            </button>
            <button
              onClick={() => openContributionModal('context')}
              style={{
                padding: '10px 20px',
                backgroundColor: '#2d5a7b',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '14px'
              }}
            >
              📝 Add Context
            </button>
            <button
              onClick={() => openContributionModal('harm')}
              style={{
                padding: '10px 20px',
                backgroundColor: '#2d5a7b',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '14px'
              }}
            >
              ⚠️ Describe Harm
            </button>
          </div>
        </div>
      </main>

      {/* Contribution Modal */}
      {modalOpen && (
        <ContributeModal
          termId={term.id}
          modalType={modalType}
          onClose={closeContributionModal}
        />
      )}

      <Footer />
    </>
  );
}