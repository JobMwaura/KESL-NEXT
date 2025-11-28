'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('terms'); // 'terms' or 'contributions'
  const [terms, setTerms] = useState([]);
  const [contributions, setContributions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // TERMS filters
  const [filterStatus, setFilterStatus] = useState('pending');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterRisk, setFilterRisk] = useState('all');
  
  // CONTRIBUTIONS filters
  const [contributionFilter, setContributionFilter] = useState('pending');
  
  // Selected items
  const [selectedTerm, setSelectedTerm] = useState(null);
  const [selectedContribution, setSelectedContribution] = useState(null);
  
  // Form states
  const [rejectionReason, setRejectionReason] = useState('');
  const [suspensionReason, setSuspensionReason] = useState('');
  const [researchNote, setResearchNote] = useState('');
  const [contributionFeedback, setContributionFeedback] = useState('');
  
  // Loading states
  const [savingResearchNote, setSavingResearchNote] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  
  // Stats
  const [stats, setStats] = useState({
    terms: { pending: 0, approved: 0, rejected: 0, suspended: 0 },
    contributions: { pending: 0, approved: 0, rejected: 0 }
  });

  useEffect(() => {
    if (activeTab === 'terms') {
      loadTerms();
    } else {
      loadContributions();
    }
    loadStats();
  }, [activeTab, filterStatus, filterCategory, filterRisk, contributionFilter]);

  // ============ TERMS FUNCTIONS ============

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
      setError(null);
    } catch (err) {
      console.error('Error loading terms:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // ============ CONTRIBUTIONS FUNCTIONS ============

  async function loadContributions() {
    try {
      setLoading(true);
      let query = supabase
        .from('community_contributions')
        .select('*, terms(id, term)')
        .order('created_at', { ascending: false });

      if (contributionFilter !== 'all') {
        query = query.eq('status', contributionFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      setContributions(data || []);
      setError(null);
    } catch (err) {
      console.error('Error loading contributions:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // ============ STATS FUNCTIONS ============

  async function loadStats() {
    try {
      const statuses = ['pending', 'approved', 'rejected', 'suspended'];
      const newTermStats = { pending: 0, approved: 0, rejected: 0, suspended: 0 };
      const newContribStats = { pending: 0, approved: 0, rejected: 0 };

      // Load term stats
      for (const status of statuses) {
        const { count } = await supabase
          .from('terms')
          .select('*', { count: 'exact', head: true })
          .eq('status', status);
        newTermStats[status] = count || 0;
      }

      // Load contribution stats
      for (const status of ['pending', 'approved', 'rejected']) {
        const { count } = await supabase
          .from('community_contributions')
          .select('*', { count: 'exact', head: true })
          .eq('status', status);
        newContribStats[status] = count || 0;
      }

      setStats({ terms: newTermStats, contributions: newContribStats });
    } catch (err) {
      console.error('Error loading stats:', err);
    }
  }

  // ============ TERM ACTIONS ============

  async function approveTerm(id) {
    try {
      setActionLoading(true);
      const { error } = await supabase
        .from('terms')
        .update({ 
          status: 'approved', 
          reviewed_at: new Date().toISOString(),
          research_note: researchNote || null
        })
        .eq('id', id);

      if (error) throw error;
      setSelectedTerm(null);
      setResearchNote('');
      await loadStats();
      await loadTerms();
      alert('✓ Term approved!');
    } catch (err) {
      console.error('Error:', err);
      alert('Failed: ' + err.message);
    } finally {
      setActionLoading(false);
    }
  }

  async function rejectTerm(id) {
    if (!rejectionReason.trim()) {
      alert('Please provide a reason');
      return;
    }
    try {
      setActionLoading(true);
      const { error } = await supabase
        .from('terms')
        .update({ 
          status: 'rejected', 
          rejection_reason: rejectionReason,
          reviewed_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;
      setSelectedTerm(null);
      setRejectionReason('');
      await loadStats();
      await loadTerms();
      alert('✓ Term rejected!');
    } catch (err) {
      console.error('Error:', err);
      alert('Failed: ' + err.message);
    } finally {
      setActionLoading(false);
    }
  }

  async function suspendTerm(id) {
    if (!suspensionReason.trim()) {
      alert('Please provide a reason');
      return;
    }
    try {
      setActionLoading(true);
      const { error } = await supabase
        .from('terms')
        .update({ 
          status: 'suspended', 
          rejection_reason: suspensionReason,
          reviewed_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;
      setSelectedTerm(null);
      setSuspensionReason('');
      await loadStats();
      await loadTerms();
      alert('⏸ Term suspended!');
    } catch (err) {
      console.error('Error:', err);
      alert('Failed: ' + err.message);
    } finally {
      setActionLoading(false);
    }
  }

  async function unsuspendTerm(id) {
    try {
      setActionLoading(true);
      const { error } = await supabase
        .from('terms')
        .update({ 
          status: 'approved',
          rejection_reason: null,
          reviewed_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;
      setSelectedTerm(null);
      await loadStats();
      await loadTerms();
      alert('✓ Term restored!');
    } catch (err) {
      console.error('Error:', err);
      alert('Failed: ' + err.message);
    } finally {
      setActionLoading(false);
    }
  }

  async function deleteTerm(id) {
    try {
      setActionLoading(true);
      const { error } = await supabase
        .from('terms')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setSelectedTerm(null);
      await loadStats();
      await loadTerms();
      alert('🗑 Term deleted!');
    } catch (err) {
      console.error('Error:', err);
      alert('Failed: ' + err.message);
    } finally {
      setActionLoading(false);
    }
  }

  async function saveResearchNote(id) {
    try {
      setSavingResearchNote(true);
      const { error } = await supabase
        .from('terms')
        .update({ research_note: researchNote || null })
        .eq('id', id);

      if (error) throw error;
      setSelectedTerm(prev => ({ ...prev, research_note: researchNote }));
      alert('✓ Research note saved!');
    } catch (err) {
      console.error('Error:', err);
      alert('Failed: ' + err.message);
    } finally {
      setSavingResearchNote(false);
    }
  }

  // ============ CONTRIBUTION ACTIONS ============

  async function updateContributionStatus(id, newStatus) {
    try {
      setActionLoading(true);
      const { error } = await supabase
        .from('community_contributions')
        .update({
          status: newStatus,
          admin_feedback: contributionFeedback,
          reviewed_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;
      setSelectedContribution(null);
      setContributionFeedback('');
      await loadStats();
      await loadContributions();
      alert(`✓ Contribution ${newStatus}!`);
    } catch (err) {
      console.error('Error:', err);
      alert('Failed: ' + err.message);
    } finally {
      setActionLoading(false);
    }
  }

  // ============ RENDER ============

  if (loading && activeTab !== 'terms' && activeTab !== 'contributions') {
    return (
      <>
        <Header />
        <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p style={{ color: '#64748b' }}>Loading...</p>
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
              Admin Dashboard
            </h1>
            <p style={{ color: '#64748b', margin: 0, fontSize: '16px' }}>
              Manage terms and community contributions
            </p>
          </div>

          {/* Stats Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '15px', marginBottom: '40px' }}>
            {/* Terms Stats */}
            {[
              { label: 'Terms Pending', value: stats.terms.pending, color: '#f59e0b' },
              { label: 'Terms Approved', value: stats.terms.approved, color: '#10b981' },
              { label: 'Terms Suspended', value: stats.terms.suspended, color: '#8b5cf6' },
              { label: 'Contributions Pending', value: stats.contributions.pending, color: '#f59e0b' },
              { label: 'Contributions Approved', value: stats.contributions.approved, color: '#10b981' }
            ].map(stat => (
              <div key={stat.label} style={{
                backgroundColor: 'white',
                borderRadius: '10px',
                padding: '18px',
                border: '1px solid #e2e8f0',
                borderTop: `4px solid ${stat.color}`
              }}>
                <p style={{ margin: '0 0 8px 0', color: '#64748b', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>
                  {stat.label}
                </p>
                <p style={{ margin: 0, fontSize: '28px', color: stat.color, fontWeight: '700' }}>
                  {stat.value}
                </p>
              </div>
            ))}
          </div>

          {/* Tab Buttons */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '30px', borderBottom: '1px solid #e2e8f0' }}>
            <button
              onClick={() => setActiveTab('terms')}
              style={{
                padding: '12px 24px',
                backgroundColor: activeTab === 'terms' ? 'white' : 'transparent',
                border: activeTab === 'terms' ? '1px solid #e2e8f0' : 'none',
                borderBottom: activeTab === 'terms' ? 'none' : '2px solid transparent',
                borderTop: activeTab === 'terms' ? '2px solid #2d5a7b' : 'none',
                cursor: 'pointer',
                fontWeight: '700',
                fontSize: '15px',
                color: activeTab === 'terms' ? '#2d5a7b' : '#94a3b8',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                if (activeTab !== 'terms') e.target.style.color = '#475569';
              }}
              onMouseLeave={(e) => {
                if (activeTab !== 'terms') e.target.style.color = '#94a3b8';
              }}
            >
              📝 Term Submissions ({stats.terms.pending})
            </button>
            <button
              onClick={() => setActiveTab('contributions')}
              style={{
                padding: '12px 24px',
                backgroundColor: activeTab === 'contributions' ? 'white' : 'transparent',
                border: activeTab === 'contributions' ? '1px solid #e2e8f0' : 'none',
                borderBottom: activeTab === 'contributions' ? 'none' : '2px solid transparent',
                borderTop: activeTab === 'contributions' ? '2px solid #2d5a7b' : 'none',
                cursor: 'pointer',
                fontWeight: '700',
                fontSize: '15px',
                color: activeTab === 'contributions' ? '#2d5a7b' : '#94a3b8',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                if (activeTab !== 'contributions') e.target.style.color = '#475569';
              }}
              onMouseLeave={(e) => {
                if (activeTab !== 'contributions') e.target.style.color = '#94a3b8';
              }}
            >
              💬 Community Contributions ({stats.contributions.pending})
            </button>
          </div>

          {/* TERMS TAB */}
          {activeTab === 'terms' && (
            <TermsSection
              terms={terms}
              loading={loading}
              filterStatus={filterStatus}
              setFilterStatus={setFilterStatus}
              filterCategory={filterCategory}
              setFilterCategory={setFilterCategory}
              filterRisk={filterRisk}
              setFilterRisk={setFilterRisk}
              selectedTerm={selectedTerm}
              setSelectedTerm={setSelectedTerm}
              researchNote={researchNote}
              setResearchNote={setResearchNote}
              rejectionReason={rejectionReason}
              setRejectionReason={setRejectionReason}
              suspensionReason={suspensionReason}
              setSuspensionReason={setSuspensionReason}
              savingResearchNote={savingResearchNote}
              actionLoading={actionLoading}
              approveTerm={approveTerm}
              rejectTerm={rejectTerm}
              suspendTerm={suspendTerm}
              unsuspendTerm={unsuspendTerm}
              deleteTerm={deleteTerm}
              saveResearchNote={saveResearchNote}
            />
          )}

          {/* CONTRIBUTIONS TAB */}
          {activeTab === 'contributions' && (
            <ContributionsSection
              contributions={contributions}
              loading={loading}
              filter={contributionFilter}
              setFilter={setContributionFilter}
              selectedContribution={selectedContribution}
              setSelectedContribution={setSelectedContribution}
              feedback={contributionFeedback}
              setFeedback={setContributionFeedback}
              actionLoading={actionLoading}
              updateStatus={updateContributionStatus}
            />
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

// ============ TERMS SECTION ============

function TermsSection({
  terms, loading, filterStatus, setFilterStatus, filterCategory, setFilterCategory,
  filterRisk, setFilterRisk, selectedTerm, setSelectedTerm, researchNote, setResearchNote,
  rejectionReason, setRejectionReason, suspensionReason, setSuspensionReason,
  savingResearchNote, actionLoading, approveTerm, rejectTerm, suspendTerm,
  unsuspendTerm, deleteTerm, saveResearchNote
}) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
      {/* Terms List */}
      <div>
        <h2 style={{ color: '#1e293b', fontSize: '18px', marginBottom: '15px' }}>
          {filterStatus.charAt(0).toUpperCase() + filterStatus.slice(1)} Terms ({terms.length})
        </h2>

        {/* Filters */}
        <div style={{ display: 'grid', gap: '12px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {['pending', 'approved', 'suspended', 'rejected'].map(status => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                style={{
                  padding: '8px 12px',
                  backgroundColor: filterStatus === status ? '#2d5a7b' : '#e2e8f0',
                  color: filterStatus === status ? 'white' : '#475569',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '12px',
                  textTransform: 'capitalize'
                }}
              >
                {status}
              </button>
            ))}
          </div>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            style={{
              padding: '8px',
              border: '1px solid #cbd5e1',
              borderRadius: '6px',
              fontSize: '12px'
            }}
          >
            <option value="all">All Categories</option>
            <option value="Derogatory">Derogatory</option>
            <option value="Exclusionary">Exclusionary</option>
            <option value="Dangerous">Dangerous</option>
            <option value="Coded">Coded</option>
          </select>

          <select
            value={filterRisk}
            onChange={(e) => setFilterRisk(e.target.value)}
            style={{
              padding: '8px',
              border: '1px solid #cbd5e1',
              borderRadius: '6px',
              fontSize: '12px'
            }}
          >
            <option value="all">All Risk Levels</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Very High">Very High</option>
          </select>
        </div>

        {/* Terms List */}
        {loading ? (
          <p style={{ color: '#94a3b8' }}>Loading...</p>
        ) : terms.length === 0 ? (
          <p style={{ color: '#94a3b8' }}>No {filterStatus} terms</p>
        ) : (
          <div style={{ display: 'grid', gap: '10px' }}>
            {terms.map(term => (
              <div
                key={term.id}
                onClick={() => {
                  setSelectedTerm(term);
                  setResearchNote(term.research_note || '');
                }}
                style={{
                  backgroundColor: selectedTerm?.id === term.id ? '#f0f9ff' : '#f8fafc',
                  border: selectedTerm?.id === term.id ? '2px solid #2d5a7b' : '1px solid #cbd5e1',
                  borderRadius: '8px',
                  padding: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <h3 style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: '700', color: '#1e293b' }}>
                  {term.term}
                </h3>
                <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8' }}>
                  {new Date(term.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Term Details */}
      <div>
        {selectedTerm ? (
          <TermDetailPanel
            term={selectedTerm}
            researchNote={researchNote}
            setResearchNote={setResearchNote}
            rejectionReason={rejectionReason}
            setRejectionReason={setRejectionReason}
            suspensionReason={suspensionReason}
            setSuspensionReason={setSuspensionReason}
            savingResearchNote={savingResearchNote}
            actionLoading={actionLoading}
            approveTerm={approveTerm}
            rejectTerm={rejectTerm}
            suspendTerm={suspendTerm}
            unsuspendTerm={unsuspendTerm}
            deleteTerm={deleteTerm}
            saveResearchNote={saveResearchNote}
          />
        ) : (
          <div style={{ color: '#94a3b8', textAlign: 'center', paddingTop: '60px' }}>
            <p>Select a term to review</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ============ TERM DETAIL PANEL ============

function TermDetailPanel({
  term, researchNote, setResearchNote, rejectionReason, setRejectionReason,
  suspensionReason, setSuspensionReason, savingResearchNote, actionLoading,
  approveTerm, rejectTerm, suspendTerm, unsuspendTerm, deleteTerm, saveResearchNote
}) {
  return (
    <div style={{
      backgroundColor: '#f8fafc',
      border: '1px solid #cbd5e1',
      borderRadius: '10px',
      padding: '20px',
      maxHeight: '85vh',
      overflow: 'auto'
    }}>
      <h2 style={{ margin: '0 0 15px 0', fontSize: '24px', fontWeight: '700', color: '#1e293b' }}>
        {term.term}
      </h2>

      <div style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #cbd5e1' }}>
        <p style={{ margin: '0 0 10px 0', fontSize: '13px', fontWeight: '600', color: '#94a3b8' }}>DEFINITION</p>
        <p style={{ margin: 0, color: '#475569', fontSize: '14px', lineHeight: '1.6' }}>
          {term.meaning}
        </p>
      </div>

      {term.quote && (
        <div style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #cbd5e1' }}>
          <p style={{ margin: '0 0 10px 0', fontSize: '13px', fontWeight: '600', color: '#94a3b8' }}>EXAMPLE</p>
          <p style={{ margin: 0, color: '#475569', fontSize: '13px', fontStyle: 'italic' }}>
            "{term.quote}"
          </p>
        </div>
      )}

      <div style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #cbd5e1' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#1e293b', fontSize: '13px' }}>
          📖 Research Note (Public)
        </label>
        <textarea
          value={researchNote}
          onChange={(e) => setResearchNote(e.target.value)}
          placeholder="Add educational context..."
          style={{
            width: '100%',
            padding: '10px',
            border: '1px solid #cbd5e1',
            borderRadius: '6px',
            fontSize: '12px',
            minHeight: '80px',
            boxSizing: 'border-box',
            fontFamily: 'inherit',
            marginBottom: '8px'
          }}
        />
        <button
          onClick={() => saveResearchNote(term.id)}
          disabled={savingResearchNote}
          style={{
            padding: '8px 16px',
            backgroundColor: savingResearchNote ? '#cbd5e1' : '#2d5a7b',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: savingResearchNote ? 'not-allowed' : 'pointer',
            fontWeight: '600',
            fontSize: '12px'
          }}
        >
          {savingResearchNote ? 'Saving...' : '💾 Save'}
        </button>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'grid', gap: '10px' }}>
        {term.status === 'pending' && (
          <>
            <button
              onClick={() => approveTerm(term.id)}
              disabled={actionLoading}
              style={{
                padding: '10px',
                backgroundColor: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '13px'
              }}
            >
              ✓ Approve
            </button>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Rejection reason..."
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                fontSize: '12px',
                minHeight: '60px',
                boxSizing: 'border-box',
                fontFamily: 'inherit'
              }}
            />
            <button
              onClick={() => rejectTerm(term.id)}
              disabled={actionLoading || !rejectionReason.trim()}
              style={{
                padding: '10px',
                backgroundColor: !rejectionReason.trim() ? '#cbd5e1' : '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: !rejectionReason.trim() ? 'not-allowed' : 'pointer',
                fontWeight: '600',
                fontSize: '13px'
              }}
            >
              ✕ Reject
            </button>
          </>
        )}

        {term.status === 'approved' && (
          <>
            <textarea
              value={suspensionReason}
              onChange={(e) => setSuspensionReason(e.target.value)}
              placeholder="Suspension reason..."
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                fontSize: '12px',
                minHeight: '60px',
                boxSizing: 'border-box',
                fontFamily: 'inherit',
                marginBottom: '10px'
              }}
            />
            <button
              onClick={() => suspendTerm(term.id)}
              disabled={actionLoading || !suspensionReason.trim()}
              style={{
                padding: '10px',
                backgroundColor: !suspensionReason.trim() ? '#cbd5e1' : '#8b5cf6',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: !suspensionReason.trim() ? 'not-allowed' : 'pointer',
                fontWeight: '600',
                fontSize: '13px',
                marginBottom: '10px'
              }}
            >
              ⏸ Suspend
            </button>
            <button
              onClick={() => {
                if (window.confirm('Delete permanently?')) deleteTerm(term.id);
              }}
              style={{
                padding: '10px',
                backgroundColor: '#dc2626',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '13px'
              }}
            >
              🗑 Delete
            </button>
          </>
        )}

        {term.status === 'suspended' && (
          <>
            <button
              onClick={() => unsuspendTerm(term.id)}
              style={{
                padding: '10px',
                backgroundColor: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '13px',
                marginBottom: '10px'
              }}
            >
              ✓ Restore
            </button>
            <button
              onClick={() => {
                if (window.confirm('Delete permanently?')) deleteTerm(term.id);
              }}
              style={{
                padding: '10px',
                backgroundColor: '#dc2626',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '13px'
              }}
            >
              🗑 Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ============ CONTRIBUTIONS SECTION ============

function ContributionsSection({
  contributions, loading, filter, setFilter, selectedContribution, setSelectedContribution,
  feedback, setFeedback, actionLoading, updateStatus
}) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
      {/* Contributions List */}
      <div>
        <h2 style={{ color: '#1e293b', fontSize: '18px', marginBottom: '15px' }}>
          {filter.charAt(0).toUpperCase() + filter.slice(1)} Contributions ({contributions.length})
        </h2>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
          {['pending', 'approved', 'rejected', 'all'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              style={{
                padding: '8px 12px',
                backgroundColor: filter === status ? '#2d5a7b' : '#e2e8f0',
                color: filter === status ? 'white' : '#475569',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '12px',
                textTransform: 'capitalize'
              }}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Contributions List */}
        {loading ? (
          <p style={{ color: '#94a3b8' }}>Loading...</p>
        ) : contributions.length === 0 ? (
          <p style={{ color: '#94a3b8' }}>No {filter} contributions</p>
        ) : (
          <div style={{ display: 'grid', gap: '10px' }}>
            {contributions.map(contrib => (
              <div
                key={contrib.id}
                onClick={() => {
                  setSelectedContribution(contrib);
                  setFeedback(contrib.admin_feedback || '');
                }}
                style={{
                  backgroundColor: selectedContribution?.id === contrib.id ? '#f0f9ff' : '#f8fafc',
                  border: selectedContribution?.id === contrib.id ? '2px solid #2d5a7b' : '1px solid #cbd5e1',
                  borderRadius: '8px',
                  padding: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '4px' }}>
                  <h3 style={{ margin: 0, fontSize: '14px', fontWeight: '700', color: '#1e293b' }}>
                    {contrib.terms?.term || 'Unknown'}
                  </h3>
                  <span style={{
                    fontSize: '10px',
                    fontWeight: '700',
                    backgroundColor: contrib.status === 'approved' ? '#d1fae5' : 
                                      contrib.status === 'rejected' ? '#fee2e2' : '#fef3c7',
                    color: contrib.status === 'approved' ? '#065f46' :
                           contrib.status === 'rejected' ? '#991b1b' : '#92400e',
                    padding: '2px 6px',
                    borderRadius: '3px'
                  }}>
                    {contrib.status}
                  </span>
                </div>
                <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase' }}>
                  {contrib.contribution_type}
                </p>
                <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8' }}>
                  {new Date(contrib.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Contribution Details */}
      <div>
        {selectedContribution ? (
          <ContributionDetailPanel
            contrib={selectedContribution}
            feedback={feedback}
            setFeedback={setFeedback}
            actionLoading={actionLoading}
            updateStatus={updateStatus}
          />
        ) : (
          <div style={{ color: '#94a3b8', textAlign: 'center', paddingTop: '60px' }}>
            <p>Select a contribution to review</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ============ CONTRIBUTION DETAIL PANEL ============

function ContributionDetailPanel({ contrib, feedback, setFeedback, actionLoading, updateStatus }) {
  const content = typeof contrib.content === 'string' ? JSON.parse(contrib.content) : contrib.content;

  return (
    <div style={{
      backgroundColor: '#f8fafc',
      border: '1px solid #cbd5e1',
      borderRadius: '10px',
      padding: '20px',
      maxHeight: '85vh',
      overflow: 'auto'
    }}>
      <h2 style={{ margin: '0 0 15px 0', fontSize: '20px', fontWeight: '700', color: '#1e293b' }}>
        {contrib.terms?.term || 'Unknown Term'}
      </h2>

      <div style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #cbd5e1' }}>
        <p style={{ margin: '0 0 8px 0', fontSize: '12px', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase' }}>
          {contrib.contribution_type}
        </p>
        <div style={{
          backgroundColor: 'white',
          border: '1px solid #e2e8f0',
          borderRadius: '6px',
          padding: '12px',
          maxHeight: '150px',
          overflow: 'auto'
        }}>
          <pre style={{
            margin: 0,
            fontSize: '12px',
            color: '#475569',
            fontFamily: 'inherit',
            whiteSpace: 'pre-wrap',
            wordWrap: 'break-word'
          }}>
            {JSON.stringify(content, null, 2)}
          </pre>
        </div>
      </div>

      <div style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #cbd5e1' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#1e293b', fontSize: '13px' }}>
          Admin Feedback (optional)
        </label>
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Add feedback for contributor..."
          style={{
            width: '100%',
            padding: '10px',
            border: '1px solid #cbd5e1',
            borderRadius: '6px',
            fontSize: '12px',
            minHeight: '80px',
            boxSizing: 'border-box',
            fontFamily: 'inherit'
          }}
        />
      </div>

      {/* Actions */}
      <div style={{ display: 'grid', gap: '10px' }}>
        {contrib.status !== 'approved' && (
          <button
            onClick={() => updateStatus(contrib.id, 'approved')}
            disabled={actionLoading}
            style={{
              padding: '10px',
              backgroundColor: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '13px'
            }}
          >
            ✓ Approve
          </button>
        )}

        {contrib.status !== 'rejected' && (
          <button
            onClick={() => updateStatus(contrib.id, 'rejected')}
            disabled={actionLoading}
            style={{
              padding: '10px',
              backgroundColor: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '13px'
            }}
          >
            ✕ Reject
          </button>
        )}

        {(contrib.status === 'approved' || contrib.status === 'rejected') && (
          <button
            onClick={() => updateStatus(contrib.id, 'pending')}
            disabled={actionLoading}
            style={{
              padding: '10px',
              backgroundColor: '#f59e0b',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '13px'
            }}
          >
            ⟲ Revert to Pending
          </button>
        )}
      </div>

      {contrib.admin_feedback && (
        <div style={{
          marginTop: '20px',
          paddingTop: '20px',
          borderTop: '1px solid #cbd5e1',
          fontSize: '12px',
          color: '#94a3b8'
        }}>
          <strong>Previous feedback:</strong> {contrib.admin_feedback}
        </div>
      )}
    </div>
  );
}