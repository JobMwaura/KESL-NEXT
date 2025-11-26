'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('submissions');
  const [profile] = useState({
    username: 'ResearchUser_2025',
    email: 'researcher@example.com',
    joinDate: '2025-01-15',
    role: 'Community Contributor',
    submissions: 8,
    approvalsRate: '87.5%',
    contributions: 'Active contributor to Kenya extreme speech documentation',
    bio: 'Academic researcher studying digital discourse patterns'
  });

  const [userSubmissions] = useState([
    {
      id: '1',
      term: 'Njaruo',
      category: 'Derogatory',
      status: 'approved',
      submittedDate: '2025-11-10',
      meaning: 'Derogatory term used to describe individuals from specific ethnic backgrounds'
    },
    {
      id: '2',
      term: 'Somalliphobia',
      category: 'Exclusionary',
      status: 'approved',
      submittedDate: '2025-11-05',
      meaning: 'Systematic targeting and suspicion of Somali communities'
    },
    {
      id: '3',
      term: 'Mabooni Behavior',
      category: 'Derogatory',
      status: 'pending',
      submittedDate: '2025-11-15',
      meaning: 'Term used to describe specific behavioral patterns attributed to ethnic groups'
    }
  ]);

  const [upvotes] = useState([
    {
      id: '1',
      term: 'Questionable Loyalty',
      votes: 45,
      date: '2025-11-01'
    },
    {
      id: '2',
      term: 'Integration Failure',
      votes: 32,
      date: '2025-10-28'
    }
  ]);

  const [comments] = useState([
    {
      id: '1',
      term: 'Kikuyu Hegemony',
      comment: 'This term gained prominence during the 2022 election cycle across multiple platforms.',
      date: '2025-11-08',
      likes: 12
    },
    {
      id: '2',
      term: 'Somalliphobia',
      comment: 'Notable escalation of usage on smaller platforms compared to mainstream media.',
      date: '2025-11-03',
      likes: 8
    }
  ]);

  const getStatusColor = (status) => {
    const colors = {
      'approved': '#51cf66',
      'pending': '#ffa94d',
      'rejected': '#d62828'
    };
    return colors[status] || '#999';
  };

  const getStatusLabel = (status) => {
    const labels = {
      'approved': 'Approved',
      'pending': 'Pending',
      'rejected': 'Rejected'
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
          <h1 style={{ fontSize: '48px', margin: '0 0 15px 0' }}>My Profile</h1>
          <p style={{ fontSize: '18px', opacity: 0.95, margin: '0 auto' }}>
            View and manage your lexicon contributions
          </p>
        </section>

        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '40px', marginBottom: '40px' }}>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              padding: '30px',
              border: '1px solid #e0e0e0',
              height: 'fit-content'
            }}>
              <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                <div style={{
                  width: '100px',
                  height: '100px',
                  backgroundColor: '#667eea',
                  borderRadius: '50%',
                  margin: '0 auto 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '40px',
                  fontWeight: 'bold'
                }}>
                  {profile.username.charAt(0).toUpperCase()}
                </div>
                <h2 style={{ margin: '0 0 5px 0', color: '#333', fontSize: '20px' }}>
                  {profile.username}
                </h2>
                <p style={{ margin: '0 0 15px 0', fontSize: '12px', color: '#999', fontWeight: 'bold' }}>
                  {profile.role}
                </p>
                <p style={{ margin: 0, fontSize: '13px', color: '#666', lineHeight: '1.6' }}>
                  {profile.bio}
                </p>
              </div>

              <div style={{
                borderTop: '1px solid #e0e0e0',
                paddingTop: '20px',
                fontSize: '13px',
                color: '#666',
                lineHeight: '2'
              }}>
                <div><strong>Email:</strong> {profile.email}</div>
                <div><strong>Joined:</strong> {profile.joinDate}</div>
                <div><strong>Submissions:</strong> {profile.submissions}</div>
                <div><strong>Approval Rate:</strong> {profile.approvalsRate}</div>
              </div>

              <button style={{
                width: '100%',
                marginTop: '20px',
                padding: '10px',
                backgroundColor: '#667eea',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '13px'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#5568d3'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#667eea'}
              >
                Edit Profile
              </button>
            </div>

            <div>
              <div style={{
                backgroundColor: '#f9f9f9',
                borderRadius: '8px',
                borderBottom: 'none',
                display: 'flex',
                borderRadius: '8px 8px 0 0',
                border: '1px solid #e0e0e0',
                borderBottom: 'none'
              }}>
                {['submissions', 'upvotes', 'comments'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    style={{
                      flex: 1,
                      padding: '15px',
                      backgroundColor: activeTab === tab ? 'white' : 'transparent',
                      border: activeTab === tab ? '2px solid #667eea' : '1px solid #e0e0e0',
                      borderBottom: activeTab === tab ? 'none' : '1px solid #e0e0e0',
                      cursor: 'pointer',
                      fontWeight: activeTab === tab ? 'bold' : 'normal',
                      color: activeTab === tab ? '#667eea' : '#666',
                      fontSize: '14px',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1).replace(/([A-Z])/g, ' $1')}
                  </button>
                ))}
              </div>

              <div style={{
                backgroundColor: 'white',
                borderRadius: '0 0 8px 8px',
                border: '1px solid #e0e0e0',
                borderTop: 'none',
                padding: '30px'
              }}>
                {activeTab === 'submissions' && (
                  <div>
                    <h3 style={{ margin: '0 0 20px 0', color: '#333' }}>
                      My Submissions ({userSubmissions.length})
                    </h3>
                    <div style={{ display: 'grid', gap: '15px' }}>
                      {userSubmissions.map(submission => (
                        <div key={submission.id} style={{
                          border: '1px solid #e0e0e0',
                          borderRadius: '6px',
                          padding: '15px',
                          backgroundColor: '#fafafa'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                            <div>
                              <h4 style={{ margin: '0 0 5px 0', color: '#333', fontSize: '16px' }}>
                                {submission.term}
                              </h4>
                              <p style={{ margin: 0, fontSize: '12px', color: '#999' }}>
                                Submitted on {submission.submittedDate}
                              </p>
                            </div>
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
                          <p style={{ margin: '8px 0 0 0', fontSize: '13px', color: '#666', lineHeight: '1.5' }}>
                            {submission.meaning}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'upvotes' && (
                  <div>
                    <h3 style={{ margin: '0 0 20px 0', color: '#333' }}>
                      Terms I Found Useful ({upvotes.length})
                    </h3>
                    <div style={{ display: 'grid', gap: '15px' }}>
                      {upvotes.map(item => (
                        <div key={item.id} style={{
                          border: '1px solid #e0e0e0',
                          borderRadius: '6px',
                          padding: '15px',
                          backgroundColor: '#fafafa',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}>
                          <div>
                            <h4 style={{ margin: '0 0 5px 0', color: '#333' }}>
                              {item.term}
                            </h4>
                            <p style={{ margin: 0, fontSize: '12px', color: '#999' }}>
                              Voted {item.date}
                            </p>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <p style={{ margin: '0 0 5px 0', fontSize: '12px', color: '#666' }}>
                              Currently
                            </p>
                            <p style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', color: '#51cf66' }}>
                              👍 {item.votes}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'comments' && (
                  <div>
                    <h3 style={{ margin: '0 0 20px 0', color: '#333' }}>
                      My Comments ({comments.length})
                    </h3>
                    <div style={{ display: 'grid', gap: '15px' }}>
                      {comments.map(comment => (
                        <div key={comment.id} style={{
                          border: '1px solid #e0e0e0',
                          borderRadius: '6px',
                          padding: '15px',
                          backgroundColor: '#fafafa'
                        }}>
                          <div style={{ marginBottom: '10px' }}>
                            <h4 style={{ margin: '0 0 5px 0', color: '#333', fontSize: '15px' }}>
                              {comment.term}
                            </h4>
                            <p style={{ margin: 0, fontSize: '12px', color: '#999' }}>
                              {comment.date}
                            </p>
                          </div>
                          <p style={{ margin: '10px 0 0 0', fontSize: '13px', color: '#666', lineHeight: '1.6' }}>
                            {comment.comment}
                          </p>
                          <div style={{ marginTop: '10px', fontSize: '12px', color: '#999' }}>
                            👍 {comment.likes} liked this
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <section style={{
          background: '#f0f5ff',
          borderLeft: '4px solid #667eea',
          padding: '20px',
          maxWidth: '1200px',
          margin: '40px auto',
          borderRadius: '4px'
        }}>
          <p style={{ margin: 0, color: '#3c4b7c', fontSize: '13px', lineHeight: '1.6' }}>
            <strong>Thank you for contributing!</strong> Your submissions help us document and understand extreme speech patterns in Kenya's digital spaces. Keep sharing insights that advance this research.
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}