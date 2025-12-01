'use client';

import React, { useState, useCallback } from 'react';
import WizardStep from '@/components/WizardStep';
import TermPreviewCard from '@/components/TermPreviewCard';
import {
  validateDefinition,
  validateExample,
  validateHarms,
  checkVariantMatch,
  calculateConfidence,
  validateSubmission,
  autoRedactExample
} from '@/lib/validation';
import {
  CATEGORY_OPTIONS,
  RISK_OPTIONS,
  LANGUAGE_OPTIONS,
  PLATFORM_OPTIONS,
  HARM_OPTIONS,
  COLORS,
  getCategoryById,
  getRiskLevelById
} from '@/lib/constants';

export default function SubmitPage() {
  const defaultCategory = CATEGORY_OPTIONS?.[0]?.value || 'slur';
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    term: '',
    variants: [],
    language: 'sheng',
    category: defaultCategory,
    risk: 'medium',
    literal_gloss: '',
    definition: '',
    examples: [
      { quote: '', platform: 'kenyatalk', date_observed: '', source_url: '' }
    ],
    harms: {
      normalizes_contempt: false,
      primes_exclusion: false,
      cues_violence: false,
      harasses: false,
      other: false
    },
    harm_details: {
      normalizes_contempt: '',
      primes_exclusion: '',
      cues_violence: '',
      harasses: '',
      other: ''
    }
  });

  // Validation states
  const [validationStates, setValidationStates] = useState({
    term: null,
    definition: null,
    examples: {},
    harms: null,
    variantMatch: null
  });

  // Step 1: Term Basics
  const handleTermChange = (value) => {
    const newData = { ...formData, term: value };
    setFormData(newData);

    // Check for variant matches
    // In production, would fetch existing terms from DB
    if (value.length > 2) {
      const variantCheck = checkVariantMatch(value, []);
      setValidationStates(prev => ({
        ...prev,
        variantMatch: variantCheck.isVariant ? variantCheck.matches : null
      }));
    }
  };

  const handleVariantsChange = (value) => {
    const variants = value
      .split(',')
      .map(v => v.trim())
      .filter(v => v.length > 0);
    setFormData(prev => ({ ...prev, variants }));
  };

  const handleLanguageChange = (value) => {
    setFormData(prev => ({ ...prev, language: value }));
  };

  const handleCategoryChange = (value) => {
    setFormData(prev => ({ ...prev, category: value }));
  };

  const handleRiskChange = (value) => {
    setFormData(prev => ({ ...prev, risk: value }));
  };

  const isStep1Valid = () => {
    return formData.term.trim().length > 0 &&
      formData.language &&
      formData.category &&
      formData.risk;
  };

  // Step 2: Definition
  const handleDefinitionChange = (value) => {
    setFormData(prev => ({ ...prev, definition: value }));

    const validation = validateDefinition(value);
    setValidationStates(prev => ({
      ...prev,
      definition: validation
    }));
  };

  const handleGlossChange = (value) => {
    setFormData(prev => ({ ...prev, literal_gloss: value }));
  };

  const isStep2Valid = () => {
    return validationStates.definition?.valid === true;
  };

  // Step 3: Examples
  const handleExampleQuoteChange = (index, value) => {
    const newExamples = [...formData.examples];
    newExamples[index].quote = value;
    setFormData(prev => ({ ...prev, examples: newExamples }));

    // Validate this example
    const exValidation = validateExample(value);
    setValidationStates(prev => ({
      ...prev,
      examples: {
        ...prev.examples,
        [index]: exValidation
      }
    }));
  };

  const handleExamplePlatformChange = (index, value) => {
    const newExamples = [...formData.examples];
    newExamples[index].platform = value;
    setFormData(prev => ({ ...prev, examples: newExamples }));
  };

  const handleExampleDateChange = (index, value) => {
    const newExamples = [...formData.examples];
    newExamples[index].date_observed = value;
    setFormData(prev => ({ ...prev, examples: newExamples }));
  };

  const handleExampleSourceChange = (index, value) => {
    const newExamples = [...formData.examples];
    newExamples[index].source_url = value;
    setFormData(prev => ({ ...prev, examples: newExamples }));
  };

  const addExample = () => {
    setFormData(prev => ({
      ...prev,
      examples: [
        ...prev.examples,
        { quote: '', platform: 'kenyatalk', date_observed: '', source_url: '' }
      ]
    }));
  };

  const removeExample = (index) => {
    if (formData.examples.length > 1) {
      setFormData(prev => ({
        ...prev,
        examples: prev.examples.filter((_, i) => i !== index)
      }));
      const newExamples = { ...validationStates.examples };
      delete newExamples[index];
      setValidationStates(prev => ({
        ...prev,
        examples: newExamples
      }));
    }
  };

  const isStep3Valid = () => {
    return formData.examples.length > 0 &&
      formData.examples.every(ex =>
        ex.quote.trim().length > 0 &&
        validateExample(ex.quote).valid &&
        ex.platform &&
        ex.date_observed
      );
  };

  // Step 4: Harms
  const handleHarmCheckChange = (harmType, checked) => {
    setFormData(prev => ({
      ...prev,
      harms: {
        ...prev.harms,
        [harmType]: checked
      }
    }));
  };

  const handleHarmDetailChange = (harmType, value) => {
    setFormData(prev => ({
      ...prev,
      harm_details: {
        ...prev.harm_details,
        [harmType]: value
      }
    }));
  };

  const isStep4Valid = () => {
    const hasHarm = Object.values(formData.harms).some(v => v === true);
    const hasDetails = Object.entries(formData.harms).every(([key, checked]) => {
      if (!checked) return true;
      return formData.harm_details[key]?.trim().length > 0;
    });
    return hasHarm && hasDetails;
  };

  // Step 5: Review & Submit
  const handleSubmit = async () => {
    setSubmitError('');
    setIsSubmitting(true);

    try {
      // Validate entire submission
      const validation = validateSubmission({
        term: formData.term,
        language: formData.language,
        category: formData.category,
        risk: formData.risk,
        definition: formData.definition,
        examples: formData.examples,
        harms: formData.harms
      });

      if (!validation.valid) {
        setSubmitError(
          `Please fix the following errors:\n${validation.errors.join('\n')}`
        );
        setIsSubmitting(false);
        return;
      }

      // Prepare submission data
      const submissionData = {
        term: formData.term,
        variants: formData.variants,
        language: formData.language,
        category: formData.category,
        risk: formData.risk,
        literal_gloss: formData.literal_gloss || null,
        meaning: formData.definition,
        examples: formData.examples.map(ex => ({
          quote: autoRedactExample(ex.quote),
          platform: ex.platform,
          date_observed: ex.date_observed,
          source_url: ex.source_url || null
        })),
        harms: Object.entries(formData.harms)
          .filter(([_, checked]) => checked)
          .reduce((acc, [key, _]) => {
            acc[key] = formData.harm_details[key];
            return acc;
          }, {}),
        status: 'pending',
        created_at: new Date().toISOString()
      };

      // Submit to API
      const response = await fetch('/api/terms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to submit term');
      }

      const result = await response.json();
      setSubmitSuccess(true);
      
      // Reset form after success
      setTimeout(() => {
        setFormData({
          term: '',
          variants: [],
          language: 'sheng',
          category: defaultCategory,
          risk: 'medium',
          literal_gloss: '',
          definition: '',
          examples: [
            { quote: '', platform: 'kenyatalk', date_observed: '', source_url: '' }
          ],
          harms: {
            normalizes_contempt: false,
            primes_exclusion: false,
            cues_violence: false,
            harasses: false,
            other: false
          },
          harm_details: {
            normalizes_contempt: '',
            primes_exclusion: '',
            cues_violence: '',
            harasses: '',
            other: ''
          }
        });
        setCurrentStep(1);
        setSubmitSuccess(false);
      }, 3000);
    } catch (error) {
      setSubmitError(error.message || 'An error occurred while submitting');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate confidence
  const confidence = calculateConfidence(formData.examples);

  // Navigation
  const goToStep = (step) => {
    if (step === 1) {
      setCurrentStep(1);
    } else if (step === 2 && isStep1Valid()) {
      setCurrentStep(2);
    } else if (step === 3 && isStep2Valid()) {
      setCurrentStep(3);
    } else if (step === 4 && isStep3Valid()) {
      setCurrentStep(4);
    } else if (step === 5 && isStep4Valid()) {
      setCurrentStep(5);
    }
  };

  const goToNextStep = () => {
    goToStep(currentStep + 1);
  };

  const goToPreviousStep = () => {
    setCurrentStep(Math.max(1, currentStep - 1));
  };

  // Progress calculation
  const progress = (currentStep / 5) * 100;

  return (
    <div className="submit-page">
      {/* Header */}
      <div className="page-header">
        <h1>🎯 Submit a Term</h1>
        <p>Help us document extreme speech in Kenya's digital spaces</p>
      </div>

      {/* Step Indicator */}
      <div className="step-indicator">
        {[1, 2, 3, 4, 5].map((step, i) => (
          <React.Fragment key={step}>
            <div
              className={`step-circle ${
                step <= currentStep ? 'active' : step === currentStep + 1 ? 'next' : 'pending'
              }`}
              onClick={() => step <= currentStep && goToStep(step)}
            >
              {step < currentStep ? '✓' : step}
            </div>
            {i < 4 && (
              <div
                className={`step-line ${step < currentStep ? 'completed' : ''}`}
              />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="progress-container">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <p className="progress-text">Step {currentStep} of 5</p>
      </div>

      {/* Success Message */}
      {submitSuccess && (
        <div className="success-message">
          ✓ Term submitted successfully! It will appear in the lexicon after review.
        </div>
      )}

      {/* Error Message */}
      {submitError && (
        <div className="error-message">
          {submitError}
        </div>
      )}

      {/* Main Content */}
      <div className="wizard-layout">
        {/* Left: Form */}
        <div className="form-section">
          {/* STEP 1: Term Basics */}
          {currentStep === 1 && (
            <WizardStep
              stepNumber={1}
              title="Term Basics"
              description="Tell us about the term and basic information"
              onNext={goToNextStep}
              isFirstStep={true}
              nextDisabled={!isStep1Valid()}
            >
              <div className="form-group">
                <label htmlFor="term">Term/Phrase *</label>
                <input
                  id="term"
                  type="text"
                  placeholder="e.g., Tugege"
                  value={formData.term}
                  onChange={(e) => handleTermChange(e.target.value)}
                  className="form-input"
                />
                {validationStates.variantMatch && (
                  <div className="variant-hint">
                    💡 Found similar: {validationStates.variantMatch[0]?.term}
                    <a href="#" className="variant-link">View term</a>
                  </div>
                )}
                <p className="form-hint">The derogatory or extreme speech term you're documenting</p>
              </div>

              <div className="form-group">
                <label htmlFor="variants">Variants (comma-separated)</label>
                <input
                  id="variants"
                  type="text"
                  placeholder="e.g., Kagege, Tugge"
                  value={formData.variants.join(', ')}
                  onChange={(e) => handleVariantsChange(e.target.value)}
                  className="form-input"
                />
                <p className="form-hint">Other spellings or related terms</p>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="language">Language *</label>
                  <select
                    id="language"
                    value={formData.language}
                    onChange={(e) => handleLanguageChange(e.target.value)}
                    className="form-select"
                  >
                    {LANGUAGE_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="category">Category *</label>
                  <select
                    id="category"
                    value={formData.category}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    className="form-select"
                  >
                    {CATEGORY_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <p className="form-hint">{getCategoryById(formData.category)?.description}</p>
                </div>

                <div className="form-group">
                  <label htmlFor="risk">Risk Level *</label>
                  <select
                    id="risk"
                    value={formData.risk}
                    onChange={(e) => handleRiskChange(e.target.value)}
                    className="form-select"
                  >
                    {RISK_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <p className="form-hint">{getRiskLevelById(formData.risk)?.description}</p>
                </div>
              </div>
            </WizardStep>
          )}

          {/* STEP 2: Definition */}
          {currentStep === 2 && (
            <WizardStep
              stepNumber={2}
              title="Plain-English Definition"
              description="Explain for someone not from Kenya. What does it mean, who says it, when?"
              onNext={goToNextStep}
              onBack={goToPreviousStep}
              nextDisabled={!isStep2Valid()}
            >
              <div className="form-group">
                <label htmlFor="definition">Definition (2-3 sentences, 50-200 words) *</label>
                <textarea
                  id="definition"
                  placeholder="Enter definition..."
                  value={formData.definition}
                  onChange={(e) => handleDefinitionChange(e.target.value)}
                  className="form-textarea"
                  rows={6}
                />
                <div className="word-counter">
                  <span>Word count: {validationStates.definition?.wordCount || 0} / 200</span>
                  <span className={validationStates.definition?.level === 'error' ? 'error' : validationStates.definition?.level === 'warning' ? 'warning' : 'good'}>
                    {validationStates.definition?.level === 'error' ? '❌' : validationStates.definition?.level === 'warning' ? '⚠️' : '✓'} {validationStates.definition?.message}
                  </span>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="gloss">Literal Gloss (optional)</label>
                <input
                  id="gloss"
                  type="text"
                  placeholder="e.g., From Kugega (to bend/fold)"
                  value={formData.literal_gloss}
                  onChange={(e) => handleGlossChange(e.target.value)}
                  className="form-input"
                />
                <p className="form-hint">Etymology or literal meaning if relevant</p>
              </div>
            </WizardStep>
          )}

          {/* STEP 3: Examples */}
          {currentStep === 3 && (
            <WizardStep
              stepNumber={3}
              title="Examples"
              description="Provide at least one redacted example. Keep quotes ≤100 characters."
              onNext={goToNextStep}
              onBack={goToPreviousStep}
              nextDisabled={!isStep3Valid()}
            >
              {formData.examples.map((example, index) => (
                <div key={index} className="example-block">
                  {index > 0 && <hr className="example-divider" />}
                  
                  {formData.examples.length > 1 && (
                    <div className="example-header">
                      <h4>Example {index + 1}</h4>
                      <button
                        type="button"
                        onClick={() => removeExample(index)}
                        className="btn-remove"
                      >
                        ✕ Remove
                      </button>
                    </div>
                  )}

                  <div className="form-group">
                    <label htmlFor={`quote-${index}`}>Quote (redacted) *</label>
                    <textarea
                      id={`quote-${index}`}
                      placeholder="e.g., Wale Tugeges wakianza kelele..."
                      value={example.quote}
                      onChange={(e) => handleExampleQuoteChange(index, e.target.value)}
                      className="form-textarea"
                      rows={3}
                    />
                    <div className="char-counter">
                      <span>Characters: {example.quote.length} / 100</span>
                      <span className={validationStates.examples?.[index]?.level === 'error' ? 'error' : validationStates.examples?.[index]?.level === 'warning' ? 'warning' : 'good'}>
                        {validationStates.examples?.[index]?.level === 'error' ? '❌' : validationStates.examples?.[index]?.level === 'warning' ? '⚠️' : '✓'}
                      </span>
                    </div>
                    {validationStates.examples?.[index]?.warnings?.length > 0 && (
                      <div className="warnings-list">
                        {validationStates.examples[index].warnings.map((w, i) => (
                          <p key={i} className="warning-item">⚠️ {w}</p>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="form-grid">
                    <div className="form-group">
                      <label htmlFor={`platform-${index}`}>Platform *</label>
                      <select
                        id={`platform-${index}`}
                        value={example.platform}
                        onChange={(e) => handleExamplePlatformChange(index, e.target.value)}
                        className="form-select"
                      >
                        {PLATFORM_OPTIONS.map(opt => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label htmlFor={`date-${index}`}>Date Observed *</label>
                      <input
                        id={`date-${index}`}
                        type="date"
                        value={example.date_observed}
                        onChange={(e) => handleExampleDateChange(index, e.target.value)}
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor={`source-${index}`}>Source URL (optional)</label>
                    <input
                      id={`source-${index}`}
                      type="url"
                      placeholder="https://..."
                      value={example.source_url}
                      onChange={(e) => handleExampleSourceChange(index, e.target.value)}
                      className="form-input"
                    />
                    <p className="form-hint">Link to the original post if publicly available</p>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={addExample}
                className="btn-add-example"
              >
                + Add Another Example
              </button>
            </WizardStep>
          )}

          {/* STEP 4: Harms */}
          {currentStep === 4 && (
            <WizardStep
              stepNumber={4}
              title="Why It Matters"
              description="How does this speech affect people? Select all that apply."
              onNext={goToNextStep}
              onBack={goToPreviousStep}
              nextDisabled={!isStep4Valid()}
            >
              {HARM_OPTIONS.map(harmType => (
                <div key={harmType.value} className="harm-item">
                  <div className="harm-checkbox-label">
                    <input
                      type="checkbox"
                      id={`harm-${harmType.value}`}
                      checked={formData.harms[harmType.value] || false}
                      onChange={(e) => handleHarmCheckChange(harmType.value, e.target.checked)}
                      className="harm-checkbox"
                    />
                    <label htmlFor={`harm-${harmType.value}`} className="harm-label">
                      {harmType.label}
                    </label>
                  </div>

                  <p className="harm-description">{harmType.description}</p>

                  {formData.harms[harmType.value] && (
                    <div className="harm-detail-section">
                      <p className="harm-prompt">💬 {harmType.prompt}</p>
                      <textarea
                        placeholder="Provide context..."
                        value={formData.harm_details[harmType.value] || ''}
                        onChange={(e) => handleHarmDetailChange(harmType.value, e.target.value)}
                        className="form-textarea"
                        rows={3}
                      />
                      <p className="form-hint">
                        {formData.harm_details[harmType.value]?.length || 0} characters
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </WizardStep>
          )}

          {/* STEP 5: Review & Submit */}
          {currentStep === 5 && (
            <WizardStep
              stepNumber={5}
              title="Review & Submit"
              description="Everything looks good! Review and submit for moderation."
              onNext={handleSubmit}
              onBack={goToPreviousStep}
              isLastStep={true}
              submitButtonText={isSubmitting ? '⏳ Submitting...' : '✓ Submit for Review'}
            >
              <div className="review-summary">
                <div className="review-item">
                  <strong>Term:</strong> {formData.term} {formData.variants.length > 0 && `(variants: ${formData.variants.join(', ')})`}
                </div>
                <div className="review-item">
                  <strong>Category:</strong> {getCategoryById(formData.category)?.label}
                </div>
                <div className="review-item">
                  <strong>Risk Level:</strong> {getRiskLevelById(formData.risk)?.label}
                </div>
                <div className="review-item">
                  <strong>Definition:</strong> {validationStates.definition?.wordCount} words
                </div>
                <div className="review-item">
                  <strong>Examples:</strong> {formData.examples.length} example(s)
                </div>
                <div className="review-item">
                  <strong>Harms Documented:</strong> {Object.values(formData.harms).filter(v => v).length}
                </div>
                <div className="review-item confidence">
                  <strong>Confidence Level:</strong> {confidence.icon} {confidence.level} - {confidence.message}
                </div>
              </div>

              <div className="info-box">
                <strong>What happens next?</strong><br />
                1. Your submission goes to our moderation queue<br />
                2. Our team reviews within 24-48 hours<br />
                3. Once approved, your term appears in the lexicon<br />
                4. Community members can add more examples
              </div>
            </WizardStep>
          )}
        </div>

        {/* Right: Preview */}
        <div className="preview-section">
          <TermPreviewCard 
            formData={formData}
            confidence={confidence}
          />
        </div>
      </div>

      <style jsx>{`
        .submit-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          padding: 40px 20px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .page-header {
          text-align: center;
          margin-bottom: 40px;
          color: #1e293b;
        }

        .page-header h1 {
          font-size: 32px;
          margin: 0 0 10px 0;
        }

        .page-header p {
          font-size: 14px;
          color: #64748b;
          margin: 0;
        }

        .step-indicator {
          display: flex;
          justify-content: center;
          gap: 8px;
          margin-bottom: 30px;
          flex-wrap: wrap;
        }

        .step-circle {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          color: white;
          cursor: pointer;
          transition: all 0.3s;
        }

        .step-circle.active,
        .step-circle.completed {
          background-color: #10b981;
        }

        .step-circle.next {
          background-color: #2d5a7b;
        }

        .step-circle.pending {
          background-color: #cbd5e1;
          color: #64748b;
          cursor: not-allowed;
        }

        .step-line {
          width: 20px;
          height: 2px;
          background-color: #cbd5e1;
          margin: 19px 0;
        }

        .step-line.completed {
          background-color: #10b981;
        }

        .progress-container {
          max-width: 1200px;
          margin: 0 auto 30px;
        }

        .progress-bar {
          width: 100%;
          height: 8px;
          background-color: #e2e8f0;
          border-radius: 4px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background-color: #10b981;
          transition: width 0.3s;
        }

        .progress-text {
          text-align: center;
          font-size: 12px;
          color: #64748b;
          margin-top: 8px;
        }

        .success-message {
          max-width: 1200px;
          margin: 0 auto 30px;
          padding: 15px;
          background-color: #ecfdf5;
          border: 1px solid #86efac;
          border-radius: 6px;
          color: #065f46;
          text-align: center;
          font-weight: 600;
        }

        .error-message {
          max-width: 1200px;
          margin: 0 auto 30px;
          padding: 15px;
          background-color: #fee2e2;
          border: 1px solid #fca5a5;
          border-radius: 6px;
          color: #991b1b;
          white-space: pre-wrap;
          font-size: 14px;
        }

        .wizard-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
          max-width: 1400px;
          margin: 0 auto;
        }

        .form-section {
          background: white;
          border-radius: 12px;
          padding: 30px;
          border: 1px solid #cbd5e1;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .preview-section {
          position: sticky;
          top: 20px;
          height: fit-content;
        }

        .form-group {
          margin-bottom: 20px;
        }

        label {
          display: block;
          font-weight: 600;
          margin-bottom: 8px;
          color: #1e293b;
          font-size: 14px;
        }

        .form-input,
        .form-select,
        .form-textarea {
          width: 100%;
          padding: 12px;
          border: 1px solid #cbd5e1;
          border-radius: 6px;
          font-size: 14px;
          font-family: inherit;
          transition: all 0.3s;
        }

        .form-input:focus,
        .form-select:focus,
        .form-textarea:focus {
          outline: none;
          border-color: #2d5a7b;
          box-shadow: 0 0 0 3px rgba(45, 90, 123, 0.1);
        }

        .form-textarea {
          resize: vertical;
          min-height: 100px;
        }

        .form-hint {
          font-size: 12px;
          color: #64748b;
          margin-top: 6px;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 15px;
        }

        .word-counter,
        .char-counter {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          margin-top: 8px;
          color: #64748b;
        }

        .word-counter span:last-child,
        .char-counter span:last-child {
          font-weight: 600;
        }

        .word-counter .good,
        .char-counter .good {
          color: #10b981;
        }

        .word-counter .warning,
        .char-counter .warning {
          color: #f59e0b;
        }

        .word-counter .error,
        .char-counter .error {
          color: #ef4444;
        }

        .variant-hint {
          background: #fef3c7;
          border-left: 3px solid #f59e0b;
          padding: 12px;
          margin-top: 8px;
          border-radius: 4px;
          font-size: 13px;
          color: #92400e;
        }

        .variant-link {
          margin-left: 8px;
          color: #d97706;
          text-decoration: none;
          font-weight: 600;
        }

        .example-block {
          background: #f8fafc;
          padding: 20px;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
          margin-bottom: 20px;
        }

        .example-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
        }

        .example-header h4 {
          margin: 0;
          font-size: 14px;
          color: #475569;
        }

        .btn-remove {
          padding: 6px 12px;
          background: #fee2e2;
          border: none;
          border-radius: 4px;
          color: #991b1b;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
        }

        .btn-remove:hover {
          background: #fca5a5;
        }

        .example-divider {
          border: none;
          border-top: 2px solid #e2e8f0;
          margin: 20px 0;
        }

        .warnings-list {
          margin-top: 8px;
          padding: 10px;
          background: #fef3c7;
          border-radius: 4px;
        }

        .warning-item {
          font-size: 12px;
          color: #92400e;
          margin: 4px 0;
        }

        .btn-add-example {
          width: 100%;
          padding: 12px;
          background: #e2e8f0;
          border: 2px dashed #cbd5e1;
          border-radius: 6px;
          color: #1e293b;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
        }

        .btn-add-example:hover {
          background: #cbd5e1;
          border-color: #94a3b8;
        }

        .harm-item {
          background: #f8fafc;
          padding: 20px;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
          margin-bottom: 20px;
        }

        .harm-checkbox-label {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 10px;
        }

        .harm-checkbox {
          width: 18px;
          height: 18px;
          cursor: pointer;
        }

        .harm-label {
          margin: 0;
          font-weight: 600;
          cursor: pointer;
          color: #1e293b;
        }

        .harm-description {
          font-size: 13px;
          color: #475569;
          margin: 8px 0;
          margin-left: 30px;
        }

        .harm-detail-section {
          margin-top: 15px;
          margin-left: 30px;
          padding: 15px;
          background: white;
          border-radius: 6px;
          border-left: 3px solid #2d5a7b;
        }

        .harm-prompt {
          font-size: 13px;
          color: #475569;
          margin: 0 0 10px 0;
          font-weight: 500;
        }

        .review-summary {
          background: #f8fafc;
          padding: 20px;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
          margin-bottom: 20px;
        }

        .review-item {
          padding: 10px 0;
          font-size: 14px;
          color: #475569;
          border-bottom: 1px solid #e2e8f0;
        }

        .review-item:last-child {
          border-bottom: none;
        }

        .review-item strong {
          color: #1e293b;
          margin-right: 8px;
        }

        .review-item.confidence {
          background: #ecfdf5;
          padding: 12px;
          margin-top: 10px;
          border-radius: 4px;
          border: 1px solid #86efac;
          color: #065f46;
        }

        .info-box {
          background: #f0f4f8;
          border-radius: 8px;
          padding: 20px;
          border-left: 4px solid #2d5a7b;
          font-size: 13px;
          line-height: 1.8;
          color: #475569;
        }

        .info-box strong {
          color: #1e293b;
          display: block;
          margin-bottom: 10px;
        }

        @media (max-width: 1024px) {
          .wizard-layout {
            grid-template-columns: 1fr;
            gap: 30px;
          }

          .preview-section {
            position: relative;
            top: auto;
          }
        }

        @media (max-width: 640px) {
          .submit-page {
            padding: 20px 10px;
          }

          .page-header h1 {
            font-size: 24px;
          }

          .step-indicator {
            gap: 4px;
          }

          .step-circle {
            width: 32px;
            height: 32px;
            font-size: 12px;
          }

          .form-section {
            padding: 20px;
          }

          .form-grid {
            grid-template-columns: 1fr;
          }

          .example-block {
            padding: 15px;
          }
        }
      `}</style>
    </div>
  );
}
