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

  const getTypeEmoji = (type) => {
    const emojis = {
      example: '📋',
      context: '📚',
      harm: '⚠️',
      relation: '🔗'
    };
    return emojis[type] || '•';
  };

  const parseContent = (content) => {
    try {
      return typeof content === 'string' ? JSON.parse(content) : content;
    } catch {
      return {};
    }
  };

  return (
    <div style={{ marginTop: '30px' }}>
      <h3
        style={{
          margin: '0 0 15px 0',
          fontSize: '18px',
          color: '#1e293b',
          fontWeight: '700'
        }}
      >
        Community Contributions
      </h3>

      <div style={{ display: 'grid', gap: '15px' }}>
        {contributions.map((contribution) => {
          const content = parseContent(contribution.content);
          return (
            <div
              key={contribution.id}
              style={{
                backgroundColor: '#f8fafc',
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                padding: '16px',
                borderLeft: '4px solid #2d5a7b'
              }}
            >
              {/* Header */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '10px'
                }}
              >
                <span
                  style={{
                    fontSize: '13px',
                    fontWeight: '700',
                    color: '#475569',
                    textTransform: 'uppercase'
                  }}
                >
                  {getTypeEmoji(contribution.contribution_type)}{' '}
                  {contribution.contribution_type}
                </span>
                <span
                  style={{
                    fontSize: '11px',
                    color: '#94a3b8'
                  }}
                >
                  {new Date(contribution.created_at).toLocaleDateString()}
                </span>
              </div>

              {/* Content based on type */}
              {contribution.contribution_type === 'example' && (
                <>
                  {content.quote && (
                    <p
                      style={{
                        margin: '0 0 10px 0',
                        fontSize: '14px',
                        fontStyle: 'italic',
                        color: '#1e293b',
                        lineHeight: '1.6'
                      }}
                    >
                      "{content.quote}"
                    </p>
                  )}
                  {content.platform && (
                    <p
                      style={{
                        margin: '0 0 8px 0',
                        fontSize: '12px',
                        color: '#475569'
                      }}
                    >
                      <strong>Platform:</strong> {content.platform}
                    </p>
                  )}
                  {content.fullContext && (
                    <p
                      style={{
                        margin: '0',
                        fontSize: '13px',
                        color: '#64748b',
                        lineHeight: '1.5'
                      }}
                    >
                      {content.fullContext}
                    </p>
                  )}
                </>
              )}

              {contribution.contribution_type === 'context' && (
                <>
                  {content.emergence && (
                    <>
                      <p
                        style={{
                          margin: '0 0 4px 0',
                          fontSize: '12px',
                          fontWeight: '700',
                          color: '#94a3b8'
                        }}
                      >
                        EMERGENCE
                      </p>
                      <p
                        style={{
                          margin: '0 0 12px 0',
                          fontSize: '13px',
                          color: '#475569',
                          lineHeight: '1.5'
                        }}
                      >
                        {content.emergence}
                      </p>
                    </>
                  )}
                  {content.evolution && (
                    <>
                      <p
                        style={{
                          margin: '0 0 4px 0',
                          fontSize: '12px',
                          fontWeight: '700',
                          color: '#94a3b8'
                        }}
                      >
                        EVOLUTION
                      </p>
                      <p
                        style={{
                          margin: '0',
                          fontSize: '13px',
                          color: '#475569',
                          lineHeight: '1.5'
                        }}
                      >
                        {content.evolution}
                      </p>
                    </>
                  )}
                </>
              )}

              {contribution.contribution_type === 'harm' && (
                <>
                  {content.description && (
                    <>
                      <p
                        style={{
                          margin: '0 0 4px 0',
                          fontSize: '12px',
                          fontWeight: '700',
                          color: '#94a3b8'
                        }}
                      >
                        HOW IT CAUSES HARM
                      </p>
                      <p
                        style={{
                          margin: '0 0 12px 0',
                          fontSize: '13px',
                          color: '#475569',
                          lineHeight: '1.5'
                        }}
                      >
                        {content.description}
                      </p>
                    </>
                  )}
                  {content.targetedGroups && (
                    <>
                      <p
                        style={{
                          margin: '0 0 4px 0',
                          fontSize: '12px',
                          fontWeight: '700',
                          color: '#94a3b8'
                        }}
                      >
                        TARGETED GROUPS
                      </p>
                      <p
                        style={{
                          margin: '0',
                          fontSize: '13px',
                          color: '#475569'
                        }}
                      >
                        {content.targetedGroups}
                      </p>
                    </>
                  )}
                </>
              )}

              {contribution.contribution_type === 'relation' && (
                <>
                  <p
                    style={{
                      margin: '0 0 4px 0',
                      fontSize: '12px',
                      fontWeight: '700',
                      color: '#94a3b8'
                    }}
                  >
                    RELATED TERM
                  </p>
                  <p
                    style={{
                      margin: '0 0 8px 0',
                      fontSize: '14px',
                      fontWeight: '700',
                      color: '#1e293b'
                    }}
                  >
                    {content.relatedTerm}
                  </p>
                  <p
                    style={{
                      margin: '0',
                      fontSize: '12px',
                      color: '#475569'
                    }}
                  >
                    <strong>Relationship:</strong> {content.relationship}
                  </p>
                </>
              )}

              {/* Helpful counter */}
              <div
                style={{
                  marginTop: '12px',
                  paddingTop: '12px',
                  borderTop: '1px solid #e2e8f0',
                  fontSize: '12px',
                  color: '#94a3b8'
                }}
              >
                👍 {contribution.helpful_count || 0} found helpful
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}