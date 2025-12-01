/**
 * components/VersionSelector.js
 * Dropdown to select which version to view or compare
 */

'use client';

import React, { useState } from 'react';

export default function VersionSelector({
  versions = [],
  currentVersion = null,
  selectedVersion = null,
  onSelect = () => {},
  label = 'Select Version',
  allowMultiple = false,
  secondVersion = null,
  onSelectSecond = () => {}
}) {
  const [isOpen, setIsOpen] = useState(false);

  if (!versions || versions.length === 0) {
    return (
      <div style={{ padding: '12px', color: '#94a3b8', fontSize: '13px' }}>
        No versions available
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
      <style jsx>{`
        .selector-container {
          position: relative;
          flex: 1;
          min-width: 250px;
        }

        .selector-label {
          display: block;
          font-size: 12px;
          font-weight: 600;
          color: #475569;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 6px;
        }

        .selector-button {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid #cbd5e1;
          border-radius: 6px;
          background: white;
          font-size: 13px;
          color: #1e293b;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
          transition: all 0.2s ease;
        }

        .selector-button:hover {
          border-color: #0284c7;
          box-shadow: 0 2px 4px rgba(2, 132, 199, 0.1);
        }

        .selector-button.open {
          border-color: #0284c7;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .dropdown-menu {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: white;
          border: 1px solid #cbd5e1;
          border-top: none;
          border-radius: 0 0 6px 6px;
          max-height: 300px;
          overflow-y: auto;
          z-index: 10;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .dropdown-item {
          padding: 12px;
          border-bottom: 1px solid #e2e8f0;
          cursor: pointer;
          transition: background 0.2s ease;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 13px;
        }

        .dropdown-item:last-child {
          border-bottom: none;
        }

        .dropdown-item:hover {
          background: #f1f5f9;
        }

        .dropdown-item.selected {
          background: #dbeafe;
          color: #0c4a6e;
          font-weight: 600;
        }

        .item-content {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .item-label {
          font-weight: 600;
          color: #1e293b;
        }

        .item-meta {
          font-size: 11px;
          color: #64748b;
        }

        .item-checkbox {
          width: 18px;
          height: 18px;
          margin-left: 8px;
          cursor: pointer;
          accent-color: #0284c7;
        }

        .badge {
          display: inline-block;
          padding: 2px 6px;
          background: #dcfce7;
          color: #166534;
          border-radius: 3px;
          font-size: 10px;
          font-weight: 600;
          margin-left: 6px;
        }

        .chevron {
          width: 16px;
          height: 16px;
          display: inline-block;
          transition: transform 0.2s ease;
        }

        .chevron.open {
          transform: rotate(180deg);
        }

        .selected-info {
          display: flex;
          align-items: center;
          gap: 8px;
          flex: 1;
          min-width: 0;
        }

        .selected-text {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        @media (max-width: 640px) {
          .selector-container {
            min-width: 100%;
          }
        }
      `}</style>

      {/* First Selector */}
      <div className="selector-container">
        <label className="selector-label">{label}</label>
        <button
          className={`selector-button ${isOpen ? 'open' : ''}`}
          onClick={() => setIsOpen(!isOpen)}
          type="button"
        >
          <div className="selected-info">
            <span className="selected-text">
              {selectedVersion
                ? `v${selectedVersion.version_number}`
                : 'Choose version...'}
            </span>
          </div>
          <span className={`chevron ${isOpen ? 'open' : ''}`}>
            ▼
          </span>
        </button>

        {isOpen && (
          <div className="dropdown-menu">
            {versions.map((version) => (
              <div
                key={version.id || version.version_number}
                className={`dropdown-item ${
                  selectedVersion?.id === version.id ? 'selected' : ''
                }`}
                onClick={() => {
                  onSelect(version);
                  setIsOpen(false);
                }}
              >
                <div className="item-content">
                  <div className="item-label">
                    v{version.version_number}
                    {currentVersion === version.version_number && (
                      <span className="badge">CURRENT</span>
                    )}
                  </div>
                  <div className="item-meta">
                    {new Date(version.created_at).toLocaleDateString(
                      'en-US',
                      {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      }
                    )}
                    {version.contributor_name &&
                      ` • ${version.contributor_name}`}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Second Selector (for comparison) */}
      {allowMultiple && (
        <div className="selector-container">
          <label className="selector-label">Compare To</label>
          <select
            style={{
              width: '100%',
              padding: '10px 12px',
              border: '1px solid #cbd5e1',
              borderRadius: '6px',
              fontSize: '13px',
              cursor: 'pointer'
            }}
            value={secondVersion?.id || ''}
            onChange={(e) => {
              const version = versions.find(v => v.id === e.target.value);
              if (version) onSelectSecond(version);
            }}
          >
            <option value="">Select version...</option>
            {versions.map((version) => (
              <option key={version.id} value={version.id}>
                v{version.version_number} ({new Date(
                  version.created_at
                ).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric'
                })})
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}

/**
 * Simple version dropdown - minimal version
 */
export function VersionSelectorSimple({
  versions = [],
  value = null,
  onChange = () => {},
  label = 'Version'
}) {
  return (
    <div>
      <label
        style={{
          display: 'block',
          fontSize: '12px',
          fontWeight: '600',
          color: '#475569',
          marginBottom: '6px',
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}
      >
        {label}
      </label>
      <select
        value={value?.id || ''}
        onChange={(e) => {
          const version = versions.find(v => v.id === e.target.value);
          if (version) onChange(version);
        }}
        style={{
          width: '100%',
          padding: '8px 12px',
          border: '1px solid #cbd5e1',
          borderRadius: '6px',
          fontSize: '13px',
          cursor: 'pointer',
          backgroundColor: 'white',
          color: '#1e293b'
        }}
      >
        <option value="">Select version...</option>
        {versions.map((version) => (
          <option key={version.id} value={version.id}>
            v{version.version_number} - {version.contributor_name} ({new Date(
              version.created_at
            ).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: '2-digit'
            })})
          </option>
        ))}
      </select>
    </div>
  );
}