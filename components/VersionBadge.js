/**
 * components/VersionBadge.js
 * Small badge displaying current version number
 * Clickable to navigate to version history page
 */

'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

export default function VersionBadge({
  versionNumber = 1,
  termId = null,
  onClick = null,
  size = 'medium',
  showLabel = false
}) {
  const router = useRouter();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (termId) {
      router.push(`/lexicon/${termId}/versions`);
    }
  };

  const sizeStyles = {
    small: { padding: '4px 8px', fontSize: '11px' },
    medium: { padding: '6px 12px', fontSize: '13px' },
    large: { padding: '8px 16px', fontSize: '14px' }
  };

  const baseStyle = {
    display: 'inline-block',
    backgroundColor: '#e0f2fe',
    border: '1px solid #0284c7',
    borderRadius: '12px',
    color: '#0c4a6e',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    userSelect: 'none',
    ...sizeStyles[size]
  };

  return (
    <span
      style={baseStyle}
      onClick={handleClick}
      onMouseEnter={(e) => {
        e.target.style.backgroundColor = '#dbeafe';
        e.target.style.borderColor = '#0284c7';
      }}
      onMouseLeave={(e) => {
        e.target.style.backgroundColor = '#e0f2fe';
        e.target.style.borderColor = '#0284c7';
      }}
      title={`Version ${versionNumber}${termId ? '. Click to view history' : ''}`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleClick();
        }
      }}
    >
      {showLabel && <span style={{ marginRight: '4px' }}>Version:</span>}
      <strong>v{versionNumber}</strong>
    </span>
  );
}

/**
 * Inline version badge - minimal variant
 */
export function VersionBadgeInline({
  versionNumber = 1,
  termId = null
}) {
  const router = useRouter();

  const handleClick = () => {
    if (termId) {
      router.push(`/lexicon/${termId}/versions`);
    }
  };

  return (
    <span
      onClick={handleClick}
      style={{
        display: 'inline-block',
        marginLeft: '6px',
        padding: '2px 6px',
        backgroundColor: '#e0f2fe',
        border: '1px solid #0284c7',
        borderRadius: '8px',
        fontSize: '10px',
        fontWeight: 'bold',
        color: '#0c4a6e',
        cursor: termId ? 'pointer' : 'default'
      }}
      title={termId ? 'Click to view version history' : ''}
    >
      v{versionNumber}
    </span>
  );
}