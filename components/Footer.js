'use client';

import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{ backgroundColor: '#1a2332', color: '#e2e8f0' }}>
      {/* Acknowledgments & Citation Section */}
      <section style={{
        backgroundColor: '#f8fafc',
        borderTop: '2px solid #e2e8f0',
        padding: '50px 20px',
        color: '#1e293b'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '40px' }}>
            {/* Acknowledgments */}
            <div>
              <h3 style={{
                fontSize: '18px',
                color: '#1e293b',
                fontWeight: '700',
                marginBottom: '16px'
              }}>
                Acknowledgments
              </h3>
              
              <div style={{
                backgroundColor: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '20px'
              }}>
                <p style={{
                  color: '#475569',
                  fontSize: '13px',
                  margin: '0 0 12px 0',
                  lineHeight: '1.7'
                }}>
                  This research has received funding from the <strong>European Research Council (ERC)</strong> under the <strong>Horizon Europe</strong> program (Grant: <strong>101122348</strong>) for the project <strong>SMALLPLATFORMS</strong>. The project is led by <strong>Prof. Sahana Udupa</strong> and based at <strong>Ludwig Maximilian University of Munich (LMU)</strong>.
                </p>

                <p style={{
                  color: '#475569',
                  fontSize: '13px',
                  margin: '0',
                  lineHeight: '1.7'
                }}>
                  <strong>Project Researcher:</strong> Dr. Job Mwaura, Kenyan researcher at LMU Department of Social and Cultural Anthropology
                </p>
              </div>
            </div>

            {/* How to Cite */}
            <div>
              <h3 style={{
                fontSize: '18px',
                color: '#1e293b',
                fontWeight: '700',
                marginBottom: '16px'
              }}>
                How to Cite
              </h3>

              <div style={{
                backgroundColor: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '20px'
              }}>
                <p style={{
                  color: '#475569',
                  fontSize: '13px',
                  margin: '0 0 12px 0',
                  lineHeight: '1.7'
                }}>
                  If you use data, terms, or content from the Kenya Extreme Speech Lexicon in your research, please cite it as:
                </p>

                <div style={{
                  backgroundColor: '#f8fafc',
                  border: '1px solid #cbd5e1',
                  borderLeft: '4px solid #2d5a7b',
                  padding: '14px',
                  borderRadius: '6px',
                  fontFamily: 'monospace',
                  fontSize: '12px',
                  color: '#1e293b',
                  lineHeight: '1.6',
                  marginBottom: '12px'
                }}>
                  <p style={{ margin: 0 }}>
                    Mwaura, J. (2025). Kenya Extreme Speech Lexicon (KESL): Documentation of extreme speech patterns across Kenya's digital platforms. Retrieved from https://kesl-next.vercel.app
                  </p>
                </div>

                <p style={{
                  color: '#64748b',
                  fontSize: '12px',
                  margin: '0',
                  fontStyle: 'italic'
                }}>
                  Include access date and specific term IDs when citing individual terms.
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
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '30px',
            marginBottom: '30px'
          }}>
            {/* About */}
            <div>
              <h3 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '12px', color: 'white' }}>
                About KESL
              </h3>
              <p style={{ fontSize: '13px', lineHeight: '1.6', color: '#cbd5e1', margin: 0 }}>
                Documents extreme speech patterns across Kenya's digital platforms.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '12px', color: 'white' }}>
                Navigation
              </h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ marginBottom: '8px' }}>
                  <Link href="/" style={{ color: '#cbd5e1', textDecoration: 'none', fontSize: '13px', transition: 'color 0.2s' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#e2e8f0'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#cbd5e1'}>
                    Home
                  </Link>
                </li>
                <li style={{ marginBottom: '8px' }}>
                  <Link href="/lexicon" style={{ color: '#cbd5e1', textDecoration: 'none', fontSize: '13px', transition: 'color 0.2s' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#e2e8f0'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#cbd5e1'}>
                    Lexicon
                  </Link>
                </li>
                <li style={{ marginBottom: '8px' }}>
                  <Link href="/submit" style={{ color: '#cbd5e1', textDecoration: 'none', fontSize: '13px', transition: 'color 0.2s' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#e2e8f0'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#cbd5e1'}>
                    Submit a Term
                  </Link>
                </li>
                <li>
                  <Link href="/understanding-extreme-speech" style={{ color: '#cbd5e1', textDecoration: 'none', fontSize: '13px', transition: 'color 0.2s' }}
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
                <li style={{ marginBottom: '8px' }}>
                  <p style={{ fontSize: '12px', color: '#cbd5e1', margin: 0 }}>
                    <strong>Project Lead:</strong> Prof. Sahana Udupa
                  </p>
                </li>
                <li style={{ marginBottom: '8px' }}>
                  <p style={{ fontSize: '12px', color: '#cbd5e1', margin: 0 }}>
                    <strong>Researcher:</strong> Dr. Job Mwaura
                  </p>
                </li>
                <li style={{ marginBottom: '8px' }}>
                  <p style={{ fontSize: '12px', color: '#cbd5e1', margin: 0 }}>
                    <strong>Institution:</strong> LMU Munich
                  </p>
                </li>
                <li>
                  <p style={{ fontSize: '12px', color: '#cbd5e1', margin: 0 }}>
                    <strong>ERC Grant:</strong> 101122348
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
            <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>
              © {currentYear} Kenya Extreme Speech Lexicon. All rights reserved.
            </p>
            <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>
              Supported by <strong style={{ color: '#cbd5e1' }}>ERC</strong> & <strong style={{ color: '#cbd5e1' }}>Horizon Europe</strong>
            </p>
          </div>
        </div>
      </section>
    </footer>
  );
}