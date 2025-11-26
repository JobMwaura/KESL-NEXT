'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { fetchTermById } from '@/lib/supabase';
import CommunityContributionForm from '@/components/CommunityContributionForm';

export default function TermPage() {
  const params = useParams();
  const [term, setTerm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [votes, setVotes] = useState(0);
  const [userVote, setUserVote] = useState(0);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    async function loadTerm() {
      try {
        setLoading(true);
        const data = await fetchTermById(params.id);
        setTerm(data);
        setVotes(data.votes || 0);
      } catch (err) {
        console.error('Error loading term:', err);
        setError('Failed to load term');
      } finally {
        setLoading(false);
      }
    }

    if (params.id) {
      loadTerm();
    }
  }, [params.id]);

  if (loading) {
    return (
      <>
        <Header />
        <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p>Loading...</p>
        </main>
        <Footer />
      </>
    );
  }

  if (error || !term) {
    return (
      <>
        <Header />
        <main style={{ padding: '60px 20px', textAlign: 'center' }}>
          <h2>Term not found</h2>
          <p><a href="/lexicon" style={{ color: '#2d5a7b' }}>← Back to Lexicon</a></p>
        </main>
        <Footer />
      </>
    );
  }

  const handleVote = (value) => {
    if (userVote === value) {
      setVotes(votes - value);
      setUserVote(0);
    } else {
      setVotes(votes - userVote + value);
      setUserVote(value);
    }
  };

  const getCategoryColor = (cat) => {
    const colors = {
      'Derogatory': '#dc2626',
      'Exclusionary': '#f97316',
      'Dangerous': '#991b1b',
      'Coded': '#7c3aed'
    };
    return colors[cat] || '#2d5a7b';
  };

  const getRiskColor = (risk) => {
    const colors = {
      'Low': '#10b981',
      'Medium': '#f59e0b',
      'High': '#ef4444'
    };
    return colors[risk] || '#94a3b8';
  };

  const migrationArray = Array.isArray(term.migration) ? term.migration : [];

  return (
    <>
      <Header />
      <main style={{ minHeight: '100vh', paddingBottom: '80px', backgroundColor: '#f8fafc' }}>
        {/* Breadcrumb */}
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '20px', color: '#94a3b8', fontSize: '14px' }}>
          <a href="/lexicon" style={{ color: '#2d5a7b', textDecoration: 'none', fontWeight: '600' }}>Lexicon</a>
          {' / '}
          <span>{term.term}</span>
        </div>

        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 20px 40px', display: 'grid', gridTemplateColumns: '1fr 340px', gap: '40px' }}>
          {/* Main Content */}
          <div>
            {/* Header */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '30px',
              marginBottom: '30px',
              border: '1px solid #cbd5e1'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
                <h1 style={{ margin: 0, fontSize: '42px', color: '#1e293b' }}>
                  {term.term}
                </h1>
                <span style={{ fontSize: '14px', color: '#94a3b8', fontWeight: '500' }}>
                  {term.language}
                </span>
              </div>
              <p style={{ margin: '10px 0 20px 0', fontSize: '15px', color: '#475569', fontStyle: 'italic' }}>
                {term.literal_gloss}
              </p>
              <div style={{ display: 'flex', gap: '10px' }}>
                <Badge text={term.category} color={getCategoryColor(term.category)} />
                <Badge text={`Risk: ${term.risk}`} color={getRiskColor(term.risk)} />
              </div>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '25px', borderBottom: '2px solid #cbd5e1', backgroundColor: 'white', borderRadius: '12px 12px 0 0', padding: '0 30px' }}>
              {[
                { id: 'overview', label: '📖 Overview', icon: '📖' },
                { id: 'context', label: '📚 Context', icon: '📚' },
                { id: 'harm', label: '⚠️ Why It Matters', icon: '⚠️' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    padding: '16px 0',
                    marginBottom: '-2px',
                    backgroundColor: 'transparent',
                    color: activeTab === tab.id ? '#2d5a7b' : '#94a3b8',
                    border: 'none',
                    borderBottom: activeTab === tab.id ? '3px solid #2d5a7b' : 'none',
                    cursor: 'pointer',
                    fontWeight: activeTab === tab.id ? '700' : '500',
                    fontSize: '14px',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div style={{ backgroundColor: 'white', borderRadius: '0 12px 12px 12px', padding: '30px', border: '1px solid #cbd5e1', borderTop: 'none' }}>
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div style={{ display: 'grid', gap: '30px' }}>
                  <div>
                    <h2 style={{ fontSize: '18px', marginBottom: '15px', color: '#1e293b' }}>Meaning</h2>
                    <p style={{ fontSize: '15px', lineHeight: '1.8', color: '#475569' }}>
                      {term.meaning}
                    </p>
                  </div>

                  {migrationArray.length > 0 && (
                    <div>
                      <h2 style={{ fontSize: '18px', marginBottom: '15px', color: '#1e293b' }}>Platforms</h2>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {migrationArray.map(platform => (
                          <span key={platform} style={{
                            backgroundColor: '#f1f5f9',
                            padding: '8px 12px',
                            borderRadius: '6px',
                            fontSize: '13px',
                            color: '#475569',
                            border: '1px solid #cbd5e1'
                          }}>
                            {platform}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {term.tags && Array.isArray(term.tags) && term.tags.length > 0 && (
                    <div>
                      <h2 style={{ fontSize: '18px', marginBottom: '15px', color: '#1e293b' }}>Tags</h2>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {term.tags.map(tag => (
                          <span key={tag} style={{
                            backgroundColor: '#2d5a7b',
                            color: 'white',
                            padding: '8px 14px',
                            borderRadius: '16px',
                            fontSize: '12px',
                            fontWeight: '600'
                          }}>
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Context Tab */}
              {activeTab === 'context' && (
                <div style={{ display: 'grid', gap: '25px' }}>
                  {term.context_history ? (
                    <div>
                      <h2 style={{ fontSize: '18px', marginBottom: '12px', color: '#1e293b' }}>Historical Context</h2>
                      <p style={{ fontSize: '14px', lineHeight: '1.8', color: '#475569', margin: 0 }}>
                        {term.context_history}
                      </p>
                    </div>
                  ) : (
                    <div style={{
                      backgroundColor: '#f1f5f9',
                      padding: '20px',
                      borderRadius: '8px',
                      color: '#475569',
                      fontSize: '14px',
                      fontStyle: 'italic'
                    }}>
                      No context history documented yet. Help us by adding context below!
                    </div>
                  )}
                </div>
              )}

              {/* Harm Tab */}
              {activeTab === 'harm' && (
                <div style={{ display: 'grid', gap: '25px' }}>
                  {term.harm_description ? (
                    <div>
                      <h2 style={{ fontSize: '18px', marginBottom: '12px', color: '#1e293b' }}>Why This Speech Matters</h2>
                      <p style={{ fontSize: '14px', lineHeight: '1.8', color: '#475569', margin: 0 }}>
                        {term.harm_description}
                      </p>
                    </div>
                  ) : (
                    <div style={{
                      backgroundColor: '#f1f5f9',
                      padding: '20px',
                      borderRadius: '8px',
                      color: '#475569',
                      fontSize: '14px',
                      fontStyle: 'italic'
                    }}>
                      Harm description not yet documented. Help us understand the impact by contributing below!
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Community Contribution Form */}
            <CommunityContributionForm termId={term.id} termName={term.term} />
          </div>

          {/* Sidebar */}
          <aside style={{ display: 'grid', gap: '20px' }}>
            {/* Usefulness Vote */}
            <div style={{
              backgroundColor: 'white',
              border: '1px solid #cbd5e1',
              borderRadius: '10px',
              padding: '20px',
              position: 'sticky',
              top: '20px'
            }}>
              <h4 style={{ margin: '0 0 15px 0', color: '#1e293b', textAlign: 'center', fontSize: '14px', fontWeight: '600' }}>
                Is this helpful?
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '15px' }}>
                <button
                  onClick={() => handleVote(1)}
                  style={{
                    padding: '10px',
                    backgroundColor: userVote === 1 ? '#10b981' : '#f1f5f9',
                    color: userVote === 1 ? 'white' : '#475569',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '13px',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (userVote !== 1) e.target.style.backgroundColor = '#e2e8f0';
                  }}
                  onMouseLeave={(e) => {
                    if (userVote !== 1) e.target.style.backgroundColor = '#f1f5f9';
                  }}
                >
                  👍 Yes
                </button>
                <button
                  onClick={() => handleVote(-1)}
                  style={{
                    padding: '10px',
                    backgroundColor: userVote === -1 ? '#ef4444' : '#f1f5f9',
                    color: userVote === -1 ? 'white' : '#475569',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '13px',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (userVote !== -1) e.target.style.backgroundColor = '#e2e8f0';
                  }}
                  onMouseLeave={(e) => {
                    if (userVote !== -1) e.target.style.backgroundColor = '#f1f5f9';
                  }}
                >
                  👎 No
                </button>
              </div>
              <div style={{ textAlign: 'center', fontSize: '13px', color: '#94a3b8' }}>
                <strong style={{ color: '#475569', fontSize: '15px' }}>{votes}</strong> found this helpful
              </div>
            </div>

            {/* Metadata */}
            <div style={{
              backgroundColor: 'white',
              border: '1px solid #cbd5e1',
              borderRadius: '10px',
              padding: '20px'
            }}>
              <h4 style={{ margin: '0 0 15px 0', color: '#1e293b', fontSize: '14px', fontWeight: '600' }}>Details</h4>
              <div style={{ fontSize: '13px', color: '#475569', lineHeight: '2' }}>
                <div><strong style={{ color: '#1e293b' }}>Language:</strong> {term.language}</div>
                <div><strong style={{ color: '#1e293b' }}>Category:</strong> {term.category}</div>
                <div><strong style={{ color: '#1e293b' }}>Risk:</strong> {term.risk}</div>
                <div><strong style={{ color: '#1e293b' }}>Added:</strong> {new Date(term.created_at).toLocaleDateString()}</div>
              </div>
            </div>

            {/* Info Box */}
            <div style={{
              backgroundColor: '#fef3c7',
              border: '1px solid #f59e0b',
              borderRadius: '10px',
              padding: '16px'
            }}>
              <p style={{ margin: 0, color: '#92400e', fontSize: '13px', lineHeight: '1.6' }}>
                <strong>📖 Research Content:</strong> This term is documented for educational and research purposes to understand harmful speech patterns.
              </p>
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </>
  );
}

function Badge({ text, color }) {
  return (
    <span style={{
      backgroundColor: color,
      color: 'white',
      padding: '6px 12px',
      borderRadius: '5px',
      fontSize: '12px',
      fontWeight: '700',
      whiteSpace: 'nowrap',
      display: 'inline-block',
      boxShadow: `0 2px 4px ${color}40`
    }}>
      {text}
    </span>
  );
}