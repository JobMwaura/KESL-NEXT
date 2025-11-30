'use client';

import React from 'react';
import Link from 'next/link';

/**
 * TermCard Component
 * Compact preview card for term in lexicon grid/list
 * Shows term name, category, risk, confidence, and first example
 * 
 * Props:
 * - id: Term ID (for link)
 * - term: Term name
 * - category: Category (derogatory, exclusionary, dangerous, coded)
 * - risk: Risk level (low, medium, high)
 * - language: Language (sheng, swahili, english, mixed)
 * - confidence_level: Confidence (low, medium, high)
 * - meaning: Definition (first 100 chars)
 * - examples: Array of example objects
 * - example_count: Number of examples
 */
export default function TermCard({
  id,
  term = 'Term',
  category = 'derogatory',
  risk = 'medium',
  language = 'sheng',
  confidence_level = 'low',
  meaning = '',
  examples = [],
  example_count = 0
}) {
  const firstExample = examples && examples.length > 0 ? examples[0] : null;

  return (
    <Link href={`/lexicon/${id}`} style={{ textDecoration: 'none' }}>
      <div
        style={{
          backgroundColor: 'white',
          border: '1px solid #cbd5e1',
          borderRadius: '10px',
          padding: '20px',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.08)',
          hover: {
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.12)'
          }
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.12)';
          e.currentTarget.style.borderColor = '#94a3b8';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.08)';
          e.currentTarget.style.borderColor = '#cbd5e1';
        }}
      >
        {/* Header: Term Name + Language */}
        <div>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '700',
            color: '#1e293b',
            margin: '0 0 4px 0',
            lineHeight: '1.3',
            wordWrap: 'break-word',
            overflowWrap: 'break-word'
          }}>
            {term}
          </h3>
          <p style={{
            fontSize: '11px',
            color: '#94a3b8',
            margin: 0,
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            {language}
          </p>
        </div>

        {/* Badges */}
        <div style={{
          display: 'flex',
          gap: '6px',
          flexWrap: 'wrap'
        }}>
          <Badge
            label={capitalizeFirst(category)}
            color={getCategoryColor(category)}
            type="category"
          />
          <Badge
            label={capitalizeFirst(risk)}
            color={getRiskColor(risk)}
            type="risk"
          />
          <Badge
            label={getConfidenceIcon(confidence_level)}
            color="#f0f4f8"
            textColor="#475569"
            type="confidence"
          />
        </div>

        {/* First Example Preview (if available) */}
        {firstExample && (
          <div style={{
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '6px',
            padding: '12px',
            marginTop: '4px'
          }}>
            <p style={{
              fontSize: '11px',
              color: '#94a3b8',
              fontWeight: '600',
              textTransform: 'uppercase',
              margin: '0 0 6px 0'
            }}>
              Example
            </p>
            <p style={{
              fontSize: '12px',
              color: '#475569',
              margin: 0,
              lineHeight: '1.4',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}>
              "{redactQuote(firstExample.quote)}"
            </p>
            <p style={{
              fontSize: '10px',
              color: '#cbd5e1',
              margin: '6px 0 0 0',
              fontWeight: '500'
            }}>
              {firstExample.platform && (
                <>
                  {getPlatformEmoji(firstExample.platform)} {capitalizeFirst(firstExample.platform)}
                  {firstExample.date_observed && ` • ${formatDate(firstExample.date_observed)}`}
                </>
              )}
            </p>
          </div>
        )}

        {/* Example Count */}
        {example_count > 0 && (
          <p style={{
            fontSize: '12px',
            color: '#64748b',
            margin: '8px 0 0 0',
            fontWeight: '600',
            paddingTop: '8px',
            borderTop: '1px solid #e2e8f0'
          }}>
            {example_count} {example_count === 1 ? 'example' : 'examples'} documented
          </p>
        )}

        {/* Definition Preview */}
        {meaning && (
          <div style={{
            marginTop: 'auto',
            paddingTop: '8px',
            borderTop: '1px solid #e2e8f0'
          }}>
            <p style={{
              fontSize: '12px',
              color: '#64748b',
              margin: 0,
              lineHeight: '1.4',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}>
              {meaning.slice(0, 120)}...
            </p>
          </div>
        )}

        {/* CTA */}
        <div style={{
          marginTop: 'auto',
          paddingTop: '12px',
          borderTop: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <span style={{
            fontSize: '12px',
            fontWeight: '700',
            color: '#2d5a7b'
          }}>
            View Details
          </span>
          <span style={{
            fontSize: '14px'
          }}>
            →
          </span>
        </div>
      </div>
    </Link>
  );
}

/**
 * Badge Component
 */
function Badge({ label, color, textColor = 'white', type = 'default' }) {
  return (
    <span style={{
      backgroundColor: color,
      color: textColor,
      padding: type === 'confidence' ? '4px 8px' : '4px 10px',
      borderRadius: '4px',
      fontSize: '10px',
      fontWeight: '700',
      whiteSpace: 'nowrap',
      textTransform: type === 'category' || type === 'risk' ? 'capitalize' : 'none',
      display: 'inline-block'
    }}>
      {label}
    </span>
  );
}

/**
 * Helper Functions
 */

function getCategoryColor(category) {
  const colors = {
    'derogatory': '#dc2626',
    'exclusionary': '#f97316',
    'dangerous': '#991b1b',
    'coded': '#7c3aed'
  };
  return colors[category?.toLowerCase()] || '#2d5a7b';
}

function getRiskColor(risk) {
  const colors = {
    'low': '#10b981',
    'medium': '#f59e0b',
    'high': '#ef4444'
  };
  return colors[risk?.toLowerCase()] || '#94a3b8';
}

function getConfidenceIcon(level) {
  const icons = {
    'low': '🟡 Low',
    'medium': '🟠 Med',
    'high': '🟢 High'
  };
  return icons[level?.toLowerCase()] || '❓ Unknown';
}

function getPlatformEmoji(platform) {
  const emojis = {
    'kenyatalk': '💬',
    'reddit': '🤖',
    'telegram': '✈️',
    'twitter': '🐦',
    'whatsapp': '💚',
    'facebook': '👍',
    'tiktok': '🎵',
    'youtube': '▶️',
    'discord': '💜',
    'other': '📱'
  };
  return emojis[platform?.toLowerCase()] || '📱';
}

function redactQuote(quote) {
  if (!quote) return '';
  
  return quote
    .replace(/@\w+/g, '[@redacted]')
    .replace(/#\w+/g, '[#redacted]')
    .slice(0, 100);
}

function formatDate(dateString) {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  } catch (error) {
    return '';
  }
}

function capitalizeFirst(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}