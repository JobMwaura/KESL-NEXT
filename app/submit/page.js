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
    platform: '',
    examples: [
      { short_quote: '', platform: '', date: '', context: '' }
    ],
    tags: '',
    migration: '',
    sources: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const categories = ['Derogatory', 'Exclusionary', 'Dangerous', 'Coded'];
  const riskLevels = ['Low', 'Medium', 'High'];
  const languages = ['Swahili', 'English', 'Sheng', 'Mixed'];
  const platforms = ['Reddit', 'Telegram', 'KenyaList', 'Twitter', 'Facebook', 'WhatsApp', 'TikTok', 'YouTube'];

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

  const handleExampleChange = (index, field, value) => {
    const newExamples = [...formData.examples];
    newExamples[index][field] = value;
    setFormData(prev => ({
      ...prev,
      examples: newExamples
    }));
  };

  const addExample = () => {
    setFormData(prev => ({
      ...prev,
      examples: [...prev.examples, { short_quote: '', platform: '', date: '', context: '' }]
    }));
  };

  const removeExample = (index) => {
    setFormData(prev => ({
      ...prev,
      examples: prev.examples.filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.term.trim()) newErrors.term = 'Term name is required';
    if (!formData.meaning.trim()) newErrors.meaning = 'Meaning is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.risk) newErrors.risk = 'Risk level is required';
    if (!formData.language) newErrors.language = 'Language is required';
    
    const hasValidExample = formData.examples.some(ex => 
      ex.short_quote.trim() && ex.platform.trim()
    );
    if (!hasValidExample) newErrors.examples = 'At least one example with quote and platform is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setSubmitted(true);
      setTimeout(() => {
        setFormData({
          term: '',
          literal_gloss: '',
          meaning: '',
          category: '',
          risk: '',
          language: '',
          platform: '',
          examples: [{ short_quote: '', platform: '', date: '', context: '' }],
          tags: '',
          migration: '',
          sources: ''
        });
        setSubmitted(false);
      }, 3000);
    }
  };

  return (
    <>
      <Header onSignInClick={() => {}} />
      <main style={{ minHeight: '100vh', paddingBottom: '80px' }}>
        <section style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '60px 20px',
          textAlign: 'center'
        }}>
          <h1 style={{ fontSize: '48px', margin: '0 0 15px 0' }}>Submit a Term</h1>
          <p style={{ fontSize: '18px', opacity: 0.95, maxWidth: '800px', margin: '0 auto' }}>
            Help document extreme speech and contentious language in Kenya's digital spaces
          </p>
        </section>

        {submitted && (
          <div style={{
            maxWidth: '1000px',
            margin: '40px auto',
            padding: '20px',
            backgroundColor: '#d4edda',
            borderLeft: '4px solid #28a745',
            borderRadius: '4px',
            color: '#155724'
          }}>
            <strong>✓ Success!</strong> Your term submission has been received. It will be reviewed by our moderation team shortly.
          </div>
        )}

        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 20px' }}>
          <form onSubmit={handleSubmit}>
            <section style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              padding: '30px',
              border: '1px solid #e0e0e0',
              marginBottom: '30px'
            }}>
              <h2 style={{ margin: '0 0 25px 0', color: '#333', borderBottom: '2px solid #f0f0f0', paddingBottom: '15px' }}>
                Basic Information
              </h2>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>
                  Term Name <span style={{ color: '#d62828' }}>*</span>
                </label>
                <input
                  type="text"
                  name="term"
                  value={formData.term}
                  onChange={handleInputChange}
                  placeholder="e.g., 'Somalliphobia', 'Questionable Loyalty'"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: errors.term ? '2px solid #d62828' : '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                    fontFamily: 'inherit'
                  }}
                />
                {errors.term && <p style={{ margin: '5px 0 0 0', color: '#d62828', fontSize: '12px' }}>✗ {errors.term}</p>}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>
                    Literal Gloss (optional)
                  </label>
                  <input
                    type="text"
                    name="literal_gloss"
                    value={formData.literal_gloss}
                    onChange={handleInputChange}
                    placeholder="Direct translation or basic meaning"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '14px',
                      boxSizing: 'border-box',
                      fontFamily: 'inherit'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>
                    Language <span style={{ color: '#d62828' }}>*</span>
                  </label>
                  <select
                    name="language"
                    value={formData.language}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: errors.language ? '2px solid #d62828' : '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                  >
                    <option value="">Select a language...</option>
                    {languages.map(lang => (
                      <option key={lang} value={lang}>{lang}</option>
                    ))}
                  </select>
                  {errors.language && <p style={{ margin: '5px 0 0 0', color: '#d62828', fontSize: '12px' }}>✗ {errors.language}</p>}
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>
                  Definition <span style={{ color: '#d62828' }}>*</span>
                </label>
                <textarea
                  name="meaning"
                  value={formData.meaning}
                  onChange={handleInputChange}
                  placeholder="What does this term mean? How is it used? What is its context?"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: errors.meaning ? '2px solid #d62828' : '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                    minHeight: '100px',
                    fontFamily: 'inherit'
                  }}
                />
                {errors.meaning && <p style={{ margin: '5px 0 0 0', color: '#d62828', fontSize: '12px' }}>✗ {errors.meaning}</p>}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>
                    Category <span style={{ color: '#d62828' }}>*</span>
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: errors.category ? '2px solid #d62828' : '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                  >
                    <option value="">Select a category...</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  {errors.category && <p style={{ margin: '5px 0 0 0', color: '#d62828', fontSize: '12px' }}>✗ {errors.category}</p>}
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>
                    Risk Level <span style={{ color: '#d62828' }}>*</span>
                  </label>
                  <select
                    name="risk"
                    value={formData.risk}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: errors.risk ? '2px solid #d62828' : '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                  >
                    <option value="">Select risk level...</option>
                    {riskLevels.map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                  {errors.risk && <p style={{ margin: '5px 0 0 0', color: '#d62828', fontSize: '12px' }}>✗ {errors.risk}</p>}
                </div>
              </div>
            </section>

            <section style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              padding: '30px',
              border: '1px solid #e0e0e0',
              marginBottom: '30px'
            }}>
              <h2 style={{ margin: '0 0 25px 0', color: '#333', borderBottom: '2px solid #f0f0f0', paddingBottom: '15px' }}>
                Examples <span style={{ color: '#d62828' }}>*</span>
              </h2>

              {errors.examples && (
                <div style={{ marginBottom: '15px', padding: '10px', backgroundColor: '#ffe0e0', borderLeft: '3px solid #d62828', color: '#d62828', fontSize: '12px' }}>
                  ✗ {errors.examples}
                </div>
              )}

              {formData.examples.map((example, index) => (
                <div key={index} style={{
                  marginBottom: '25px',
                  padding: '20px',
                  backgroundColor: '#f9f9f9',
                  borderRadius: '6px',
                  border: '1px solid #e0e0e0'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                    <h4 style={{ margin: 0, color: '#333' }}>Example {index + 1}</h4>
                    {formData.examples.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeExample(index)}
                        style={{
                          padding: '5px 10px',
                          backgroundColor: '#d62828',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '13px', color: '#333' }}>
                      Quote/Excerpt (redacted)
                    </label>
                    <textarea
                      value={example.short_quote}
                      onChange={(e) => handleExampleChange(index, 'short_quote', e.target.value)}
                      placeholder="Provide a redacted example of the speech (max 30 words, remove identifying information)"
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '13px',
                        minHeight: '70px',
                        boxSizing: 'border-box',
                        fontFamily: 'inherit'
                      }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '13px', color: '#333' }}>
                        Platform
                      </label>
                      <select
                        value={example.platform}
                        onChange={(e) => handleExampleChange(index, 'platform', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '8px',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          fontSize: '13px',
                          boxSizing: 'border-box'
                        }}
                      >
                        <option value="">Select platform...</option>
                        {platforms.map(p => (
                          <option key={p} value={p}>{p}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '13px', color: '#333' }}>
                        Date (optional)
                      </label>
                      <input
                        type="date"
                        value={example.date}
                        onChange={(e) => handleExampleChange(index, 'date', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '8px',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          fontSize: '13px',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '13px', color: '#333' }}>
                      Context (optional)
                    </label>
                    <textarea
                      value={example.context}
                      onChange={(e) => handleExampleChange(index, 'context', e.target.value)}
                      placeholder="What was the broader context of this speech?"
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '13px',
                        minHeight: '60px',
                        boxSizing: 'border-box',
                        fontFamily: 'inherit'
                      }}
                    />
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={addExample}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#667eea',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '13px'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#5568d3'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#667eea'}
              >
                + Add Another Example
              </button>
            </section>

            <section style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              padding: '30px',
              border: '1px solid #e0e0e0',
              marginBottom: '30px'
            }}>
              <h2 style={{ margin: '0 0 25px 0', color: '#333', borderBottom: '2px solid #f0f0f0', paddingBottom: '15px' }}>
                Additional Information
              </h2>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>
                  Tags (optional)
                </label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  placeholder="e.g., ethnic, political, security, economic (comma-separated)"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                    fontFamily: 'inherit'
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>
                  Migration Path (optional)
                </label>
                <input
                  type="text"
                  name="migration"
                  value={formData.migration}
                  onChange={handleInputChange}
                  placeholder="e.g., Online → Offline, Platform A → Platform B → Platform C"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                    fontFamily: 'inherit'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>
                  Sources/References (optional)
                </label>
                <textarea
                  name="sources"
                  value={formData.sources}
                  onChange={handleInputChange}
                  placeholder="Links to academic sources, reports, or documentation"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                    minHeight: '80px',
                    fontFamily: 'inherit'
                  }}
                />
              </div>
            </section>

            <section style={{
              backgroundColor: '#f0f5ff',
              borderLeft: '4px solid #667eea',
              padding: '20px',
              borderRadius: '4px',
              marginBottom: '30px'
            }}>
              <p style={{ margin: 0, color: '#3c4b7c', fontSize: '13px', lineHeight: '1.6' }}>
                <strong>ℹ️ Important:</strong> All examples will be redacted to protect privacy. Do not include identifying information such as usernames, dates, or location details that could identify individuals. Your submission will be reviewed by our moderation team before publication.
              </p>
            </section>

            <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end' }}>
              <button
                type="reset"
                style={{
                  padding: '12px 30px',
                  backgroundColor: '#f0f0f0',
                  color: '#333',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '14px'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#e0e0e0'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#f0f0f0'}
              >
                Clear Form
              </button>
              <button
                type="submit"
                style={{
                  padding: '12px 40px',
                  backgroundColor: '#667eea',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '14px'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#5568d3'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#667eea'}
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