// components/TermPreviewCard.js
'use client';

import React from 'react';
import { CATEGORIES, RISK_LEVELS, CONFIDENCE_LEVELS } from '@/lib/constants';

/**
 * TermPreviewCard Component
 * Shows live preview of how the term card will appear to readers
 * Updates in real-time as form fields change
 * 
 * Props:
 * - formData: Current form state { term, language, category, risk, definition, quote, examples, etc }
 * - confidence: Current confidence level object
 */
export default function TermPreviewCard({ 
  formData = {}, 
  confidence = CONFIDENCE_LEVELS.LOW 
}) {
  const {
    term = 'Your term',
    language = 'English',
    category = 'derogatory',
    risk = 'medium',
    literal_gloss = '',
    definition = 'Your definition will appear here',
    quote = 'Your example quote will appear here',
    platform = 'Platform',
    date_observed = 'Date'
  } = formData;

  const categoryConfig = CATEGORIES[Object.keys(CATEGORIES).find(
    key => CATEGORIES[key].id === category
  )] || CATEGORIES.DEROGATORY;

  const riskConfig = RISK_LEVELS[Object.keys(RISK_LEVELS).find(
    key => RISK_LEVELS[key].id === risk
  )] || RISK_LEVELS.MEDIUM;

  return (
    <div className="preview-card-container">
      <div className="preview-header">
        <div className="preview-label">📱 How Readers Will See It</div>
      </div>

      <div className="term-card">
        {/* Card Header */}
        <div className="card-header">
          <h1 className="card-term">{term || 'Term'}</h1>
          
          {literal_gloss && (
            <p className="card-gloss">{literal_gloss}</p>
          )}

          <div className="card-badges">
            <span className="badge badge-language">
              {language || 'Language'}
            </span>
            <span 
              className="badge badge-category"
              style={{ backgroundColor: categoryConfig.color + '33', color: categoryConfig.color }}
            >
              {categoryConfig.label}
            </span>
            <span 
              className="badge badge-risk"
              style={{ backgroundColor: riskConfig.color + '33', color: riskConfig.color }}
            >
              {riskConfig.icon} Risk: {riskConfig.label}
            </span>
            <span className="badge badge-confidence">
              {confidence.icon} {confidence.label}
            </span>
          </div>
        </div>

        {/* Definition Section */}
        <div className="card-section section-definition">
          <div className="section-label">📝 Definition</div>
          <p className="section-content">
            {definition.trim() || 'Enter your definition...'}
          </p>
        </div>

        {/* Example Section */}
        {quote && (
          <div className="card-section section-example">
            <div className="section-label">💬 In Use</div>
            <blockquote className="example-quote">
              {quote.trim()}
            </blockquote>
            <div className="example-meta">
              {platform} • {date_observed || 'Date'}
            </div>
          </div>
        )}

        {/* Accordions Preview */}
        <div className="card-section section-accordions">
          <div className="accordion-placeholder">
            <div className="accordion-item">
              <div className="accordion-header">▶ Context</div>
            </div>
            <div className="accordion-item">
              <div className="accordion-header">▶ Harm</div>
            </div>
            <div className="accordion-item">
              <div className="accordion-header">▶ Examples</div>
            </div>
            <div className="accordion-item">
              <div className="accordion-header">▶ Platforms & Migration</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="card-section section-actions">
          <button className="btn-action">+ Add Example</button>
          <button className="btn-action">+ Add Context</button>
        </div>
      </div>

      {/* Preview Notes */}
      <div className="preview-notes">
        💡 This updates in real-time as you fill the form. This is exactly what readers will see.
      </div>

      <style jsx>{`
        .preview-card-container {
          position: sticky;
          top: 20px;
        }

        .preview-header {
          margin-bottom: 15px;
        }

        .preview-label {
          font-size: 12px;
          font-weight: 700;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .term-card {
          background: white;
          border: 1px solid #cbd5e1;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }

        .card-header {
          padding: 20px;
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          border-bottom: 1px solid #e2e8f0;
        }

        .card-term {
          font-size: 28px;
          font-weight: 700;
          color: #1e293b;
          margin: 0 0 8px 0;
        }

        .card-gloss {
          font-size: 13px;
          color: #64748b;
          font-style: italic;
          margin: 0 0 12px 0;
        }

        .card-badges {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 600;
          white-space: nowrap;
        }

        .badge-language {
          background: #dbeafe;
          color: #0c4a6e;
        }

        .badge-category {
          border: 1px solid currentColor;
        }

        .badge-risk {
          border: 1px solid currentColor;
        }

        .badge-confidence {
          background: #f0f4f8;
          color: #475569;
        }

        .card-section {
          padding: 16px 20px;
          border-bottom: 1px solid #e2e8f0;
        }

        .card-section:last-of-type {
          border-bottom: none;
        }

        .section-label {
          font-size: 11px;
          font-weight: 700;
          color: #64748b;
          text-transform: uppercase;
          margin-bottom: 8px;
        }

        .section-content {
          font-size: 13px;
          color: #475569;
          line-height: 1.6;
          margin: 0;
        }

        .section-definition {
          background: white;
        }

        .section-example {
          background: #f0fdf4;
        }

        .example-quote {
          font-size: 13px;
          color: #1e293b;
          font-style: italic;
          border-left: 3px solid #10b981;
          margin: 8px 0;
          padding-left: 12px;
        }

        .example-meta {
          font-size: 11px;
          color: #64748b;
          margin-top: 8px;
        }

        .section-accordions {
          background: white;
          padding: 0;
        }

        .accordion-placeholder {
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          overflow: hidden;
        }

        .accordion-item {
          border-bottom: 1px solid #e2e8f0;
        }

        .accordion-item:last-child {
          border-bottom: none;
        }

        .accordion-header {
          padding: 12px 16px;
          background: #f8fafc;
          font-size: 12px;
          font-weight: 600;
          color: #1e293b;
          cursor: pointer;
          user-select: none;
        }

        .accordion-header:hover {
          background: #e2e8f0;
        }

        .section-actions {
          display: flex;
          gap: 10px;
          padding: 16px 20px;
        }

        .btn-action {
          flex: 1;
          padding: 10px 12px;
          border: none;
          border-radius: 6px;
          background: #e2e8f0;
          color: #1e293b;
          font-weight: 600;
          font-size: 12px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .btn-action:hover {
          background: #cbd5e1;
        }

        .preview-notes {
          margin-top: 12px;
          padding: 12px;
          background: #f0f4f8;
          border-radius: 6px;
          font-size: 12px;
          color: #475569;
          text-align: center;
        }

        @media (max-width: 1024px) {
          .preview-card-container {
            position: relative;
            top: auto;
            margin-top: 30px;
          }
        }

        @media (max-width: 640px) {
          .card-term {
            font-size: 24px;
          }

          .card-header {
            padding: 16px;
          }

          .card-section {
            padding: 12px 16px;
          }

          .section-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}