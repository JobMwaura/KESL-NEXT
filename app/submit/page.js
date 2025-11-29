'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function SubmitPage() {
  const [formData, setFormData] = useState({
    term: '',
    literal_gloss: '',
    meaning: '',
    category: '',
    risk: '',
    language: '',
    quote: '',
    platform: '',
    date: '',
    context: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const categories = ['Derogatory', 'Exclusionary', 'Dangerous', 'Coded'];
  const riskLevels = ['Low', 'Medium', 'High', 'Very High'];
  const languages = ['Swahili', 'English', 'Sheng', 'Mixed'];
  const platforms = ['Reddit', 'Telegram', 'KenyaList', 'KenyansOnline', 'Twitter/X', 'Facebook', 'WhatsApp', 'TikTok', 'YouTube', 'Instagram', 'Other'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.term.trim()) newErrors.term = 'Term is required';
    if (!formData.meaning.trim()) newErrors.meaning = 'Meaning is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.risk) newErrors.risk = 'Risk level is required';
    if (!formData.language) newErrors.language = 'Language is required';
    if (!formData.quote.trim()) newErrors.quote = 'At least one example quote is required';
    if (!formData.platform) newErrors.platform = 'Platform is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        const response = await fetch('/api/terms', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            term: formData.term,
            literal_gloss: formData.literal_gloss,
            meaning: formData.meaning,
            category: formData.category,
            risk: formData.risk,
            language: formData.language,
            examples: [{
              quote: formData.quote,
              platform: formData.platform,
              date: formData.date || null,
              context: formData.context || null,
              url: null
            }]
          })
        });

        const result = await response.json();

        if (!response.ok) {
          setErrors({ submit: result.error || 'Failed to submit. Please try again.' });
          return;
        }

        setSubmitted(true);
        setTimeout(() => {
          setFormData({
            term: '',
            literal_gloss: '',
            meaning: '',
            category: '',
            risk: '',
            language: '',
            quote: '',
            platform: '',
            date: '',
            context: ''
          });
          setSubmitted(false);
        }, 3000);
      } catch (error) {
        console.error('Submission error:', error);
        setErrors({ submit: 'Network error. Please check your connection and try again.' });
      }
    }
  };

  return (
    <>
      <Header />
      <main style={{ minHeight: '100vh', paddingBottom: '80px' }}>
        {/* Breadcrumb Navigation */}
        <nav style={{
          padding: '20px',
          backgroundColor: '#f8fafc',
          borderBottom: '1px solid #e2e8f0'
        }}>
          <div style={{ maxWidth: '1300px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '8px', padding: '0 20px' }}>
            <a href="/" style={{
              textDecoration: 'none',
              color: '#2d5a7b',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'color 0.2s',
              padding: '6px 0'
            }}
            onMouseEnter={(e) => e.target.style.color = '#1a3a52'}
            onMouseLeave={(e) => e.target.style.color = '#2d5a7b'}>
              🏠 Home
            </a>
            <span style={{ color: '#cbd5e1' }}>/</span>
            <span style={{ color: '#64748b', fontSize: '14px', fontWeight: '500' }}>
              ✏️ Submit a Term
            </span>
          </div>
        </nav>

        <section style={{
          background: 'linear-gradient(135deg, #1a3a52 0%, #2d5a7b 100%)',
          color: 'white',
          padding: '60px 20px',
          textAlign: 'center'
        }}>
          <h1 style={{ fontSize: '48px', margin: '0 0 15px 0', fontWeight: '700' }}>
            Submit a New Term
          </h1>
          <p style={{ fontSize: '18px', opacity: 0.95, maxWidth: '700px', margin: '0 auto', lineHeight: '1.6' }}>
            Help us document extreme speech patterns in Kenya. Submit a term with one example, and our community will help expand it.
          </p>
        </section>

        {submitted && (
          <div style={{
            maxWidth: '800px',
            margin: '40px auto',
            padding: '20px',
            backgroundColor: '#d1fae5',
            border: '1px solid #6ee7b7',
            borderRadius: '6px',
            color: '#065f46',
            textAlign: 'center'
          }}>
            <strong style={{ fontSize: '16px' }}>✓ Success!</strong>
            <p style={{ margin: '10px 0 0 0' }}>Your term has been submitted for review. Our team will check it and it will appear in the lexicon within 24-48 hours. Thank you!</p>
          </div>
        )}

        <div style={{ maxWidth: '700px', margin: '0 auto', padding: '40px 20px' }}>
          <form onSubmit={handleSubmit}>
            {errors.submit && (
              <div style={{
                marginBottom: '20px',
                padding: '15px',
                backgroundColor: '#fee2e2',
                border: '1px solid #fca5a5',
                borderRadius: '6px',
                color: '#991b1b',
                fontSize: '14px'
              }}>
                {errors.submit}
              </div>
            )}

            {/* Term & Meaning */}
            <section style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              padding: '30px',
              border: '1px solid #e2e8f0',
              marginBottom: '25px'
            }}>
              <h2 style={{ margin: '0 0 20px 0', color: '#1e293b', fontSize: '18px', fontWeight: '700' }}>
                Term Details
              </h2>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#1e293b' }}>
                  Term/Phrase <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="text"
                  name="term"
                  value={formData.term}
                  onChange={handleInputChange}
                  placeholder="e.g., 'This nigga is the worst president', 'Cabal of foolish men'"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: errors.term ? '2px solid #ef4444' : '1px solid #e2e8f0',
                    borderRadius: '6px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                    fontFamily: 'inherit'
                  }}
                />
                {errors.term && <p style={{ margin: '5px 0 0 0', color: '#991b1b', fontSize: '12px' }}>✗ {errors.term}</p>}
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#1e293b' }}>
                  What does it mean? <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <textarea
                  name="meaning"
                  value={formData.meaning}
                  onChange={handleInputChange}
                  placeholder="Explain what this term means and how it's used. What is its context in Kenya's digital spaces?"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: errors.meaning ? '2px solid #ef4444' : '1px solid #e2e8f0',
                    borderRadius: '6px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                    minHeight: '100px',
                    fontFamily: 'inherit',
                    resize: 'vertical'
                  }}
                />
                {errors.meaning && <p style={{ margin: '5px 0 0 0', color: '#991b1b', fontSize: '12px' }}>✗ {errors.meaning}</p>}
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#1e293b' }}>
                  Language <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <select
                  name="language"
                  value={formData.language}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: errors.language ? '2px solid #ef4444' : '1px solid #e2e8f0',
                    borderRadius: '6px',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                >
                  <option value="">Select language...</option>
                  {languages.map(lang => (
                    <option key={lang} value={lang}>{lang}</option>
                  ))}
                </select>
                {errors.language && <p style={{ margin: '5px 0 0 0', color: '#991b1b', fontSize: '12px' }}>✗ {errors.language}</p>}
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#1e293b' }}>
                  Literal Gloss (optional)
                </label>
                <input
                  type="text"
                  name="literal_gloss"
                  value={formData.literal_gloss}
                  onChange={handleInputChange}
                  placeholder="Direct word-for-word translation"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '6px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                    fontFamily: 'inherit'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#1e293b' }}>
                    Category <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: errors.category ? '2px solid #ef4444' : '1px solid #e2e8f0',
                      borderRadius: '6px',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                  >
                    <option value="">Select...</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  {errors.category && <p style={{ margin: '5px 0 0 0', color: '#991b1b', fontSize: '12px' }}>✗ {errors.category}</p>}
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#1e293b' }}>
                    Risk Level <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <select
                    name="risk"
                    value={formData.risk}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: errors.risk ? '2px solid #ef4444' : '1px solid #e2e8f0',
                      borderRadius: '6px',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                  >
                    <option value="">Select...</option>
                    {riskLevels.map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                  {errors.risk && <p style={{ margin: '5px 0 0 0', color: '#991b1b', fontSize: '12px' }}>✗ {errors.risk}</p>}
                </div>
              </div>
            </section>

            {/* Example */}
            <section style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              padding: '30px',
              border: '1px solid #e2e8f0',
              marginBottom: '25px'
            }}>
              <h2 style={{ margin: '0 0 20px 0', color: '#1e293b', fontSize: '18px', fontWeight: '700' }}>
                Real-World Example
              </h2>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#1e293b' }}>
                  Quote (redacted) <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <textarea
                  name="quote"
                  value={formData.quote}
                  onChange={handleInputChange}
                  placeholder="Provide the actual quote or redacted excerpt. Remove identifying information like real names, usernames, specific dates that identify people, or locations."
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: errors.quote ? '2px solid #ef4444' : '1px solid #e2e8f0',
                    borderRadius: '6px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                    minHeight: '80px',
                    fontFamily: 'monospace',
                    resize: 'vertical'
                  }}
                />
                {errors.quote && <p style={{ margin: '5px 0 0 0', color: '#991b1b', fontSize: '12px' }}>✗ {errors.quote}</p>}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#1e293b' }}>
                    Platform <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <select
                    name="platform"
                    value={formData.platform}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: errors.platform ? '2px solid #ef4444' : '1px solid #e2e8f0',
                      borderRadius: '6px',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                  >
                    <option value="">Select...</option>
                    {platforms.map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                  {errors.platform && <p style={{ margin: '5px 0 0 0', color: '#991b1b', fontSize: '12px' }}>✗ {errors.platform}</p>}
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#1e293b' }}>
                    Date (optional)
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#1e293b' }}>
                  Context (optional)
                </label>
                <textarea
                  name="context"
                  value={formData.context}
                  onChange={handleInputChange}
                  placeholder="What was the broader context? What was being discussed? Why was this speech used?"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '6px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                    minHeight: '70px',
                    fontFamily: 'inherit',
                    resize: 'vertical'
                  }}
                />
              </div>
            </section>

            {/* Privacy Notice */}
            <section style={{
              backgroundColor: '#ecfdf5',
              borderLeft: '4px solid #10b981',
              padding: '20px',
              borderRadius: '6px',
              marginBottom: '25px'
            }}>
              <p style={{ margin: 0, color: '#065f46', fontSize: '13px', lineHeight: '1.6' }}>
                <strong>🔒 Privacy:</strong> All quotes will be redacted to protect privacy. Do not include real names, usernames, specific identifying dates, or locations. Your submission will be reviewed before publication.
              </p>
            </section>

            {/* Buttons */}
            <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end' }}>
              <button
                type="reset"
                style={{
                  padding: '12px 30px',
                  backgroundColor: '#f1f5f9',
                  color: '#1e293b',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '14px',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#e2e8f0'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#f1f5f9'}
              >
                Clear
              </button>
              <button
                type="submit"
                style={{
                  padding: '12px 40px',
                  backgroundColor: '#2d5a7b',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '14px',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#1a3a52'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#2d5a7b'}
              >
                Submit Term
              </button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}