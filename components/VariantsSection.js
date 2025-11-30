'use client';

import React, { useState } from 'react';
import Link from 'next/link';

/**
 * VariantsSection Component
 * Shows term variants (alternate spellings) and related terms
 * Allows navigation to related terms
 * 
 * Props:
 * - variants: Array of variant strings ["Kagege", "Tugge", ...]
 * - related_terms: Array of related term objects [{ id, term, relation_type }, ...]
 * - currentTermId: Current term ID (to prevent self-linking)
 * - isInitiallyOpen: Start expanded (default: false)
 */
export default function VariantsSection({ 
  variants = [], 
  related_terms = [],
  currentTermId = '',
  isInitiallyOpen = false 
}) {
  const [isOpen, setIsOpen] = useState(isInitiallyOpen);
  const [copiedVariant, setCopiedVariant] = useState(null);

  // Relation type configuration
  const relationTypes = {
    variant_of: {
      icon: '🔤',
      label: 'Variant of',
      color: '#2d5a7b',
      bgColor: '#dbeafe',
      description: 'Alternative spelling or pronunciation'
    },
    similar_to: {
      icon: '🔗',
      label: 'Similar to',
      color: '#7c3aed',
      bgColor: '#ede9fe',
      description: 'Similar term with comparable meaning'
    },
    evolved_from: {
      icon: '📈',
      label: 'Evolved from',
      color: '#059669',
      bgColor: '#d1fae5',
      description: 'Original or earlier form of term'
    },
    evolved_to: {
      icon: '➡️',
      label: 'Evolved to',
      color: '#dc2626',
      bgColor: '#fee2e2',
      description: 'Current evolution of this term'
    },
    related: {
      icon: '🔀',
      label: 'Related',
      color: '#f59e0b',
      bgColor: '#fef3c7',
      description: 'Related but distinct term'
    }
  };

  const hasContent = variants.length > 0 || related_terms.length > 0;

  if (!hasContent) {
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
          No variants or related terms documented yet.
        </p>
      </div>
    );
  }

  const handleCopyVariant = (variant) => {
    navigator.clipboard.writeText(variant);
    setCopiedVariant(variant);
    setTimeout(() => setCopiedVariant(null), 2000);
  };

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
            🔤 Variants & Related ({(variants.length || 0) + (related_terms.length || 0)})
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
          {/* Variants Section */}
          {variants && variants.length > 0 && (
            <div style={{
              padding: '20px',
              borderBottom: related_terms.length > 0 ? '1px solid #e2e8f0' : 'none'
            }}>
              <h4 style={{
                margin: '0 0 16px 0',
                fontSize: '13px',
                fontWeight: '700',
                color: '#1e293b',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                📝 Variant Spellings
              </h4>

              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px'
              }}>
                {variants.map((variant, index) => (
                  <button
                    key={index}
                    onClick={() => handleCopyVariant(variant)}
                    style={{
                      backgroundColor: '#dbeafe',
                      border: '1px solid #0284c7',
                      color: '#0c4a6e',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: '600',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      whiteSpace: 'nowrap'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#bfdbfe';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#dbeafe';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    {copiedVariant === variant ? '✓ Copied!' : variant}
                  </button>
                ))}
              </div>

              <p style={{
                margin: '12px 0 0 0',
                fontSize: '11px',
                color: '#64748b',
                fontStyle: 'italic'
              }}>
                💡 Click a variant to copy it
              </p>
            </div>
          )}

          {/* Related Terms Section */}
          {related_terms && related_terms.length > 0 && (
            <div style={{
              padding: '20px'
            }}>
              <h4 style={{
                margin: '0 0 16px 0',
                fontSize: '13px',
                fontWeight: '700',
                color: '#1e293b',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                🔗 Related Terms
              </h4>

              <div style={{
                display: 'grid',
                gap: '10px'
              }}>
                {related_terms.map((relatedTerm, index) => {
                  // Skip if linking to itself
                  if (relatedTerm.id === currentTermId) return null;

                  const relation = relationTypes[relatedTerm.relation_type] || relationTypes.related;

                  return (
                    <Link
                      key={index}
                      href={`/lexicon/${relatedTerm.id}`}
                      style={{ textDecoration: 'none' }}
                    >
                      <div
                        style={{
                          backgroundColor: relation.bgColor,
                          border: `1px solid ${relation.color}33`,
                          borderRadius: '6px',
                          padding: '12px',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '12px'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = relation.color + '11';
                          e.currentTarget.style.transform = 'translateX(4px)';
                          e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = relation.bgColor;
                          e.currentTarget.style.transform = 'translateX(0)';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          flex: 1,
                          minWidth: 0
                        }}>
                          <span style={{
                            fontSize: '16px',
                            flexShrink: 0
                          }}>
                            {relation.icon}
                          </span>
                          <div style={{
                            minWidth: 0
                          }}>
                            <p style={{
                              margin: '0 0 4px 0',
                              fontSize: '12px',
                              fontWeight: '700',
                              color: '#1e293b',
                              wordWrap: 'break-word',
                              overflowWrap: 'break-word'
                            }}>
                              {relatedTerm.term}
                            </p>
                            <p style={{
                              margin: 0,
                              fontSize: '11px',
                              color: relation.color,
                              fontWeight: '600',
                              textTransform: 'uppercase',
                              letterSpacing: '0.5px'
                            }}>
                              {relation.label}
                            </p>
                          </div>
                        </div>

                        {/* Relation Badge */}
                        <div style={{
                          backgroundColor: relation.color,
                          color: 'white',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '10px',
                          fontWeight: '700',
                          whiteSpace: 'nowrap',
                          flexShrink: 0
                        }}>
                          →
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>

              <p style={{
                margin: '12px 0 0 0',
                fontSize: '11px',
                color: '#64748b',
                fontStyle: 'italic'
              }}>
                💡 Click a term to view its full documentation
              </p>
            </div>
          )}

          {/* Research Note */}
          <div style={{
            padding: '12px 20px',
            backgroundColor: '#f0fdf4',
            borderTop: '1px solid #e2e8f0',
            borderRadius: '0 0 8px 8px'
          }}>
            <p style={{
              margin: 0,
              fontSize: '12px',
              color: '#15803d',
              lineHeight: '1.5'
            }}>
              <span style={{ fontWeight: '700' }}>📚 Research Note:</span> Understanding variants and related terms is crucial for comprehensive documentation. 
              Variants show spelling/pronunciation differences across regions, while related terms map the semantic network of extreme speech.
            </p>
          </div>
        </div>
      )}

      <style jsx>{`
        @media (max-width: 768px) {
          div[style*="display: flex"][style*="gap: 8px"] {
            flex-direction: column;
          }

          button {
            width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
}