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
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showBulkSelect, setShowBulkSelect] = useState(false);
  const [selectedTerms, setSelectedTerms] = useState(new Set());
  const [stats, setStats] = useState({ pending: 0, approved: 0, rejected: 0 });

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
      const statuses = ['pending', 'approved', 'rejected'];
      const newStats = { pending: 0, approved: 0, rejected: 0 };

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
      setStats(prev => ({
        ...prev,
        pending: prev.pending - 1,
        approved: prev.approved + 1
      }));
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
      setStats(prev => ({
        ...prev,
        pending: prev.pending - 1,
        rejected: prev.rejected + 1
      }));
      alert('✓ Term rejected!');
    } catch (err) {
      console.error('Error rejecting:', err);
      alert('Failed to reject: ' + err.message);
    }
  }

  async function saveTerm(id, data) {
    try {
      const { error } = await supabase
        .from('terms')
        .update({
          term: data.term,
          meaning: data.meaning,
          category: data.category,
          risk: data.risk
        })
        .eq('id', id);

      if (error) throw error;

      const updatedTerms = terms.map(t => 
        t.id === id ? { ...t, ...data } : t
      );
      setTerms(updatedTerms);
      setSelectedTerm(updatedTerms.find(t => t.id === id));
      setIsEditing(false);
      alert('✓ Term updated!');
    } catch (err) {
      console.error('Error saving:', err);
      alert('Failed to save: ' + err.message);
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
      setStats(prev => ({
        ...prev,
        pending: prev.pending - selectedTerms.size,
        approved: prev.approved + selectedTerms.size
      }));
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
              {['pending', 'approved', 'rejected'].map(status => (
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
                    <div style={{ paddingTop: '4px' }}>
                      <input
                        type="checkbox"
                        checked={selectedTerms.has(term.id)}
                        onChange={() => toggleTermSelection(term.id)}
                        style={{ cursor: 'pointer', width: '18px', height: '18px' }}
                      />
                    </div>
                  )}

                  <div style={{ flex: 1, onClick: () => setSelectedTerm(term) }}>
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

        {/* Detail Modal */}
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
              maxWidth: '800px',
              width: '100%',
              maxHeight: '90vh',
              overflow: 'auto'
            }}>
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '30px' }}>
                <div>
                  <h2 style={{ margin: '0 0 10px 0', color: '#1e293b', fontSize: '28px', fontWeight: '700' }}>
                    {isEditing ? 'Edit Term' : selectedTerm.term}
                  </h2>
                  {!isEditing && (
                    <p style={{ margin: 0, color: '#94a3b8', fontSize: '13px' }}>
                      Submitted {new Date(selectedTerm.created_at).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => {
                    setSelectedTerm(null);
                    setIsEditing(false);
                    setEditData(null);
                  }}
                  style={{
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
              </div>

              {/* Edit Mode */}
              {isEditing ? (
                <div style={{ marginBottom: '30px' }}>
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#1e293b' }}>
                      Term
                    </label>
                    <input
                      type="text"
                      value={editData.term}
                      onChange={(e) => setEditData({ ...editData, term: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #cbd5e1',
                        borderRadius: '6px',
                        fontSize: '14px',
                        boxSizing: 'border-box',
                        fontFamily: 'inherit'
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#1e293b' }}>
                      Meaning
                    </label>
                    <textarea
                      value={editData.meaning}
                      onChange={(e) => setEditData({ ...editData, meaning: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #cbd5e1',
                        borderRadius: '6px',
                        fontSize: '14px',
                        boxSizing: 'border-box',
                        minHeight: '100px',
                        fontFamily: 'inherit'
                      }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#1e293b' }}>
                        Category
                      </label>
                      <select
                        value={editData.category}
                        onChange={(e) => setEditData({ ...editData, category: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '10px',
                          border: '1px solid #cbd5e1',
                          borderRadius: '6px',
                          fontSize: '14px',
                          boxSizing: 'border-box'
                        }}
                      >
                        <option value="Derogatory">Derogatory</option>
                        <option value="Exclusionary">Exclusionary</option>
                        <option value="Dangerous">Dangerous</option>
                        <option value="Coded">Coded</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#1e293b' }}>
                        Risk Level
                      </label>
                      <select
                        value={editData.risk}
                        onChange={(e) => setEditData({ ...editData, risk: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '10px',
                          border: '1px solid #cbd5e1',
                          borderRadius: '6px',
                          fontSize: '14px',
                          boxSizing: 'border-box'
                        }}
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                        <option value="Very High">Very High</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                      onClick={() => saveTerm(selectedTerm.id, editData)}
                      style={{
                        padding: '12px 24px',
                        backgroundColor: '#10b981',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: '600',
                        fontSize: '14px'
                      }}
                    >
                      ✓ Save Changes
                    </button>
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setEditData(null);
                      }}
                      style={{
                        padding: '12px 24px',
                        backgroundColor: '#e2e8f0',
                        color: '#475569',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: '600',
                        fontSize: '14px'
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {/* View Mode */}
                  <div style={{ marginBottom: '30px' }}>
                    <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
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
                    </div>

                    <h3 style={{ margin: '0 0 10px 0', color: '#1e293b', fontWeight: '700' }}>
                      Meaning
                    </h3>
                    <p style={{ margin: '0 0 20px 0', color: '#475569', lineHeight: '1.7' }}>
                      {selectedTerm.meaning}
                    </p>

                    {selectedTerm.language && (
                      <>
                        <h3 style={{ margin: '0 0 10px 0', color: '#1e293b', fontWeight: '700' }}>
                          Language
                        </h3>
                        <p style={{ margin: '0 0 20px 0', color: '#475569' }}>
                          {selectedTerm.language}
                        </p>
                      </>
                    )}

                    {selectedTerm.literal_gloss && (
                      <>
                        <h3 style={{ margin: '0 0 10px 0', color: '#1e293b', fontWeight: '700' }}>
                          Literal Gloss
                        </h3>
                        <p style={{ margin: '0 0 20px 0', color: '#475569' }}>
                          {selectedTerm.literal_gloss}
                        </p>
                      </>
                    )}
                  </div>

                  {selectedTerm.status === 'rejected' && selectedTerm.rejection_reason && (
                    <div style={{
                      backgroundColor: '#fee2e2',
                      border: '1px solid #fca5a5',
                      borderRadius: '8px',
                      padding: '16px',
                      marginBottom: '30px'
                    }}>
                      <p style={{ margin: '0 0 8px 0', fontWeight: '600', color: '#991b1b' }}>
                        Rejection Reason:
                      </p>
                      <p style={{ margin: 0, color: '#991b1b', fontSize: '14px' }}>
                        {selectedTerm.rejection_reason}
                      </p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  {selectedTerm.status === 'pending' && (
                    <div style={{ display: 'grid', gap: '12px' }}>
                      <button
                        onClick={() => setIsEditing(true) || setEditData({ ...selectedTerm })}
                        style={{
                          padding: '14px 24px',
                          backgroundColor: '#8b5cf6',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontWeight: '600',
                          fontSize: '14px'
                        }}
                      >
                        ✏️ Edit Before Approving
                      </button>

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

                      <div style={{ marginBottom: '12px' }}>
                        <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#1e293b', fontSize: '13px' }}>
                          Rejection Reason (if rejecting)
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
                            fontFamily: 'inherit'
                          }}
                        />
                      </div>

                      <button
                        onClick={() => rejectTerm(selectedTerm.id)}
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

                  {selectedTerm.status === 'approved' && (
                    <div style={{
                      backgroundColor: '#d1fae5',
                      border: '1px solid #6ee7b7',
                      borderRadius: '6px',
                      padding: '16px',
                      color: '#065f46',
                      textAlign: 'center',
                      fontWeight: '600'
                    }}>
                      ✓ This term is approved and live
                    </div>
                  )}
                </>
              )}
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