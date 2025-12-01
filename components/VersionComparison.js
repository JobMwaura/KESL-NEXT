/**
 * components/VersionComparison.js
 * Side-by-side comparison of two versions
 * Shows field-level differences with visual highlighting
 */

'use client';

import React from 'react';

export default function VersionComparison({
  versionA = null,
  versionB = null,
  diff = null
}) {
  if (!versionA || !versionB) {
    return (
      <div style={{ padding: '20px', color: '#94a3b8', textAlign: 'center' }}>
        Select two versions to compare
      </div>
    );
  }

  const getVersionLabel = (version) => {
    return `v${version.version_number} - ${new Date(
      version.created_at
    ).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })}`;
  };

  return (
    <div style={{ width: '100%' }}>
      <style jsx>{`
        .comparison-container {
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          overflow: hidden;
          background: white;
        }

        .comparison-header {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1px;
          background: #e2e8f0;
          padding: 0;
        }

        .comparison-column-header {
          padding: 16px;
          background: #f8fafc;
          font-weight: 600;
          font-size: 14px;
          color: #1e293b;
          border-right: 1px solid #e2e8f0;
        }

        .comparison-column-header:last-child {
          border-right: none;
        }

        .comparison-body {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1px;
          background: #e2e8f0;
          padding: 0;
          min-height: 200px;
        }

        .comparison-cell {
          padding: 20px;
          background: white;
          overflow-y: auto;
          max-height: 600px;
        }

        .comparison-cell:nth-child(odd) {
          border-right: 1px solid #e2e8f0;
        }

        .field-section {
          margin-bottom: 24px;
        }

        .field-name {
          font-weight: 600;
          font-size: 12px;
          color: #475569;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 8px;
        }

        .field-content {
          font-size: 13px;
          color: #1e293b;
          line-height: 1.5;
          word-break: break-word;
        }

        .added {
          background: #dcfce7;
          padding: 8px;
          border-left: 3px solid #10b981;
          border-radius: 3px;
          color: #166534;
        }

        .removed {
          background: #fee2e2;
          padding: 8px;
          border-left: 3px solid #ef4444;
          border-radius: 3px;
          color: #991b1b;
          text-decoration: line-through;
        }

        .modified {
          background: #dbeafe;
          padding: 8px;
          border-left: 3px solid #0284c7;
          border-radius: 3px;
          color: #0c4a6e;
        }

        .array-item {
          padding: 6px 0;
          border-bottom: 1px solid #e2e8f0;
        }

        .array-item:last-child {
          border-bottom: none;
        }

        .changelog-summary {
          padding: 12px;
          background: #f1f5f9;
          border-left: 3px solid #0284c7;
          border-radius: 4px;
          margin-bottom: 20px;
          font-size: 13px;
          color: #475569;
        }

        .change-indicator {
          display: inline-block;
          font-weight: 600;
          margin-right: 4px;
        }

        .added-indicator {
          color: #10b981;
        }

        .removed-indicator {
          color: #ef4444;
        }

        .modified-indicator {
          color: #0284c7;
        }

        .empty-state {
          color: #94a3b8;
          font-style: italic;
        }

        @media (max-width: 1024px) {
          .comparison-body {
            grid-template-columns: 1fr;
            gap: 0;
          }

          .comparison-cell:nth-child(odd) {
            border-right: none;
            border-bottom: 2px solid #cbd5e1;
          }

          .comparison-column-header {
            border-right: none;
            border-bottom: 2px solid #e2e8f0;
          }
        }
      `}</style>

      <div className="comparison-container">
        {/* Header */}
        <div className="comparison-header">
          <div className="comparison-column-header">
            {getVersionLabel(versionA)}
          </div>
          <div className="comparison-column-header">
            {getVersionLabel(versionB)}
          </div>
        </div>

        {/* Body */}
        <div className="comparison-body">
          {/* Column A */}
          <div className="comparison-cell">
            {renderVersionSnapshot(versionA.term_snapshot, diff, 'A')}
          </div>

          {/* Column B */}
          <div className="comparison-cell">
            {renderVersionSnapshot(versionB.term_snapshot, diff, 'B')}
          </div>
        </div>
      </div>

      {/* Summary */}
      <DiffSummary diff={diff} />
    </div>
  );
}

/**
 * Render version snapshot with diff highlighting
 */
function renderVersionSnapshot(snapshot = {}, diff = null, column = 'A') {
  if (!snapshot || Object.keys(snapshot).length === 0) {
    return <div className="empty-state">No data</div>;
  }

  const isColumnA = column === 'A';

  return (
    <div>
      {Object.entries(snapshot).map(([key, value]) => {
        let className = '';
        let displayValue = value;

        if (diff) {
          if (isColumnA) {
            if (diff.removed && diff.removed[key]) {
              className = 'removed';
              displayValue = value;
            } else if (diff.modified && diff.modified[key]) {
              className = 'modified';
              displayValue = diff.modified[key].old;
            }
          } else {
            if (diff.added && diff.added[key]) {
              className = 'added';
              displayValue = value;
            } else if (diff.modified && diff.modified[key]) {
              className = 'modified';
              displayValue = diff.modified[key].new;
            }
          }
        }

        return (
          <div key={key} className="field-section">
            <div className="field-name">{formatFieldName(key)}</div>
            <div className={`field-content ${className}`}>
              {renderFieldValue(displayValue)}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/**
 * Render field value with appropriate formatting
 */
function renderFieldValue(value) {
  if (value === null || value === undefined) {
    return <span className="empty-state">(empty)</span>;
  }

  if (Array.isArray(value)) {
    return (
      <div>
        {value.length === 0 ? (
          <span className="empty-state">(no items)</span>
        ) : (
          value.map((item, idx) => (
            <div key={idx} className="array-item">
              {typeof item === 'object' ? (
                <pre style={{ margin: 0, fontSize: '11px' }}>
                  {JSON.stringify(item, null, 2)}
                </pre>
              ) : (
                String(item)
              )}
            </div>
          ))
        )}
      </div>
    );
  }

  if (typeof value === 'object') {
    return (
      <pre style={{ margin: 0, fontSize: '11px' }}>
        {JSON.stringify(value, null, 2)}
      </pre>
    );
  }

  return String(value);
}

/**
 * Format field name for display
 */
function formatFieldName(fieldName) {
  return fieldName
    .replace(/_/g, ' ')
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Diff Summary Component
 */
function DiffSummary({ diff = null }) {
  if (!diff) return null;

  const addedCount = diff.added ? Object.keys(diff.added).length : 0;
  const removedCount = diff.removed ? Object.keys(diff.removed).length : 0;
  const modifiedCount = diff.modified ? Object.keys(diff.modified).length : 0;

  if (addedCount === 0 && removedCount === 0 && modifiedCount === 0) {
    return (
      <div style={{ marginTop: '16px', padding: '12px', textAlign: 'center', color: '#94a3b8' }}>
        No differences
      </div>
    );
  }

  return (
    <div style={{ marginTop: '16px' }}>
      <style jsx>{`
        .diff-summary {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 12px;
        }

        .summary-item {
          padding: 12px;
          border-radius: 6px;
          text-align: center;
          font-size: 13px;
          font-weight: 500;
        }

        .summary-item.added {
          background: #dcfce7;
          color: #166534;
          border: 1px solid #6ee7b7;
        }

        .summary-item.removed {
          background: #fee2e2;
          color: #991b1b;
          border: 1px solid #fca5a5;
        }

        .summary-item.modified {
          background: #dbeafe;
          color: #0c4a6e;
          border: 1px solid #7dd3fc;
        }

        .count {
          font-weight: 700;
          font-size: 18px;
          display: block;
          margin-bottom: 4px;
        }
      `}</style>

      <div className="diff-summary">
        {addedCount > 0 && (
          <div className="summary-item added">
            <span className="count">+{addedCount}</span>
            Field{addedCount !== 1 ? 's' : ''} Added
          </div>
        )}
        {removedCount > 0 && (
          <div className="summary-item removed">
            <span className="count">-{removedCount}</span>
            Field{removedCount !== 1 ? 's' : ''} Removed
          </div>
        )}
        {modifiedCount > 0 && (
          <div className="summary-item modified">
            <span className="count">~{modifiedCount}</span>
            Field{modifiedCount !== 1 ? 's' : ''} Changed
          </div>
        )}
      </div>
    </div>
  );
}