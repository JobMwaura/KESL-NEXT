'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function SubmitPage() {
  const [formData, setFormData] = useState({
    // Basic Information
    term: '',
    literal_gloss: '',
    meaning: '',
    category: '',
    risk: '',
    language: '',
    
    // Speech Details
    registers: '',
    linguisticMarkers: '',
    targetGroup: '',
    actorPositioning: '',
    
    // Examples
    examples: [
      { 
        quote: '', 
        platform: '', 
        date: '', 
        context: '',
        url: ''
      }
    ],

    // Detailed Analysis
    speechFunction: '',
    harmPotential: '',
    platformDynamics: '',
    powerRelations: '',
    identityPolitics: '',
    keyTheme: '',
    
    // Migration & Spread
    contentMigration: '',
    offlineConsequences: '',
    amplificationPatterns: '',
    
    // Additional
    tags: '',
    sources: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const categories = ['Derogatory', 'Exclusionary', 'Dangerous', 'Coded'];
  const riskLevels = ['Low', 'Medium', 'High', 'Very High'];
  const languages = ['Swahili', 'English', 'Sheng', 'Mixed'];
  const platforms = ['Reddit', 'Telegram', 'KenyaList', 'KenyansOnline', 'Twitter/X', 'Facebook', 'WhatsApp', 'TikTok', 'YouTube', 'Instagram', 'Other'];
  const speechFunctions = ['Political attack', 'Ethnic targeting', 'Gender-based', 'Religious', 'Class denigration', 'LGBTQ+ targeting', 'General insult', 'Other'];

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
      examples: [...prev.examples, { quote: '', platform: '', date: '', context: '', url: '' }]
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
    if (!formData.meaning.trim()) newErrors.meaning = 'Definition is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.risk) newErrors.risk = 'Risk level is required';
    if (!formData.language) newErrors.language = 'Language is required';
    
    const hasValidExample = formData.examples.some(ex => 
      ex.quote.trim() && ex.platform.trim()
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
          registers: '',
          linguisticMarkers: '',
          targetGroup: '',
          actorPositioning: '',
          examples: [{ quote: '', platform: '', date: '', context: '', url: '' }],
          speechFunction: '',
          harmPotential: '',
          platformDynamics: '',
          powerRelations: '',
          identityPolitics: '',
          keyTheme: '',
          contentMigration: '',
          offlineConsequences: '',
          amplificationPatterns: '',
          tags: '',
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
          background: 'linear-gradient(135deg, #1a3a52 0%, #2d5a7b 100%)',
          color: 'white',
          padding: '60px 20px',
          textAlign: 'center'
        }}>
          <h1 style={{ fontSize: '48px', margin: '0 0 15px 0', fontWeight: '700' }}>Document Extreme Speech</h1>
          <p style={{ fontSize: '18px', opacity: 0.95, maxWidth: '800px', margin: '0 auto', lineHeight: '1.6' }}>
            Help KESL document extreme speech patterns across Kenya's digital platforms. Your detailed contributions help us understand harmful speech in context.
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
            <strong>✓ Success!</strong> Your submission has been received and will be reviewed by our moderation team. Thank you for contributing to KESL!
          </div>
        )}

        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
          <form onSubmit={handleSubmit}>
            {/* SECTION 1: BASIC INFORMATION */}
            <section style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              padding: '30px',
              border: '1px solid #e0e0e0',
              marginBottom: '30px'
            }}>
              <h2 style={{ margin: '0 0 25px 0', color: '#1a3a52', borderBottom: '2px solid #f0f0f0', paddingBottom: '15px', fontSize: '22px', fontWeight: '700' }}>
                1. Basic Information
              </h2>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#1a3a52' }}>
                  Term/Phrase <span style={{ color: '#d62828' }}>*</span>
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
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#1a3a52' }}>
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
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '14px',
                      boxSizing: 'border-box',
                      fontFamily: 'inherit'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#1a3a52' }}>
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
                    <option value="">Select language...</option>
                    {languages.map(lang => (
                      <option key={lang} value={lang}>{lang}</option>
                    ))}
                  </select>
                  {errors.language && <p style={{ margin: '5px 0 0 0', color: '#d62828', fontSize: '12px' }}>✗ {errors.language}</p>}
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#1a3a52' }}>
                  Definition & Meaning <span style={{ color: '#d62828' }}>*</span>
                </label>
                <textarea
                  name="meaning"
                  value={formData.meaning}
                  onChange={handleInputChange}
                  placeholder="Detailed explanation: What does this term mean? How is it commonly used? What is the cultural context?"
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
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#1a3a52' }}>
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
                    <option value="">Select category...</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  {errors.category && <p style={{ margin: '5px 0 0 0', color: '#d62828', fontSize: '12px' }}>✗ {errors.category}</p>}
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#1a3a52' }}>
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

            {/* SECTION 2: SPEECH CHARACTERISTICS */}
            <section style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              padding: '30px',
              border: '1px solid #e0e0e0',
              marginBottom: '30px'
            }}>
              <h2 style={{ margin: '0 0 25px 0', color: '#1a3a52', borderBottom: '2px solid #f0f0f0', paddingBottom: '15px', fontSize: '22px', fontWeight: '700' }}>
                2. Speech Characteristics
              </h2>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#1a3a52' }}>
                  Registers & Tone (optional)
                </label>
                <textarea
                  name="registers"
                  value={formData.registers}
                  onChange={handleInputChange}
                  placeholder="Describe the tone and linguistic registers used. E.g., 'Painful, disgust, moral revulsion tone. Contemptuous rhetoric. Dehumanizing language.'"
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

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#1a3a52' }}>
                  Linguistic Markers (optional)
                </label>
                <textarea
                  name="linguisticMarkers"
                  value={formData.linguisticMarkers}
                  onChange={handleInputChange}
                  placeholder="What specific linguistic devices are used? E.g., 'Racial slurs (nigga), moral condemnation terms (narcissist, murderer), clinical labels (pathological liar), humor and sarcasm, escalated negative evaluations'"
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#1a3a52' }}>
                    Target Group (optional)
                  </label>
                  <input
                    type="text"
                    name="targetGroup"
                    value={formData.targetGroup}
                    onChange={handleInputChange}
                    placeholder="E.g., 'Political leaders', 'Ethnic minorities', 'LGBTQ+ community', 'Women'"
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
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#1a3a52' }}>
                    Actor Positioning (optional)
                  </label>
                  <input
                    type="text"
                    name="actorPositioning"
                    value={formData.actorPositioning}
                    onChange={handleInputChange}
                    placeholder="How are targets cast or portrayed? E.g., 'As dumb and foolish', 'As pathological', 'As unworthy'"
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
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#1a3a52' }}>
                  Speech Function (optional)
                </label>
                <select
                  name="speechFunction"
                  value={formData.speechFunction}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                >
                  <option value="">Select primary function...</option>
                  {speechFunctions.map(func => (
                    <option key={func} value={func}>{func}</option>
                  ))}
                </select>
              </div>
            </section>

            {/* SECTION 3: EXAMPLES */}
            <section style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              padding: '30px',
              border: '1px solid #e0e0e0',
              marginBottom: '30px'
            }}>
              <h2 style={{ margin: '0 0 25px 0', color: '#1a3a52', borderBottom: '2px solid #f0f0f0', paddingBottom: '15px', fontSize: '22px', fontWeight: '700' }}>
                3. Examples <span style={{ color: '#d62828' }}>*</span>
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
                    <h4 style={{ margin: 0, color: '#1a3a52', fontWeight: '700' }}>Example {index + 1}</h4>
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
                          fontSize: '12px',
                          fontWeight: '600'
                        }}
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '13px', color: '#1a3a52' }}>
                      Quote/Excerpt (redacted)
                    </label>
                    <textarea
                      value={example.quote}
                      onChange={(e) => handleExampleChange(index, 'quote', e.target.value)}
                      placeholder="Provide the actual text or redacted excerpt. Remove identifying information (names, dates that identify, locations). Be precise with the speech."
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '13px',
                        minHeight: '70px',
                        boxSizing: 'border-box',
                        fontFamily: 'monospace'
                      }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '13px', color: '#1a3a52' }}>
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
                      <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '13px', color: '#1a3a52' }}>
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

                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '13px', color: '#1a3a52' }}>
                      URL/Link (optional)
                    </label>
                    <input
                      type="url"
                      value={example.url}
                      onChange={(e) => handleExampleChange(index, 'url', e.target.value)}
                      placeholder="Link to the original post (if publicly accessible)"
                      style={{
                        width: '100%',
                        padding: '8px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '13px',
                        boxSizing: 'border-box',
                        fontFamily: 'monospace'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '13px', color: '#1a3a52' }}>
                      Context (optional)
                    </label>
                    <textarea
                      value={example.context}
                      onChange={(e) => handleExampleChange(index, 'context', e.target.value)}
                      placeholder="What was the broader context? What was being discussed? Why was this speech used? What triggered it?"
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '13px',
                        minHeight: '80px',
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
                  backgroundColor: '#1a3a52',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '13px'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#2d5a7b'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#1a3a52'}
              >
                + Add Another Example
              </button>
            </section>

            {/* SECTION 4: DETAILED ANALYSIS */}
            <section style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              padding: '30px',
              border: '1px solid #e0e0e0',
              marginBottom: '30px'
            }}>
              <h2 style={{ margin: '0 0 25px 0', color: '#1a3a52', borderBottom: '2px solid #f0f0f0', paddingBottom: '15px', fontSize: '22px', fontWeight: '700' }}>
                4. Detailed Analysis (Optional but Valuable)
              </h2>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#1a3a52' }}>
                  Harm Potential & Effects
                </label>
                <textarea
                  name="harmPotential"
                  value={formData.harmPotential}
                  onChange={handleInputChange}
                  placeholder="What harms does this speech cause? Normalization of insults? Heightened polarization? Risk of violence? Targeting of marginalized groups? E.g., 'Normalized insults on political leaders, heightened polarization, uses of dehumanizing language'"
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

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#1a3a52' }}>
                  Platform Dynamics
                </label>
                <textarea
                  name="platformDynamics"
                  value={formData.platformDynamics}
                  onChange={handleInputChange}
                  placeholder="How does this speech spread on specific platforms? E.g., 'Content migrated from X/Twitter to Reddit. High engagement with 191 upvotes and 9 replies. Use of charged emotional language for virality and traction.'"
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

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#1a3a52' }}>
                  Power Relations & Impact
                </label>
                <textarea
                  name="powerRelations"
                  value={formData.powerRelations}
                  onChange={handleInputChange}
                  placeholder="What power dynamics are at play? E.g., 'Social platform affords ordinary citizens power to assail senior politicians. Ordinary voter othered as dumber than political leaders. Ordinary citizen attack on power holders.'"
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

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#1a3a52' }}>
                  Identity Politics & Intersectionality
                </label>
                <textarea
                  name="identityPolitics"
                  value={formData.identityPolitics}
                  onChange={handleInputChange}
                  placeholder="What identity categories are invoked or targeted? E.g., 'Reference to n-word which though often used carries historical racialized weight of denigration. Post reinforces class stereotypes about poverty (Even if you grew up in poverty you are prone to steal).'"
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

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#1a3a52' }}>
                  Key Theme/Pattern
                </label>
                <input
                  type="text"
                  name="keyTheme"
                  value={formData.keyTheme}
                  onChange={handleInputChange}
                  placeholder="E.g., 'Elitist denigration', 'Political elitism', 'Ethnic stereotyping', 'Gender-based harassment'"
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
            </section>

            {/* SECTION 5: MIGRATION & SPREAD */}
            <section style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              padding: '30px',
              border: '1px solid #e0e0e0',
              marginBottom: '30px'
            }}>
              <h2 style={{ margin: '0 0 25px 0', color: '#1a3a52', borderBottom: '2px solid #f0f0f0', paddingBottom: '15px', fontSize: '22px', fontWeight: '700' }}>
                5. Content Migration & Spread (Optional)
              </h2>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#1a3a52' }}>
                  Migration Path
                </label>
                <input
                  type="text"
                  name="contentMigration"
                  value={formData.contentMigration}
                  onChange={handleInputChange}
                  placeholder="E.g., 'Offline gossip → Online tabloid (X/Twitter) → Reddit', or 'Telegram channel → Multiple platforms → Offline spaces'"
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
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#1a3a52' }}>
                  Offline Consequences
                </label>
                <textarea
                  name="offlineConsequences"
                  value={formData.offlineConsequences}
                  onChange={handleInputChange}
                  placeholder="Has this speech manifested offline? E.g., 'Narratives reflect in workplace gossip, matatu conversations, community gatherings', or 'Led to harassment or violence against target groups'"
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

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#1a3a52' }}>
                  Amplification Patterns
                </label>
                <textarea
                  name="amplificationPatterns"
                  value={formData.amplificationPatterns}
                  onChange={handleInputChange}
                  placeholder="How is this speech amplified? Bots? Influencers? Network effects? E.g., 'Content uses highly charged emotional language for virality. Receives significant engagement. Is shared across multiple platforms with modifications.'"
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

            {/* SECTION 6: ADDITIONAL INFO */}
            <section style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              padding: '30px',
              border: '1px solid #e0e0e0',
              marginBottom: '30px'
            }}>
              <h2 style={{ margin: '0 0 25px 0', color: '#1a3a52', borderBottom: '2px solid #f0f0f0', paddingBottom: '15px', fontSize: '22px', fontWeight: '700' }}>
                6. Additional Information
              </h2>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#1a3a52' }}>
                  Tags
                </label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  placeholder="E.g., ethnic, political, security, gender, economic, religion, class (comma-separated)"
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
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#1a3a52' }}>
                  Sources & References
                </label>
                <textarea
                  name="sources"
                  value={formData.sources}
                  onChange={handleInputChange}
                  placeholder="Academic sources, reports, policy documents, or other references relevant to this term"
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

            {/* Privacy Notice */}
            <section style={{
              backgroundColor: '#f0f4f8',
              borderLeft: '4px solid #1a3a52',
              padding: '20px',
              borderRadius: '4px',
              marginBottom: '30px'
            }}>
              <p style={{ margin: 0, color: '#3c4b7c', fontSize: '13px', lineHeight: '1.6' }}>
                <strong>ℹ️ Important:</strong> All examples and personal information will be carefully redacted to protect privacy. Do not include identifying information such as real usernames, full names, specific dates that identify individuals, or location details. Your submission will be reviewed by our moderation team before publication to ensure ethical documentation.
              </p>
            </section>

            <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end' }}>
              <button
                type="reset"
                style={{
                  padding: '12px 30px',
                  backgroundColor: '#f0f0f0',
                  color: '#1a3a52',
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
                  backgroundColor: '#1a3a52',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '14px'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#2d5a7b'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#1a3a52'}
              >
                Submit Contribution
              </button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}