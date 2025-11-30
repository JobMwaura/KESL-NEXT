'use client';

import React, { useState } from 'react';

/**
 * ExampleSection Component
 * Accordion showing all examples where a term has been used
 * 
 * Props:
 * - examples: Array of example objects with { quote, platform, date_observed, source_url }
 * - termId: ID of the term (for tracking)
 * - isInitiallyOpen: Start expanded or collapsed (default: false)
 */
export default function ExampleSection({ 
  examples = [], 
  termId = '',
  isInitiallyOpen = false 
}) {
  const [isOpen, setIsOpen] = useState(isInitiallyOpen);

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
          No examples documented yet. Be the first to contribute!
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
            💬 Examples ({examples.length})
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
          backgroundColor: 'white',
          maxHeight: '600px',
          overflow: 'auto'
        }}>
          {examples.map((example, index) => (
            <div
              key={example.id || index}
              style={{
                padding: '20px',
                borderBottom: index < examples.length - 1 ? '1px solid #e2e8f0' : 'none',
                backgroundColor: index % 2 === 0 ? 'white' : '#f8fafc'
              }}
            >
              {/* Example Number */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '12px'
              }}>
                <span style={{
                  backgroundColor: '#e2e8f0',
                  color: '#475569',
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: '700'
                }}>
                  {index + 1}
                </span>
                <PlatformBadge platform={example.platform} />
              </div>

              {/* Quote */}
              <blockquote style={{
                margin: '0 0 12px 0',
                padding: '12px',
                backgroundColor: '#f0fdf4',
                borderLeft: '3px solid #10b981',
                fontSize: '14px',
                color: '#1e293b',
                fontStyle: 'italic',
                lineHeight: '1.6',
                wordWrap: 'break-word',
                overflowWrap: 'break-word'
              }}>
                "{redactQuote(example.quote)}"
              </blockquote>

              {/* Metadata */}
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '12px',
                alignItems: 'center',
                fontSize: '12px',
                color: '#64748b'
              }}>
                <span>📅 {formatDate(example.date_observed)}</span>
                
                {example.source_url && (
                  <a
                    href={example.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: '#2d5a7b',
                      textDecoration: 'none',
                      fontWeight: '600',
                      transition: 'color 0.2s',
                      padding: '4px 8px',
                      backgroundColor: '#dbeafe',
                      borderRadius: '4px'
                    }}
                    onMouseEnter={(e) => e.target.style.color = '#1a3a52'}
                    onMouseLeave={(e) => e.target.style.color = '#2d5a7b'}
                  >
                    🔗 View Source
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        @media (max-width: 768px) {
          button {
            padding: 14px 16px !important;
          }

          div[style*="padding: 20px"] {
            padding: 16px !important;
          }

          blockquote {
            font-size: 12px !important;
            padding: 10px !important;
          }
        }
      `}</style>
    </div>
  );
}

/**
 * Platform Badge Component
 */
function PlatformBadge({ platform = 'unknown' }) {
  const platformColors = {
    'kenyatalk': { bg: '#c7d2e8', color: '#1e293b', emoji: '💬' },
    'reddit': { bg: '#ffdab9', color: '#7c2d12', emoji: '🤖' },
    'telegram': { bg: '#a3d5ff', color: '#003d82', emoji: '✈️' },
    'twitter': { bg: '#a3d5ff', color: '#003d82', emoji: '🐦' },
    'whatsapp': { bg: '#c8e6c9', color: '#1b5e20', emoji: '💚' },
    'facebook': { bg: '#bbdefb', color: '#0d47a1', emoji: '👍' },
    'tiktok': { bg: '#f0e6ff', color: '#4a148c', emoji: '🎵' },
    'youtube': { bg: '#ffccbc', color: '#bf360c', emoji: '▶️' },
    'discord': { bg: '#e1d5f0', color: '#512da8', emoji: '💬' },
    'other': { bg: '#e0e0e0', color: '#424242', emoji: '📱' }
  };

  const config = platformColors[platform.toLowerCase()] || platformColors.other;

  return (
    <span style={{
      backgroundColor: config.bg,
      color: config.color,
      padding: '4px 10px',
      borderRadius: '4px',
      fontSize: '12px',
      fontWeight: '600',
      whiteSpace: 'nowrap'
    }}>
      {config.emoji} {capitalizeFirst(platform)}
    </span>
  );
}

/**
 * Redact sensitive information in quotes
 * Replaces @mentions and #hashtags with [redacted]
 */
function redactQuote(quote) {
  if (!quote) return '';
  
  return quote
    .replace(/@\w+/g, '[@redacted]')
    .replace(/#\w+/g, '[#redacted]')
    .slice(0, 200) + (quote.length > 200 ? '...' : '');
}

/**
 * Format date to readable format
 */
function formatDate(dateString) {
  if (!dateString) return 'Unknown date';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch (error) {
    return dateString;
  }
}

/**
 * Capitalize first letter
 */
function capitalizeFirst(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}