/**
 * components/VariantWarning.js
 * Shows "Did you mean X?" warning when user types similar term
 * Helps prevent duplicate documentation
 * Used in submit form Step 1
 */

'use client';

import React from 'react';

export default function VariantWarning({
  suggestedTerm = null,
  onViewTerm = () => {},
  onMarkAsVariant = () => {},
  show = true
}) {
  // Don't render if no suggestion or explicitly hidden
  if (!show || !suggestedTerm) {
    return null;
  }

  return (
    <div
      className="variant-warning"
      role="alert"
      aria-live="polite"
      style={{
        padding: '12px 16px',
        backgroundColor: '#fef3c7',
        border: '1px solid #fcd34d',
        borderRadius: '6px',
        marginTop: '12px',
        fontSize: '13px',
        color: '#92400e',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px'
      }}
    >
      <style jsx>{`
        .variant-warning {
          animation: slideDown 0.2s ease-out;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .warning-icon {
          flex-shrink: 0;
          font-size: 18px;
          line-height: 1.5;
        }

        .warning-content {
          flex: 1;
          line-height: 1.5;
        }

        .warning-title {
          font-weight: 600;
          margin-bottom: 6px;
        }

        .warning-term {
          font-weight: 600;
          color: #b45309;
        }

        .warning-details {
          font-size: 12px;
          margin-top: 4px;
          color: #854d0e;
        }

        .warning-actions {
          display: flex;
          gap: 8px;
          margin-top: 8px;
          flex-wrap: wrap;
        }

        .warning-link {
          background: #fbbf24;
          color: #78350f;
          padding: 4px 8px;
          border-radius: 3px;
          text-decoration: none;
          font-weight: 500;
          font-size: 12px;
          cursor: pointer;
          border: none;
          transition: all 0.2s ease;
        }

        .warning-link:hover {
          background: #fcd34d;
          color: #451a03;
        }

        .warning-link:active {
          transform: scale(0.98);
        }

        .warning-button-secondary {
          background: transparent;
          color: #92400e;
          padding: 4px 8px;
          border: 1px solid #fbbf24;
          border-radius: 3px;
          font-size: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .warning-button-secondary:hover {
          background: #fef3c7;
          border-color: #92400e;
        }

        .close-button {
          flex-shrink: 0;
          background: transparent;
          border: none;
          color: #92400e;
          cursor: pointer;
          padding: 0;
          font-size: 16px;
          line-height: 1;
          opacity: 0.7;
          transition: opacity 0.2s ease;
        }

        .close-button:hover {
          opacity: 1;
        }

        @media (max-width: 640px) {
          .variant-warning {
            flex-direction: column;
          }

          .warning-actions {
            flex-direction: column;
          }

          .warning-link,
          .warning-button-secondary {
            width: 100%;
            text-align: center;
          }
        }
      `}</style>

      {/* Warning icon */}
      <span className="warning-icon" aria-hidden="true">
        💡
      </span>

      {/* Warning content */}
      <div className="warning-content">
        <div className="warning-title">Found a similar term</div>
        <div>
          We found a term that might be the same as{' '}
          <span className="warning-term">"{suggestedTerm.term}"</span>
          {suggestedTerm.year && (
            <span className="warning-details"> (documented {suggestedTerm.year})</span>
          )}
        </div>

        {/* If suggested term has details */}
        {suggestedTerm.category && (
          <div className="warning-details">
            Category: {suggestedTerm.category}
            {suggestedTerm.riskLevel && ` • Risk: ${suggestedTerm.riskLevel}`}
          </div>
        )}

        {/* Action buttons */}
        <div className="warning-actions">
          <button
            className="warning-link"
            onClick={() => onViewTerm(suggestedTerm.id)}
            title={`View the existing term "${suggestedTerm.term}"`}
          >
            View existing term
          </button>

          <button
            className="warning-button-secondary"
            onClick={() => onMarkAsVariant(suggestedTerm.id)}
            title={`Mark your term as a variant of "${suggestedTerm.term}"`}
          >
            It's a variant
          </button>
        </div>
      </div>

      {/* Close button (optional - for dismissing the warning) */}
      <button
        className="close-button"
        onClick={() => {
          // Parent component should handle dismissing
          // For now, just provide the button
        }}
        aria-label="Dismiss warning"
        title="Dismiss this warning"
      >
        ✕
      </button>
    </div>
  );
}

/**
 * Variant showing only in compact form (for form rows)
 */
export function VariantWarningCompact({
  suggestedTerm = null,
  onViewTerm = () => {},
  show = true
}) {
  if (!show || !suggestedTerm) return null;

  return (
    <div
      style={{
        padding: '8px 12px',
        backgroundColor: '#fef3c7',
        border: '1px solid #fcd34d',
        borderRadius: '4px',
        fontSize: '12px',
        color: '#92400e',
        marginTop: '8px'
      }}
    >
      <strong>💡 Found:</strong> "{suggestedTerm.term}"
      <button
        onClick={() => onViewTerm(suggestedTerm.id)}
        style={{
          marginLeft: '8px',
          background: 'transparent',
          border: 'none',
          color: '#b45309',
          cursor: 'pointer',
          textDecoration: 'underline',
          fontSize: '12px',
          fontWeight: '500'
        }}
      >
        View
      </button>
    </div>
  );
}

/**
 * Inline variant warning (one-liner)
 */
export function VariantWarningInline({
  suggestedTerm = null,
  show = true
}) {
  if (!show || !suggestedTerm) return null;

  return (
    <span
      style={{
        display: 'inline-block',
        padding: '2px 6px',
        backgroundColor: '#fef3c7',
        border: '1px solid #fcd34d',
        borderRadius: '3px',
        fontSize: '11px',
        color: '#92400e',
        marginLeft: '8px'
      }}
      title={`Similar to existing term: "${suggestedTerm.term}"`}
    >
      💡 Similar term exists
    </span>
  );
}