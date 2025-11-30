'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase, autoMergeModerationItem, approveModerationItem, rejectModerationItem } from '@/lib/supabase';

export default function AdminDashboard() {
  const [adminTab, setAdminTab] = useState('submissions');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  return (
    <main style={{
      minHeight: '100vh',
      backgroundColor: '#f0f4f8',
      paddingTop: '0'
    }}>
      {/* Admin Header */}
      <header style={{
        backgroundColor: 'white',
        borderBottom: '1px solid #e2e8f0',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
      }}>
        <div style={{
          maxWidth: '1600px',
          margin: '0 auto',
          padding: '20px 30px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h1 style={{
              margin: 0,
              fontSize: '24px',
              fontWeight: '700',
              color: '#0f172a'
            }}>
              🔐 Admin Dashboard
            </h1>
            <p style={{
              margin: '4px 0 0 0',
              fontSize: '13px',
              color: '#64748b'
            }}>
              Kenya Extreme Speech Lexicon Moderation
            </p>
          </div>
          <div style={{
            fontSize: '28px',
            padding: '8px 12px',
            backgroundColor: '#f1f5f9',
            borderRadius: '8px'
          }}>
            ⚙️
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <nav style={{
        backgroundColor: 'white',
        borderBottom: '1px solid #e2e8f0',
        position: 'sticky',
        top: '76px',
        zIndex: 99
      }}>
        <div style={{
          maxWidth: '1600px',
          margin: '0 auto',
          padding: '0 30px',
          display: 'flex',
          gap: '30px'
        }}>
          {[
            { id: 'submissions', label: '📋 Term Submissions', icon: '📄' },
            { id: 'contributions', label: '🤝 Contributions Queue', icon: '🔄' },
            { id: 'suspended', label: '⏸️ Suspended Terms', icon: '⏸' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setAdminTab(tab.id)}
              style={{
                padding: '16px 0',
                border: 'none',
                background: 'none',
                borderBottom: adminTab === tab.id ? '3px solid #2563eb' : 'none',
                color: adminTab === tab.id ? '#0f172a' : '#64748b',
                fontSize: '14px',
                fontWeight: adminTab === tab.id ? '600' : '500',
                cursor: 'pointer',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap'
              }}
              onMouseEnter={e => e.currentTarget.style.color = '#1e293b'}
              onMouseLeave={e => e.currentTarget.style.color = adminTab === tab.id ? '#0f172a' : '#64748b'}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Content Area */}
      <div style={{
        maxWidth: '1600px',
        margin: '0 auto',
        padding: '30px'
      }}>
        {/* Global Error Message */}
        {error && (
          <div style={{
            backgroundColor: '#fee2e2',
            border: '1px solid #fca5a5',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span style={{ color: '#991b1b', fontWeight: '600' }}>
              ✕ Error: {error}
            </span>
            <button
              onClick={() => setError(null)}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '18px',
                cursor: 'pointer',
                color: '#991b1b'
              }}
            >
              ✕
            </button>
          </div>
        )}

        {/* Global Success Message */}
        {success && (
          <div style={{
            backgroundColor: '#d1fae5',
            border: '1px solid #6ee7b7',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            animation: 'slideIn 0.3s ease-out'
          }}>
            <span style={{ color: '#065f46', fontWeight: '600' }}>
              ✓ {success}
            </span>
            <button
              onClick={() => setSuccess(null)}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '18px',
                cursor: 'pointer',
                color: '#065f46'
              }}
            >
              ✕
            </button>
          </div>
        )}

        {/* Tab Content */}
        {adminTab === 'submissions' && (
          <SubmissionsTab setError={setError} setSuccess={setSuccess} />
        )}
        {adminTab === 'contributions' && (
          <ContributionsTab setError={setError} setSuccess={setSuccess} />
        )}
        {adminTab === 'suspended' && (
          <SuspendedTab setError={setError} setSuccess={setSuccess} />
        )}
      </div>

      <style>{`
        @keyframes slideIn {
          from { transform: translateY(-20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </main>
  );
}

// ============================================================================
// SUBMISSIONS TAB - Review pending term submissions
// ============================================================================

function SubmissionsTab({ setError, setSuccess }) {
  const [terms, setTerms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ pending: 0, approved: 0, rejected: 0 });
  const [selectedTerm, setSelectedTerm] = useState(null);
  const [approving, setApproving] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [researchNote, setResearchNote] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  useEffect(() => {
    loadTerms();
  }, [filterCategory]);

  const loadTerms = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('terms')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (filterCategory !== 'all') {
        query = query.eq('category', filterCategory);
      }

      const { data, error: err } = await query;
      if (err) throw err;

      setTerms(data || []);

      // Load stats
      const statuses = ['pending', 'approved', 'rejected'];
      const newStats = {};
      for (const status of statuses) {
        const { count } = await supabase
          .from('terms')
          .select('*', { count: 'exact', head: true })
          .eq('status', status);
        newStats[status] = count || 0;
      }
      setStats(newStats);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (termId) => {
    try {
      setApproving(true);
      
      // Update the term status to approved
      const { error: err } = await supabase
        .from('terms')
        .update({
          status: 'approved',
          research_note: researchNote,
          reviewed_at: new Date().toISOString()
        })
        .eq('id', termId);

      if (err) throw err;

      setSelectedTerm(null);
      setResearchNote('');
      setRejectReason('');
      setSuccess('✓ Term approved and published!');
      await loadTerms();
    } catch (err) {
      console.error('Error approving term:', err);
      setError('Failed to approve: ' + err.message);
    } finally {
      setApproving(false);
    }
  };

  const handleReject = async (termId) => {
    if (!rejectReason.trim()) {
      setError('Please provide a rejection reason');
      return;
    }

    try {
      setRejecting(true);
      const { error: err } = await supabase
        .from('terms')
        .update({
          status: 'rejected',
          rejection_reason: rejectReason,
          reviewed_at: new Date().toISOString()
        })
        .eq('id', termId);

      if (err) throw err;

      setSelectedTerm(null);
      setRejectReason('');
      setSuccess('Term rejected.');
      await loadTerms();
    } catch (err) {
      setError('Failed to reject: ' + err.message);
    } finally {
      setRejecting(false);
    }
  };

  return (
    <div>
      {/* Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        marginBottom: '30px'
      }}>
        {[
          { label: 'Pending Review', count: stats.pending, color: '#f59e0b', bg: '#fef3c7' },
          { label: 'Approved', count: stats.approved, color: '#10b981', bg: '#d1fae5' },
          { label: 'Rejected', count: stats.rejected, color: '#ef4444', bg: '#fee2e2' }
        ].map(stat => (
          <div
            key={stat.label}
            style={{
              backgroundColor: 'white',
              border: '1px solid #e2e8f0',
              borderRadius: '10px',
              padding: '20px',
              borderTop: `4px solid ${stat.color}`
            }}
          >
            <p style={{
              margin: '0 0 8px 0',
              fontSize: '12px',
              fontWeight: '700',
              color: '#64748b',
              textTransform: 'uppercase'
            }}>
              {stat.label}
            </p>
            <p style={{
              margin: 0,
              fontSize: '32px',
              fontWeight: '700',
              color: stat.color
            }}>
              {stat.count}
            </p>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div style={{
        backgroundColor: 'white',
        border: '1px solid #e2e8f0',
        borderRadius: '10px',
        padding: '16px',
        marginBottom: '24px'
      }}>
        <label style={{
          display: 'block',
          fontSize: '12px',
          fontWeight: '700',
          color: '#475569',
          marginBottom: '8px',
          textTransform: 'uppercase'
        }}>
          Filter by Category
        </label>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          style={{
            width: '100%',
            maxWidth: '300px',
            padding: '10px',
            border: '1px solid #cbd5e1',
            borderRadius: '6px',
            fontSize: '14px',
            cursor: 'pointer'
          }}
        >
          <option value="all">All Categories</option>
          <option value="Derogatory">Derogatory</option>
          <option value="Exclusionary">Exclusionary</option>
          <option value="Dangerous">Dangerous</option>
          <option value="Coded">Coded</option>
        </select>
      </div>

      {/* Terms List */}
      {loading ? (
        <LoadingSpinner />
      ) : terms.length === 0 ? (
        <div style={{
          backgroundColor: 'white',
          border: '1px solid #e2e8f0',
          borderRadius: '10px',
          padding: '40px',
          textAlign: 'center',
          color: '#94a3b8'
        }}>
          <p style={{ fontSize: '16px', margin: 0 }}>No pending submissions</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '12px' }}>
          {terms.map(term => (
            <TermCard
              key={term.id}
              term={term}
              onClick={() => {
                setSelectedTerm(term);
                setResearchNote(term.research_note || '');
                setRejectReason('');
              }}
            />
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {selectedTerm && (
        <Modal
          title={selectedTerm.term}
          onClose={() => setSelectedTerm(null)}
          content={
            <div>
              {/* Badges */}
              <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
                <Badge color="#f59e0b" label={selectedTerm.category} />
                <Badge color={getRiskColor(selectedTerm.risk)} label={selectedTerm.risk} />
              </div>

              {/* Definition */}
              <Section title="Definition">
                <p style={{ color: '#475569', lineHeight: '1.8' }}>
                  {selectedTerm.meaning}
                </p>
              </Section>

              {/* Language & Gloss */}
              {(selectedTerm.language || selectedTerm.literal_gloss) && (
                <Section title="Language">
                  {selectedTerm.language && (
                    <p style={{ margin: '0 0 8px 0', color: '#475569' }}>
                      <strong>Language:</strong> {selectedTerm.language}
                    </p>
                  )}
                  {selectedTerm.literal_gloss && (
                    <p style={{ margin: 0, color: '#475569' }}>
                      <strong>Literal gloss:</strong> {selectedTerm.literal_gloss}
                    </p>
                  )}
                </Section>
              )}

              {/* Research Note */}
              <Section title="📖 Research Note (public)">
                <textarea
                  value={researchNote}
                  onChange={(e) => setResearchNote(e.target.value)}
                  placeholder="Educational context or disclaimer..."
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #cbd5e1',
                    borderRadius: '6px',
                    fontSize: '14px',
                    minHeight: '80px',
                    fontFamily: 'inherit',
                    boxSizing: 'border-box',
                    marginBottom: '12px'
                  }}
                />
                <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>
                  This will appear on the public page
                </p>
              </Section>

              {/* Rejection Reason */}
              <Section title="Rejection Reason">
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Why is this being rejected? (e.g., Duplicate, Inaccurate, Off-topic)"
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #cbd5e1',
                    borderRadius: '6px',
                    fontSize: '14px',
                    minHeight: '80px',
                    fontFamily: 'inherit',
                    boxSizing: 'border-box',
                    marginBottom: '12px'
                  }}
                />
              </Section>

              {/* Actions */}
              <div style={{ display: 'grid', gap: '10px', marginTop: '24px' }}>
                <button
                  onClick={() => handleApprove(selectedTerm.id)}
                  disabled={approving}
                  style={{
                    padding: '12px',
                    backgroundColor: '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontWeight: '600',
                    cursor: approving ? 'not-allowed' : 'pointer',
                    opacity: approving ? 0.7 : 1
                  }}
                >
                  {approving ? 'Approving...' : '✓ Approve & Publish'}
                </button>
                <button
                  onClick={() => handleReject(selectedTerm.id)}
                  disabled={rejecting || !rejectReason.trim()}
                  style={{
                    padding: '12px',
                    backgroundColor: rejectReason.trim() ? '#ef4444' : '#cbd5e1',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontWeight: '600',
                    cursor: rejecting || !rejectReason.trim() ? 'not-allowed' : 'pointer',
                    opacity: rejecting ? 0.7 : 1
                  }}
                >
                  {rejecting ? 'Rejecting...' : '✕ Reject'}
                </button>
              </div>
            </div>
          }
        />
      )}
    </div>
  );
}

// ============================================================================
// CONTRIBUTIONS TAB - Review community contributions (examples, harms, etc)
// ============================================================================

function ContributionsTab({ setError, setSuccess }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ pending: 0, approved: 0, rejected: 0 });
  const [filterType, setFilterType] = useState('all');
  const [approving, setApproving] = useState(null);
  const [rejecting, setRejecting] = useState(null);

  useEffect(() => {
    loadItems();
  }, [filterType]);

  const loadItems = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('moderation_queue')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (filterType !== 'all') {
        query = query.eq('type', filterType);
      }

      const { data, error: err } = await query;
      if (err) throw err;
      setItems(data || []);

      // Load stats
      const { data: allItems } = await supabase
        .from('moderation_queue')
        .select('status');

      if (allItems) {
        setStats({
          pending: allItems.filter(i => i.status === 'pending').length,
          approved: allItems.filter(i => i.status === 'approved').length,
          rejected: allItems.filter(i => i.status === 'rejected').length
        });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (itemId) => {
    try {
      setApproving(itemId);
      
      console.log('🔄 PHASE 5: Starting auto-merge and approval for:', itemId);
      
      // Step 1: Auto-merge the contribution into the term
      console.log('Step 1: Auto-merging contribution...');
      await autoMergeModerationItem(itemId);
      console.log('✓ Contribution merged into term');
      
      // Step 2: Update status to approved
      console.log('Step 2: Updating status to approved...');
      await approveModerationItem(itemId);
      console.log('✓ Status updated to approved');
      
      setSuccess('✓ Contribution approved and merged!');
      await loadItems();
      
    } catch (err) {
      console.error('❌ Error approving contribution:', err);
      setError('Failed to approve: ' + err.message);
    } finally {
      setApproving(null);
    }
  };

  const handleReject = async (itemId) => {
    try {
      setRejecting(itemId);
      
      console.log('Rejecting contribution:', itemId);
      
      const { error: err } = await rejectModerationItem(itemId, 'Rejected by admin');

      if (err) throw err;
      
      setSuccess('Contribution rejected.');
      await loadItems();
    } catch (err) {
      console.error('Error rejecting contribution:', err);
      setError('Failed to reject: ' + err.message);
    } finally {
      setRejecting(null);
    }
  };

  return (
    <div>
      {/* Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        marginBottom: '30px'
      }}>
        {[
          { label: 'Pending', count: stats.pending, color: '#f59e0b' },
          { label: 'Approved', count: stats.approved, color: '#10b981' },
          { label: 'Rejected', count: stats.rejected, color: '#ef4444' }
        ].map(stat => (
          <div
            key={stat.label}
            style={{
              backgroundColor: 'white',
              border: '1px solid #e2e8f0',
              borderRadius: '10px',
              padding: '20px',
              borderTop: `4px solid ${stat.color}`
            }}
          >
            <p style={{
              margin: '0 0 8px 0',
              fontSize: '12px',
              fontWeight: '700',
              color: '#64748b',
              textTransform: 'uppercase'
            }}>
              {stat.label}
            </p>
            <p style={{
              margin: 0,
              fontSize: '32px',
              fontWeight: '700',
              color: stat.color
            }}>
              {stat.count}
            </p>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div style={{
        backgroundColor: 'white',
        border: '1px solid #e2e8f0',
        borderRadius: '10px',
        padding: '16px',
        marginBottom: '24px'
      }}>
        <label style={{
          display: 'block',
          fontSize: '12px',
          fontWeight: '700',
          color: '#475569',
          marginBottom: '8px',
          textTransform: 'uppercase'
        }}>
          Filter by Type
        </label>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          style={{
            width: '100%',
            maxWidth: '300px',
            padding: '10px',
            border: '1px solid #cbd5e1',
            borderRadius: '6px',
            fontSize: '14px',
            cursor: 'pointer'
          }}
        >
          <option value="all">All Types</option>
          <option value="example">Example</option>
          <option value="context">Context</option>
          <option value="harm">Harm</option>
          <option value="relation">Relation</option>
        </select>
      </div>

      {/* Items */}
      {loading ? (
        <LoadingSpinner />
      ) : items.length === 0 ? (
        <div style={{
          backgroundColor: 'white',
          border: '1px solid #e2e8f0',
          borderRadius: '10px',
          padding: '40px',
          textAlign: 'center',
          color: '#94a3b8'
        }}>
          <p style={{ fontSize: '16px', margin: 0 }}>No pending contributions</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '12px' }}>
          {items.map(item => (
            <ContributionCard
              key={item.id}
              item={item}
              onApprove={() => handleApprove(item.id)}
              onReject={() => handleReject(item.id)}
              approving={approving === item.id}
              rejecting={rejecting === item.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// SUSPENDED TAB - Manage suspended terms
// ============================================================================

function SuspendedTab({ setError, setSuccess }) {
  const [terms, setTerms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTerms();
  }, []);

  const loadTerms = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: err } = await supabase
        .from('terms')
        .select('*')
        .eq('status', 'suspended')
        .order('created_at', { ascending: false });

      if (err) throw err;
      setTerms(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (termId) => {
    if (!window.confirm('Restore this term to published status?')) return;

    try {
      const { error: err } = await supabase
        .from('terms')
        .update({
          status: 'approved',
          rejection_reason: null
        })
        .eq('id', termId);

      if (err) throw err;
      setSuccess('Term restored! ✓');
      await loadTerms();
    } catch (err) {
      setError('Failed to restore: ' + err.message);
    }
  };

  const handleDelete = async (termId) => {
    if (!window.confirm('⚠️ PERMANENT: Delete this term? Cannot be undone.')) return;

    try {
      const { error: err } = await supabase
        .from('terms')
        .delete()
        .eq('id', termId);

      if (err) throw err;
      setSuccess('Term deleted permanently.');
      await loadTerms();
    } catch (err) {
      setError('Failed to delete: ' + err.message);
    }
  };

  return (
    <div>
      {loading ? (
        <LoadingSpinner />
      ) : terms.length === 0 ? (
        <div style={{
          backgroundColor: 'white',
          border: '1px solid #e2e8f0',
          borderRadius: '10px',
          padding: '40px',
          textAlign: 'center',
          color: '#94a3b8'
        }}>
          <p style={{ fontSize: '16px', margin: 0 }}>No suspended terms</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '12px' }}>
          {terms.map(term => (
            <div
              key={term.id}
              style={{
                backgroundColor: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '10px',
                padding: '16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'start',
                gap: '16px'
              }}
            >
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: '0 0 8px 0', color: '#0f172a', fontWeight: '600' }}>
                  {term.term}
                </h3>
                <p style={{ margin: '0 0 8px 0', color: '#64748b', fontSize: '13px' }}>
                  {term.category} • {term.risk} risk
                </p>
                {term.rejection_reason && (
                  <p style={{ margin: 0, color: '#64748b', fontSize: '13px' }}>
                    <strong>Reason:</strong> {term.rejection_reason}
                  </p>
                )}
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => handleRestore(term.id)}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  ✓ Restore
                </button>
                <button
                  onClick={() => handleDelete(term.id)}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#ef4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  🗑 Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// REUSABLE COMPONENTS
// ============================================================================

function TermCard({ term, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        backgroundColor: 'white',
        border: '1px solid #e2e8f0',
        borderRadius: '10px',
        padding: '16px',
        cursor: 'pointer',
        transition: 'all 0.2s',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'start',
        gap: '16px'
      }}
      onMouseEnter={e => {
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
        e.currentTarget.style.borderColor = '#cbd5e1';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.borderColor = '#e2e8f0';
      }}
    >
      <div style={{ flex: 1 }}>
        <h3 style={{ margin: '0 0 8px 0', color: '#0f172a', fontWeight: '600' }}>
          {term.term}
        </h3>
        <p style={{ margin: '0 0 8px 0', color: '#64748b', fontSize: '13px' }}>
          {new Date(term.created_at).toLocaleDateString()} • {term.language || 'English'}
        </p>
        <p style={{ margin: 0, color: '#475569', fontSize: '13px', lineHeight: '1.5' }}>
          {term.meaning.substring(0, 100)}...
        </p>
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        <Badge color="#f59e0b" label={term.category} />
        <Badge color={getRiskColor(term.risk)} label={term.risk} />
      </div>
    </div>
  );
}

function ContributionCard({ item, onApprove, onReject, approving, rejecting }) {
  const typeIcon = {
    example: '📌',
    context: '📚',
    harm: '⚠️',
    relation: '🔗'
  }[item.type] || '📝';

  return (
    <div style={{
      backgroundColor: 'white',
      border: '1px solid #e2e8f0',
      borderRadius: '10px',
      padding: '16px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'start',
      gap: '16px'
    }}>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
          <span style={{ fontSize: '16px' }}>{typeIcon}</span>
          <span style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', textTransform: 'capitalize' }}>
            {item.type}
          </span>
          <span style={{ fontSize: '12px', color: '#94a3b8' }}>
            •
          </span>
          <span style={{ fontSize: '12px', color: '#64748b' }}>
            {new Date(item.created_at).toLocaleDateString()}
          </span>
        </div>
        <div style={{
          backgroundColor: '#f1f5f9',
          border: '1px solid #cbd5e1',
          borderRadius: '6px',
          padding: '12px',
          fontSize: '13px',
          color: '#475569',
          fontFamily: 'monospace',
          overflow: 'auto',
          maxHeight: '120px'
        }}>
          {JSON.stringify(item.data, null, 2)}
        </div>
      </div>
      <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
        <button
          onClick={onApprove}
          disabled={approving}
          title="Approve and auto-merge into term"
          style={{
            padding: '8px 16px',
            backgroundColor: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: '600',
            cursor: approving ? 'not-allowed' : 'pointer',
            opacity: approving ? 0.7 : 1,
            whiteSpace: 'nowrap'
          }}
        >
          {approving ? '⏳' : '✓ Approve'}
        </button>
        <button
          onClick={onReject}
          disabled={rejecting}
          title="Reject contribution"
          style={{
            padding: '8px 16px',
            backgroundColor: '#ef4444',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: '600',
            cursor: rejecting ? 'not-allowed' : 'pointer',
            opacity: rejecting ? 0.7 : 1,
            whiteSpace: 'nowrap'
          }}
        >
          {rejecting ? '⏳' : '✕ Reject'}
        </button>
      </div>
    </div>
  );
}

function Modal({ title, onClose, content }) {
  return (
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
    }} onClick={onClose}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        width: '100%',
        maxWidth: '700px',
        maxHeight: '90vh',
        overflow: 'auto',
        padding: '30px',
        boxShadow: '0 20px 25px rgba(0,0,0,0.15)'
      }} onClick={e => e.stopPropagation()}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'start',
          marginBottom: '24px',
          paddingBottom: '16px',
          borderBottom: '1px solid #e2e8f0'
        }}>
          <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '700', color: '#0f172a' }}>
            {title}
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#94a3b8',
              padding: 0
            }}
          >
            ✕
          </button>
        </div>
        {content}
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #e2e8f0' }}>
      <h3 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>
        {title}
      </h3>
      {children}
    </div>
  );
}

function Badge({ color, label }) {
  return (
    <span style={{
      backgroundColor: color + '20',
      color: color,
      padding: '6px 12px',
      borderRadius: '6px',
      fontSize: '12px',
      fontWeight: '600'
    }}>
      {label}
    </span>
  );
}

function LoadingSpinner() {
  return (
    <div style={{
      textAlign: 'center',
      padding: '60px 20px',
      color: '#94a3b8'
    }}>
      <div style={{
        display: 'inline-block',
        width: '40px',
        height: '40px',
        border: '3px solid #e2e8f0',
        borderTop: '3px solid #2d5a7b',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        marginBottom: '15px'
      }} />
      <p style={{ fontSize: '14px', margin: 0 }}>Loading...</p>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

function getRiskColor(risk) {
  const colors = {
    'Low': '#10b981',
    'Medium': '#f59e0b',
    'High': '#ef4444',
    'Very High': '#991b1b'
  };
  return colors[risk] || '#6b7280';
}