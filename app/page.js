'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { fetchApprovedTerms } from '@/lib/supabase';

export default function Home() {
  const [recentTerms, setRecentTerms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTerms() {
      try {
        const data = await fetchApprovedTerms();
        setRecentTerms(data.slice(0, 6)); // Get 6 most recent
      } catch (err) {
        console.error('Error loading terms:', err);
      } finally {
        setLoading(false);
      }
    }

    loadTerms();
  }, []);

  return (
    <>
      <Header />
      <main>
        {/* Hero Section */}
        <section style={{
          background: 'linear-gradient(135deg, #1a3a52 0%, #2d5a7b 50%, #4a7ba7 100%)',
          color: 'white',
          padding: '120px 20px',
          textAlign: 'center'
        }}>
          <h1 style={{ fontSize: '56px', marginBottom: '20px', fontWeight: 'bold', lineHeight: '1.2' }}>
            Kenya Extreme Speech Lexicon
          </h1>
          <p style={{ fontSize: '24px', marginBottom: '30px', opacity: 0.95 }}>
            Understanding polarization and hate speech in Kenya's digital spaces
          </p>
          <p style={{ fontSize: '16px', maxWidth: '800px', margin: '0 auto 40px', opacity: 0.9, lineHeight: '1.8' }}>
            A comprehensive research platform documenting extreme speech patterns across Reddit, Telegram, KenyaList, and other small digital platforms
          </p>
          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/lexicon" style={{ textDecoration: 'none' }}>
              <button style={{
                padding: '16px 40px',
                backgroundColor: 'white',
                color: '#1a3a52',
                border: 'none',
                borderRadius: '6px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: '0 4px 6px rgba(0,0,0,0.2)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 12px rgba(0,0,0,0.3)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 6px rgba(0,0,0,0.2)';
              }}>
                Browse Lexicon →
              </button>
            </a>
            <a href="/submit" style={{ textDecoration: 'none' }}>
              <button style={{
                padding: '16px 40px',
                backgroundColor: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 6px rgba(0,0,0,0.2)'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#059669';
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 12px rgba(0,0,0,0.3)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#10b981';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 6px rgba(0,0,0,0.2)';
              }}>
                + Submit a Term
              </button>
            </a>
          </div>
        </section>

        {/* Submission Info Banner */}
        <section style={{
          background: '#ecfdf5',
          borderTop: '4px solid #10b981',
          padding: '20px',
          textAlign: 'center'
        }}>
          <p style={{ margin: 0, color: '#065f46', fontSize: '14px', fontWeight: '600' }}>
            ℹ️ <strong>Help us document extreme speech:</strong> Found a term? Submit it with one example and our team will review it within 24-48 hours.
          </p>
        </section>

        {/* Quick Stats */}
        <section style={{ padding: '60px 20px', maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
            <StatBox number="30+" label="Terms Documented" color="#10b981" />
            <StatBox number="8+" label="Platforms Analyzed" color="#3b82f6" />
            <StatBox number="100+" label="FGD & Interviews" color="#f59e0b" />
            <StatBox number="1000+" label="Content Items" color="#7c3aed" />
          </div>
        </section>

        {/* Recent Terms Preview */}
        <section style={{ background: '#f8fafc', padding: '80px 20px' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '60px' }}>
              <div>
                <h2 style={{ fontSize: '40px', color: '#1e293b', margin: '0 0 5px 0' }}>Recently Documented Terms</h2>
                <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>Latest submissions approved by our research team</p>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <a href="/submit" style={{ textDecoration: 'none' }}>
                  <button style={{
                    padding: '12px 24px',
                    backgroundColor: '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '14px',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#059669';
                    e.target.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#10b981';
                    e.target.style.transform = 'translateY(0)';
                  }}>
                    + Submit
                  </button>
                </a>
                <a href="/lexicon" style={{ textDecoration: 'none' }}>
                  <button style={{
                    padding: '12px 24px',
                    backgroundColor: '#2d5a7b',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '14px'
                  }}>
                    View All Terms
                  </button>
                </a>
              </div>
            </div>
            
            {loading ? (
              <p style={{ textAlign: 'center', color: '#94a3b8' }}>Loading terms...</p>
            ) : recentTerms.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                {recentTerms.map((term) => (
                  <a key={term.id} href={`/lexicon/${term.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <TermPreviewCard term={term} />
                  </a>
                ))}
              </div>
            ) : (
              <p style={{ textAlign: 'center', color: '#94a3b8' }}>No terms documented yet.</p>
            )}
          </div>
        </section>

        {/* How to Contribute */}
        <section style={{ padding: '80px 20px', maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: '40px', marginBottom: '60px', color: '#1e293b' }}>
            How to Contribute
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px', maxWidth: '900px', margin: '0 auto' }}>
            <ContributionStep 
              number="1"
              icon="📝"
              title="Find a Term"
              description="Spot extreme speech on Reddit, Telegram, KenyaList, or other platforms"
            />
            <ContributionStep 
              number="2"
              icon="✏️"
              title="Submit with Example"
              description="Fill out the simple form with the term, its meaning, and one redacted example"
            />
            <ContributionStep 
              number="3"
              icon="👀"
              title="Review Process"
              description="Our research team reviews submissions within 24-48 hours"
            />
            <ContributionStep 
              number="4"
              icon="✓"
              title="Goes Live"
              description="Once approved, your term appears in the lexicon and on the homepage"
            />
          </div>
          <div style={{ textAlign: 'center', marginTop: '60px' }}>
            <a href="/submit" style={{ textDecoration: 'none' }}>
              <button style={{
                padding: '16px 50px',
                backgroundColor: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 6px rgba(0,0,0,0.2)'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#059669';
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 12px rgba(0,0,0,0.3)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#10b981';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 6px rgba(0,0,0,0.2)';
              }}>
                Ready to Submit? →
              </button>
            </a>
          </div>
        </section>

        {/* Research Focus */}
        <section style={{ padding: '80px 20px', maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: '40px', marginBottom: '60px', color: '#1e293b' }}>
            Research Focus
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' }}>
            <ResearchCard 
              icon="🌐"
              title="Platform Mapping"
              description="Identify and analyze extreme speech patterns across Kenya's smaller digital platforms"
            />
            <ResearchCard 
              icon="📊"
              title="Content Migration"
              description="Track how harmful content moves from mainstream to niche platforms and offline spaces"
            />
            <ResearchCard 
              icon="🎯"
              title="Community Impact"
              description="Document how extreme speech systematically targets ethnic minorities and marginalized groups"
            />
            <ResearchCard 
              icon="⚖️"
              title="Policy Analysis"
              description="Examine legal gaps and content moderation failures on small platforms"
            />
            <ResearchCard 
              icon="💡"
              title="Systemic Patterns"
              description="Identify organized campaigns and systematic targeting strategies"
            />
            <ResearchCard 
              icon="🛡️"
              title="Rights Protection"
              description="Generate evidence for digital rights advocacy and platform accountability"
            />
          </div>
        </section>

        {/* Understanding Extreme Speech Section */}
        <section style={{ padding: '80px 20px', maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: '40px', marginBottom: '60px', color: '#1e293b' }}>
            Conceptual Foundation
          </h2>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <a href="/understanding-extreme-speech" style={{ textDecoration: 'none' }}>
              <div style={{
                border: '2px solid #2d5a7b',
                borderRadius: '8px',
                padding: '40px',
                backgroundColor: '#f0f4f8',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 15px 40px rgba(45, 90, 123, 0.2)';
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.borderColor = '#1a3a52';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = '#2d5a7b';
              }}>
                <div style={{ fontSize: '48px', marginBottom: '20px' }}>📚</div>
                <h3 style={{ fontSize: '28px', color: '#1a3a52', marginBottom: '15px' }}>
                  Understanding Extreme Speech
                </h3>
                <p style={{ color: '#475569', lineHeight: '1.8', marginBottom: '20px', fontSize: '16px' }}>
                  Learn how we conceptualize extreme speech as a critical framework for understanding online vitriol. Discover why we move beyond traditional "hate speech" definitions to center historical awareness, cultural context, and community voices.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <span style={{ color: '#2d5a7b', fontWeight: 'bold', fontSize: '18px' }}>→</span>
                    <div><strong>Definition:</strong> A scholarly framework grounded in ethnography and decolonial thinking</div>
                  </div>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <span style={{ color: '#2d5a7b', fontWeight: 'bold', fontSize: '18px' }}>→</span>
                    <div><strong>Why it matters:</strong> Recognizes ambivalence, power dynamics, and context</div>
                  </div>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <span style={{ color: '#2d5a7b', fontWeight: 'bold', fontSize: '18px' }}>→</span>
                    <div><strong>Kenya context:</strong> How we apply this framework to Kenyan digital spaces</div>
                  </div>
                </div>
                <p style={{ color: '#2d5a7b', fontWeight: 'bold', fontSize: '16px', margin: 0 }}>
                  Explore the framework →
                </p>
              </div>
            </a>
          </div>
        </section>

        {/* Key Findings */}
        <section style={{ background: '#f8fafc', padding: '80px 20px' }}>
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <h2 style={{ textAlign: 'center', fontSize: '40px', marginBottom: '60px', color: '#1e293b' }}>
              Key Findings
            </h2>
            <div style={{ display: 'grid', gap: '30px' }}>
              <FindingCard
                number="01"
                title="Content Moderation Gap"
                description="Smaller platforms have significantly worse content moderation compared to Facebook, Twitter, and WhatsApp, creating spaces where extreme speech thrives with minimal accountability."
              />
              <FindingCard
                number="02"
                title="Platform-Specific Discourse"
                description="Different platforms create distinct discourse environments. Telegram channels and KenyaList forums host more extreme content than mainstream platforms, with less oversight."
              />
              <FindingCard
                number="03"
                title="Ethnic Targeting Patterns"
                description="Systematic targeting of Somali, LGBTQ+, and other minority communities with derogatory, exclusionary, and dangerous speech across multiple platforms."
              />
              <FindingCard
                number="04"
                title="Offline Consequences"
                description="Online extreme speech normalizes offline discrimination. Workplace gossip, matatu conversations, and community gatherings reflect narratives originating on digital platforms."
              />
              <FindingCard
                number="05"
                title="Regulatory Vacuum"
                description="NCIC (National Cohesion and Integration Commission) focuses only on ethnic hate speech, leaving gaps in addressing religious discrimination, gender-based harassment, and other harmful content."
              />
              <FindingCard
                number="06"
                title="Cross-Platform Amplification"
                description="Content migrates from offline sources to social media to smaller platforms, where lack of moderation allows it to escalate and persist without accountability."
              />
            </div>
          </div>
        </section>

        {/* Platforms Studied */}
        <section style={{ padding: '80px 20px', maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: '40px', marginBottom: '60px', color: '#1e293b' }}>
            Platforms Studied
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
            <PlatformBadge name="Reddit (r/Kenya)" color="#FF4500" />
            <PlatformBadge name="Telegram Channels" color="#0088cc" />
            <PlatformBadge name="KenyaList Forums" color="#2d5a7b" />
            <PlatformBadge name="KenyansOnline" color="#1a3a52" />
            <PlatformBadge name="WhatsApp Groups" color="#25D366" />
            <PlatformBadge name="Twitter/X" color="#000000" />
            <PlatformBadge name="Facebook" color="#1877F2" />
            <PlatformBadge name="TikTok" color="#000000" />
          </div>
        </section>

        {/* Methodology */}
        <section style={{ background: '#f0f4f8', padding: '80px 20px' }}>
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <h2 style={{ textAlign: 'center', fontSize: '40px', marginBottom: '60px', color: '#1e293b' }}>
              Methodology
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px' }}>
              <MethodCard
                title="Content Analysis"
                description="Systematic documentation and classification of extreme speech using established frameworks (derogatory, exclusionary, dangerous speech)"
              />
              <MethodCard
                title="Focus Group Discussions"
                description="In-depth conversations with affected communities in Eastleigh and other areas to understand lived experiences of online hate"
              />
              <MethodCard
                title="Expert Interviews"
                description="Engagement with policy makers, content creators, journalists, and digital rights advocates"
              />
              <MethodCard
                title="Platform Auditing"
                description="Technical analysis of content moderation policies, enforcement mechanisms, and governance structures"
              />
              <MethodCard
                title="Migration Tracking"
                description="Documentation of how content flows between platforms and from online to offline spaces"
              />
              <MethodCard
                title="Multi-Stakeholder Approach"
                description="Collaboration with civil society, government bodies, and affected communities for comprehensive understanding"
              />
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section style={{
          background: 'linear-gradient(135deg, #1a3a52 0%, #2d5a7b 50%, #4a7ba7 100%)',
          color: 'white',
          padding: '80px 20px',
          textAlign: 'center'
        }}>
          <h2 style={{ fontSize: '40px', marginBottom: '20px' }}>
            Ready to Contribute?
          </h2>
          <p style={{ fontSize: '18px', marginBottom: '30px', opacity: 0.95 }}>
            Help us document extreme speech. Submit a term with one example in just 3-5 minutes.
          </p>
          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/submit" style={{ textDecoration: 'none' }}>
              <button style={{
                padding: '16px 50px',
                backgroundColor: 'white',
                color: '#1a3a52',
                border: 'none',
                borderRadius: '6px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: '0 4px 6px rgba(0,0,0,0.2)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 12px rgba(0,0,0,0.3)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 6px rgba(0,0,0,0.2)';
              }}>
                + Submit a Term
              </button>
            </a>
            <a href="/lexicon" style={{ textDecoration: 'none' }}>
              <button style={{
                padding: '16px 50px',
                backgroundColor: 'rgba(255,255,255,0.2)',
                color: 'white',
                border: '2px solid white',
                borderRadius: '6px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'rgba(255,255,255,0.3)';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'rgba(255,255,255,0.2)';
                e.target.style.transform = 'translateY(0)';
              }}>
                Browse Lexicon
              </button>
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function ContributionStep({ number, icon, title, description }) {
  return (
    <div style={{
      textAlign: 'center',
      padding: '30px'
    }}>
      <div style={{
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        backgroundColor: '#dbeafe',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 20px',
        fontSize: '28px',
        fontWeight: 'bold',
        color: '#2d5a7b'
      }}>
        {number}
      </div>
      <div style={{ fontSize: '40px', marginBottom: '15px' }}>{icon}</div>
      <h3 style={{ fontSize: '18px', color: '#1e293b', marginBottom: '10px' }}>{title}</h3>
      <p style={{ color: '#64748b', lineHeight: '1.6', margin: 0 }}>{description}</p>
    </div>
  );
}

function ResearchCard({ icon, title, description }) {
  return (
    <div style={{
      padding: '30px',
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      backgroundColor: '#fff',
      transition: 'all 0.3s ease',
      cursor: 'pointer'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
      e.currentTarget.style.transform = 'translateY(-5px)';
      e.currentTarget.style.borderColor = '#2d5a7b';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.boxShadow = 'none';
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.borderColor = '#e2e8f0';
    }}>
      <div style={{ fontSize: '48px', marginBottom: '15px' }}>{icon}</div>
      <h3 style={{ marginBottom: '10px', color: '#1e293b' }}>{title}</h3>
      <p style={{ color: '#475569', lineHeight: '1.6', margin: 0 }}>{description}</p>
    </div>
  );
}

function FindingCard({ number, title, description }) {
  return (
    <div style={{ display: 'flex', gap: '20px', paddingBottom: '30px', borderBottom: '1px solid #cbd5e1' }}>
      <div style={{
        fontSize: '32px',
        fontWeight: 'bold',
        color: '#2d5a7b',
        minWidth: '50px'
      }}>
        {number}
      </div>
      <div>
        <h3 style={{ color: '#1e293b', marginBottom: '10px' }}>{title}</h3>
        <p style={{ color: '#475569', lineHeight: '1.8', margin: 0 }}>{description}</p>
      </div>
    </div>
  );
}

function PlatformBadge({ name, color }) {
  return (
    <div style={{
      backgroundColor: color,
      color: 'white',
      padding: '15px 20px',
      borderRadius: '20px',
      textAlign: 'center',
      fontWeight: 'bold',
      fontSize: '14px',
      transition: 'all 0.3s ease',
      cursor: 'default'
    }}>
      {name}
    </div>
  );
}

function MethodCard({ title, description }) {
  return (
    <div style={{
      padding: '25px',
      backgroundColor: 'white',
      borderRadius: '8px',
      border: '1px solid #cbd5e1',
      transition: 'all 0.3s ease',
      cursor: 'pointer'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.boxShadow = '0 4px 12px rgba(45, 90, 123, 0.1)';
      e.currentTarget.style.borderColor = '#2d5a7b';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.boxShadow = 'none';
      e.currentTarget.style.borderColor = '#cbd5e1';
    }}>
      <h3 style={{ color: '#1e293b', marginBottom: '10px' }}>{title}</h3>
      <p style={{ color: '#475569', lineHeight: '1.6', margin: 0 }}>{description}</p>
    </div>
  );
}

function StatBox({ number, label, color }) {
  return (
    <div style={{
      padding: '40px 20px',
      textAlign: 'center',
      backgroundColor: 'white',
      borderRadius: '8px',
      border: `2px solid ${color}`,
      boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
      transition: 'all 0.3s ease',
      cursor: 'default'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-5px)';
      e.currentTarget.style.boxShadow = `0 8px 16px ${color}30`;
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.05)';
    }}>
      <div style={{ fontSize: '36px', fontWeight: 'bold', color: color, marginBottom: '10px' }}>
        {number}
      </div>
      <div style={{ color: '#475569', fontSize: '14px' }}>{label}</div>
    </div>
  );
}

function TermPreviewCard({ term }) {
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

  return (
    <div style={{
      border: '1px solid #cbd5e1',
      borderRadius: '8px',
      padding: '20px',
      backgroundColor: 'white',
      transition: 'all 0.3s ease',
      cursor: 'pointer'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)';
      e.currentTarget.style.transform = 'translateY(-3px)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.boxShadow = 'none';
      e.currentTarget.style.transform = 'translateY(0)';
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
        <div>
          <h3 style={{ margin: '0 0 4px 0', fontSize: '20px', color: '#1e293b' }}>
            {term.term}
          </h3>
          <p style={{ margin: 0, fontSize: '13px', color: '#94a3b8' }}>
            {term.language}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          <span style={{
            backgroundColor: getCategoryColor(term.category),
            color: 'white',
            padding: '3px 8px',
            borderRadius: '3px',
            fontSize: '11px',
            fontWeight: 'bold',
            whiteSpace: 'nowrap'
          }}>
            {term.category}
          </span>
          <span style={{
            backgroundColor: getRiskColor(term.risk),
            color: 'white',
            padding: '3px 8px',
            borderRadius: '3px',
            fontSize: '11px',
            fontWeight: 'bold',
            whiteSpace: 'nowrap'
          }}>
            {term.risk}
          </span>
        </div>
      </div>
      <p style={{ margin: '15px 0', fontSize: '14px', color: '#475569', lineHeight: '1.5' }}>
        {term.meaning.substring(0, 100)}...
      </p>
      <div style={{ fontSize: '12px', color: '#94a3b8' }}>
        👍 {term.votes || 0} useful
      </div>
    </div>
  );
}