'use client';

import React, { useState } from 'react';

/**
 * HarmSection Component
 * Displays documented harms for a term with visual indicators and expandable details
 * 
 * Props:
 * - harms: Object { normalizes_contempt: true, primes_exclusion: false, ... }
 * - harm_details: Object { normalizes_contempt: "explanation...", ... }
 * - isInitiallyOpen: Start expanded (default: false)
 */
export default function HarmSection({ 
  harms = {}, 
  harm_details = {},
  isInitiallyOpen = false 
}) {
  const [isOpen, setIsOpen] = useState(isInitiallyOpen);

  // Define harm types with icons and descriptions
  const harmTypes = {
    normalizes_contempt: {
      icon: '😠',
      label: 'Normalizes Contempt',
      color: '#dc2626',
      bgColor: '#fee2e2',
      description: 'Normalizes contempt or hatred toward a group'
    },
    primes_exclusion: {
      icon: '🚫',
      label: 'Primes Exclusion',
      color: '#f97316',
      bgColor: '#ffedd5',
      description: 'Primes exclusion from civic/political life'
    },
    cues_violence: {
      icon: '⚔️',
      label: 'Cues Violence',
      color: '#991b1b',
      bgColor: '#fecaca',
      description: 'Cues or implies violence against a group'
    },
    harasses: {
      icon: '🎯',
      label: 'Harasses/Targets',
      color: '#7c2d12',
      bgColor: '#fed7aa',
      description: 'Used to harass or target individuals/groups'
    },
    other: {
      icon: '⚠️',
      label: 'Other Harm',
      color: '#6366f1',
      bgColor: '#e0e7ff',
      description: 'Other documented harms'
    }
  };

  // Filter only selected harms
  const selectedHarms = Object.entries(harms).filter(([_, selected]) => selected);

  if (selectedHarms.length === 0) {
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
          No documented harms yet.
        </p>
      </div>
    );
  }

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
            💔 Documented Harms ({selectedHarms.length})
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
          padding: '0',
          backgroundColor: 'white'
        }}>
          {selectedHarms.map(([harmType, _], index) => {
            const harmConfig = harmTypes[harmType];
            const detail = harm_details[harmType];

            return (
              <div
                key={harmType}
                style={{
                  padding: '20px',
                  borderBottom: index < selectedHarms.length - 1 ? '1px solid #e2e8f0' : 'none',
                  backgroundColor: index % 2 === 0 ? 'white' : '#f8fafc'
                }}
              >
                {/* Harm Type Header */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '12px'
                }}>
                  <span style={{
                    fontSize: '20px',
                    display: 'inline-block'
                  }}>
                    {harmConfig.icon}
                  </span>
                  <div>
                    <h4 style={{
                      margin: '0 0 2px 0',
                      fontSize: '14px',
                      fontWeight: '700',
                      color: harmConfig.color
                    }}>
                      {harmConfig.label}
                    </h4>
                    <p style={{
                      margin: 0,
                      fontSize: '12px',
                      color: '#64748b',
                      fontStyle: 'italic'
                    }}>
                      {harmConfig.description}
                    </p>
                  </div>
                </div>

                {/* Harm Details */}
                {detail && (
                  <div style={{
                    backgroundColor: harmConfig.bgColor,
                    border: `1px solid ${harmConfig.color}33`,
                    borderRadius: '6px',
                    padding: '12px',
                    marginTop: '12px'
                  }}>
                    <p style={{
                      margin: 0,
                      fontSize: '13px',
                      color: '#1e293b',
                      lineHeight: '1.6',
                      wordWrap: 'break-word',
                      overflowWrap: 'break-word'
                    }}>
                      {detail}
                    </p>
                  </div>
                )}

                {/* Risk Indicator */}
                <div style={{
                  marginTop: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <span style={{
                    display: 'inline-block',
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: harmConfig.color
                  }} />
                  <span style={{
                    fontSize: '11px',
                    fontWeight: '600',
                    color: harmConfig.color,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    High Impact
                  </span>
                </div>
              </div>
            );
          })}

          {/* Harm Impact Summary */}
          <div style={{
            padding: '20px',
            backgroundColor: '#fef3c7',
            borderTop: '1px solid #e2e8f0',
            borderRadius: '0 0 8px 8px'
          }}>
            <p style={{
              margin: '0 0 10px 0',
              fontSize: '12px',
              fontWeight: '700',
              color: '#92400e',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              ⚠️ Impact Assessment
            </p>
            <p style={{
              margin: 0,
              fontSize: '13px',
              color: '#78350f',
              lineHeight: '1.6'
            }}>
              This term has been documented to cause {selectedHarms.length} type{selectedHarms.length !== 1 ? 's' : ''} of harm. 
              Community members have provided context on how this term impacts vulnerability.
            </p>
          </div>
        </div>
      )}

      <style jsx>{`
        @media (max-width: 768px) {
          div[style*="padding: 20px"] {
            padding: 16px !important;
          }

          h4 {
            font-size: 13px !important;
          }
        }
      `}</style>
    </div>
  );
}