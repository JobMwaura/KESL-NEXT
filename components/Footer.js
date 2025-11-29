'use client';

import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{ backgroundColor: '#1a2332', color: '#e2e8f0' }}>
      {/* Acknowledgments Section */}
      <section style={{
        backgroundColor: '#f8fafc',
        borderTop: '2px solid #e2e8f0',
        padding: '60px 20px',
        color: '#1e293b'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {/* Acknowledgments */}
          <div style={{ marginBottom: '60px' }}>
            <h2 style={{
              fontSize: '24px',
              color: '#1e293b',
              fontWeight: '700',
              marginBottom: '20px'
            }}>
              Acknowledgments
            </h2>
            
            <div style={{
              backgroundColor: 'white',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '24px',
              lineHeight: '1.8'
            }}>
              <p style={{
                color: '#475569',
                fontSize: '14px',
                margin: '0 0 16px 0'
              }}>
                This research has received funding from the <strong>European Research Council (ERC)</strong> under the <strong>Horizon Europe</strong> program (Grant Agreement Number: <strong>101122348</strong>) for the project <strong>SMALLPLATFORMS</strong>.
              </p>

              <p style={{
                color: '#475569',
                fontSize: '14px',
                margin: '0 0 16px 0'
              }}>
                Views and opinions expressed are those of the author(s) only and do not necessarily reflect those of the European Union or the European Research Council Executive Agency. Neither the European Union nor the granting authority can be held responsible for them.
              </p>

              <p style={{
                color: '#475569',
                fontSize: '14px',
                margin: '0'
              }}>
                <strong>Project Lead:</strong> Dr. Job Mwaura, Department of Social and Cultural Anthropology, Ludwig Maximilian University of Munich (LMU)
              </p>
            </div>
          </div>

          {/* How to Cite */}
          <div>
            <h2 style={{
              fontSize: '24px',
              color: '#1e293b',
              fontWeight: '700',
              marginBottom: '20px'
            }}>
              How to Cite This Platform
            </h2>

            <div style={{
              backgroundColor: 'white',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '24px'
            }}>
              <p style={{
                color: '#475569',
                fontSize: '14px',
                marginBottom: '16px'
              }}>
                If you use data, terms, or content from the Kenya Extreme Speech Lexicon in your research, please cite it as:
              </p>

              <div style={{
                backgroundColor: '#f8fafc',
                border: '1px solid #cbd5e1',
                borderLeft: '4px solid #2d5a7b',
                padding: '16px',
                borderRadius: '6px',
                fontFamily: 'monospace',
                fontSize: '13px',
                color: '#1e293b',
                lineHeight: '1.6',
                overflowX: 'auto'
              }}>
                <p style={{ margin: 0 }}>
                  Mwaura, J. (2025). Kenya Extreme Speech Lexicon (KESL):<br />
                  Documentation of extreme speech patterns across<br />
                  Kenya's digital platforms. Retrieved from<br />
                  https://kesl-next.vercel.app
                </p>
              </div>

              <p style={{
                color: '#64748b',
                fontSize: '12px',
                margin: '12px 0 0 0',
                fontStyle: 'italic'
              }}>
                Note: Include access date and specific term IDs when citing individual terms.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Footer */}
      <section style={{ padding: '60px 20px', borderTop: '1px solid #2d3e50' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '40px',
            marginBottom: '50px'
          }}>
            {/* About */}
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px', color: 'white' }}>
                About KESL
              </h3>
              <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#cbd5e1', margin: 0 }}>
                Kenya Extreme Speech Lexicon documents and analyzes extreme speech patterns across Kenya's digital platforms, from mainstream social media to smaller decentralized networks.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px', color: 'white' }}>
                Navigation
              </h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ marginBottom: '10px' }}>
                  <Link href="/" style={{ color: '#cbd5e1', textDecoration: 'none', fontSize: '14px', transition: 'color 0.2s' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#e2e8f0'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#cbd5e1'}>
                    Home
                  </Link>
                </li>
                <li style={{ marginBottom: '10px' }}>
                  <Link href="/lexicon" style={{ color: '#cbd5e1', textDecoration: 'none', fontSize: '14px', transition: 'color 0.2s' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#e2e8f0'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#cbd5e1'}>
                    Lexicon
                  </Link>
                </li>
                <li style={{ marginBottom: '10px' }}>
                  <Link href="/submit" style={{ color: '#cbd5e1', textDecoration: 'none', fontSize: '14px', transition: 'color 0.2s' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#e2e8f0'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#cbd5e1'}>
                    Submit a Term
                  </Link>
                </li>
                <li>
                  <Link href="/understanding-extreme-speech" style={{ color: '#cbd5e1', textDecoration: 'none', fontSize: '14px', transition: 'color 0.2s' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#e2e8f0'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#cbd5e1'}>
                    Conceptual Framework
                  </Link>
                </li>
              </ul>
            </div>

            {/* Project */}
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px', color: 'white' }}>
                Project Info
              </h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ marginBottom: '10px' }}>
                  <p style={{ fontSize: '13px', color: '#cbd5e1', margin: 0 }}>
                    <strong>Lead:</strong> Dr. Job Mwaura
                  </p>
                </li>
                <li style={{ marginBottom: '10px' }}>
                  <p style={{ fontSize: '13px', color: '#cbd5e1', margin: 0 }}>
                    <strong>Institution:</strong> LMU Munich
                  </p>
                </li>
                <li style={{ marginBottom: '10px' }}>
                  <p style={{ fontSize: '13px', color: '#cbd5e1', margin: 0 }}>
                    <strong>Funded by:</strong> European Research Council
                  </p>
                </li>
                <li>
                  <p style={{ fontSize: '13px', color: '#cbd5e1', margin: 0 }}>
                    <strong>Grant:</strong> 101122348
                  </p>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Footer */}
          <div style={{
            paddingTop: '30px',
            borderTop: '1px solid #2d3e50',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '20px'
          }}>
            <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>
              © {currentYear} Kenya Extreme Speech Lexicon (KESL). All rights reserved.
            </p>
            <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>
              Supported by <strong style={{ color: '#cbd5e1' }}>Horizon Europe</strong> & <strong style={{ color: '#cbd5e1' }}>European Research Council</strong>
            </p>
          </div>
        </div>
      </section>
    </footer>
  );
}