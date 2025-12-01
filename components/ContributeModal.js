'use client';

import { useState, useEffect } from 'react';
import { addExample, addContext, addHarm, addRelatedTerm } from '@/lib/supabase';

export default function ContributeModal({ isOpen, onClose, termId, termName, type }) {
  const [contributionType, setContributionType] = useState(type || 'example');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const [charCount, setCharCount] = useState(0);

  // Form data state
  const [formData, setFormData] = useState({
    // Example fields
    quote: '',
    platform: '',
    date_observed: new Date().toISOString().split('T')[0],
    source_url: '',
    
    // Context fields
    context: '',
    
    // Harm fields
    harm_type: 'normalizes_contempt',
    harm_description: '',
    targeted_groups: '',
    
    // Related term fields
    related_term_id: '',
    relation_type: 'similar_to'
  });

  // Reset form when modal opens with new type
  useEffect(() => {
    if (type) {
      setContributionType(type);
      setError(null);
      setSubmitted(false);
      resetForm();
    }
  }, [type, isOpen]);

  const resetForm = () => {
    setFormData({
      quote: '',
      platform: '',
      date_observed: new Date().toISOString().split('T')[0],
      source_url: '',
      context: '',
      harm_type: 'normalizes_contempt',
      harm_description: '',
      targeted_groups: '',
      related_term_id: '',
      relation_type: 'similar_to'
    });
    setCharCount(0);
    setError(null);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Update character count for text fields
    if (field === 'quote' || field === 'context' || field === 'harm_description') {
      setCharCount(value.length);
    }
  };

  const validateForm = () => {
    setError(null);

    switch (contributionType) {
      case 'example':
        if (!formData.quote.trim()) {
          setError('Quote is required');
          return false;
        }
        if (formData.quote.length > 100) {
          setError('Quote must be 100 characters or less');
          return false;
        }
        if (!formData.platform.trim()) {
          setError('Platform is required');
          return false;
        }
        if (!formData.date_observed) {
          setError('Date is required');
          return false;
        }
        break;

      case 'context':
        if (!formData.context.trim()) {
          setError('Context description is required');
          return false;
        }
        break;

      case 'harm':
        if (!formData.harm_description.trim()) {
          setError('Harm description is required');
          return false;
        }
        if (formData.harm_description.length < 30) {
          setError('Harm description must be at least 30 characters');
          return false;
        }
        break;

      case 'relation':
        if (!formData.related_term_id.trim()) {
          setError('Related term ID is required');
          return false;
        }
        break;

      default:
        return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      switch (contributionType) {
        case 'example':
          await addExample(termId, {
            quote: formData.quote.trim(),
            platform: formData.platform.trim(),
            date_observed: formData.date_observed,
            source_url: formData.source_url.trim() || null
          });
          break;

        case 'context':
          await addContext(termId, {
            context: formData.context.trim()
          });
          break;

        case 'harm':
          await addHarm(termId, {
            harm_type: formData.harm_type,
            harm_description: formData.harm_description.trim(),
            targeted_groups: formData.targeted_groups.trim() || null
          });
          break;

        case 'relation':
          await addRelatedTerm(termId, {
            related_term_id: formData.related_term_id.trim(),
            relation_type: formData.relation_type
          });
          break;
      }

      setSubmitted(true);
      setTimeout(() => {
        onClose();
        resetForm();
      }, 2000);

    } catch (err) {
      console.error('Error submitting contribution:', err);
      setError(err.message || 'Failed to submit contribution');
      setLoading(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        maxWidth: '600px',
        width: '100%',
        maxHeight: '90vh',
        overflow: 'auto',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
      }}>
        {/* Header */}
        <div style={{
          padding: '24px',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h2 style={{
              margin: '0 0 8px 0',
              fontSize: '20px',
              fontWeight: '700',
              color: '#1e293b'
            }}>
              Contribute to {termName}
            </h2>
            <p style={{
              margin: 0,
              fontSize: '14px',
              color: '#94a3b8'
            }}>
              Help improve our documentation
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              width: '32px',
              height: '32px',
              border: 'none',
              backgroundColor: '#f1f5f9',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '18px',
              color: '#64748b',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#e2e8f0';
              e.target.style.color = '#1e293b';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#f1f5f9';
              e.target.style.color = '#64748b';
            }}
          >
            ✕
          </button>
        </div>

        {/* Success Message */}
        {submitted && (
          <div style={{
            padding: '16px 24px',
            backgroundColor: '#d1fae5',
            border: '1px solid #a7f3d0',
            color: '#065f46',
            borderRadius: '6px',
            marginTop: '24px',
            marginLeft: '24px',
            marginRight: '24px'
          }}>
            <p style={{ margin: 0, fontSize: '14px', fontWeight: '600' }}>
              ✓ Thank you! Your contribution has been submitted for review.
            </p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div style={{
            padding: '16px 24px',
            backgroundColor: '#fee2e2',
            border: '1px solid #fecaca',
            color: '#7f1d1d',
            borderRadius: '6px',
            marginTop: '24px',
            marginLeft: '24px',
            marginRight: '24px'
          }}>
            <p style={{ margin: 0, fontSize: '14px', fontWeight: '600' }}>
              ✕ {error}
            </p>
          </div>
        )}

        {/* Form Content */}
        {!submitted && (
          <div style={{ padding: '24px' }}>
            {/* Type Selector */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '700',
                color: '#94a3b8',
                textTransform: 'uppercase',
                marginBottom: '8px'
              }}>
                Contribution Type
              </label>
              <select
                value={contributionType}
                onChange={(e) => {
                  setContributionType(e.target.value);
                  setError(null);
                }}
                style={{
                  width: '100%',
                  padding: '12px',
                  fontSize: '14px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  backgroundColor: 'white',
                  cursor: 'pointer',
                  fontWeight: '500',
                  color: '#1e293b'
                }}
              >
                <option value="example">💬 Add Example</option>
                <option value="context">📚 Add Context</option>
                <option value="harm">💔 Describe Harm</option>
                <option value="relation">🔗 Add Related Term</option>
              </select>
            </div>

            {/* Example Section */}
            {contributionType === 'example' && (
              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: '700',
                    color: '#1e293b',
                    marginBottom: '8px'
                  }}>
                    Quote <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <textarea
                    value={formData.quote}
                    onChange={(e) => handleInputChange('quote', e.target.value)}
                    placeholder="Paste the quote as it appeared (max 100 characters)"
                    style={{
                      width: '100%',
                      padding: '12px',
                      fontSize: '14px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px',
                      fontFamily: 'monospace',
                      resize: 'vertical',
                      minHeight: '80px',
                      boxSizing: 'border-box'
                    }}
                  />
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginTop: '6px',
                    fontSize: '12px',
                    color: charCount > 100 ? '#ef4444' : '#94a3b8'
                  }}>
                    <span>For privacy, avoid including personal identifying information</span>
                    <span>{charCount}/100</span>
                  </div>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: '700',
                    color: '#1e293b',
                    marginBottom: '8px'
                  }}>
                    Platform <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <select
                    value={formData.platform}
                    onChange={(e) => handleInputChange('platform', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      fontSize: '14px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px',
                      backgroundColor: 'white',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="">Select a platform</option>
                    <option value="Twitter">Twitter/X</option>
                    <option value="Reddit">Reddit</option>
                    <option value="KenyaTalk">KenyaTalk</option>
                    <option value="Telegram">Telegram</option>
                    <option value="WhatsApp">WhatsApp</option>
                    <option value="Facebook">Facebook</option>
                    <option value="TikTok">TikTok</option>
                    <option value="YouTube">YouTube</option>
                    <option value="Discord">Discord</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: '700',
                    color: '#1e293b',
                    marginBottom: '8px'
                  }}>
                    Date Observed <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.date_observed}
                    onChange={(e) => handleInputChange('date_observed', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      fontSize: '14px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: '700',
                    color: '#1e293b',
                    marginBottom: '8px'
                  }}>
                    Source URL <span style={{ fontSize: '12px', fontWeight: '400', color: '#94a3b8' }}>(optional)</span>
                  </label>
                  <input
                    type="url"
                    value={formData.source_url}
                    onChange={(e) => handleInputChange('source_url', e.target.value)}
                    placeholder="https://..."
                    style={{
                      width: '100%',
                      padding: '12px',
                      fontSize: '14px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    type="button"
                    onClick={onClose}
                    style={{
                      flex: 1,
                      padding: '12px',
                      backgroundColor: '#f1f5f9',
                      color: '#64748b',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontWeight: '600',
                      fontSize: '14px',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#e2e8f0';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = '#f1f5f9';
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      flex: 1,
                      padding: '12px',
                      backgroundColor: loading ? '#cbd5e1' : '#2d5a7b',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      fontWeight: '600',
                      fontSize: '14px',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      if (!loading) e.target.style.backgroundColor = '#1a3a52';
                    }}
                    onMouseLeave={(e) => {
                      if (!loading) e.target.style.backgroundColor = '#2d5a7b';
                    }}
                  >
                    {loading ? 'Submitting...' : 'Submit Example'}
                  </button>
                </div>
              </form>
            )}

            {/* Context Section */}
            {contributionType === 'context' && (
              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: '700',
                    color: '#1e293b',
                    marginBottom: '8px'
                  }}>
                    Context Description <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <textarea
                    value={formData.context}
                    onChange={(e) => handleInputChange('context', e.target.value)}
                    placeholder="Provide context about when/where/how this term is used"
                    style={{
                      width: '100%',
                      padding: '12px',
                      fontSize: '14px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px',
                      resize: 'vertical',
                      minHeight: '120px',
                      boxSizing: 'border-box'
                    }}
                  />
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginTop: '6px',
                    fontSize: '12px',
                    color: '#94a3b8'
                  }}>
                    <span>Helpful context helps researchers understand usage patterns</span>
                    <span>{charCount} chars</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    type="button"
                    onClick={onClose}
                    style={{
                      flex: 1,
                      padding: '12px',
                      backgroundColor: '#f1f5f9',
                      color: '#64748b',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontWeight: '600',
                      fontSize: '14px',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#e2e8f0';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = '#f1f5f9';
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      flex: 1,
                      padding: '12px',
                      backgroundColor: loading ? '#cbd5e1' : '#2d5a7b',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      fontWeight: '600',
                      fontSize: '14px',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      if (!loading) e.target.style.backgroundColor = '#1a3a52';
                    }}
                    onMouseLeave={(e) => {
                      if (!loading) e.target.style.backgroundColor = '#2d5a7b';
                    }}
                  >
                    {loading ? 'Submitting...' : 'Submit Context'}
                  </button>
                </div>
              </form>
            )}

            {/* Harm Section */}
            {contributionType === 'harm' && (
              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: '700',
                    color: '#1e293b',
                    marginBottom: '8px'
                  }}>
                    Type of Harm <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <select
                    value={formData.harm_type}
                    onChange={(e) => handleInputChange('harm_type', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      fontSize: '14px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px',
                      backgroundColor: 'white',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="normalizes_contempt">😠 Normalizes Contempt</option>
                    <option value="primes_exclusion">🚫 Primes Exclusion</option>
                    <option value="cues_violence">⚔️ Cues Violence</option>
                    <option value="harasses">🎯 Harasses/Targets Groups</option>
                    <option value="other">⚠️ Other Harm</option>
                  </select>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: '700',
                    color: '#1e293b',
                    marginBottom: '8px'
                  }}>
                    Describe the Harm <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <textarea
                    value={formData.harm_description}
                    onChange={(e) => handleInputChange('harm_description', e.target.value)}
                    placeholder="Explain how this term causes harm (min 30 characters)"
                    style={{
                      width: '100%',
                      padding: '12px',
                      fontSize: '14px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px',
                      resize: 'vertical',
                      minHeight: '100px',
                      boxSizing: 'border-box'
                    }}
                  />
                  <div style={{
                    fontSize: '12px',
                    color: formData.harm_description.length < 30 ? '#ef4444' : '#94a3b8',
                    marginTop: '6px'
                  }}>
                    {charCount}/30 min
                  </div>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: '700',
                    color: '#1e293b',
                    marginBottom: '8px'
                  }}>
                    Targeted Groups <span style={{ fontSize: '12px', fontWeight: '400', color: '#94a3b8' }}>(optional)</span>
                  </label>
                  <textarea
                    value={formData.targeted_groups}
                    onChange={(e) => handleInputChange('targeted_groups', e.target.value)}
                    placeholder="Which communities are most affected by this term?"
                    style={{
                      width: '100%',
                      padding: '12px',
                      fontSize: '14px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px',
                      resize: 'vertical',
                      minHeight: '80px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    type="button"
                    onClick={onClose}
                    style={{
                      flex: 1,
                      padding: '12px',
                      backgroundColor: '#f1f5f9',
                      color: '#64748b',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontWeight: '600',
                      fontSize: '14px',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#e2e8f0';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = '#f1f5f9';
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      flex: 1,
                      padding: '12px',
                      backgroundColor: loading ? '#cbd5e1' : '#2d5a7b',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      fontWeight: '600',
                      fontSize: '14px',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      if (!loading) e.target.style.backgroundColor = '#1a3a52';
                    }}
                    onMouseLeave={(e) => {
                      if (!loading) e.target.style.backgroundColor = '#2d5a7b';
                    }}
                  >
                    {loading ? 'Submitting...' : 'Submit Harm Description'}
                  </button>
                </div>
              </form>
            )}

            {/* Related Term Section */}
            {contributionType === 'relation' && (
              <form onSubmit={handleSubmit}>
                <div style={{
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  padding: '12px',
                  marginBottom: '20px',
                  fontSize: '13px',
                  color: '#64748b'
                }}>
                  <p style={{ margin: 0 }}>
                    Link this term to a related term in the lexicon. You'll need the term's KEL ID.
                  </p>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: '700',
                    color: '#1e293b',
                    marginBottom: '8px'
                  }}>
                    Related Term KEL ID <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.related_term_id}
                    onChange={(e) => handleInputChange('related_term_id', e.target.value)}
                    placeholder="e.g., KEL-0042"
                    style={{
                      width: '100%',
                      padding: '12px',
                      fontSize: '14px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px',
                      fontFamily: 'monospace',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: '700',
                    color: '#1e293b',
                    marginBottom: '8px'
                  }}>
                    Relationship Type <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <select
                    value={formData.relation_type}
                    onChange={(e) => handleInputChange('relation_type', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      fontSize: '14px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px',
                      backgroundColor: 'white',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="variant_of">🔤 Variant of (alternative spelling)</option>
                    <option value="similar_to">🔗 Similar to (comparable meaning)</option>
                    <option value="evolved_from">📈 Evolved from (original form)</option>
                    <option value="evolved_to">➡️ Evolved to (current evolution)</option>
                    <option value="related">🔀 Related (distinct but connected)</option>
                  </select>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    type="button"
                    onClick={onClose}
                    style={{
                      flex: 1,
                      padding: '12px',
                      backgroundColor: '#f1f5f9',
                      color: '#64748b',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontWeight: '600',
                      fontSize: '14px',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#e2e8f0';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = '#f1f5f9';
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      flex: 1,
                      padding: '12px',
                      backgroundColor: loading ? '#cbd5e1' : '#2d5a7b',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      fontWeight: '600',
                      fontSize: '14px',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      if (!loading) e.target.style.backgroundColor = '#1a3a52';
                    }}
                    onMouseLeave={(e) => {
                      if (!loading) e.target.style.backgroundColor = '#2d5a7b';
                    }}
                  >
                    {loading ? 'Submitting...' : 'Add Related Term'}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
