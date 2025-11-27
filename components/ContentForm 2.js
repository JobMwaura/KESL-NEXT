'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';

export default function ContentForm({ onContentAdded }) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    content: '',
    platform: 'Reddit',
    category: 'Derogatory Speech',
    ethnic_target: '',
    severity: 'Medium'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // For now, just add to local state
      // Later: send to Supabase
      const newContent = {
        id: Date.now().toString(),
        user_id: user?.id,
        ...formData,
        created_at: new Date().toISOString()
      };

      onContentAdded(newContent);
      setFormData({
        content: '',
        platform: 'Reddit',
        category: 'Derogatory Speech',
        ethnic_target: '',
        severity: 'Medium'
      });
    } catch (err) {
      setError('Failed to submit content');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{
      backgroundColor: '#f9f9f9',
      padding: '20px',
      borderRadius: '8px',
      marginBottom: '30px',
      border: '1px solid #ddd'
    }}>
      <h3>Document Extreme Speech Content</h3>

      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Platform</label>
        <select
          name="platform"
          value={formData.platform}
          onChange={handleChange}
          style={{
            width: '100%',
            padding: '10px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '14px',
            boxSizing: 'border-box'
          }}
        >
          <option>Reddit</option>
          <option>Telegram</option>
          <option>KenyaList</option>
          <option>Twitter/X</option>
          <option>Facebook</option>
          <option>WhatsApp</option>
          <option>TikTok</option>
          <option>Other</option>
        </select>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Category</label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          style={{
            width: '100%',
            padding: '10px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '14px',
            boxSizing: 'border-box'
          }}
        >
          <option>Derogatory Speech</option>
          <option>Exclusionary Speech</option>
          <option>Dangerous Speech</option>
          <option>Hate Speech</option>
          <option>Incitement</option>
        </select>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Ethnic/Community Target (if applicable)</label>
        <input
          type="text"
          name="ethnic_target"
          value={formData.ethnic_target}
          onChange={handleChange}
          placeholder="e.g., Somali, Kikuyu, LGBTQ+"
          style={{
            width: '100%',
            padding: '10px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '14px',
            boxSizing: 'border-box'
          }}
        />
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Severity Level</label>
        <select
          name="severity"
          value={formData.severity}
          onChange={handleChange}
          style={{
            width: '100%',
            padding: '10px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '14px',
            boxSizing: 'border-box'
          }}
        >
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
          <option>Critical</option>
        </select>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Content</label>
        <textarea
          name="content"
          value={formData.content}
          onChange={handleChange}
          required
          placeholder="Paste or describe the extreme speech content here..."
          style={{
            width: '100%',
            padding: '10px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '14px',
            boxSizing: 'border-box',
            minHeight: '150px',
            fontFamily: 'monospace'
          }}
        />
      </div>

      {error && <div style={{ color: 'red', marginBottom: '15px', fontSize: '14px' }}>{error}</div>}

      <button
        type="submit"
        disabled={loading}
        style={{
          padding: '12px 24px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          fontSize: '16px',
          fontWeight: 'bold',
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.6 : 1
        }}
      >
        {loading ? 'Submitting...' : 'Submit Content'}
      </button>
    </form>
  );
}