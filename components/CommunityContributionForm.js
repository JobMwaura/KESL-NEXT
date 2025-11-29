'use client';

import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function CommunityContributionForm({ termId, termName }) {
  const [activeTab, setActiveTab] = useState('example');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    example: {
      quote: '',
      fullContext: '',
      platform: '',
      eventDate: '',
      sourceRef: ''
    },
    context: {
      emergence: '',
      evolution: ''
    },
    harm: {
      description: '',
      targetedGroups: '',
      consequences: ''
    },
    relation: {
      relatedTerm: '',
      relationship: ''
    }
  });

  const handleInputChange = (field, subField, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: {
        ...prev[field],
        [subField]: value
      }
    }));
  };

  const handleSubmit = async (e, type) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let content = '';
      
      if (type === 'example') {
        content = JSON.stringify({
          quote: formData.example.quote,
          fullContext: formData.example.fullContext,
          platform: formData.example.platform,
          eventDate: formData.example.eventDate,
          sourceRef: formData.example.sourceRef
        });
      } else if (type === 'context') {
        content = JSON.stringify(formData.context);
      } else if (type === 'harm') {
        content = JSON.stringify(formData.harm);
      } else if (type === 'relation') {
        content = JSON.stringify(formData.relation);
      }

      // Insert contribution to database
      const { data, error: insertError } = await supabase
        .from('community_contributions')
        .insert([
          {
            term_id: termId,
            contribution_type: type,
            content: content,
            status: 'pending',
            created_at: new Date().toISOString()
          }
        ])
        .select();

      if (insertError) {
        console.error('Insert error:', insertError);
        throw new Error(insertError.message || 'Failed to save contribution');
      }

      console.log('Contribution saved:', data);
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 5000);
      
      // Reset form
      setFormData({
        example: { quote: '', fullContext: '', platform: '', eventDate: '', sourceRef: '' },
        context: { emergence: '', evolution: '' },
        harm: { description: '', targetedGroups: '', consequences: '' },
        relation: { relatedTerm: '', relationship: '' }
      });
    } catch (err) {
      console.error('Submit error:', err);
      setError(err.message || 'Failed to submit contribution');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      backgroundColor: '#f8fafc',
      border: '1px solid #cbd5e1',
      borderRadius: '10px',
      padding: '30px',
      marginTop: '40px'
    }}>
      <h3 style={{ margin: '0 0 10px 0', color: '#1e293b', fontSize: '20px' }}>
        Help Us Document This Term
      </h3>
      <p style={{ color: '#475569', fontSize: '14px', margin: '0 0 25px 0' }}>
        Community contributions help improve our lexicon. All submissions are moderated by our research team.
      </p>

      {submitted && (
        <div style={{
          backgroundColor: '#d1fae5',
          border: '1px solid #6ee7b7',
          borderRadius: '6px',
          padding: '16px',
          marginBottom: '20px',
          color: '#065f46'
        }}>
          ✓ Thank you! Your contribution has been submitted for review.
        </div>
      )}

      {error && (
        <div style={{
          backgroundColor: '#fee2e2',
          border: '1px solid #fca5a5',
          borderRadius: '6px',
          padding: '16px',
          marginBottom: '20px',
          color: '#991b1b'
        }}>
          Error: {error}
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {[
          { id: 'example', label: '📝 Add Example' },
          { id: 'context', label: '📚 Add Context' },
          { id: 'harm', label: '⚠️ Describe Harm' },
          { id: 'relation', label: '🔗 Related Term' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '10px 16px',
              backgroundColor: activeTab === tab.id ? '#2d5a7b' : '#e2e8f0',
              color: activeTab === tab.id ? 'white' : '#475569',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '500',
              fontSize: '13px',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              if (activeTab !== tab.id) e.target.style.backgroundColor = '#cbd5e1';
            }}
            onMouseLeave={(e) => {
              if (activeTab !== tab.id) e.target.style.backgroundColor = '#e2e8f0';
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Example Form */}
      {activeTab === 'example' && (
        <form onSubmit={(e) => handleSubmit(e, 'example')} style={{ display: 'grid', gap: '15px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#1e293b', fontSize: '14px' }}>
              Short Quote or Usage Example
            </label>
            <textarea
              value={formData.example.quote}
              onChange={(e) => handleInputChange('example', 'quote', e.target.value)}
              placeholder="How is this term actually used? (keep under 100 characters)"
              maxLength="100"
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                fontSize: '14px',
                minHeight: '60px',
                boxSizing: 'border-box',
                fontFamily: 'inherit'
              }}
              required
            />
            <span style={{ fontSize: '12px', color: '#94a3b8' }}>
              {formData.example.quote.length}/100
            </span>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#1e293b', fontSize: '14px' }}>
              Full Context (optional)
            </label>
            <textarea
              value={formData.example.fullContext}
              onChange={(e) => handleInputChange('example', 'fullContext', e.target.value)}
              placeholder="Provide more context about where/when this was said"
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                fontSize: '14px',
                minHeight: '80px',
                boxSizing: 'border-box',
                fontFamily: 'inherit'
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#1e293b', fontSize: '14px' }}>
                Platform
              </label>
              <input
                type="text"
                value={formData.example.platform}
                onChange={(e) => handleInputChange('example', 'platform', e.target.value)}
                placeholder="e.g. Telegram, KenyaList, Reddit"
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#1e293b', fontSize: '14px' }}>
                Date (optional)
              </label>
              <input
                type="date"
                value={formData.example.eventDate}
                onChange={(e) => handleInputChange('example', 'eventDate', e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#1e293b', fontSize: '14px' }}>
              Source Reference (optional)
            </label>
            <input
              type="text"
              value={formData.example.sourceRef}
              onChange={(e) => handleInputChange('example', 'sourceRef', e.target.value)}
              placeholder="Link or source reference"
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading || !formData.example.quote}
            style={{
              padding: '12px 20px',
              backgroundColor: formData.example.quote ? '#2d5a7b' : '#cbd5e1',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: formData.example.quote ? 'pointer' : 'not-allowed',
              fontWeight: '600',
              fontSize: '14px',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              if (formData.example.quote && !loading) e.target.style.backgroundColor = '#1a3a52';
            }}
            onMouseLeave={(e) => {
              if (formData.example.quote && !loading) e.target.style.backgroundColor = '#2d5a7b';
            }}
          >
            {loading ? 'Submitting...' : 'Submit Example'}
          </button>
        </form>
      )}

      {/* Context Form */}
      {activeTab === 'context' && (
        <form onSubmit={(e) => handleSubmit(e, 'context')} style={{ display: 'grid', gap: '15px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#1e293b', fontSize: '14px' }}>
              When/Where did this term emerge?
            </label>
            <textarea
              value={formData.context.emergence}
              onChange={(e) => handleInputChange('context', 'emergence', e.target.value)}
              placeholder="e.g. 'Emerged in 2020 during election tensions on Telegram channels...'"
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                fontSize: '14px',
                minHeight: '80px',
                boxSizing: 'border-box',
                fontFamily: 'inherit'
              }}
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#1e293b', fontSize: '14px' }}>
              How has it evolved over time?
            </label>
            <textarea
              value={formData.context.evolution}
              onChange={(e) => handleInputChange('context', 'evolution', e.target.value)}
              placeholder="How has the meaning or usage changed?"
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                fontSize: '14px',
                minHeight: '80px',
                boxSizing: 'border-box',
                fontFamily: 'inherit'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading || !formData.context.emergence}
            style={{
              padding: '12px 20px',
              backgroundColor: formData.context.emergence ? '#2d5a7b' : '#cbd5e1',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: formData.context.emergence ? 'pointer' : 'not-allowed',
              fontWeight: '600',
              fontSize: '14px'
            }}
          >
            {loading ? 'Submitting...' : 'Submit Context'}
          </button>
        </form>
      )}

      {/* Harm Form */}
      {activeTab === 'harm' && (
        <form onSubmit={(e) => handleSubmit(e, 'harm')} style={{ display: 'grid', gap: '15px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#1e293b', fontSize: '14px' }}>
              Why is this speech harmful?
            </label>
            <textarea
              value={formData.harm.description}
              onChange={(e) => handleInputChange('harm', 'description', e.target.value)}
              placeholder="Describe the specific harms this speech causes..."
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                fontSize: '14px',
                minHeight: '100px',
                boxSizing: 'border-box',
                fontFamily: 'inherit'
              }}
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#1e293b', fontSize: '14px' }}>
              Who does it target?
            </label>
            <input
              type="text"
              value={formData.harm.targetedGroups}
              onChange={(e) => handleInputChange('harm', 'targetedGroups', e.target.value)}
              placeholder="e.g. Somali communities, LGBTQ+ individuals, women"
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#1e293b', fontSize: '14px' }}>
              Real-world consequences (optional)
            </label>
            <textarea
              value={formData.harm.consequences}
              onChange={(e) => handleInputChange('harm', 'consequences', e.target.value)}
              placeholder="Have you witnessed or documented any offline consequences?"
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                fontSize: '14px',
                minHeight: '80px',
                boxSizing: 'border-box',
                fontFamily: 'inherit'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading || !formData.harm.description}
            style={{
              padding: '12px 20px',
              backgroundColor: formData.harm.description ? '#2d5a7b' : '#cbd5e1',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: formData.harm.description ? 'pointer' : 'not-allowed',
              fontWeight: '600',
              fontSize: '14px'
            }}
          >
            {loading ? 'Submitting...' : 'Submit Harm Description'}
          </button>
        </form>
      )}

      {/* Related Terms Form */}
      {activeTab === 'relation' && (
        <form onSubmit={(e) => handleSubmit(e, 'relation')} style={{ display: 'grid', gap: '15px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#1e293b', fontSize: '14px' }}>
              Related Term
            </label>
            <input
              type="text"
              value={formData.relation.relatedTerm}
              onChange={(e) => handleInputChange('relation', 'relatedTerm', e.target.value)}
              placeholder="Name of a related term in the lexicon"
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#1e293b', fontSize: '14px' }}>
              How are they related?
            </label>
            <select
              value={formData.relation.relationship}
              onChange={(e) => handleInputChange('relation', 'relationship', e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
              required
            >
              <option value="">Select relationship type</option>
              <option value="synonym">Synonym or variation</option>
              <option value="targets_same">Targets same group</option>
              <option value="similar_context">Similar context/period</option>
              <option value="evolved_from">Evolved from</option>
              <option value="precursor_to">Precursor to</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading || !formData.relation.relatedTerm || !formData.relation.relationship}
            style={{
              padding: '12px 20px',
              backgroundColor: (formData.relation.relatedTerm && formData.relation.relationship) ? '#2d5a7b' : '#cbd5e1',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: (formData.relation.relatedTerm && formData.relation.relationship) ? 'pointer' : 'not-allowed',
              fontWeight: '600',
              fontSize: '14px'
            }}
          >
            {loading ? 'Submitting...' : 'Submit Related Term'}
          </button>
        </form>
      )}

      <div style={{
        backgroundColor: '#f1f5f9',
        border: '1px solid #cbd5e1',
        borderRadius: '6px',
        padding: '16px',
        marginTop: '25px',
        fontSize: '13px',
        color: '#475569'
      }}>
        <strong style={{ color: '#1e293b' }}>🔒 Privacy & Moderation:</strong> Your contributions help improve our research. All submissions are reviewed by our team within 2-3 days. We prioritize accuracy and safety in documenting extreme speech.
      </div>
    </div>
  );
}