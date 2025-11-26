'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function ModerationPage() {
  const [submissions, setSubmissions] = useState([
    {
      id: '1',
      term: 'Mabooni',
      category: 'Derogatory',
      submittedBy: 'User_2024',
      submittedDate: '2025-11-20',
      meaning: 'Derogatory term used to describe behavior or individuals from specific ethnic backgrounds',
      examples: [
        { quote: 'Example text redacted for privacy', platform: 'KenyaList', date: '2025-11-15' }
      ],
      status: 'pending'
    },
    {
      id: '2',
      term: 'Kikuyu Hegemony',
      category: 'Coded',
      submittedBy: 'User_2025',
      submittedDate: '2025-11-19',
      meaning: 'Coded language used to describe perceived ethnic dominance in economic and political spheres',
      examples: [
        { quote: 'Example text redacted for privacy', platform: 'Reddit', date: '2025-11-10' }
      ],
      status: 'pending'
    },
    {
      id: '3',
      term: 'Mwanafrika Kamili',
      category: 'Exclusionary',
      submittedBy: 'User_2026',
      submittedDate: '2025-11-18',
      meaning: 'Phrase used to question citizenship and belonging of specific communities',
      examples: [
        { quote: 'Example text redacted for privacy', platform: 'Twitter', date: '2025-11-08' }
      ],
      status: 'pending'
    }
  ]);

  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [filterStatus, setFilterStatus] = useState('pending');

  const filteredSubmissions = submissions.filter(s => 
    filterStatus === 'all' || s.status === filterStatus
  );

  const handleApprove = (id) => {
    setSubmissions(submissions.map(s =>
      s.id === id ? { ...s, status: 'approved' } : s
    ));
    setSelectedSubmission(null);
    setReviewNotes('');
  };

  const handleReject = (id) => {
    setSubmissions(submissions.map(s =>
      s.id === id ? { ...s, status: 'rejected' } : s
    ));
    setSelectedSubmission(null);
    setReviewNotes('');
  };

  const handleRequest = (id) => {
    setSubmissions(submissions.map(s =>
      s.id === id ? { ...s, status: 'revision_requested' } : s
    ));
    setSelectedSubmission(null);
    setReviewNotes('');
  };

  const getCategoryColor = (cat) => {
    const colors = {
      'Derogatory': '#ff6b6b',
      'Exclusionary': '#ffa94d',
      'Dangerous': '#d62828',
      'Coded': '#9c27b0'
    };
    return colors[cat] || '#667eea';
  };

  const getStatusColor = (status) => {
    const colors = {
      'pending': '#ffa94d',
      'approved': '#51cf66',
      'rejected': '#d62828',
      'revision_requested': '#4dabf7'
    };
    return colors[status] || '#999';
  };

  const getStatusLabel = (status) => {
    const labels = {
      'pending': 'Pending Review',
      'approved': 'Approved',
      'rejected': 'Rejected',
      'revision_requested': 'Revision Requested'
    };
    return labels[status] || status;
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
          <h1 style={{ fontSize: '48px', margin: '0 0 15px 0' }}>Moderation Queue</h1>
          <p style={{ fontSize: '18px', opacity: 0.95, maxWidth: '800px', margin: '0 auto' }}>
            Review and approve new extreme speech term submissions
          </p>
        </section>

        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '40px 20px', display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '40px' }}>
          <div>
            <div style={{
              backgroundColor: '#f9f9f9',
              borderRadius: '8px',
              padding: '20px',
              border: '1px solid #e0e0e0'
            }}>
              <h3 style={{ margin: '0 0 20px 0', color: '#333' }}>Filter</h3>
              
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold', color: '#333' }}>
                  Status
                </label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                >
                  <option value="all">All Submissions</option>
                  <option value="pending">Pending Review ({submissions.filter(s => s.status === 'pending').length})</option>
                  <option value="approved">Approved ({submissions.filter(s => s.status === 'approved').length})</option>
                  <option value="rejected">Rejected ({submissions.filter(s => s.status === 'rejected').length})</option>
                  <option value="revision_requested">Revision Requested ({submissions.filter(s => s.status === 'revision_requested').length})</option>
                </select>
              </div>

              <div style={{
                backgroundColor: 'white',
                borderRadius: '6px',
                padding: '15px',
                border: '1px solid #e0e0e0'
              }}>
                <p style={{ margin: '0 0 10px 0', fontSize: '12px', color: '#999', fontWeight: 'bold' }}>
                  QUEUE STATS
                </p>
                <div style={{ fontSize: '14px', color: '#666', lineHeight: '2' }}>
                  <div>
                    <span style={{ color: '#ffa94d', fontWeight: 'bold' }}>●</span> Pending: <strong>{submissions.filter(s => s.status === 'pending').length}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#51cf66', fontWeight: 'bold' }}>●</span> Approved: <strong>{submissions.filter(s => s.status === 'approved').length}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#d62828', fontWeight: 'bold' }}>●</span> Rejected: <strong>{submissions.filter(s => s.status === 'rejected').length}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#4dabf7', fontWeight: 'bold' }}>●</span> Revision: <strong>{submissions.filter(s => s.status === 'revision_requested').length}</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div style={{ display: 'grid', gap: '15px' }}>
              {filteredSubmissions.map(submission => (
                <div
                  key={submission.id}
                  onClick={() => setSelectedSubmission(submission)}
                  style={{
                    border: selectedSubmission?.id === submission.id ? '2px solid #667eea' : '1px solid #e0e0e0',
                    borderRadius: '8px',
                    padding: '20px',
                    backgroundColor: selectedSubmission?.id === submission.id ? '#f0f5ff' : 'white',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (selectedSubmission?.id !== submission.id) {
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                    <div>
                      <h4 style={{ margin: '0 0 5px 0', fontSize: '18px', color: '#333' }}>
                        {submission.term}
                      </h4>
                      <p style={{ margin: 0, fontSize: '13px', color: '#999' }}>
                        Submitted by {submission.submittedBy} on {submission.submittedDate}
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <span style={{
                        backgroundColor: getCategoryColor(submission.category),
                        color: 'white',
                        padding: '4px 10px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        whiteSpace: 'nowrap'
                      }}>
                        {submission.category}
                      </span>
                      <span style={{
                        backgroundColor: getStatusColor(submission.status),
                        color: 'white',
                        padding: '4px 10px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        whiteSpace: 'nowrap'
                      }}>
                        {getStatusLabel(submission.status)}
                      </span>
                    </div>
                  </div>
                  <p style={{ margin: 0, fontSize: '14px', color: '#555', lineHeight: '1.6' }}>
                    {submission.meaning}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {selectedSubmission && (
          <section style={{
            maxWidth: '1400px',
            margin: '40px auto',
            padding: '0 20px'
          }}>
            <div style={{
              backgroundColor: '#f9f9f9',
              borderRadius: '8px',
              padding: '30px',
              border: '1px solid #e0e0e0'
            }}>
              <h2 style={{ marginTop: 0, marginBottom: '25px', color: '#333' }}>
                Review: {selectedSubmission.term}
              </h2>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px', marginBottom: '30px' }}>
                <div>
                  <div style={{ marginBottom: '25px' }}>
                    <h4 style={{ margin: '0 0 10px 0', color: '#333' }}>Meaning</h4>
                    <p style={{ margin: 0, fontSize: '15px', color: '#555', lineHeight: '1.6' }}>
                      {selectedSubmission.meaning}
                    </p>
                  </div>

                  <div style={{ marginBottom: '25px' }}>
                    <h4 style={{ margin: '0 0 10px 0', color: '#333' }}>Examples ({selectedSubmission.examples.length})</h4>
                    {selectedSubmission.examples.map((ex, idx) => (
                      <div key={idx} style={{
                        backgroundColor: 'white',
                        padding: '15px',
                        borderRadius: '6px',
                        border: '1px solid #e0e0e0',
                        marginBottom: '10px'
                      }}>
                        <p style={{ margin: '0 0 5px 0', fontSize: '13px', color: '#666' }}>
                          <strong>{ex.platform}</strong> • {ex.date}
                        </p>
                        <blockquote style={{
                          margin: '10px 0 0 0',
                          paddingLeft: '12px',
                          borderLeft: '3px solid #667eea',
                          fontStyle: 'italic',
                          color: '#555'
                        }}>
                          "{ex.quote}"
                        </blockquote>
                      </div>
                    ))}
                  </div>

                  <div>
                    <h4 style={{ margin: '0 0 10px 0', color: '#333' }}>Review Notes</h4>
                    <textarea
                      value={reviewNotes}
                      onChange={(e) => setReviewNotes(e.target.value)}
                      placeholder="Add notes about this submission (approval reason, issues, requests, etc.)"
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '14px',
                        boxSizing: 'border-box',
                        minHeight: '120px',
                        fontFamily: 'inherit'
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div style={{
                    backgroundColor: 'white',
                    borderRadius: '6px',
                    padding: '20px',
                    border: '1px solid #e0e0e0'
                  }}>
                    <h4 style={{ margin: '0 0 15px 0', color: '#333', fontSize: '14px' }}>
                      SUBMISSION INFO
                    </h4>
                    <div style={{ fontSize: '13px', color: '#666', lineHeight: '2' }}>
                      <div><strong>Category:</strong> {selectedSubmission.category}</div>
                      <div><strong>Submitted by:</strong> {selectedSubmission.submittedBy}</div>
                      <div><strong>Submitted:</strong> {selectedSubmission.submittedDate}</div>
                      <div><strong>Examples:</strong> {selectedSubmission.examples.length}</div>
                    </div>

                    <div style={{
                      marginTop: '20px',
                      paddingTop: '20px',
                      borderTop: '1px solid #e0e0e0'
                    }}>
                      <h4 style={{ margin: '0 0 12px 0', color: '#333', fontSize: '14px' }}>
                        ACTIONS
                      </h4>
                      <div style={{ display: 'grid', gap: '8px' }}>
                        <button
                          onClick={() => handleApprove(selectedSubmission.id)}
                          style={{
                            padding: '10px',
                            backgroundColor: '#51cf66',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            fontSize: '13px'
                          }}
                          onMouseEnter={(e) => e.target.style.backgroundColor = '#40c057'}
                          onMouseLeave={(e) => e.target.style.backgroundColor = '#51cf66'}
                        >
                          ✓ Approve
                        </button>
                        <button
                          onClick={() => handleRequest(selectedSubmission.id)}
                          style={{
                            padding: '10px',
                            backgroundColor: '#4dabf7',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            fontSize: '13px'
                          }}
                          onMouseEnter={(e) => e.target.style.backgroundColor = '#339af0'}
                          onMouseLeave={(e) => e.target.style.backgroundColor = '#4dabf7'}
                        >
                          ↻ Request Revision
                        </button>
                        <button
                          onClick={() => handleReject(selectedSubmission.id)}
                          style={{
                            padding: '10px',
                            backgroundColor: '#d62828',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            fontSize: '13px'
                          }}
                          onMouseEnter={(e) => e.target.style.backgroundColor = '#c41c1c'}
                          onMouseLeave={(e) => e.target.style.backgroundColor = '#d62828'}
                        >
                          ✕ Reject
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        <section style={{
          background: '#fff3cd',
          borderLeft: '4px solid #ffc107',
          padding: '20px',
          maxWidth: '1200px',
          margin: '40px auto',
          borderRadius: '4px'
        }}>
          <p style={{ margin: 0, color: '#856404', fontSize: '14px', lineHeight: '1.6' }}>
            <strong>⚠️ Moderation Note:</strong> All submissions are reviewed by trained moderators to ensure quality and accuracy before addition to the lexicon.
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}