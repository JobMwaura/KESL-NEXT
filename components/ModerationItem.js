'use client';

import { useState } from 'react';

export default function ModerationItem({ 
  item, 
  onApprove, 
  onReject, 
  onRevise,
  loading 
}) {
  const [showDetails, setShowDetails] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);

  const getTypeIcon = (type) => {
    const icons = {
      'example': '💬',
      'context': '📚',
      'harm': '💔',
      'relation': '🔗'
    };
    return icons[type] || '📝';
  };

  const getTypeColor = (type) => {
    const colors = {
      'example': '#dbeafe',
      'context': '#dbeafe',
      'harm': '#fee2e2',
      'relation': '#e0e7ff'
    };
    return colors[type] || '#f1f5f9';
  };

  const getTypeTextColor = (type) => {
    const colors = {
      'example': '#0c4a6e',
      'context': '#0c4a6e',
      'harm': '#991b1b',
      'relation': '#3730a3'
    };
    return colors[type] || '#1e293b';
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }
    await onReject(item.id, rejectReason);
    setShowRejectForm(false);
    setRejectReason('');
  };

  return (
    <div style={{
      backgroundColor: 'white',
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      padding: '20px',
      marginBottom: '16px'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '16px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          {/* Type Badge */}
          <span style={{
            backgroundColor: getTypeColor(item.type),
            color: getTypeTextColor(item.type),
            padding: '8px 14px',
            borderRadius: '6px',
            fontSize: '13px',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            {getTypeIcon(item.type)} {item.type}
          </span>

          {/* Status Badge */}
          <span style={{
            backgroundColor: item.status === 'pending' ? '#fef3c7' : 
                           item.status === 'approved' ? '#d1fae5' : '#fee2e2',
            color: item.status === 'pending' ? '#92400e' :
                   item.status === 'approved' ? '#065f46' : '#7f1d1d',
            padding: '6px 12px',
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: '600',
            textTransform: 'capitalize'
          }}>
            {item.status}
          </span>
        </div>

        {/* Date */}
        <span style={{
          fontSize: '12px',
          color: '#94a3b8'
        }}>
          {formatDate(item.created_at)}
        </span>
      </div>

      {/* Content Preview */}
      <div style={{
        backgroundColor: '#f8fafc',
        border: '1px solid #e2e8f0',
        borderRadius: '6px',
        padding: '16px',
        marginBottom: '16px',
        maxHeight: '150px',
        overflow: 'auto'
      }}>
        {/* Example Type */}
        {item.type === 'example' && (
          <div>
            <p style={{ margin: '0 0 8px 0', fontSize: '12px', fontWeight: '700', color: '#94a3b8' }}>
              QUOTE
            </p>
            <p style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#1e293b', fontFamily: 'monospace' }}>
              "{item.data.quote}"
            </p>
            <p style={{ margin: '0 0 4px 0', fontSize: '12px', fontWeight: '700', color: '#94a3b8' }}>
              PLATFORM
            </p>
            <p style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#1e293b' }}>
              {item.data.platform}
            </p>
            <p style={{ margin: '0 0 4px 0', fontSize: '12px', fontWeight: '700', color: '#94a3b8' }}>
              DATE OBSERVED
            </p>
            <p style={{ margin: '0', fontSize: '14px', color: '#1e293b' }}>
              {item.data.date_observed}
            </p>
            {item.data.source_url && (
              <>
                <p style={{ margin: '12px 0 4px 0', fontSize: '12px', fontWeight: '700', color: '#94a3b8' }}>
                  SOURCE
                </p>
                <p style={{ margin: '0', fontSize: '14px', color: '#2563eb' }}>
                  <a href={item.data.source_url} target="_blank" rel="noreferrer" style={{ color: '#2563eb', textDecoration: 'underline' }}>
                    {item.data.source_url}
                  </a>
                </p>
              </>
            )}
          </div>
        )}

        {/* Context Type */}
        {item.type === 'context' && (
          <div>
            <p style={{ margin: '0 0 8px 0', fontSize: '12px', fontWeight: '700', color: '#94a3b8' }}>
              CONTEXT
            </p>
            <p style={{ margin: '0', fontSize: '14px', color: '#1e293b', lineHeight: '1.6' }}>
              {item.data.context}
            </p>
          </div>
        )}

        {/* Harm Type */}
        {item.type === 'harm' && (
          <div>
            <p style={{ margin: '0 0 8px 0', fontSize: '12px', fontWeight: '700', color: '#94a3b8' }}>
              HARM TYPE
            </p>
            <p style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#1e293b', textTransform: 'capitalize' }}>
              {item.data.harm_type.replace(/_/g, ' ')}
            </p>
            <p style={{ margin: '0 0 8px 0', fontSize: '12px', fontWeight: '700', color: '#94a3b8' }}>
              DESCRIPTION
            </p>
            <p style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#1e293b', lineHeight: '1.6' }}>
              {item.data.harm_description}
            </p>
            {item.data.targeted_groups && (
              <>
                <p style={{ margin: '0 0 8px 0', fontSize: '12px', fontWeight: '700', color: '#94a3b8' }}>
                  AFFECTED GROUPS
                </p>
                <p style={{ margin: '0', fontSize: '14px', color: '#1e293b' }}>
                  {item.data.targeted_groups}
                </p>
              </>
            )}
          </div>
        )}

        {/* Relation Type */}
        {item.type === 'relation' && (
          <div>
            <p style={{ margin: '0 0 8px 0', fontSize: '12px', fontWeight: '700', color: '#94a3b8' }}>
              RELATED TERM ID
            </p>
            <p style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#1e293b', fontFamily: 'monospace' }}>
              {item.data.related_term_id}
            </p>
            <p style={{ margin: '0 0 8px 0', fontSize: '12px', fontWeight: '700', color: '#94a3b8' }}>
              RELATIONSHIP TYPE
            </p>
            <p style={{ margin: '0', fontSize: '14px', color: '#1e293b', textTransform: 'capitalize' }}>
              {item.data.relation_type.replace(/_/g, ' ')}
            </p>
          </div>
        )}
      </div>

      {/* Rejection Reason (if rejected) */}
      {item.status === 'rejected' && item.rejection_reason && (
        <div style={{
          backgroundColor: '#fee2e2',
          border: '1px solid #fecaca',
          borderRadius: '6px',
          padding: '12px',
          marginBottom: '16px',
          fontSize: '13px',
          color: '#7f1d1d'
        }}>
          <p style={{ margin: '0 0 4px 0', fontWeight: '700' }}>Rejection Reason:</p>
          <p style={{ margin: '0' }}>
            {item.rejection_reason}
          </p>
        </div>
      )}

      {/* Reject Form */}
      {showRejectForm && (
        <div style={{
          backgroundColor: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '6px',
          padding: '12px',
          marginBottom: '16px'
        }}>
          <textarea
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="Why are you rejecting this contribution?"
            style={{
              width: '100%',
              padding: '8px',
              fontSize: '13px',
              border: '1px solid #cbd5e1',
              borderRadius: '4px',
              minHeight: '60px',
              boxSizing: 'border-box',
              marginBottom: '8px',
              fontFamily: 'inherit'
            }}
          />
          <div style={{
            display: 'flex',
            gap: '8px'
          }}>
            <button
              onClick={() => setShowRejectForm(false)}
              style={{
                flex: 1,
                padding: '8px',
                backgroundColor: '#f1f5f9',
                color: '#64748b',
                border: '1px solid #e2e8f0',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: '600'
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleReject}
              disabled={loading}
              style={{
                flex: 1,
                padding: '8px',
                backgroundColor: loading ? '#cbd5e1' : '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '12px',
                fontWeight: '600'
              }}
            >
              {loading ? 'Rejecting...' : 'Confirm Rejection'}
            </button>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      {item.status === 'pending' && (
        <div style={{
          display: 'flex',
          gap: '8px'
        }}>
          <button
            onClick={() => onApprove(item.id)}
            disabled={loading}
            style={{
              flex: 1,
              padding: '10px',
              backgroundColor: loading ? '#cbd5e1' : '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: '600',
              fontSize: '13px'
            }}
          >
            {loading ? 'Approving...' : '✓ Approve'}
          </button>

          <button
            onClick={() => setShowRejectForm(!showRejectForm)}
            style={{
              flex: 1,
              padding: '10px',
              backgroundColor: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '13px'
            }}
          >
            ✕ Reject
          </button>

          {onRevise && (
            <button
              onClick={() => onRevise(item.id)}
              style={{
                flex: 1,
                padding: '10px',
                backgroundColor: '#f59e0b',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '13px'
              }}
            >
              ✎ Revise
            </button>
          )}
        </div>
      )}

      {item.status !== 'pending' && (
        <div style={{
          padding: '10px',
          backgroundColor: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '6px',
          textAlign: 'center',
          fontSize: '13px',
          color: '#64748b',
          fontWeight: '600'
        }}>
          {item.status === 'approved' ? '✓ Approved' : '✕ Rejected'}
          {item.approved_at && (
            <p style={{ margin: '4px 0 0 0', fontSize: '12px' }}>
              {formatDate(item.approved_at)}
            </p>
          )}
        </div>
      )}
    </div>
  );
}