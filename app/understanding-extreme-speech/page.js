'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function UnderstandingExtremeSpeech() {
  const [activeTab, setActiveTab] = useState('definition');

  const tabs = [
    { id: 'definition', label: 'Core Definition' },
    { id: 'why-extreme', label: 'Why Extreme Speech?' },
    { id: 'categories', label: 'Key Categories' },
    { id: 'kenya-context', label: 'Kenya Context' },
  ];

  return (
    <div style={{ background: '#ffffff', minHeight: '100vh' }}>
      {/* Hero Section - Minimal and Clean */}
      <div style={{
        background: 'linear-gradient(135deg, #1a3a52 0%, #2d5a7b 100%)',
        color: 'white',
        padding: '60px 20px',
        textAlign: 'left'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <Link href="/" style={{ 
            color: 'rgba(255,255,255,0.8)', 
            textDecoration: 'none',
            fontSize: '14px',
            marginBottom: '20px',
            display: 'inline-block'
          }}>
            ← Back to Home
          </Link>
          <h1 style={{ 
            fontSize: '48px', 
            marginBottom: '15px', 
            fontWeight: '700',
            lineHeight: '1.2'
          }}>
            Understanding Extreme Speech
          </h1>
          <p style={{ 
            fontSize: '18px', 
            opacity: 0.95,
            maxWidth: '600px',
            lineHeight: '1.6'
          }}>
            A critical framework for analyzing how speech functions as both subversive resistance and systematic harm in Kenya's digital spaces
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 20px' }}>
        
        {/* Tab Navigation - Horizontal Scroll */}
        <div style={{ 
          display: 'flex', 
          gap: '20px', 
          borderBottom: '2px solid #e2e8f0',
          marginBottom: '50px',
          overflowX: 'auto',
          paddingBottom: '0'
        }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '16px 0',
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '500',
                color: activeTab === tab.id ? '#1a3a52' : '#94a3b8',
                borderBottom: activeTab === tab.id ? '3px solid #1a3a52' : 'none',
                transition: 'all 0.3s ease',
                whiteSpace: 'nowrap',
                paddingLeft: '20px',
                paddingRight: '20px',
                marginBottom: '-2px'
              }}
              onMouseEnter={(e) => {
                if (activeTab !== tab.id) {
                  e.target.style.color = '#475569';
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== tab.id) {
                  e.target.style.color = '#94a3b8';
                }
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content - Clean Cards */}
        <div style={{ minHeight: '500px' }}>

          {/* Definition Tab */}
          {activeTab === 'definition' && (
            <div style={{ animation: 'fadeIn 0.3s ease-in-out' }}>
              <h2 style={{ fontSize: '32px', fontWeight: '700', color: '#1a3a52', marginBottom: '30px' }}>
                Core Definition
              </h2>
              
              {/* Quote Card */}
              <div style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderLeft: '4px solid #1a3a52',
                padding: '30px',
                borderRadius: '8px',
                marginBottom: '40px'
              }}>
                <p style={{ 
                  fontSize: '18px', 
                  fontStyle: 'italic',
                  color: '#1e293b',
                  margin: '0 0 15px 0',
                  lineHeight: '1.7'
                }}>
                  "Extreme speech is a critical conceptual framework that aims to uncover vitriolic online cultures through comparative and ethnographic excavations of digital practices."
                </p>
                <p style={{ 
                  fontSize: '13px', 
                  color: '#64748b',
                  margin: 0
                }}>
                  — Udupa, S. (2023). <em>Challenges and perspectives of hate speech research</em>
                </p>
              </div>

              {/* Two Column Layout */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1a3a52', marginBottom: '12px' }}>
                    Key Principle
                  </h3>
                  <p style={{ color: '#475569', lineHeight: '1.7', margin: 0 }}>
                    Extreme speech is <strong>not just another definition</strong>. Rather, it is a conceptual framework developed to foreground <strong>historical awareness</strong>, <strong>critical deconstruction of existing categories</strong>, and <strong>grounded understanding of evolving practices</strong> in online communities.
                  </p>
                </div>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1a3a52', marginBottom: '12px' }}>
                    Core Goal
                  </h3>
                  <p style={{ color: '#475569', lineHeight: '1.7', margin: 0 }}>
                    To holistically analyze contemporary digital hate cultures by examining both <strong>proximate contexts</strong> (media affordances, speech cultures) and <strong>deep contextualization</strong> (historical continuities and technopolitical formations).
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Why Extreme Speech Tab */}
          {activeTab === 'why-extreme' && (
            <div style={{ animation: 'fadeIn 0.3s ease-in-out' }}>
              <h2 style={{ fontSize: '32px', fontWeight: '700', color: '#1a3a52', marginBottom: '30px' }}>
                Why "Extreme Speech" Instead of "Hate Speech"?
              </h2>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px' }}>
                {/* Problems */}
                <div style={{
                  background: '#fef2f2',
                  border: '1px solid #fee2e2',
                  borderRadius: '8px',
                  padding: '30px'
                }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#991b1b', marginBottom: '20px' }}>
                    Problems with "Hate Speech"
                  </h3>
                  <ul style={{ 
                    listStyle: 'none', 
                    padding: 0, 
                    margin: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px'
                  }}>
                    <li style={{ color: '#475569', fontSize: '14px', lineHeight: '1.6' }}>
                      <strong>Predefined effects</strong> — Assumes inherent negativity
                    </li>
                    <li style={{ color: '#475569', fontSize: '14px', lineHeight: '1.6' }}>
                      <strong>Legal focus</strong> — Emphasizes culpability over understanding
                    </li>
                    <li style={{ color: '#475569', fontSize: '14px', lineHeight: '1.6' }}>
                      <strong>Universalizing</strong> — Imposes Western definitions
                    </li>
                    <li style={{ color: '#475569', fontSize: '14px', lineHeight: '1.6' }}>
                      <strong>Weaponizable</strong> — Used to suppress dissent
                    </li>
                    <li style={{ color: '#475569', fontSize: '14px', lineHeight: '1.6' }}>
                      <strong>Closes dialogue</strong> — Functions as accusation
                    </li>
                  </ul>
                </div>

                {/* Benefits */}
                <div style={{
                  background: '#f0fdf4',
                  border: '1px solid #dcfce7',
                  borderRadius: '8px',
                  padding: '30px'
                }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#166534', marginBottom: '20px' }}>
                    What "Extreme Speech" Offers
                  </h3>
                  <ul style={{ 
                    listStyle: 'none', 
                    padding: 0, 
                    margin: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px'
                  }}>
                    <li style={{ color: '#475569', fontSize: '14px', lineHeight: '1.6' }}>
                      ✓ <strong>Ambiguity recognition</strong> — Speech is contextual
                    </li>
                    <li style={{ color: '#475569', fontSize: '14px', lineHeight: '1.6' }}>
                      ✓ <strong>Cultural sensitivity</strong> — Respects local norms
                    </li>
                    <li style={{ color: '#475569', fontSize: '14px', lineHeight: '1.6' }}>
                      ✓ <strong>Historical depth</strong> — Connects to power structures
                    </li>
                    <li style={{ color: '#475569', fontSize: '14px', lineHeight: '1.6' }}>
                      ✓ <strong>Ethnographic</strong> — Centers lived experience
                    </li>
                    <li style={{ color: '#475569', fontSize: '14px', lineHeight: '1.6' }}>
                      ✓ <strong>Grounded</strong> — Emerges from communities
                    </li>
                  </ul>
                </div>
              </div>

              {/* Kenya Context */}
              <div style={{
                background: '#f0f4f8',
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                padding: '25px',
                marginTop: '30px'
              }}>
                <p style={{ color: '#1e293b', lineHeight: '1.7', margin: 0 }}>
                  <strong>In Kenya:</strong> As scholar Katiambo (2021) argues, "the polysemy of extreme speech is removed when incivility becomes known as hate speech, blocking us from ever knowing its alternative possibilities." Understanding the ambivalence is critical.
                </p>
              </div>
            </div>
          )}

          {/* Categories Tab */}
          {activeTab === 'categories' && (
            <div style={{ animation: 'fadeIn 0.3s ease-in-out' }}>
              <h2 style={{ fontSize: '32px', fontWeight: '700', color: '#1a3a52', marginBottom: '30px' }}>
                Three Key Categories
              </h2>
              
              <div style={{ display: 'grid', gap: '20px' }}>
                {/* Derogatory */}
                <div style={{
                  background: '#fef3c7',
                  border: '1px solid #fcd34d',
                  borderLeft: '4px solid #d97706',
                  borderRadius: '8px',
                  padding: '25px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '15px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#92400e', margin: 0 }}>
                      1. Derogatory Extreme Speech
                    </h3>
                    <span style={{ 
                      background: '#d97706', 
                      color: 'white', 
                      padding: '4px 12px', 
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}>
                      Uncivil
                    </span>
                  </div>
                  <p style={{ color: '#78350f', fontSize: '14px', lineHeight: '1.6', margin: '0 0 10px 0' }}>
                    Violates civility norms within specific contexts but doesn't explicitly exclude vulnerable groups. Ambivalent—can challenge power OR perpetuate harm.
                  </p>
                  <p style={{ color: '#b45309', fontSize: '13px', margin: 0 }}>
                    <strong>Examples:</strong> Derogatory jokes, insults, sobriquets
                  </p>
                </div>

                {/* Exclusionary */}
                <div style={{
                  background: '#fee2e2',
                  border: '1px solid #fecaca',
                  borderLeft: '4px solid #dc2626',
                  borderRadius: '8px',
                  padding: '25px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '15px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#7f1d1d', margin: 0 }}>
                      2. Exclusionary Extreme Speech
                    </h3>
                    <span style={{ 
                      background: '#dc2626', 
                      color: 'white', 
                      padding: '4px 12px', 
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}>
                      Excluding
                    </span>
                  </div>
                  <p style={{ color: '#7f1d1d', fontSize: '14px', lineHeight: '1.6', margin: '0 0 10px 0' }}>
                    Calls for or implies excluding disadvantaged groups. Explicitly targets ethnic, gender, and other marginalized identities.
                  </p>
                  <p style={{ color: '#991b1b', fontSize: '13px', margin: 0 }}>
                    <strong>Targets:</strong> Gender, ethnicity, national origin, racialized categories
                  </p>
                </div>

                {/* Dangerous */}
                <div style={{
                  background: '#f8d7da',
                  border: '1px solid #f5c6cb',
                  borderLeft: '4px solid #991b1b',
                  borderRadius: '8px',
                  padding: '25px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '15px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#721c24', margin: 0 }}>
                      3. Dangerous Speech
                    </h3>
                    <span style={{ 
                      background: '#991b1b', 
                      color: 'white', 
                      padding: '4px 12px', 
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}>
                      Violent
                    </span>
                  </div>
                  <p style={{ color: '#721c24', fontSize: '14px', lineHeight: '1.6', margin: '0 0 10px 0' }}>
                    Has reasonable chance to trigger or catalyze real-world harm and violence. Most severe category requiring intervention.
                  </p>
                  <p style={{ color: '#991b1b', fontSize: '13px', margin: 0 }}>
                    <strong>Framework:</strong> Benesch (2013) Dangerous Speech Project
                  </p>
                </div>
              </div>

              {/* Key Insight */}
              <div style={{
                background: 'linear-gradient(135deg, #1a3a52 0%, #2d5a7b 100%)',
                color: 'white',
                borderRadius: '8px',
                padding: '30px',
                marginTop: '30px'
              }}>
                <p style={{ margin: 0, lineHeight: '1.7' }}>
                  These categories help us ask the right questions: <strong>What are the contextual, historical, and power dynamics at play? Who benefits? Who is harmed?</strong>
                </p>
              </div>
            </div>
          )}

          {/* Kenya Context Tab */}
          {activeTab === 'kenya-context' && (
            <div style={{ animation: 'fadeIn 0.3s ease-in-out' }}>
              <h2 style={{ fontSize: '32px', fontWeight: '700', color: '#1a3a52', marginBottom: '30px' }}>
                KESL's Approach in Kenya
              </h2>
              
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1a3a52', marginBottom: '15px' }}>
                  Why This Framework Matters for Kenya
                </h3>
                <p style={{ color: '#475569', lineHeight: '1.7', marginBottom: '20px' }}>
                  Kenya's digital landscape—across Twitter, WhatsApp, Telegram, Reddit, and local platforms—features complex speech that resists simple categorization:
                </p>

                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
                  gap: '20px',
                  marginBottom: '40px'
                }}>
                  <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <p style={{ color: '#1a3a52', fontWeight: '600', fontSize: '14px', margin: '0 0 8px 0' }}>
                      🗣️ Political Contestation
                    </p>
                    <p style={{ color: '#475569', fontSize: '13px', lineHeight: '1.6', margin: 0 }}>
                      Speech challenging power serves democratic function despite appearing "extreme"
                    </p>
                  </div>
                  <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <p style={{ color: '#1a3a52', fontWeight: '600', fontSize: '14px', margin: '0 0 8px 0' }}>
                      📱 Ethnic Dimensions
                    </p>
                    <p style={{ color: '#475569', fontSize: '13px', lineHeight: '1.6', margin: 0 }}>
                      Extreme speech systematically targets minorities and marginalized communities
                    </p>
                  </div>
                  <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <p style={{ color: '#1a3a52', fontWeight: '600', fontSize: '14px', margin: '0 0 8px 0' }}>
                      ⚖️ State Weaponization
                    </p>
                    <p style={{ color: '#475569', fontSize: '13px', lineHeight: '1.6', margin: 0 }}>
                      Risk of "hate speech" accusations used against civil society and dissent
                    </p>
                  </div>
                </div>

                <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1a3a52', marginBottom: '15px' }}>
                  KESL's Mission
                </h3>
                <p style={{ color: '#475569', lineHeight: '1.7', marginBottom: '20px' }}>
                  We document extreme speech patterns across Kenyan platforms through community contributions, contextual analysis, and rights-centered advocacy. We reject Western definitions and center Kenyan voices and epistemologies.
                </p>

                <div style={{ 
                  background: '#f0fdf4', 
                  border: '1px solid #dcfce7', 
                  borderRadius: '8px', 
                  padding: '25px'
                }}>
                  <h4 style={{ color: '#166534', fontWeight: '600', marginBottom: '15px', margin: 0 }}>
                    Research Focus Areas
                  </h4>
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                    gap: '15px',
                    marginTop: '15px'
                  }}>
                    <div style={{ color: '#1e293b', fontSize: '13px', lineHeight: '1.6' }}>
                      <strong>🌐 Platform Mapping</strong><br/>Patterns across smaller digital platforms
                    </div>
                    <div style={{ color: '#1e293b', fontSize: '13px', lineHeight: '1.6' }}>
                      <strong>📊 Content Migration</strong><br/>How content moves between platforms
                    </div>
                    <div style={{ color: '#1e293b', fontSize: '13px', lineHeight: '1.6' }}>
                      <strong>👥 Community Impact</strong><br/>Targeting of minorities and marginalized groups
                    </div>
                    <div style={{ color: '#1e293b', fontSize: '13px', lineHeight: '1.6' }}>
                      <strong>⚖️ Policy Analysis</strong><br/>Legal gaps and moderation failures
                    </div>
                    <div style={{ color: '#1e293b', fontSize: '13px', lineHeight: '1.6' }}>
                      <strong>🎯 Systemic Patterns</strong><br/>Organized campaigns and strategies
                    </div>
                    <div style={{ color: '#1e293b', fontSize: '13px', lineHeight: '1.6' }}>
                      <strong>🛡️ Rights Protection</strong><br/>Evidence for advocacy and accountability
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Citations Section */}
        <div style={{ 
          borderTop: '2px solid #e2e8f0', 
          marginTop: '60px', 
          paddingTop: '60px'
        }}>
          <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1a3a52', marginBottom: '25px' }}>
            Key Sources
          </h3>
          <div style={{ 
            display: 'grid', 
            gap: '20px',
            fontSize: '13px',
            color: '#475569',
            lineHeight: '1.7'
          }}>
            <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '8px' }}>
              <p style={{ margin: 0 }}>
                <strong>Udupa, S. (2023).</strong> Extreme speech. In C. Strippel, S. Paasch-Colberg, M. Emmer, & J. Trebbe (Eds.), <em>Challenges and perspectives of hate speech research</em>. Digital Communication Research. https://doi.org/10.48541/dcr.v12.14
              </p>
            </div>
            <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '8px' }}>
              <p style={{ margin: 0 }}>
                <strong>Katiambo, D. (2021).</strong> It is incivility, not hate speech. In S. Udupa, I. Gagliardone, & P. Hervik (Eds.), <em>Digital hate: The global conjuncture of extreme speech</em>. Indiana University Press.
              </p>
            </div>
            <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '8px' }}>
              <p style={{ margin: 0 }}>
                <strong>Benesch, S. (2013).</strong> Dangerous Speech: A Proposal to Prevent Group Violence. Dangerous Speech Project.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div style={{ 
          textAlign: 'center', 
          marginTop: '60px',
          paddingTop: '40px',
          borderTop: '2px solid #e2e8f0'
        }}>
          <h3 style={{ color: '#1a3a52', fontSize: '20px', marginBottom: '15px' }}>
            Ready to explore?
          </h3>
          <Link href="/lexicon" style={{ textDecoration: 'none' }}>
            <button style={{
              padding: '14px 36px',
              backgroundColor: '#1a3a52',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '15px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#2d5a7b';
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#1a3a52';
              e.target.style.transform = 'translateY(0)';
            }}>
              Explore the KESL Lexicon →
            </button>
          </Link>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}