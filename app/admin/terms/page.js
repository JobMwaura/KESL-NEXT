'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function AdminTermsPage() {
  const [terms, setTerms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('pending');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterRisk, setFilterRisk] = useState('all');
  const [selectedTerm, setSelectedTerm] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [suspensionReason, setSuspensionReason] = useState('');
  const [showBulkSelect, setShowBulkSelect] = useState(false);
  const [selectedTerms, setSelectedTerms] = useState(new Set());
  const [stats, setStats] = useState({ pending: 0, approved: 0, rejected: 0, suspended: 0 });

  useEffect(() => {
    loadTerms();
    loadStats();
  }, [filterStatus, filterCategory, filterRisk]);

  async function loadTerms() {
    try {
      setLoading(true);
      let query = supabase
        .from('terms')
        .select('*')
        .eq('status', filterStatus)
        .order('created_at', { ascending: false });

      if (filterCategory !== 'all') {
        query = query.eq('category', filterCategory);
      }

      if (filterRisk !== 'all') {
        query = query.eq('risk', filterRisk);
      }

      const { data, error } = await query;

      if (error) throw error;
      setTerms(data || []);
    } catch (err) {
      console.error('Error loading terms:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function loadStats() {
    try {
      const statuses = ['pending', 'approved', 'rejected', 'suspended'];
      const newStats = { pending: 0, approved: 0, rejected: 0, suspended: 0 };

      for (const status of statuses) {
        const { count } = await supabase
          .from('terms')
          .select('*', { count: 'exact', head: true })
          .eq('status', status);

        newStats[status] = count || 0;
      }

      setStats(newStats);
    } catch (err) {
      console.error('Error loading stats:', err);
    }
  }

  async function approveTerm(id) {
    try {
      const { error } = await supabase
        .from('terms')
        .update({ 
          status: 'approved', 
          reviewed_at: new Date().toISOString(),
          reviewed_by: 'admin-manual'
        })
        .eq('id', id);

      if (error) throw error;

      setTerms(terms.filter(t => t.id !== id));
      setSelectedTerm(null);
      await loadStats();
      if (filterStatus === 'pending') {
        await loadTerms();
      }
      alert('✓ Term approved!');
    } catch (err) {
      console.error('Error approving:', err);
      alert('Failed to approve: ' + err.message);
    }
  }

  async function rejectTerm(id) {
    if (!rejectionReason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }

    try {
      const { error } = await supabase
        .from('terms')
        .update({ 
          status: 'rejected', 
          rejection_reason: rejectionReason,
          reviewed_at: new Date().toISOString(),
          reviewed_by: 'admin-manual'
        })
        .eq('id', id);

      if (error) throw error;

      setTerms(terms.filter(t => t.id !== id));
      setSelectedTerm(null);
      setRejectionReason('');
      await loadStats();
      if (filterStatus === 'pending') {
        await loadTerms();
      }
      alert('✓ Term rejected!');
    } catch (err) {
      console.error('Error rejecting:', err);
      alert('Failed to reject: ' + err.message);
    }
  }

  async function suspendTerm(id) {
    if (!suspensionReason.trim()) {
      alert('Please provide a reason for suspension');
      return;
    }

    try {
      const { error } = await supabase
        .from('terms')
        .update({ 
          status: 'suspended', 
          rejection_reason: suspensionReason,
          reviewed_at: new Date().toISOString(),
          reviewed_by: 'admin-manual'
        })
        .eq('id', id);

      if (error) throw error;

      setTerms(terms.filter(t => t.id !== id));
      setSelectedTerm(null);
      setSuspensionReason('');
      
      // Reload both stats and terms to reflect the suspension
      await loadStats();
      // If currently viewing approved tab, reload to show updated list
      if (filterStatus === 'approved') {
        await loadTerms();
      }
      
      alert('⏸ Term suspended!');
    } catch (err) {
      console.error('Error suspending:', err);
      alert('Failed to suspend: ' + err.message);
    }
  }

  async function unsuspendTerm(id) {
    try {
      const { error } = await supabase
        .from('terms')
        .update({ 
          status: 'approved',
          rejection_reason: null,
          reviewed_at: new Date().toISOString(),
          reviewed_by: 'admin-manual'
        })
        .eq('id', id);

      if (error) throw error;

      setTerms(terms.filter(t => t.id !== id));
      setSelectedTerm(null);
      await loadStats();
      if (filterStatus === 'suspended') {
        await loadTerms();
      }
      alert('✓ Term restored!');
    } catch (err) {
      console.error('Error unsuspending:', err);
      alert('Failed to restore: ' + err.message);
    }
  }

  async function deleteTerm(id) {
    try {
      const { error } = await supabase
        .from('terms')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setTerms(terms.filter(t => t.id !== id));
      setSelectedTerm(null);
      await loadStats();
      await loadTerms();
      alert('🗑 Term permanently deleted!');
    } catch (err) {
      console.error('Error deleting:', err);
      alert('Failed to delete: ' + err.message);
    }
  }

  function toggleTermSelection(id) {
    const newSelected = new Set(selectedTerms);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedTerms(newSelected);
  }

  async function bulkApprove() {
    if (selectedTerms.size === 0) {
      alert('Select terms first');
      return;
    }

    try {
      const { error } = await supabase
        .from('terms')
        .update({ 
          status: 'approved',
          reviewed_at: new Date().toISOString(),
          reviewed_by: 'admin-bulk'
        })
        .in('id', Array.from(selectedTerms));

      if (error) throw error;

      setTerms(terms.filter(t => !selectedTerms.has(t.id)));
      setSelectedTerms(new Set());
      await loadStats();
      alert(`✓ ${selectedTerms.size} terms approved!`);
    } catch (err) {
      console.error('Error bulk approving:', err);
      alert('Failed to bulk approve: ' + err.message);
    }
  }

  async function exportCSV() {
    try {
      const { data } = await supabase
        .from('terms')
        .select('*')
        .eq('status', filterStatus);

      const csv = [
        ['Term', 'Meaning', 'Category', 'Risk Level', 'Status', 'Submitted', 'Language'].join(','),
        ...data.map(t => [
          `"${t.term}"`,
          `"${t.meaning.substring(0, 50)}..."`,
          t.category,
          t.risk,
          t.status,
          new Date(t.created_at).toLocaleDateString(),
          t.language
        ].join(','))
      ].join('\n');

      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `terms-${filterStatus}-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Error exporting:', err);
      alert('Failed to export: ' + err.message);
    }
  }

  if (loading) {
    return (
      <>
        <Header />
        <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p style={{ fontSize: '16px', color: '#64748b' }}>Loading terms...</p>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main style={{ minHeight: '100vh', backgroundColor: '#f8fafc', paddingBottom: '80px' }}>
        <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '40px 20px' }}>
          {/* Header */}
          <div style={{ marginBottom: '40px' }}>
            <h1 style={{ fontSize: '36px', margin: '0 0 10px 0', color: '#1e293b', fontWeight: '700' }}>
              Term Submissions
            </h1>
            <p style={{ color: '#64748b', margin: 0, fontSize: '16px' }}>
              Review and moderate community term submissions
            </p>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>
            {[
              { label: 'Pending', value: stats.pending, color: '#f59e0b' },
              { label: 'Approved', value: stats.approved, color: '#10b981' },
              { label: 'Suspended', value: stats.suspended, color: '#8b5cf6' },
              { label: 'Rejected', value: stats.rejected, color: '#ef4444' }
            ].map(stat => (
              <div key={stat.label} style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '24px',
                border: '1px solid #e2e8f0',
                borderTop: `4px solid ${stat.color}`
              }}>
                <p style={{ margin: '0 0 10px 0', color: '#64748b', fontSize: '13px', fontWeight: '600', textTransform: 'uppercase' }}>
                  {stat.label}
                </p>
                <p style={{ margin: 0, fontSize: '32px', color: stat.color, fontWeight: '700' }}>
                  {stat.value}
                </p>
              </div>
            ))}
          </div>

          {error && (
            <div style={{
              backgroundColor: '#fee2e2',
              border: '1px solid #fca5a5',
              borderRadius: '8px',
              padding: '16px',
              marginBottom: '30px',
              color: '#991b1b',
              fontSize: '14px'
            }}>
              ✗ Error: {error}
            </div>
          )}

          {/* Filters & Actions */}
          <div style={{ 
            backgroundColor: 'white', 
            borderRadius: '12px', 
            padding: '24px', 
            marginBottom: '30px',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
              <h2 style={{ margin: 0, color: '#1e293b', fontSize: '18px', fontWeight: '700' }}>
                Submissions ({terms.length})
              </h2>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => setShowBulkSelect(!showBulkSelect)}
                  style={{
                    padding: '10px 16px',
                    backgroundColor: showBulkSelect ? '#2d5a7b' : '#e2e8f0',
                    color: showBulkSelect ? 'white' : '#475569',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '13px'
                  }}
                >
                  {showBulkSelect ? '✓ Bulk Select ON' : 'Bulk Select'}
                </button>
                <button
                  onClick={exportCSV}
                  style={{
                    padding: '10px 16px',
                    backgroundColor: '#e2e8f0',
                    color: '#475569',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '13px'
                  }}
                >
                  📥 Export CSV
                </button>
              </div>
            </div>

            {/* Bulk Actions */}
            {showBulkSelect && selectedTerms.size > 0 && (
              <div style={{
                backgroundColor: '#dbeafe',
                border: '1px solid #93c5fd',
                borderRadius: '8px',
                padding: '16px',
                marginBottom: '20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <p style={{ margin: 0, color: '#1e40af', fontWeight: '600' }}>
                  {selectedTerms.size} term{selectedTerms.size > 1 ? 's' : ''} selected
                </p>
                <button
                  onClick={bulkApprove}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '13px'
                  }}
                >
                  Approve All
                </button>
              </div>
            )}

            {/* Filter Tabs */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
              {['pending', 'approved', 'suspended', 'rejected'].map(status => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  style={{
                    padding: '10px 16px',
                    backgroundColor: filterStatus === status ? '#2d5a7b' : '#e2e8f0',
                    color: filterStatus === status ? 'white' : '#475569',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '13px',
                    textTransform: 'capitalize'
                  }}
                >
                  {status === 'pending' && '⏳ '}
                  {status === 'approved' && '✓ '}
                  {status === 'suspended' && '⏸ '}
                  {status === 'rejected' && '✗ '}
                  {status}
                </button>
              ))}
            </div>

            {/* Category & Risk Filters */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#475569', fontSize: '13px' }}>
                  Category
                </label>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #cbd5e1',
                    borderRadius: '6px',
                    fontSize: '13px',
                    boxSizing: 'border-box'
                  }}
                >
                  <option value="all">All Categories</option>
                  <option value="Derogatory">Derogatory</option>
                  <option value="Exclusionary">Exclusionary</option>
                  <option value="Dangerous">Dangerous</option>
                  <option value="Coded">Coded</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#475569', fontSize: '13px' }}>
                  Risk Level
                </label>
                <select
                  value={filterRisk}
                  onChange={(e) => setFilterRisk(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #cbd5e1',
                    borderRadius: '6px',
                    fontSize: '13px',
                    boxSizing: 'border-box'
                  }}
                >
                  <option value="all">All Levels</option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Very High">Very High</option>
                </select>
              </div>
            </div>
          </div>

          {/* Terms List */}
          {terms.length === 0 ? (
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '60px 20px',
              textAlign: 'center',
              border: '1px solid #e2e8f0'
            }}>
              <p style={{ color: '#94a3b8', fontSize: '16px', margin: 0 }}>
                No {filterStatus} submissions
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '12px' }}>
              {terms.map(term => (
                <div
                  key={term.id}
                  onClick={() => setSelectedTerm(term)}
                  style={{
                    backgroundColor: 'white',
                    border: selectedTerms.has(term.id) ? '2px solid #2d5a7b' : '1px solid #e2e8f0',
                    borderRadius: '10px',
                    padding: '20px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    display: 'flex',
                    gap: '16px',
                    alignItems: 'flex-start'
                  }}
                  onMouseEnter={(e) => {
                    if (!selectedTerms.has(term.id)) {
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
                      e.currentTarget.style.borderColor = '#cbd5e1';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.borderColor = selectedTerms.has(term.id) ? '#2d5a7b' : '#e2e8f0';
                  }}
                >
                  {showBulkSelect && (
                    <div style={{ paddingTop: '4px' }} onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={selectedTerms.has(term.id)}
                        onChange={() => toggleTermSelection(term.id)}
                        style={{ cursor: 'pointer', width: '18px', height: '18px' }}
                      />
                    </div>
                  )}

                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '10px' }}>
                      <div>
                        <h3 style={{ margin: '0 0 5px 0', color: '#1e293b', fontSize: '16px', fontWeight: '700' }}>
                          {term.term}
                        </h3>
                        <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8' }}>
                          {new Date(term.created_at).toLocaleDateString()} at {new Date(term.created_at).toLocaleTimeString()}
                        </p>
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <span style={{
                          backgroundColor: getCategoryColor(term.category),
                          color: 'white',
                          padding: '6px 12px',
                          borderRadius: '4px',
                          fontSize: '11px',
                          fontWeight: '600'
                        }}>
                          {term.category}
                        </span>
                        <span style={{
                          backgroundColor: getRiskColor(term.risk),
                          color: 'white',
                          padding: '6px 12px',
                          borderRadius: '4px',
                          fontSize: '11px',
                          fontWeight: '600'
                        }}>
                          {term.risk}
                        </span>
                      </div>
                    </div>
                    <p style={{ margin: '10px 0 0 0', color: '#475569', fontSize: '13px', lineHeight: '1.5' }}>
                      {term.meaning.substring(0, 120)}...
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Detail Modal - COMPLETE SUBMISSION REVIEW */}
        {selectedTerm && (
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
              maxWidth: '900px',
              width: '100%',
              maxHeight: '95vh',
              overflow: 'auto'
            }}>
              {/* Close Button */}
              <button
                onClick={() => setSelectedTerm(null)}
                style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  background: 'none',
                  border: 'none',
                  fontSize: '28px',
                  cursor: 'pointer',
                  color: '#94a3b8',
                  padding: '0'
                }}
              >
                ✕
              </button>

              {/* Header */}
              <div style={{ marginBottom: '30px' }}>
                <div style={{ display: 'flex', gap: '12px', marginBottom: '15px' }}>
                  <span style={{
                    backgroundColor: getCategoryColor(selectedTerm.category),
                    color: 'white',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontWeight: '600'
                  }}>
                    {selectedTerm.category}
                  </span>
                  <span style={{
                    backgroundColor: getRiskColor(selectedTerm.risk),
                    color: 'white',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontWeight: '600'
                  }}>
                    {selectedTerm.risk}
                  </span>
                  <span style={{
                    backgroundColor: selectedTerm.status === 'pending' ? '#f59e0b' : 
                                     selectedTerm.status === 'approved' ? '#10b981' :
                                     selectedTerm.status === 'suspended' ? '#8b5cf6' : '#ef4444',
                    color: 'white',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontWeight: '600'
                  }}>
                    {selectedTerm.status.toUpperCase()}
                  </span>
                </div>
                <h2 style={{ margin: '0 0 10px 0', color: '#1e293b', fontSize: '32px', fontWeight: '700' }}>
                  {selectedTerm.term}
                </h2>
                <p style={{ margin: 0, color: '#94a3b8', fontSize: '13px' }}>
                  Submitted {new Date(selectedTerm.created_at).toLocaleDateString()} at {new Date(selectedTerm.created_at).toLocaleTimeString()}
                </p>
              </div>

              {/* Full Submission Details */}
              <div style={{ marginBottom: '30px', paddingBottom: '30px', borderBottom: '1px solid #e2e8f0' }}>
                <h3 style={{ margin: '0 0 15px 0', color: '#1e293b', fontWeight: '700', fontSize: '16px' }}>
                  Definition
                </h3>
                <p style={{ margin: '0 0 25px 0', color: '#475569', lineHeight: '1.8', fontSize: '15px' }}>
                  {selectedTerm.meaning}
                </p>

                {selectedTerm.language && (
                  <>
                    <h3 style={{ margin: '0 0 8px 0', color: '#1e293b', fontWeight: '700', fontSize: '14px' }}>
                      Language
                    </h3>
                    <p style={{ margin: '0 0 25px 0', color: '#475569', fontSize: '14px' }}>
                      {selectedTerm.language}
                    </p>
                  </>
                )}

                {selectedTerm.literal_gloss && (
                  <>
                    <h3 style={{ margin: '0 0 8px 0', color: '#1e293b', fontWeight: '700', fontSize: '14px' }}>
                      Literal Gloss
                    </h3>
                    <p style={{ margin: '0 0 25px 0', color: '#475569', fontSize: '14px' }}>
                      {selectedTerm.literal_gloss}
                    </p>
                  </>
                )}
              </div>

              {/* Example Quote */}
              <div style={{ marginBottom: '30px', paddingBottom: '30px', borderBottom: '1px solid #e2e8f0' }}>
                <h3 style={{ margin: '0 0 15px 0', color: '#1e293b', fontWeight: '700', fontSize: '16px' }}>
                  Example Quote
                </h3>
                <div style={{
                  backgroundColor: '#f8fafc',
                  border: '1px solid #cbd5e1',
                  borderRadius: '8px',
                  padding: '16px',
                  marginBottom: '15px',
                  fontFamily: 'monospace',
                  fontSize: '14px',
                  color: '#475569',
                  lineHeight: '1.6',
                  whiteSpace: 'pre-wrap',
                  wordWrap: 'break-word'
                }}>
                  {selectedTerm.quote || 'No quote provided'}
                </div>

                <h3 style={{ margin: '0 0 8px 0', color: '#1e293b', fontWeight: '700', fontSize: '14px' }}>
                  Platform
                </h3>
                <p style={{ margin: '0 0 20px 0', color: '#475569', fontSize: '14px' }}>
                  {selectedTerm.platform || 'Not specified'}
                </p>

                {selectedTerm.date && (
                  <>
                    <h3 style={{ margin: '0 0 8px 0', color: '#1e293b', fontWeight: '700', fontSize: '14px' }}>
                      Date Found
                    </h3>
                    <p style={{ margin: '0 0 20px 0', color: '#475569', fontSize: '14px' }}>
                      {new Date(selectedTerm.date).toLocaleDateString()}
                    </p>
                  </>
                )}

                {selectedTerm.context && (
                  <>
                    <h3 style={{ margin: '0 0 8px 0', color: '#1e293b', fontWeight: '700', fontSize: '14px' }}>
                      Context
                    </h3>
                    <p style={{ margin: 0, color: '#475569', fontSize: '14px', lineHeight: '1.6' }}>
                      {selectedTerm.context}
                    </p>
                  </>
                )}
              </div>

              {/* Status Alerts */}
              {selectedTerm.status === 'rejected' && selectedTerm.rejection_reason && (
                <div style={{
                  backgroundColor: '#fee2e2',
                  border: '1px solid #fca5a5',
                  borderRadius: '8px',
                  padding: '16px',
                  marginBottom: '30px'
                }}>
                  <p style={{ margin: '0 0 8px 0', fontWeight: '600', color: '#991b1b' }}>
                    ✗ Rejection Reason:
                  </p>
                  <p style={{ margin: 0, color: '#991b1b', fontSize: '14px' }}>
                    {selectedTerm.rejection_reason}
                  </p>
                </div>
              )}

              {selectedTerm.status === 'suspended' && selectedTerm.rejection_reason && (
                <div style={{
                  backgroundColor: '#f3e8ff',
                  border: '1px solid #ddd6fe',
                  borderRadius: '8px',
                  padding: '16px',
                  marginBottom: '30px'
                }}>
                  <p style={{ margin: '0 0 8px 0', fontWeight: '600', color: '#6d28d9' }}>
                    ⏸ Suspension Reason:
                  </p>
                  <p style={{ margin: 0, color: '#6d28d9', fontSize: '14px' }}>
                    {selectedTerm.rejection_reason}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div>
                {selectedTerm.status === 'pending' && (
                  <div style={{ display: 'grid', gap: '12px' }}>
                    <button
                      onClick={() => approveTerm(selectedTerm.id)}
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

                    <div>
                      <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#1e293b', fontSize: '13px' }}>
                        Reject with reason (optional)
                      </label>
                      <textarea
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        placeholder="e.g., Duplicate, Inaccurate, Off-topic, Spam..."
                        style={{
                          width: '100%',
                          padding: '10px',
                          border: '1px solid #cbd5e1',
                          borderRadius: '6px',
                          fontSize: '13px',
                          minHeight: '70px',
                          boxSizing: 'border-box',
                          fontFamily: 'inherit',
                          marginBottom: '10px'
                        }}
                      />
                      <button
                        onClick={() => rejectTerm(selectedTerm.id)}
                        disabled={!rejectionReason.trim()}
                        style={{
                          width: '100%',
                          padding: '14px 24px',
                          backgroundColor: rejectionReason.trim() ? '#ef4444' : '#cbd5e1',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: rejectionReason.trim() ? 'pointer' : 'not-allowed',
                          fontWeight: '600',
                          fontSize: '14px'
                        }}
                      >
                        ✕ Reject
                      </button>
                    </div>
                  </div>
                )}

                {selectedTerm.status === 'approved' && (
                  <div style={{ display: 'grid', gap: '12px' }}>
                    <div style={{
                      backgroundColor: '#d1fae5',
                      border: '1px solid #6ee7b7',
                      borderRadius: '6px',
                      padding: '16px',
                      color: '#065f46',
                      textAlign: 'center',
                      fontWeight: '600',
                      marginBottom: '12px'
                    }}>
                      ✓ This term is approved and live
                    </div>

                    <div>
                      <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#1e293b', fontSize: '13px' }}>
                        Suspend with reason (optional)
                      </label>
                      <textarea
                        value={suspensionReason}
                        onChange={(e) => setSuspensionReason(e.target.value)}
                        placeholder="e.g., Duplicate, Needs revision, Community flagged, Requires research..."
                        style={{
                          width: '100%',
                          padding: '10px',
                          border: '1px solid #cbd5e1',
                          borderRadius: '6px',
                          fontSize: '13px',
                          minHeight: '70px',
                          boxSizing: 'border-box',
                          fontFamily: 'inherit',
                          marginBottom: '10px'
                        }}
                      />
                      <button
                        onClick={() => suspendTerm(selectedTerm.id)}
                        disabled={!suspensionReason.trim()}
                        style={{
                          width: '100%',
                          padding: '14px 24px',
                          backgroundColor: suspensionReason.trim() ? '#8b5cf6' : '#cbd5e1',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: suspensionReason.trim() ? 'pointer' : 'not-allowed',
                          fontWeight: '600',
                          fontSize: '14px',
                          marginBottom: '10px'
                        }}
                      >
                        ⏸ Suspend
                      </button>
                    </div>

                    <button
                      onClick={() => {
                        if (window.confirm('⚠️ PERMANENT: Delete this term permanently?')) {
                          deleteTerm(selectedTerm.id);
                        }
                      }}
                      style={{
                        width: '100%',
                        padding: '14px 24px',
                        backgroundColor: '#dc2626',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: '600',
                        fontSize: '14px'
                      }}
                    >
                      🗑 Delete Permanently
                    </button>
                  </div>
                )}

                {selectedTerm.status === 'suspended' && (
                  <div style={{ display: 'grid', gap: '12px' }}>
                    <div style={{
                      backgroundColor: '#f3e8ff',
                      border: '1px solid #ddd6fe',
                      borderRadius: '6px',
                      padding: '16px',
                      color: '#6d28d9',
                      textAlign: 'center',
                      fontWeight: '600',
                      marginBottom: '12px'
                    }}>
                      ⏸ This term is suspended
                    </div>

                    <button
                      onClick={() => unsuspendTerm(selectedTerm.id)}
                      style={{
                        width: '100%',
                        padding: '14px 24px',
                        backgroundColor: '#10b981',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: '600',
                        fontSize: '14px',
                        marginBottom: '10px'
                      }}
                    >
                      ✓ Restore to Live
                    </button>

                    <button
                      onClick={() => {
                        if (window.confirm('⚠️ PERMANENT: Delete this term permanently?')) {
                          deleteTerm(selectedTerm.id);
                        }
                      }}
                      style={{
                        width: '100%',
                        padding: '14px 24px',
                        backgroundColor: '#dc2626',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: '600',
                        fontSize: '14px'
                      }}
                    >
                      🗑 Delete Permanently
                    </button>
                  </div>
                )}

                {selectedTerm.status === 'rejected' && (
                  <div style={{ 
                    backgroundColor: '#fee2e2',
                    border: '1px solid #fca5a5',
                    borderRadius: '6px',
                    padding: '16px',
                    color: '#991b1b',
                    textAlign: 'center',
                    fontWeight: '600'
                  }}>
                    ✗ This term was rejected
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}

function getCategoryColor(category) {
  const colors = {
    'Derogatory': '#f59e0b',
    'Exclusionary': '#ef4444',
    'Dangerous': '#991b1b',
    'Coded': '#6366f1'
  };
  return colors[category] || '#6b7280';
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