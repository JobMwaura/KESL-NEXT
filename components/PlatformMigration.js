'use client';

import React, { useState } from 'react';

/**
 * PlatformMigration Component
 * Visualizes term migration across platforms
 * Shows where term appears and how it flows between platforms
 * 
 * Props:
 * - examples: Array of example objects with { platform, date_observed, quote, ... }
 * - migration: Object with migration pattern data (optional)
 * - isInitiallyOpen: Start expanded (default: false)
 */
export default function PlatformMigration({ 
  examples = [], 
  migration = {},
  isInitiallyOpen = false 
}) {
  const [isOpen, setIsOpen] = useState(isInitiallyOpen);

  // Platform configuration
  const platformConfig = {
    twitter: {
      emoji: '🐦',
      label: 'Twitter/X',
      color: '#1DA1F2',
      bgColor: '#EFF7FF',
      anonymity: 'Low',
      moderation: 'High',
      reach: 'Very High'
    },
    reddit: {
      emoji: '🤖',
      label: 'Reddit',
      color: '#FF4500',
      bgColor: '#FFF5F0',
      anonymity: 'Medium',
      moderation: 'Medium',
      reach: 'High'
    },
    kenyatalk: {
      emoji: '💬',
      label: 'KenyaTalk',
      color: '#6366f1',
      bgColor: '#EEF2FF',
      anonymity: 'Medium',
      moderation: 'Low',
      reach: 'High'
    },
    telegram: {
      emoji: '✈️',
      label: 'Telegram',
      color: '#0088cc',
      bgColor: '#E3F2FD',
      anonymity: 'High',
      moderation: 'None',
      reach: 'Very High'
    },
    whatsapp: {
      emoji: '💚',
      label: 'WhatsApp',
      color: '#25D366',
      bgColor: '#F0FDF4',
      anonymity: 'High',
      moderation: 'None',
      reach: 'Very High'
    },
    facebook: {
      emoji: '👍',
      label: 'Facebook',
      color: '#0A66C2',
      bgColor: '#F3F6FA',
      anonymity: 'Low',
      moderation: 'Medium',
      reach: 'Very High'
    },
    discord: {
      emoji: '💜',
      label: 'Discord',
      color: '#5865F2',
      bgColor: '#F3F4FE',
      anonymity: 'High',
      moderation: 'Low',
      reach: 'Medium'
    },
    tiktok: {
      emoji: '🎵',
      label: 'TikTok',
      color: '#000000',
      bgColor: '#F5F5F5',
      anonymity: 'Low',
      moderation: 'Medium',
      reach: 'Very High'
    },
    other: {
      emoji: '📱',
      label: 'Other',
      color: '#64748b',
      bgColor: '#F1F5F9',
      anonymity: 'Unknown',
      moderation: 'Unknown',
      reach: 'Unknown'
    }
  };

  if (!examples || examples.length === 0) {
    return (
      <div style={{
        backgroundColor: '#f8fafc',
        border: '1px solid #e2e8f0',
        borderRadius: '8px',
        padding: '20px',
        textAlign: 'center'
      }}>
        <p style={{
          color: '#94a3b8',
          fontSize: '14px',
          margin: 0,
          fontStyle: 'italic'
        }}>
          No platform data available yet.
        </p>
      </div>
    );
  }

  // Extract unique platforms and sort by first appearance
  const platformsUsed = [];
  const platformDates = {};
  
  examples.forEach(ex => {
    if (ex.platform) {
      const platform = ex.platform.toLowerCase();
      if (!platformsUsed.includes(platform)) {
        platformsUsed.push(platform);
      }
      if (!platformDates[platform] || new Date(ex.date_observed) < new Date(platformDates[platform])) {
        platformDates[platform] = ex.date_observed;
      }
    }
  });

  // Sort by date
  platformsUsed.sort((a, b) => 
    new Date(platformDates[a]) - new Date(platformDates[b])
  );

  // Count examples per platform
  const exampleCounts = {};
  platformsUsed.forEach(platform => {
    exampleCounts[platform] = examples.filter(
      ex => ex.platform?.toLowerCase() === platform
    ).length;
  });

  return (
    <div style={{
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      overflow: 'hidden',
      backgroundColor: 'white'
    }}>
      {/* Accordion Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%',
          padding: '16px 20px',
          backgroundColor: isOpen ? 'white' : '#f8fafc',
          border: 'none',
          borderBottom: isOpen ? '1px solid #e2e8f0' : 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          transition: 'all 0.3s ease',
          textAlign: 'left'
        }}
        onMouseEnter={(e) => {
          if (!isOpen) e.currentTarget.style.backgroundColor = '#f1f5f9';
        }}
        onMouseLeave={(e) => {
          if (!isOpen) e.currentTarget.style.backgroundColor = '#f8fafc';
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{
            fontSize: '14px',
            fontWeight: '700',
            color: '#1e293b',
            transition: 'transform 0.3s ease',
            transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)',
            display: 'inline-block'
          }}>
            ▶
          </span>
          <span style={{
            fontSize: '16px',
            fontWeight: '700',
            color: '#1e293b'
          }}>
            🌐 Platforms & Migration ({platformsUsed.length})
          </span>
        </div>
        <span style={{
          fontSize: '12px',
          color: '#94a3b8',
          fontWeight: '600'
        }}>
          {isOpen ? '▲ Hide' : '▼ Show'}
        </span>
      </button>

      {/* Accordion Content */}
      {isOpen && (
        <div style={{
          padding: '20px',
          backgroundColor: 'white'
        }}>
          {/* Platform Flow Visualization */}
          <div style={{
            marginBottom: '30px'
          }}>
            <h4 style={{
              margin: '0 0 16px 0',
              fontSize: '13px',
              fontWeight: '700',
              color: '#1e293b',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              📊 Platform Flow
            </h4>

            {/* Flow Diagram */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              overflowX: 'auto',
              paddingBottom: '12px',
              backgroundColor: '#f8fafc',
              borderRadius: '6px',
              padding: '12px',
              flexWrap: 'wrap'
            }}>
              {platformsUsed.map((platform, index) => {
                const config = platformConfig[platform] || platformConfig.other;
                const count = exampleCounts[platform];

                return (
                  <React.Fragment key={platform}>
                    {/* Platform Chip */}
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '4px',
                      minWidth: 'fit-content'
                    }}>
                      <div style={{
                        backgroundColor: config.bgColor,
                        border: `2px solid ${config.color}`,
                        borderRadius: '8px',
                        padding: '8px 12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        whiteSpace: 'nowrap',
                        fontWeight: '600',
                        fontSize: '12px',
                        color: config.color
                      }}>
                        <span style={{ fontSize: '14px' }}>{config.emoji}</span>
                        {config.label}
                      </div>
                      <span style={{
                        fontSize: '10px',
                        fontWeight: '700',
                        backgroundColor: config.color,
                        color: 'white',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        minWidth: '20px',
                        textAlign: 'center'
                      }}>
                        {count}
                      </span>
                    </div>

                    {/* Arrow (if not last) */}
                    {index < platformsUsed.length - 1 && (
                      <div style={{
                        fontSize: '18px',
                        color: '#cbd5e1',
                        fontWeight: '700',
                        margin: '0 4px'
                      }}>
                        →
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          {/* Platform Details Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '12px'
          }}>
            {platformsUsed.map(platform => {
              const config = platformConfig[platform] || platformConfig.other;
              const count = exampleCounts[platform];
              const firstDate = platformDates[platform];

              return (
                <div
                  key={platform}
                  style={{
                    backgroundColor: config.bgColor,
                    border: `1px solid ${config.color}33`,
                    borderRadius: '6px',
                    padding: '12px',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {/* Platform Header */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '10px'
                  }}>
                    <span style={{ fontSize: '16px' }}>{config.emoji}</span>
                    <h5 style={{
                      margin: 0,
                      fontSize: '13px',
                      fontWeight: '700',
                      color: config.color
                    }}>
                      {config.label}
                    </h5>
                  </div>

                  {/* Stats */}
                  <div style={{
                    display: 'grid',
                    gap: '6px',
                    fontSize: '11px',
                    color: '#475569'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontWeight: '600' }}>Examples:</span>
                      <span style={{ fontWeight: '700', color: config.color }}>{count}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontWeight: '600' }}>First seen:</span>
                      <span>{new Date(firstDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontWeight: '600' }}>Anonymity:</span>
                      <span>{config.anonymity}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontWeight: '600' }}>Moderation:</span>
                      <span>{config.moderation}</span>
                    </div>
                  </div>

                  {/* Risk Indicator */}
                  <div style={{
                    marginTop: '10px',
                    paddingTop: '10px',
                    borderTop: `1px solid ${config.color}33`,
                    fontSize: '10px',
                    fontWeight: '600',
                    color: config.color,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    {config.moderation === 'None' ? '⚠️ No Moderation' : '✓ Moderated'}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Research Insight */}
          <div style={{
            marginTop: '20px',
            padding: '12px',
            backgroundColor: '#ecfdf5',
            border: '1px solid #86efac',
            borderRadius: '6px'
          }}>
            <p style={{
              margin: '0 0 6px 0',
              fontSize: '12px',
              fontWeight: '700',
              color: '#166534',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              🔍 Research Insight
            </p>
            <p style={{
              margin: 0,
              fontSize: '13px',
              color: '#15803d',
              lineHeight: '1.5'
            }}>
              This term appears across {platformsUsed.length} platform{platformsUsed.length !== 1 ? 's' : ''}, 
              indicating {platformsUsed.length > 2 ? 'significant' : 'moderate'} cross-platform prevalence. 
              The presence on less-moderated platforms like {
                platformsUsed.some(p => ['telegram', 'whatsapp', 'discord'].includes(p)) 
                  ? 'Telegram/WhatsApp' 
                  : 'other unmoderated spaces'
              } suggests active distribution in private networks.
            </p>
          </div>
        </div>
      )}

      <style jsx>{`
        @media (max-width: 768px) {
          div[style*="display: grid"] {
            grid-template-columns: 1fr !important;
          }

          div[style*="display: flex"][style*="gap: 12px"] {
            flex-wrap: wrap;
          }
        }
      `}</style>
    </div>
  );
}