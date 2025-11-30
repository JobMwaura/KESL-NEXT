/**
 * components/HarmCheckboxes.js
 * Renders checkbox list for harm types with follow-up questions
 * Used in submit form Step 5 and contribute modal
 */

'use client';

import React from 'react';
import { HARM_TYPES } from '@/lib/constants';

export default function HarmCheckboxes({
  value = {},
  harmDetails = {},
  onChange = () => {},
  onDetailsChange = () => {}
}) {
  // Define harm types in order with prompts
  const harms = [
    {
      id: 'normalizes_contempt',
      label: 'Normalizes contempt',
      prompt: 'What contemptuous attitudes does this term promote?'
    },
    {
      id: 'primes_exclusion',
      label: 'Primes exclusion/eviction',
      prompt: 'From what? (land, jobs, neighborhoods, politics, etc.)'
    },
    {
      id: 'cues_violence',
      label: 'Cues/legitimizes violence',
      prompt: 'What violence? (ethnic clashes, mob action, harassment, etc.)'
    },
    {
      id: 'harasses',
      label: 'Harasses individuals',
      prompt: 'Describe the targeting and harassment tactics'
    },
    {
      id: 'other',
      label: 'Other harm',
      prompt: 'Describe other harms not listed above'
    }
  ];

  /**
   * Handle checkbox toggle
   */
  const handleCheck = (id) => {
    onChange({
      ...value,
      [id]: !value[id]
    });
  };

  /**
   * Handle harm detail text change
   */
  const handleDetailsChange = (id, text) => {
    onDetailsChange({
      ...harmDetails,
      [id]: text
    });
  };

  return (
    <div className="harms-container" style={{ maxWidth: '100%' }}>
      <style jsx>{`
        .harms-container {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .harm-item {
          padding: 12px;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          background: #f8fafc;
          transition: all 0.2s ease;
        }

        .harm-item:hover {
          border-color: #cbd5e1;
          background: #f1f5f9;
        }

        .harm-item input[type='checkbox']:checked ~ .harm-content {
          background: #f0f9ff;
          border-color: #0284c7;
        }

        .harm-checkbox-wrapper {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 8px;
          cursor: pointer;
        }

        .harm-checkbox {
          width: 18px;
          height: 18px;
          cursor: pointer;
          accent-color: #0284c7;
        }

        .harm-label {
          cursor: pointer;
          font-weight: 500;
          color: #1e293b;
          user-select: none;
        }

        .harm-content {
          margin-left: 28px;
          padding: 12px;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 4px;
          margin-top: 8px;
        }

        .harm-prompt {
          font-size: 13px;
          color: #475569;
          margin-bottom: 8px;
          padding: 8px;
          background: #f1f5f9;
          border-left: 3px solid #0284c7;
          border-radius: 2px;
        }

        .harm-textarea {
          width: 100%;
          min-height: 80px;
          padding: 10px;
          font-size: 14px;
          font-family: inherit;
          border: 1px solid #cbd5e1;
          border-radius: 4px;
          background: white;
          color: #1e293b;
          resize: vertical;
          box-sizing: border-box;
        }

        .harm-textarea:focus {
          outline: none;
          border-color: #0284c7;
          box-shadow: 0 0 0 3px rgba(2, 132, 199, 0.1);
        }

        .harm-textarea::placeholder {
          color: #94a3b8;
        }

        .char-count {
          font-size: 12px;
          color: #64748b;
          margin-top: 4px;
          text-align: right;
        }

        .char-count.warning {
          color: #f59e0b;
        }

        .char-count.error {
          color: #ef4444;
        }

        .checked-indicator {
          display: inline-block;
          width: 6px;
          height: 6px;
          background: #10b981;
          border-radius: 50%;
          margin-left: 6px;
        }

        @media (max-width: 640px) {
          .harm-item {
            padding: 10px;
          }

          .harm-content {
            margin-left: 20px;
            padding: 10px;
          }

          .harm-textarea {
            min-height: 60px;
            font-size: 13px;
          }
        }
      `}</style>

      {harms.map((harm) => (
        <div key={harm.id} className="harm-item">
          <div className="harm-checkbox-wrapper">
            <input
              type="checkbox"
              className="harm-checkbox"
              id={`harm-${harm.id}`}
              checked={value[harm.id] || false}
              onChange={() => handleCheck(harm.id)}
              aria-label={harm.label}
            />
            <label className="harm-label" htmlFor={`harm-${harm.id}`}>
              {harm.label}
              {value[harm.id] && <span className="checked-indicator"></span>}
            </label>
          </div>

          {/* Show details input only if checked */}
          {value[harm.id] && (
            <div className="harm-content">
              <div className="harm-prompt">💬 {harm.prompt}</div>

              <textarea
                className="harm-textarea"
                placeholder={`Provide specific details about how ${harm.label.toLowerCase()} occurs...`}
                value={harmDetails[harm.id] || ''}
                onChange={(e) => handleDetailsChange(harm.id, e.target.value)}
                aria-label={`Details for ${harm.label}`}
              />

              <div
                className={`char-count ${
                  (harmDetails[harm.id] || '').length > 200 ? 'warning' : ''
                } ${(harmDetails[harm.id] || '').length > 500 ? 'error' : ''}`}
              >
                {(harmDetails[harm.id] || '').length} characters
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Summary of selected harms */}
      {Object.values(value).some(v => v) && (
        <div
          style={{
            padding: '12px',
            backgroundColor: '#e0f2fe',
            border: '1px solid #0284c7',
            borderRadius: '6px',
            fontSize: '13px',
            color: '#0c4a6e'
          }}
        >
          ✓ {Object.values(value).filter(v => v).length} harm type
          {Object.values(value).filter(v => v).length !== 1 ? 's' : ''} selected
        </div>
      )}
    </div>
  );
}