'use client';

import { useState, useEffect } from 'react';
import { fetchTermContributions } from '@/lib/supabase';

/**
 * ApprovedContributions Component
 * Displays approved community contributions for a specific term
 * 
 * Props:
 * - termId: ID of the term
 * - type: Type of contributions to show ('context', 'harm', 'example', 'relation', or undefined for all)
 */
export default function ApprovedContributions({ termId, type }) {
  const [contributions, setContributions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadContributions() {
      try {
        setLoading(true);
        const data = await fetchTermContributions(termId, type);
        setContributions(data || []);
      } catch (err) {
        console.error('Error loading contributions:', err);
        setError('Failed to load contributions');
      } finally {
        setLoading(false);
      }
    }

    if (termId) {
      loadContributions();
    }
  }, [termId, type]);

  if (loading) {
    return (
      <div style={{
        padding: '24px',
        textAlign: 'center',
        color: '#94a3b8'
      }}>
        <div style={{
          display: 'inline-block',
          width: '30px',
          height: '30px',
          border: '3px solid #e2e8f0',
          borderTop: '3px solid #2d5a7b',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          marginBottom: '12px'
        }} />
        <p style={{ margin: '0', fontSize: '14px' }}>Loading contributions...</p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        backgroundColor: '#fee2e2',
        border: '1px solid #fecaca',
        borderRadius: '8px',
        padding: '16px',
        color: '#991b1b'
      }}>
        <p style={{ margin: 0, fontSize: '14px' }}>
          ⚠️ {error}
        </p>
      </div>
    );
  }

  if (!contributions || contributions.length === 0) {
    return (
      <div style={{
        backgroundColor: '#f8fafc',
        border: '2px dashed #cbd5e1',
        borderRadius: '10px',
        padding: '40px',
        textAlign: 'center'
      }}>
        <p style={{
          fontSize: '16px',
          color: '#64748b',
          margin: '0 0 16px 0'
        }}>
          {type ? `No ${type} contributions yet.` : 'No contributions yet.'}
        </p>
        <p style={{
          fontSize: '14px',
          color: '#94a3b8',
          margin: 0
        }}>
          Be the first to contribute! Use the Contribute tab to add context, examples, or harms.
        </p>
      </div>
    );
  }

  return (
    <div style={{
      display: 'grid',
      gap: '20px'
    }}>
      {contributions.map((contribution) => (
        <ContributionCard 
          key={contribution.id} 
          contribution={contribution}
          type={type}
        />
      ))}
    </div>
  );
}

/**
 * Individual Contribution Card
 */
function ContributionCard({ contribution, type }) {
  const [showFull, setShowFull] = useState(false);

  const getTypeColor = (contType) => {
    const colors = {
      context: { bg: '#dbeafe', border: '#0284c7', text: '#0c4a6e', icon: '📚' },
      harm: { bg: '#fee2e2', border: '#dc2626', text: '#991b1b', icon: '💔' },
      example: { bg: '#dbeafe', border: '#0284c7', text: '#0c4a6e', icon: '💬' },
      relation: { bg: '#e0e7ff', border: '#4f46e5', text: '#3730a3', icon: '🔗' },
      other: { bg: '#f3e8ff', border: '#7c3aed', text: '#5b21b6', icon: '📝' }
    };
    return colors[contType] || colors.other;
  };

  const typeConfig = getTypeColor(contribution.type || type);
  const contentPreview = contribution.content?.slice(0, 200);
  const isLongContent = contribution.content && contribution.content.length > 200;

  return (
    <div style={{
      backgroundColor: 'white',
      border: `2px solid ${typeConfig.border}`,
      borderRadius: '10px',
      padding: '24px',
      transition: 'all 0.3s ease'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
      e.currentTarget.style.transform = 'translateY(-2px)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.boxShadow = 'none';
      e.currentTarget.style.transform = 'translateY(0)';
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '16px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <span style={{
            backgroundColor: typeConfig.bg,
            color: typeConfig.text,
            padding: '8px 14px',
            borderRadius: '6px',
            fontSize: '13px',
            fontWeight: '700',
            whiteSpace: 'nowrap'
          }}>
            {typeConfig.icon} {capitalizeFirst(contribution.type || type || 'Contribution')}
          </span>
          
          {contribution.contributor && (
            <span style={{
              fontSize: '13px',
              color: '#94a3b8',
              fontStyle: 'italic'
            }}>
              by {contribution.contributor}
            </span>
          )}
        </div>

        {contribution.status && (
          <span style={{
            fontSize: '12px',
            color: contribution.status === 'approved' ? '#10b981' : '#f59e0b',
            fontWeight: '600',
            backgroundColor: contribution.status === 'approved' ? '#ecfdf5' : '#fffbeb',
            padding: '4px 12px',
            borderRadius: '4px'
          }}>
            ✓ {capitalizeFirst(contribution.status)}
          </span>
        )}
      </div>

      {/* Title/Subject (if present) */}
      {contribution.title && (
        <h4 style={{
          fontSize: '16px',
          fontWeight: '700',
          color: '#1e293b',
          margin: '0 0 12px 0'
        }}>
          {contribution.title}
        </h4>
      )}

      {/* Content */}
      <div style={{
        fontSize: '15px',
        color: '#475569',
        lineHeight: '1.7',
        backgroundColor: '#f8fafc',
        padding: '16px',
        borderRadius: '8px',
        marginBottom: '12px',
        borderLeft: `4px solid ${typeConfig.border}`
      }}>
        {showFull ? contribution.content : contentPreview}
        {isLongContent && !showFull && '...'}
      </div>

      {/* Show More/Less */}
      {isLongContent && (
        <button
          onClick={() => setShowFull(!showFull)}
          style={{
            fontSize: '13px',
            color: typeConfig.text,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontWeight: '600',
            padding: '0',
            marginBottom: '12px',
            textDecoration: 'underline'
          }}
        >
          {showFull ? '▲ Show less' : '▼ Read more'}
        </button>
      )}

      {/* Metadata */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '16px',
        fontSize: '12px',
        color: '#94a3b8',
        paddingTop: '12px',
        borderTop: '1px solid #e2e8f0'
      }}>
        {contribution.created_at && (
          <span>
            📅 {new Date(contribution.created_at).toLocaleDateString()}
          </span>
        )}
        
        {contribution.category && (
          <span>
            🏷️ {capitalizeFirst(contribution.category)}
          </span>
        )}

        {contribution.language && (
          <span>
            🌐 {contribution.language}
          </span>
        )}

        {contribution.source && (
          <span>
            📌 {capitalizeFirst(contribution.source)}
          </span>
        )}
      </div>

      {/* Additional Fields based on type */}
      {contribution.type === 'harm' && contribution.affected_groups && (
        <div style={{
          marginTop: '12px',
          padding: '12px',
          backgroundColor: '#fee2e2',
          borderRadius: '6px',
          fontSize: '13px',
          color: '#991b1b'
        }}>
          <strong>Affected Groups:</strong> {contribution.affected_groups}
        </div>
      )}

      {contribution.type === 'example' && contribution.platform && (
        <div style={{
          marginTop: '12px',
          padding: '12px',
          backgroundColor: typeConfig.bg,
          borderRadius: '6px',
          fontSize: '13px',
          color: typeConfig.text,
          fontWeight: '600'
        }}>
          Platform: {capitalizeFirst(contribution.platform)}
        </div>
      )}

      {contribution.url && (
        <div style={{
          marginTop: '12px'
        }}>
          <a
            href={contribution.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: '13px',
              color: '#0284c7',
              textDecoration: 'none',
              fontWeight: '600',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 12px',
              backgroundColor: '#dbeafe',
              borderRadius: '6px',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#bfdbfe';
              e.target.style.color = '#0c4a6e';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#dbeafe';
              e.target.style.color = '#0284c7';
            }}
          >
            🔗 View Source
          </a>
        </div>
      )}
    </div>
  );
}

/**
 * Capitalize first letter
 */
function capitalizeFirst(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}