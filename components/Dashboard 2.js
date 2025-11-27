'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import ContentForm from './ContentForm';

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [contents, setContents] = useState([]);

  const handleLogout = async () => {
    await signOut();
  };

  const handleContentAdded = (newContent) => {
    setContents([newContent, ...contents]);
    setShowForm(false);
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1>KESL Dashboard</h1>
        <div>
          <span style={{ marginRight: '20px', fontSize: '16px' }}>Welcome, {user?.email}</span>
          <button
            onClick={handleLogout}
            style={{
              padding: '10px 20px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Logout
          </button>
        </div>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{
            padding: '12px 24px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          {showForm ? 'Cancel' : '+ Document Extreme Speech'}
        </button>
      </div>

      {showForm && <ContentForm onContentAdded={handleContentAdded} />}

      <div>
        <h2>Documented Content ({contents.length})</h2>
        {contents.length === 0 ? (
          <p style={{ color: '#666', fontSize: '16px' }}>No content documented yet. Start by clicking the button above.</p>
        ) : (
          <div>
            {contents.map((item) => (
              <div
                key={item.id}
                style={{
                  border: '1px solid #ddd',
                  padding: '15px',
                  marginBottom: '15px',
                  borderRadius: '4px',
                  backgroundColor: '#f9f9f9'
                }}
              >
                <div style={{ marginBottom: '10px' }}>
                  <strong>Platform:</strong> {item.platform}
                </div>
                <div style={{ marginBottom: '10px' }}>
                  <strong>Category:</strong> {item.category}
                </div>
                {item.ethnic_target && (
                  <div style={{ marginBottom: '10px' }}>
                    <strong>Ethnic Target:</strong> {item.ethnic_target}
                  </div>
                )}
                <div style={{ marginBottom: '10px' }}>
                  <strong>Severity:</strong> {item.severity}
                </div>
                <div>
                  <strong>Content:</strong>
                  <p style={{ marginTop: '5px', whiteSpace: 'pre-wrap', color: '#333' }}>{item.content}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}