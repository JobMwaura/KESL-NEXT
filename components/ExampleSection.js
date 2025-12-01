'use client';

import { useState } from 'react';

export default function ExampleSection({ examples, termId }) {
  const [expandedExample, setExpandedExample] = useState(null);

  const getPlatformColor = (platform) => {
    const colors = {
      'reddit': '#ff4500',
      'Reddit': '#ff4500',
      'telegram': '#0088cc',
      'Telegram': '#0088cc',
      'tiktok': '#00f7ef',
      'TikTok': '#00f7ef',
      'x': '#000000',
      'X': '#000000',
      'twitter': '#1DA1F2',
      'Twitter': '#1DA1F2'
    };
    return colors[platform] || '#6b7280';
  };

  const getPlatformIcon = (platform) => {
    const icons = {
      'reddit': '🔴',
      'Reddit': '🔴',
      'telegram': '✈️',
      'Telegram': '✈️',
      'tiktok': '🎵',
      'TikTok': '🎵',
      'x': '𝕏',
      'X': '𝕏',
      'twitter': '𝕏',
      'Twitter': '𝕏'
    };
    return icons[platform] || '📱';
  };

  if (!examples || examples.length === 0) {
    return (
      <div style={{
        backgroundColor: '#f8fafc',
        border: '2px dashed #cbd5e1',
        borderRadius: '10px',
        padding: '40px',
        textAlign: 'center'
      }}>
        <p style={{ fontSize: '16px', color: '#64748b', margin: 0 }}>
          No examples documented yet. Help us by adding one!
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gap: '24px' }}>
      {examples.map((example, idx) => (
        <div
          key={idx}
          style={{
            backgroundColor: 'white',
            border: '1px solid #cbd5e1',
            borderRadius: '10px',
            overflow: 'hidden',
            transition: 'all 0.2s'
          }}
        >
          {/* Header with Platform and Date */}
          <div style={{
            padding: '20px 24px',
            borderBottom: '1px solid #e2e8f0',
            backgroundColor: '#f8fafc'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'start',
              gap: '16px'
            }}>
              <div style={{ flex: 1 }}>
                {/* Platform Badge */}
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '12px'
                }}>
                  <span style={{
                    padding: '6px 12px',
                    backgroundColor: getPlatformColor(example.platform),
                    color: 'white',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontWeight: '700',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    {getPlatformIcon(example.platform)} {example.platform}
                  </span>
                </div>

                {/* Date */}
                <p style={{
                  fontSize: '14px',
                  color: '#94a3b8',
                  margin: '0 0 12px 0'
                }}>
                  📅 {example.date || example.posted_date || 'Date not specified'}
                </p>

                {/* Thread/Post Title */}
                {example.thread_title && (
                  <p style={{
                    fontSize: '16px',
                    fontWeight: '700',
                    color: '#1e293b',
                    margin: '0 0 8px 0'
                  }}>
                    {example.thread_title}
                  </p>
                )}

                {/* Link */}
                {example.url && (
                  <a
                    href={example.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontSize: '12px',
                      color: '#0284c7',
                      textDecoration: 'none',
                      wordBreak: 'break-all',
                      display: 'inline-block'
                    }}
                  >
                    🔗 View original post
                  </a>
                )}
              </div>

              {/* Engagement Metrics */}
              {example.engagement_metrics && (
                <div style={{
                  backgroundColor: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  minWidth: '180px',
                  textAlign: 'right'
                }}>
                  <p style={{
                    fontSize: '11px',
                    fontWeight: '700',
                    color: '#94a3b8',
                    textTransform: 'uppercase',
                    margin: '0 0 12px 0',
                    letterSpacing: '0.5px'
                  }}>
                    Engagement
                  </p>
                  <div style={{ display: 'grid', gap: '8px' }}>
                    {example.engagement_metrics.upvotes && (
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <span style={{ fontSize: '12px', color: '#64748b' }}>👍 Upvotes</span>
                        <span style={{
                          fontSize: '14px',
                          fontWeight: '700',
                          color: '#10b981'
                        }}>
                          {example.engagement_metrics.upvotes}
                        </span>
                      </div>
                    )}
                    {example.engagement_metrics.views && (
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <span style={{ fontSize: '12px', color: '#64748b' }}>👁️ Views</span>
                        <span style={{
                          fontSize: '14px',
                          fontWeight: '700',
                          color: '#0284c7'
                        }}>
                          {example.engagement_metrics.views}
                        </span>
                      </div>
                    )}
                    {example.engagement_metrics.comments && (
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <span style={{ fontSize: '12px', color: '#64748b' }}>💬 Comments</span>
                        <span style={{
                          fontSize: '14px',
                          fontWeight: '700',
                          color: '#f59e0b'
                        }}>
                          {example.engagement_metrics.comments}
                        </span>
                      </div>
                    )}
                    {example.engagement_metrics.reposts && (
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <span style={{ fontSize: '12px', color: '#64748b' }}>🔄 Reposts</span>
                        <span style={{
                          fontSize: '14px',
                          fontWeight: '700',
                          color: '#8b5cf6'
                        }}>
                          {example.engagement_metrics.reposts}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          <div style={{ padding: '24px' }}>
            {/* Full Post Content */}
            {example.full_post && (
              <div style={{
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '16px',
                marginBottom: '16px',
                fontFamily: 'system-ui, -apple-system, monospace',
                fontSize: '14px',
                color: '#1e293b',
                lineHeight: '1.7',
                whiteSpace: 'pre-wrap',
                wordWrap: 'break-word'
              }}>
                {example.full_post}
              </div>
            )}

            {/* Context/Notes */}
            {example.context && (
              <div style={{
                backgroundColor: '#fef3c7',
                border: '1px solid #fcd34d',
                borderRadius: '8px',
                padding: '16px',
                marginBottom: '16px'
              }}>
                <p style={{
                  fontSize: '12px',
                  fontWeight: '700',
                  color: '#92400e',
                  margin: '0 0 8px 0',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Context
                </p>
                <p style={{
                  fontSize: '14px',
                  color: '#451a03',
                  margin: 0,
                  lineHeight: '1.6'
                }}>
                  {example.context}
                </p>
              </div>
            )}

            {/* Category & Target */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '16px',
              marginBottom: '16px'
            }}>
              {example.category && (
                <div style={{
                  backgroundColor: '#f0f9ff',
                  border: '1px solid #bfdbfe',
                  borderRadius: '8px',
                  padding: '12px'
                }}>
                  <p style={{
                    fontSize: '11px',
                    fontWeight: '700',
                    color: '#0c4a6e',
                    margin: '0 0 6px 0',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Category
                  </p>
                  <p style={{
                    fontSize: '14px',
                    color: '#1e293b',
                    margin: 0,
                    fontWeight: '600'
                  }}>
                    {example.category}
                  </p>
                </div>
              )}
              {example.target && (
                <div style={{
                  backgroundColor: '#fce7f3',
                  border: '1px solid #fbcfe8',
                  borderRadius: '8px',
                  padding: '12px'
                }}>
                  <p style={{
                    fontSize: '11px',
                    fontWeight: '700',
                    color: '#831843',
                    margin: '0 0 6px 0',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Target/Actor
                  </p>
                  <p style={{
                    fontSize: '14px',
                    color: '#1e293b',
                    margin: 0,
                    fontWeight: '600'
                  }}>
                    {example.target}
                  </p>
                </div>
              )}
            </div>

            {/* Registers/Tone */}
            {example.registers && (
              <div style={{
                backgroundColor: '#f3e8ff',
                border: '1px solid #e9d5ff',
                borderRadius: '8px',
                padding: '16px',
                marginBottom: '16px'
              }}>
                <p style={{
                  fontSize: '12px',
                  fontWeight: '700',
                  color: '#6b21a8',
                  margin: '0 0 8px 0',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  🎭 Registers & Tone
                </p>
                <p style={{
                  fontSize: '14px',
                  color: '#1e293b',
                  margin: 0,
                  lineHeight: '1.6'
                }}>
                  {example.registers}
                </p>
              </div>
            )}

            {/* Risk Level */}
            {example.risk_level && (
              <div style={{
                backgroundColor: example.risk_level === 'High' ? '#fee2e2' : example.risk_level === 'Medium' ? '#fef3c7' : '#f0fdf4',
                border: example.risk_level === 'High' ? '1px solid #fecaca' : example.risk_level === 'Medium' ? '1px solid #fcd34d' : '1px solid #bbf7d0',
                borderRadius: '8px',
                padding: '12px'
              }}>
                <p style={{
                  fontSize: '11px',
                  fontWeight: '700',
                  color: example.risk_level === 'High' ? '#991b1b' : example.risk_level === 'Medium' ? '#92400e' : '#166534',
                  margin: '0 0 6px 0',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  ⚠️ Risk Level
                </p>
                <p style={{
                  fontSize: '14px',
                  color: '#1e293b',
                  margin: 0,
                  fontWeight: '700'
                }}>
                  {example.risk_level}
                </p>
              </div>
            )}
          </div>

          {/* Expand Button for additional details */}
          {(example.platform_dynamics || example.key_theme || example.power_relations) && (
            <div style={{
              padding: '16px 24px',
              borderTop: '1px solid #e2e8f0',
              backgroundColor: '#f8fafc'
            }}>
              <button
                onClick={() => setExpandedExample(expandedExample === idx ? null : idx)}
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: 'white',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '13px',
                  color: '#2d5a7b',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#f1f5f9';
                  e.target.style.borderColor = '#2d5a7b';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'white';
                  e.target.style.borderColor = '#cbd5e1';
                }}
              >
                {expandedExample === idx ? '▼ Hide Analysis' : '▶ Show Analysis'}
              </button>
            </div>
          )}

          {/* Expanded Analysis */}
          {expandedExample === idx && (
            <div style={{
              padding: '24px',
              borderTop: '1px solid #e2e8f0',
              backgroundColor: '#fafbfc'
            }}>
              <div style={{ display: 'grid', gap: '16px' }}>
                {example.platform_dynamics && (
                  <div>
                    <h4 style={{
                      fontSize: '14px',
                      fontWeight: '700',
                      color: '#1e293b',
                      margin: '0 0 8px 0'
                    }}>
                      📱 Platform Dynamics
                    </h4>
                    <p style={{
                      fontSize: '14px',
                      color: '#475569',
                      margin: 0,
                      lineHeight: '1.6'
                    }}>
                      {example.platform_dynamics}
                    </p>
                  </div>
                )}

                {example.power_relations && (
                  <div>
                    <h4 style={{
                      fontSize: '14px',
                      fontWeight: '700',
                      color: '#1e293b',
                      margin: '0 0 8px 0'
                    }}>
                      ⚖️ Power Relations
                    </h4>
                    <p style={{
                      fontSize: '14px',
                      color: '#475569',
                      margin: 0,
                      lineHeight: '1.6'
                    }}>
                      {example.power_relations}
                    </p>
                  </div>
                )}

                {example.key_theme && (
                  <div>
                    <h4 style={{
                      fontSize: '14px',
                      fontWeight: '700',
                      color: '#1e293b',
                      margin: '0 0 8px 0'
                    }}>
                      🔑 Key Theme
                    </h4>
                    <p style={{
                      fontSize: '14px',
                      color: '#475569',
                      margin: 0,
                      lineHeight: '1.6'
                    }}>
                      {example.key_theme}
                    </p>
                  </div>
                )}

                {example.actor_positioning && (
                  <div>
                    <h4 style={{
                      fontSize: '14px',
                      fontWeight: '700',
                      color: '#1e293b',
                      margin: '0 0 8px 0'
                    }}>
                      🎭 Actor Positioning
                    </h4>
                    <p style={{
                      fontSize: '14px',
                      color: '#475569',
                      margin: 0,
                      lineHeight: '1.6'
                    }}>
                      {example.actor_positioning}
                    </p>
                  </div>
                )}

                {example.resonance && (
                  <div>
                    <h4 style={{
                      fontSize: '14px',
                      fontWeight: '700',
                      color: '#1e293b',
                      margin: '0 0 8px 0'
                    }}>
                      📊 Resonance
                    </h4>
                    <p style={{
                      fontSize: '14px',
                      color: '#475569',
                      margin: 0,
                      lineHeight: '1.6'
                    }}>
                      {example.resonance}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}