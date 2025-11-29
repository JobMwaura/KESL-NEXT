'use client';

import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{ backgroundColor: '#1a2332', color: '#e2e8f0' }}>
      {/* Compact Acknowledgments & Citation */}
      <section style={{
        backgroundColor: '#f8fafc',
        borderTop: '2px solid #e2e8f0',
        padding: '40px 20px',
        color: '#1e293b'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '40px' }}>
            {/* Acknowledgments */}
            <div>
              <h3 style={{
                fontSize: '16px',
                color: '#1e293b',
                fontWeight: '700',
                marginBottom: '12px'
              }}>
                Acknowledgments
              </h3>
              
              <div style={{
                backgroundColor: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                padding: '16px'
              }}>
                <p style={{
                  color: '#475569',
                  fontSize: '12px',
                  margin: '0 0 10px 0',
                  lineHeight: '1.6'
                }}>
                  This research received funding from the <strong>European Research Council (ERC)</strong> under <strong>Horizon Europe</strong> (Grant: <strong>101122348</strong>) for <strong>SMALLPLATFORMS</strong>.
                </p>

                <p style={{
                  color: '#64748b',
                  fontSize: '11px',
                  margin: '0',
                  lineHeight: '1.5'
                }}>
                  <strong>Lead:</strong> Dr. Job Mwaura, Kenyan researcher at LMU
                </p>
              </div>
            </div>

            {/* How to Cite */}
            <div>
              <h3 style={{
                fontSize: '16px',
                color: '#1e293b',
                fontWeight: '700',
                marginBottom: '12px'
              }}>
                How to Cite
              </h3>

              <div style={{
                backgroundColor: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                padding: '16px'
              }}>
                <p style={{
                  color: '#475569',
                  fontSize: '11px',
                  margin: '0 0 8px 0',
                  lineHeight: '1.5',
                  fontFamily: 'monospace'
                }}>
                  <strong>Mwaura, J. (2025).</strong> Kenya Extreme Speech Lexicon (KESL). https://kesl-next.vercel.app
                </p>

                <p style={{
                  color: '#64748b',
                  fontSize: '10px',
                  margin: '0',
                  fontStyle: 'italic'
                }}>
                  Include access date and term IDs when citing individual terms.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Footer */}
      <section style={{ padding: '40px 20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '30px',
            marginBottom: '30px'
          }}>
            {/* About */}
            <div>
              <h3 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '12px', color: 'white' }}>
                About KESL
              </h3>
              <p style={{ fontSize: '12px', lineHeight: '1.5', color: '#cbd5e1', margin: 0 }}>
                Documents extreme speech patterns across Kenya's digital platforms.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '12px', color: 'white' }}>
                Navigation
              </h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ marginBottom: '6px' }}>
                  <Link href="/" style={{ color: '#cbd5e1', textDecoration: 'none', fontSize: '12px', transition: 'color 0.2s' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#e2e8f0'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#cbd5e1'}>
                    Home
                  </Link>
                </li>
                <li style={{ marginBottom: '6px' }}>
                  <Link href="/lexicon" style={{ color: '#cbd5e1', textDecoration: 'none', fontSize: '12px', transition: 'color 0.2s' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#e2e8f0'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#cbd5e1'}>
                    Lexicon
                  </Link>
                </li>
                <li style={{ marginBottom: '6px' }}>
                  <Link href="/submit" style={{ color: '#cbd5e1', textDecoration: 'none', fontSize: '12px', transition: 'color 0.2s' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#e2e8f0'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#cbd5e1'}>
                    Submit a Term
                  </Link>
                </li>
                <li>
                  <Link href="/understanding-extreme-speech" style={{ color: '#cbd5e1', textDecoration: 'none', fontSize: '12px', transition: 'color 0.2s' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#e2e8f0'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#cbd5e1'}>
                    Framework
                  </Link>
                </li>
              </ul>
            </div>

            {/* Project */}
            <div>
              <h3 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '12px', color: 'white' }}>
                Project Info
              </h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ marginBottom: '6px' }}>
                  <p style={{ fontSize: '11px', color: '#cbd5e1', margin: 0 }}>
                    <strong>Lead:</strong> Dr. Job Mwaura
                  </p>
                </li>
                <li style={{ marginBottom: '6px' }}>
                  <p style={{ fontSize: '11px', color: '#cbd5e1', margin: 0 }}>
                    <strong>ERC Grant:</strong> 101122348
                  </p>
                </li>
                <li>
                  <p style={{ fontSize: '11px', color: '#cbd5e1', margin: 0 }}>
                    <strong>Program:</strong> Horizon Europe
                  </p>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Footer */}
          <div style={{
            paddingTop: '20px',
            borderTop: '1px solid #2d3e50',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '15px'
          }}>
            <p style={{ fontSize: '11px', color: '#94a3b8', margin: 0 }}>
              © {currentYear} Kenya Extreme Speech Lexicon. All rights reserved.
            </p>
            <p style={{ fontSize: '11px', color: '#94a3b8', margin: 0 }}>
              Supported by <strong style={{ color: '#cbd5e1' }}>ERC</strong> & <strong style={{ color: '#cbd5e1' }}>Horizon Europe</strong>
            </p>
          </div>
        </div>
      </section>
    </footer>
  );
}