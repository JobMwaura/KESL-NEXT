'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function ApprovedContributions({ termId, type = null }) {
  const [contributions, setContributions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [popupImage, setPopupImage] = useState(null);

  useEffect(() => {
    loadApprovedContributions();
  }, [termId, type]);

  async function loadApprovedContributions() {
    try {
      setLoading(true);
      let query = supabase
        .from('community_contributions')
        .select('*')
        .eq('term_id', termId)
        .eq('status', 'approved')
        .order('helpful_count', { ascending: false });

      if (type) {
        query = query.eq('contribution_type', type);
      }

      const { data, error } = await query;
      if (error) throw error;
      setContributions(data || []);
    } catch (err) {
      console.error('Error loading contributions:', err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <p style={{ color: '#94a3b8' }}>Loading contributions...</p>;
  if (contributions.length === 0) return null;

  const parseContent = (content) => {
    try {
      return typeof content === 'string' ? JSON.parse(content) : content;
    } catch {
      return {};
    }
  };

  return (
    <div style={{ marginTop: '30px' }}>
      <h3 style={{
        margin: '0 0 20px 0',
        fontSize: '18px',
        color: '#1e293b',
        fontWeight: '700',
        paddingBottom: '10px',
        borderBottom: '2px solid #2d5a7b'
      }}>
        💬 Community Contributions
      </h3>

      <div style={{ display: 'grid', gap: '20px' }}>
        {contributions.map((contribution) => {
          const content = parseContent(contribution.content);
          const isExpanded = expandedId === contribution.id;

          return (
            <div
              key={contribution.id}
              style={{
                backgroundColor: '#f8fafc',
                border: '2px solid #cbd5e1',
                borderRadius: '10px',
                overflow: 'hidden',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#2d5a7b';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(45, 90, 123, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#cbd5e1';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {/* Header */}
              <div
                onClick={() => setExpandedId(isExpanded ? null : contribution.id)}
                style={{
                  backgroundColor: '#f1f5f9',
                  padding: '16px',
                  borderBottom: isExpanded ? '1px solid #cbd5e1' : 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{
                      fontSize: '13px',
                      fontWeight: '700',
                      color: '#475569',
                      textTransform: 'uppercase',
                      backgroundColor: '#2d5a7b',
                      color: 'white',
                      padding: '4px 10px',
                      borderRadius: '4px'
                    }}>
                      {getTypeEmoji(contribution.contribution_type)} {contribution.contribution_type}
                    </span>
                    <span style={{
                      fontSize: '11px',
                      color: '#94a3b8'
                    }}>
                      {new Date(contribution.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  
                  {/* Preview text */}
                  <p style={{
                    margin: 0,
                    fontSize: '13px',
                    color: '#64748b',
                    lineHeight: '1.5'
                  }}>
                    {getPreviewText(content, contribution.contribution_type)}
                  </p>
                </div>

                <div style={{ marginLeft: '15px', fontSize: '20px', color: '#2d5a7b' }}>
                  {isExpanded ? '▼' : '▶'}
                </div>
              </div>

              {/* Expanded Content */}
              {isExpanded && (
                <div style={{ padding: '20px', borderTop: '1px solid #cbd5e1' }}>
                  {contribution.contribution_type === 'example' && (
                    <ExampleContent content={content} contribution={contribution} popupImage={popupImage} setPopupImage={setPopupImage} />
                  )}

                  {contribution.contribution_type === 'context' && (
                    <ContextContent content={content} />
                  )}

                  {contribution.contribution_type === 'harm' && (
                    <HarmContent content={content} />
                  )}

                  {contribution.contribution_type === 'relation' && (
                    <RelationContent content={content} />
                  )}

                  {/* Helpful Counter */}
                  <div style={{
                    marginTop: '20px',
                    paddingTop: '15px',
                    borderTop: '1px solid #e2e8f0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <span style={{
                      fontSize: '12px',
                      color: '#94a3b8'
                    }}>
                      👍 {contribution.helpful_count || 0} found helpful
                    </span>
                    <span style={{
                      fontSize: '11px',
                      color: '#cbd5e1'
                    }}>
                      Submitted by community member
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Image Popup Modal */}
      {popupImage && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px'
          }}
          onClick={() => setPopupImage(null)}
        >
          <div
            style={{
              position: 'relative',
              maxWidth: '90vw',
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image */}
            <img
              src={getImageUrl(popupImage)}
              alt="Full size contribution image"
              style={{
                maxWidth: '100%',
                maxHeight: '75vh',
                borderRadius: '8px',
                objectFit: 'contain'
              }}
            />

            {/* Buttons Container */}
            <div
              style={{
                display: 'flex',
                gap: '10px',
                marginTop: '15px',
                justifyContent: 'flex-end'
              }}
            >
              {/* Download Button */}
              <button
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = getImageUrl(popupImage);
                  link.download = `contribution-${Date.now()}.jpg`;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
                style={{
                  padding: '10px 16px',
                  backgroundColor: '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '14px',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#059669'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#10b981'}
              >
                ⬇️ Download
              </button>

              {/* Close Button */}
              <button
                onClick={() => setPopupImage(null)}
                style={{
                  padding: '10px 16px',
                  backgroundColor: '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '14px',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#dc2626'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#ef4444'}
              >
                ✕ Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============ CONTENT TYPE COMPONENTS ============

function ExampleContent({ content, contribution, popupImage, setPopupImage }) {
  return (
    <div style={{ display: 'grid', gap: '20px' }}>
      {/* Quote */}
      {content.quote && (
        <div>
          <p style={{ margin: '0 0 8px 0', fontSize: '12px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase' }}>
            Quote
          </p>
          <div style={{
            backgroundColor: 'white',
            border: '1px solid #e2e8f0',
            borderLeft: '4px solid #2d5a7b',
            borderRadius: '4px',
            padding: '12px',
            fontSize: '14px',
            fontStyle: 'italic',
            color: '#1e293b',
            lineHeight: '1.6'
          }}>
            "{content.quote}"
          </div>
        </div>
      )}

      {/* Full Context */}
      {content.fullContext && (
        <div>
          <p style={{ margin: '0 0 8px 0', fontSize: '12px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase' }}>
            Full Context
          </p>
          <p style={{
            margin: 0,
            fontSize: '13px',
            color: '#475569',
            lineHeight: '1.6',
            backgroundColor: 'white',
            border: '1px solid #e2e8f0',
            borderRadius: '4px',
            padding: '12px'
          }}>
            {content.fullContext}
          </p>
        </div>
      )}

      {/* Platform & Date */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
        {content.platform && (
          <div>
            <p style={{ margin: '0 0 6px 0', fontSize: '12px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase' }}>
              Platform
            </p>
            <p style={{
              margin: 0,
              fontSize: '13px',
              color: '#1e293b',
              fontWeight: '600'
            }}>
              {content.platform}
            </p>
          </div>
        )}

        {content.eventDate && (
          <div>
            <p style={{ margin: '0 0 6px 0', fontSize: '12px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase' }}>
              Date Found
            </p>
            <p style={{
              margin: 0,
              fontSize: '13px',
              color: '#1e293b',
              fontWeight: '600'
            }}>
              {new Date(content.eventDate).toLocaleDateString()}
            </p>
          </div>
        )}
      </div>

      {/* Image - Thumbnail Card */}
      {contribution.image_url && (
        <div
          onClick={() => setPopupImage(contribution.image_url)}
          style={{
            marginTop: '20px',
            backgroundColor: '#f1f5f9',
            border: '2px dashed #2d5a7b',
            borderRadius: '8px',
            padding: '20px',
            cursor: 'pointer',
            textAlign: 'center',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '160px',
            flexDirection: 'column',
            gap: '12px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#e0e7ff';
            e.currentTarget.style.borderColor = '#4f46e5';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(79, 70, 229, 0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#f1f5f9';
            e.currentTarget.style.borderColor = '#2d5a7b';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <span style={{ fontSize: '40px' }}>📸</span>
          <div>
            <p style={{ margin: '0', fontSize: '14px', fontWeight: '700', color: '#1e293b' }}>
              Screenshot Attached
            </p>
            <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#64748b' }}>
              Click to view & download
            </p>
          </div>
          <div style={{
            marginTop: '8px',
            fontSize: '11px',
            color: '#94a3b8',
            fontStyle: 'italic'
          }}>
            → Click to enlarge
          </div>
        </div>
      )}

      {/* Source Reference */}
      {content.sourceRef && (
        <div>
          <p style={{ margin: '0 0 6px 0', fontSize: '12px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase' }}>
            Source Reference
          </p>
          <p style={{
            margin: 0,
            fontSize: '12px',
            color: '#475569',
            wordBreak: 'break-all'
          }}>
            {content.sourceRef}
          </p>
        </div>
      )}
    </div>
  );
}

function ContextContent({ content }) {
  return (
    <div style={{ display: 'grid', gap: '20px' }}>
      {content.emergence && (
        <div>
          <p style={{ margin: '0 0 10px 0', fontSize: '12px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase' }}>
            When & Where It Emerged
          </p>
          <p style={{
            margin: 0,
            fontSize: '13px',
            color: '#475569',
            lineHeight: '1.6',
            backgroundColor: 'white',
            border: '1px solid #e2e8f0',
            borderRadius: '4px',
            padding: '12px'
          }}>
            {content.emergence}
          </p>
        </div>
      )}

      {content.evolution && (
        <div>
          <p style={{ margin: '0 0 10px 0', fontSize: '12px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase' }}>
            How It Has Evolved
          </p>
          <p style={{
            margin: 0,
            fontSize: '13px',
            color: '#475569',
            lineHeight: '1.6',
            backgroundColor: 'white',
            border: '1px solid #e2e8f0',
            borderRadius: '4px',
            padding: '12px'
          }}>
            {content.evolution}
          </p>
        </div>
      )}

      {content.history && (
        <div>
          <p style={{ margin: '0 0 10px 0', fontSize: '12px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase' }}>
            Historical Context
          </p>
          <p style={{
            margin: 0,
            fontSize: '13px',
            color: '#475569',
            lineHeight: '1.6',
            backgroundColor: 'white',
            border: '1px solid #e2e8f0',
            borderRadius: '4px',
            padding: '12px'
          }}>
            {content.history}
          </p>
        </div>
      )}
    </div>
  );
}

function HarmContent({ content }) {
  return (
    <div style={{ display: 'grid', gap: '20px' }}>
      {content.description && (
        <div>
          <p style={{ margin: '0 0 10px 0', fontSize: '12px', fontWeight: '700', color: '#991b1b', textTransform: 'uppercase' }}>
            ⚠️ How It Causes Harm
          </p>
          <p style={{
            margin: 0,
            fontSize: '13px',
            color: '#475569',
            lineHeight: '1.6',
            backgroundColor: '#fee2e2',
            border: '1px solid #fca5a5',
            borderRadius: '4px',
            padding: '12px'
          }}>
            {content.description}
          </p>
        </div>
      )}

      {content.targetedGroups && (
        <div>
          <p style={{ margin: '0 0 10px 0', fontSize: '12px', fontWeight: '700', color: '#991b1b', textTransform: 'uppercase' }}>
            👥 Targeted Groups
          </p>
          <p style={{
            margin: 0,
            fontSize: '13px',
            color: '#475569',
            backgroundColor: 'white',
            border: '1px solid #e2e8f0',
            borderRadius: '4px',
            padding: '12px'
          }}>
            {content.targetedGroups}
          </p>
        </div>
      )}

      {content.consequences && (
        <div>
          <p style={{ margin: '0 0 10px 0', fontSize: '12px', fontWeight: '700', color: '#991b1b', textTransform: 'uppercase' }}>
            Real-World Consequences
          </p>
          <p style={{
            margin: 0,
            fontSize: '13px',
            color: '#475569',
            lineHeight: '1.6',
            backgroundColor: 'white',
            border: '1px solid #e2e8f0',
            borderRadius: '4px',
            padding: '12px'
          }}>
            {content.consequences}
          </p>
        </div>
      )}
    </div>
  );
}

function RelationContent({ content }) {
  return (
    <div style={{ display: 'grid', gap: '15px' }}>
      {content.relatedTerm && (
        <div>
          <p style={{ margin: '0 0 8px 0', fontSize: '12px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase' }}>
            Related Term
          </p>
          <p style={{
            margin: 0,
            fontSize: '16px',
            color: '#2d5a7b',
            fontWeight: '700'
          }}>
            {content.relatedTerm}
          </p>
        </div>
      )}

      {content.relationship && (
        <div>
          <p style={{ margin: '0 0 8px 0', fontSize: '12px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase' }}>
            Relationship Type
          </p>
          <div style={{
            backgroundColor: '#e0e7ff',
            border: '1px solid #c7d2fe',
            borderRadius: '4px',
            padding: '10px 12px',
            fontSize: '13px',
            color: '#4f46e5',
            fontWeight: '600',
            textTransform: 'capitalize'
          }}>
            {content.relationship}
          </div>
        </div>
      )}
    </div>
  );
}

// ============ HELPER FUNCTIONS ============

function getTypeEmoji(type) {
  const emojis = {
    example: '📋',
    context: '📚',
    harm: '⚠️',
    relation: '🔗'
  };
  return emojis[type] || '•';
}

function getImageUrl(imagePath) {
  if (!imagePath) return '';
  // If it's already a full URL, return it as-is
  if (imagePath.startsWith('http')) return imagePath;
  // If it already has the storage path structure, return as-is
  if (imagePath.includes('/storage/v1/object/public/')) return imagePath;
  // Otherwise construct the full URL
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return `${supabaseUrl}/storage/v1/object/public/${imagePath}`;
}

function getPreviewText(content, type) {
  if (type === 'example') {
    if (content.quote) return `"${content.quote.substring(0, 80)}${content.quote.length > 80 ? '...' : ''}"`;
    return 'Example contribution';
  }
  if (type === 'context') {
    if (content.emergence) return `Emerged: ${content.emergence.substring(0, 80)}...`;
    return 'Context contribution';
  }
  if (type === 'harm') {
    if (content.description) return `${content.description.substring(0, 80)}...`;
    return 'Harm description';
  }
  if (type === 'relation') {
    return `Related to: ${content.relatedTerm || 'another term'}`;
  }
  return 'Community contribution';
}