// components/WizardStep.js
'use client';

import React from 'react';

/**
 * WizardStep Component
 * Reusable wrapper for each step in the submission wizard
 * 
 * Props:
 * - stepNumber: 1-5 (which step)
 * - title: Step title (e.g., "Term Basics")
 * - description: Brief description (optional)
 * - children: Step content
 * - onNext: Callback for next button
 * - onBack: Callback for back button
 * - nextDisabled: Disable next button (optional)
 * - isFirstStep: Don't show back button on step 1
 * - isLastStep: Show submit instead of next on step 5
 */
export default function WizardStep({
  stepNumber = 1,
  title = '',
  description = '',
  children,
  onNext,
  onBack,
  nextDisabled = false,
  isFirstStep = false,
  isLastStep = false,
  nextButtonText = 'Next →',
  submitButtonText = '✓ Submit for Review'
}) {
  return (
    <div className="wizard-step">
      {/* Step Header */}
      <div className="step-header">
        <h2 className="step-title">Step {stepNumber}: {title}</h2>
        {description && <p className="step-description">{description}</p>}
      </div>

      {/* Step Content */}
      <div className="step-content">
        {children}
      </div>

      {/* Button Group */}
      <div className="button-group">
        {!isFirstStep && (
          <button 
            className="btn btn-back"
            onClick={onBack}
            type="button"
          >
            ← Back
          </button>
        )}
        
        {isLastStep ? (
          <button 
            className="btn btn-submit"
            onClick={onNext}
            disabled={nextDisabled}
            type="button"
          >
            {submitButtonText}
          </button>
        ) : (
          <button 
            className="btn btn-next"
            onClick={onNext}
            disabled={nextDisabled}
            type="button"
          >
            {nextButtonText}
          </button>
        )}
      </div>

      <style jsx>{`
        .wizard-step {
          animation: fadeIn 0.3s ease-in;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .step-header {
          margin-bottom: 30px;
        }

        .step-title {
          font-size: 24px;
          font-weight: 700;
          color: #1e293b;
          margin: 0 0 12px 0;
        }

        .step-description {
          font-size: 14px;
          color: #64748b;
          margin: 0;
          line-height: 1.6;
        }

        .step-content {
          margin-bottom: 30px;
        }

        .button-group {
          display: flex;
          gap: 12px;
          margin-top: 30px;
        }

        .btn {
          flex: 1;
          padding: 12px 20px;
          border: none;
          border-radius: 6px;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .btn-back {
          background-color: #e2e8f0;
          color: #1e293b;
        }

        .btn-back:hover:not(:disabled) {
          background-color: #cbd5e1;
          transform: translateY(-2px);
        }

        .btn-next {
          background-color: #2d5a7b;
          color: white;
        }

        .btn-next:hover:not(:disabled) {
          background-color: #1a3a52;
          transform: translateY(-2px);
        }

        .btn-submit {
          background-color: #10b981;
          color: white;
        }

        .btn-submit:hover:not(:disabled) {
          background-color: #059669;
          transform: translateY(-2px);
        }

        @media (max-width: 640px) {
          .step-title {
            font-size: 20px;
          }

          .button-group {
            flex-direction: column-reverse;
          }
        }
      `}</style>
    </div>
  );
}