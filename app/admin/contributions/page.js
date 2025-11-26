'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function AdminContributionsPage() {
  const [contributions, setContributions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('pending');
  const [selectedContribution, setSelectedContribution] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    loadContributions();
  }, [filterStatus]);

  async function loadContributions() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('community_contributions')
        .select(`
          *,
          terms:term_id(term)
        `)
        .eq('status', filterStatus)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setContributions(data || []);
    } catch (err) {
      console.error('Error loading contributions:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function approveContribution(id) {
    try {
      const { error } = await supabase
        .from('community_contributions')
        .update({ status: 'approved', approved_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
      
      setContributions(contributions.filter(c => c.id !== id));
      setSelectedContribution(null);
      alert('✓ Contribution approved!');
    } catch (err) {
      console.error('Error approving:', err);
      alert('Failed to approve: ' + err.message);
    }
  }

  async function rejectContribution(id) {
    if (!rejectionReason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }

    try {
      const { error } = await supabase
        .from('community_contributions')
        .update({ 
          status: 'rejected', 
          reason_for_rejection: rejectionReason 
        })
        .eq('id', id);

      if (error) throw error;
      
      setContributions(contributions.filter(c => c.id !== id));
      setSelectedContribution(null);
      setRejectionReason('');
      alert('✓ Contribution rejected!');
    } catch (err) {
      console.error('Error rejecting:', err);
      alert('Failed to reject: ' + err.message);
    }
  }

  if (loading) {
    return (
      <>
        <Header />
        <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p>Loading contributions...</p>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main style={{ minHeight: '100vh', backgroundColor: '#f8fafc', paddingBottom: '80px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '40px 20px' }}>
          <h1 style={{ fontSize: '32px', marginBottom: '10px', color: '#1e293b' }}>
            Moderate Community Contributions
          </h1>
          <p style={{ color: '#475569', marginBottom: '30px', fontSize: '15px' }}>
            Review and approve/reject community submissions
          </p>

          {error && (
            <div style={{
              backgroundColor: '#fee2e2',
              border: '1px solid #fca5a5',
              borderRadius: '8px',
              padding: '20px',
              marginBottom: '30px',
              color: '#991b1b'
            }}>
              Error: {error}
            </div>
          )}

          {/* Filter Tabs */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
            {['pending', 'approved', 'rejected'].map(status => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                style={{
                  padding: '12px 24px',
                  backgroundColor: filterStatus === status ? '#2d5a7b' : '#e2e8f0',
                  color: filterStatus === status ? 'white' : '#475569',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '14px',
                  textTransform: 'capitalize'
                }}
              >
                {status} ({contributions.length})
              </button>
            ))}
          </div>

          {/* Contributions List */}
          {contributions.length === 0 ? (
            <div style={{
              backgroundColor: 'white',
              borderRadius: '10px',
              padding: '40px',
              textAlign: 'center',
              color: '#94a3b8'
            }}>
              No {filterStatus} contributions
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '16px' }}>
              {contributions.map(contribution => (
                <div
                  key={contribution.id}
                  onClick={() => setSelectedContribution(contribution)}
                  style={{
                    backgroundColor: 'white',
                    border: '1px solid #cbd5e1',
                    borderRadius: '10px',
                    padding: '20px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    borderLeft: `4px solid ${getColorByType(contribution.contribution_type)}`
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '10px' }}>
                    <div>
                      <h3 style={{ margin: '0 0 5px 0', color: '#1e293b' }}>
                        {contribution.terms?.term} · {getTypeLabel(contribution.contribution_type)}
                      </h3>
                      <p style={{ margin: 0, fontSize: '13px', color: '#94a3b8' }}>
                        {new Date(contribution.created_at).toLocaleDateString()} at {new Date(contribution.created_at).toLocaleTimeString()}
                      </p>
                    </div>
                    <span style={{
                      backgroundColor: getColorByType(contribution.contribution_type),
                      color: 'white',
                      padding: '6px 12px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}>
                      {getTypeLabel(contribution.contribution_type)}
                    </span>
                  </div>
                  <p style={{ margin: '10px 0 0 0', color: '#475569', fontSize: '14px', lineHeight: '1.5' }}>
                    {truncateContent(contribution.content, 150)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Detail Modal */}
        {selectedContribution && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '40px',
              maxWidth: '600px',
              width: '100%',
              maxHeight: '90vh',
              overflow: 'auto'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '20px' }}>
                <div>
                  <h2 style={{ margin: '0 0 5px 0', color: '#1e293b', fontSize: '24px' }}>
                    {selectedContribution.terms?.term}
                  </h2>
                  <p style={{ margin: 0, color: '#94a3b8', fontSize: '14px' }}>
                    {getTypeLabel(selectedContribution.contribution_type)} · {new Date(selectedContribution.created_at).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedContribution(null)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '24px',
                    cursor: 'pointer',
                    color: '#94a3b8'
                  }}
                >
                  ✕
                </button>
              </div>

              {/* Content */}
              <div style={{
                backgroundColor: '#f8fafc',
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                padding: '20px',
                marginBottom: '25px'
              }}>
                <pre style={{
                  margin: 0,
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  color: '#475569',
                  fontSize: '13px',
                  fontFamily: 'monospace'
                }}>
                  {formatContent(selectedContribution.content)}
                </pre>
              </div>

              {/* Rejection Reason (if rejected) */}
              {selectedContribution.status === 'rejected' && selectedContribution.reason_for_rejection && (
                <div style={{
                  backgroundColor: '#fee2e2',
                  border: '1px solid #fca5a5',
                  borderRadius: '8px',
                  padding: '16px',
                  marginBottom: '25px'
                }}>
                  <p style={{ margin: '0 0 8px 0', fontWeight: '600', color: '#991b1b' }}>
                    Rejection Reason:
                  </p>
                  <p style={{ margin: 0, color: '#991b1b', fontSize: '14px' }}>
                    {selectedContribution.reason_for_rejection}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              {selectedContribution.status === 'pending' && (
                <div style={{ display: 'grid', gap: '12px' }}>
                  <button
                    onClick={() => approveContribution(selectedContribution.id)}
                    style={{
                      padding: '14px 24px',
                      backgroundColor: '#10b981',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontWeight: '600',
                      fontSize: '14px'
                    }}
                  >
                    ✓ Approve
                  </button>
                  
                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#1e293b', fontSize: '14px' }}>
                      Rejection Reason (if rejecting)
                    </label>
                    <textarea
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      placeholder="e.g., Inaccurate, Off-topic, Spam..."
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
                    onClick={() => rejectContribution(selectedContribution.id)}
                    style={{
                      padding: '14px 24px',
                      backgroundColor: '#ef4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontWeight: '600',
                      fontSize: '14px'
                    }}
                  >
                    ✕ Reject
                  </button>
                </div>
              )}

              {selectedContribution.status === 'approved' && (
                <div style={{
                  backgroundColor: '#d1fae5',
                  border: '1px solid #6ee7b7',
                  borderRadius: '6px',
                  padding: '16px',
                  color: '#065f46',
                  textAlign: 'center',
                  fontWeight: '600'
                }}>
                  ✓ This contribution is approved
                </div>
              )}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}

function getTypeLabel(type) {
  const labels = {
    'example': '📝 Example',
    'context': '📚 Context',
    'harm': '⚠️ Harm',
    'relation': '🔗 Related'
  };
  return labels[type] || type;
}

function getColorByType(type) {
  const colors = {
    'example': '#3b82f6',
    'context': '#8b5cf6',
    'harm': '#ef4444',
    'relation': '#10b981'
  };
  return colors[type] || '#6b7280';
}

function truncateContent(content, length) {
  try {
    const parsed = JSON.parse(content);
    const text = Object.values(parsed).join(' ');
    return text.length > length ? text.substring(0, length) + '...' : text;
  } catch {
    return content.length > length ? content.substring(0, length) + '...' : content;
  }
}

function formatContent(content) {
  try {
    const parsed = JSON.parse(content);
    return JSON.stringify(parsed, null, 2);
  } catch {
    return content;
  }
}