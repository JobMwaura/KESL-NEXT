/**
 * components/VersionTimeline.js
 * Visual timeline showing version history
 * Displays v1 → v2 → v3 progression with details
 */

'use client';

import React, { useState } from 'react';

export default function VersionTimeline({
  versions = [],
  currentVersionNumber = null,
  onVersionSelect = () => {},
  sticky = true
}) {
  const [hoveredVersion, setHoveredVersion] = useState(null);

  if (!versions || versions.length === 0) {
    return (
      <div style={{ padding: '20px', color: '#94a3b8' }}>
        No version history available
      </div>
    );
  }

  const timelineStyle = {
    position: sticky ? 'sticky' : 'relative',
    top: sticky ? '20px' : 'auto',
    maxHeight: sticky ? 'calc(100vh - 40px)' : 'auto',
    overflowY: sticky ? 'auto' : 'visible'
  };

  return (
    <div style={timelineStyle}>
      <style jsx>{`
        .timeline-container {
          padding: 20px 10px;
        }

        .timeline-line {
          position: absolute;
          left: 19px;
          top: 40px;
          bottom: 0;
          width: 2px;
          background: linear-gradient(to bottom, #0284c7 0%, #0284c7 50%, #cbd5e1 50%, #cbd5e1 100%);
        }

        .timeline-item {
          position: relative;
          margin-bottom: 28px;
          padding-left: 60px;
          cursor: pointer;
          transition: opacity 0.2s ease;
        }

        .timeline-item:hover {
          opacity: 0.8;
        }

        .timeline-dot {
          position: absolute;
          left: 6px;
          top: 2px;
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background: white;
          border: 3px solid #0284c7;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: bold;
          color: #0284c7;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .timeline-item.current .timeline-dot {
          background: #0284c7;
          color: white;
          box-shadow: 0 0 0 4px rgba(2, 132, 199, 0.2);
        }

        .timeline-content {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 12px;
          transition: all 0.2s ease;
        }

        .timeline-item:hover .timeline-content,
        .timeline-item.hovered .timeline-content {
          background: white;
          border-color: #0284c7;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }

        .version-label {
          font-weight: 600;
          font-size: 13px;
          color: #1e293b;
          margin-bottom: 4px;
        }

        .version-date {
          font-size: 12px;
          color: #64748b;
          margin-bottom: 6px;
        }

        .version-contributor {
          font-size: 12px;
          color: #475569;
          margin-bottom: 6px;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .contributor-avatar {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3b82f6 0%, #0284c7 100%);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          font-weight: bold;
        }

        .version-changes {
          font-size: 12px;
          color: #475569;
          padding: 8px;
          background: #f1f5f9;
          border-left: 2px solid #3b82f6;
          border-radius: 3px;
          margin-top: 6px;
        }

        .version-type {
          display: inline-block;
          padding: 2px 6px;
          background: #dbeafe;
          color: #0c4a6e;
          border-radius: 3px;
          font-size: 10px;
          font-weight: 600;
          margin-right: 4px;
          margin-top: 6px;
        }

        .current-badge {
          display: inline-block;
          padding: 2px 6px;
          background: #dcfce7;
          color: #166534;
          border-radius: 3px;
          font-size: 10px;
          font-weight: 600;
          margin-top: 6px;
        }

        @media (max-width: 640px) {
          .timeline-item {
            padding-left: 45px;
            margin-bottom: 24px;
          }

          .timeline-dot {
            width: 22px;
            height: 22px;
            left: 3px;
            font-size: 10px;
            border-width: 2px;
          }

          .timeline-line {
            left: 14px;
            top: 32px;
          }

          .timeline-content {
            padding: 10px;
          }

          .version-label {
            font-size: 12px;
          }

          .version-date {
            font-size: 11px;
          }

          .version-contributor {
            font-size: 11px;
          }
        }
      `}</style>

      <div className="timeline-container">
        <div className="timeline-line" />

        {versions.map((version, index) => {
          const isCurrentVersion =
            currentVersionNumber === version.version_number;
          const isHovered = hoveredVersion === version.version_number;
          const versionNum = version.version_number || index + 1;

          return (
            <div
              key={version.id || index}
              className={`timeline-item ${isCurrentVersion ? 'current' : ''} ${
                isHovered ? 'hovered' : ''
              }`}
              onClick={() => onVersionSelect(version)}
              onMouseEnter={() => setHoveredVersion(version.version_number)}
              onMouseLeave={() => setHoveredVersion(null)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  onVersionSelect(version);
                }
              }}
            >
              <div
                className="timeline-dot"
                title={`Version ${versionNum}`}
              >
                {versionNum}
              </div>

              <div className="timeline-content">
                <div className="version-label">
                  v{versionNum}
                  {isCurrentVersion && <span className="current-badge">CURRENT</span>}
                </div>

                <div className="version-date">
                  {new Date(version.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>

                <div className="version-contributor">
                  <div
                    className="contributor-avatar"
                    title={version.contributor_name}
                  >
                    {version.contributor_name
                      ?.charAt(0)
                      .toUpperCase() || '?'}
                  </div>
                  <span>{version.contributor_name || 'Unknown'}</span>
                </div>

                <span className="version-type">
                  {formatContributionType(version.contribution_type)}
                </span>

                {version.changes_summary && (
                  <div className="version-changes">
                    📝 {version.changes_summary}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Format contribution type for display
 */
function formatContributionType(type = 'edit') {
  const typeMap = {
    initial: 'Initial',
    example_added: 'Example',
    context_added: 'Context',
    harm_documented: 'Harm',
    variant_added: 'Variant',
    related_term_added: 'Related',
    edit: 'Edit',
    rollback: 'Rollback'
  };

  return typeMap[type] || type;
}