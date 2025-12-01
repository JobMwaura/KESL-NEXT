/**
 * app/lexicon/[id]/versions/page.js
 * Full version history page for a term
 * Shows timeline, details, and comparison functionality
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import VersionTimeline from '@/components/VersionTimeline';
import VersionComparison from '@/components/VersionComparison';
import VersionSelector from '@/components/VersionSelector';
import { getTermWithVersions, compareVersions, formatVersionsList } from '@/lib/supabase-phase-6';

export default function VersionHistoryPage() {
  const params = useParams();
  const router = useRouter();
  const termId = params.id;

  const [term, setTerm] = useState(null);
  const [versions, setVersions] = useState([]);
  const [selectedVersion, setSelectedVersion] = useState(null);
  const [selectedSecondVersion, setSelectedSecondVersion] = useState(null);
  const [comparison, setComparison] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch term and versions
  useEffect(() => {
    loadTermWithVersions();
  }, [termId]);

  const loadTermWithVersions = async () => {
    try {
      setLoading(true);
      setError(null);

      const { term: termData, versions: versionsData, error: fetchError } =
        await getTermWithVersions(termId);

      if (fetchError) {
        setError('Failed to load term history');
        return;
      }

      setTerm(termData);
      const formattedVersions = formatVersionsList(versionsData);
      setVersions(formattedVersions);

      // Set first version as selected
      if (formattedVersions.length > 0) {
        setSelectedVersion(formattedVersions[formattedVersions.length - 1]);
      }
    } catch (err) {
      console.error('Error loading term:', err);
      setError('An error occurred while loading the term');
    } finally {
      setLoading(false);
    }
  };

  // Handle version selection
  const handleVersionSelect = (version) => {
    setSelectedVersion(version);
    setComparison(null);
  };

  const handleSecondVersionSelect = (version) => {
    setSelectedSecondVersion(version);
  };

  // Compare two versions
  const handleCompare = async () => {
    if (!selectedVersion || !selectedSecondVersion) {
      setError('Please select two versions to compare');
      return;
    }

    try {
      setError(null);
      const { v1, v2, diff, error: compareError } = await compareVersions(
        termId,
        selectedVersion.number,
        selectedSecondVersion.number
      );

      if (compareError) {
        setError('Failed to compare versions');
        return;
      }

      setComparison({ v1, v2, diff });
    } catch (err) {
      console.error('Error comparing versions:', err);
      setError('An error occurred while comparing versions');
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '40px 20px', textAlign: 'center' }}>
        <div style={{ fontSize: '16px', color: '#64748b' }}>
          Loading version history...
        </div>
      </div>
    );
  }

  if (error && !term) {
    return (
      <div style={{ padding: '40px 20px' }}>
        <div
          style={{
            padding: '16px',
            backgroundColor: '#fee2e2',
            border: '1px solid #fca5a5',
            borderRadius: '6px',
            color: '#991b1b'
          }}
        >
          {error}
        </div>
      </div>
    );
  }

  const breadcrumbPath = `Home > Lexicon > ${term?.term || 'Term'} > Version History`;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      {/* Breadcrumb */}
      <div
        style={{
          padding: '16px 20px',
          backgroundColor: 'white',
          borderBottom: '1px solid #e2e8f0',
          fontSize: '13px',
          color: '#64748b'
        }}
      >
        <button
          onClick={() => router.back()}
          style={{
            background: 'none',
            border: 'none',
            color: '#0284c7',
            cursor: 'pointer',
            fontSize: '13px',
            marginRight: '8px'
          }}
        >
          ← Back
        </button>
        {breadcrumbPath}
      </div>

      {/* Header */}
      <div style={{ padding: '24px 20px', backgroundColor: 'white', borderBottom: '1px solid #e2e8f0' }}>
        <h1
          style={{
            margin: '0 0 8px 0',
            fontSize: '28px',
            fontWeight: '700',
            color: '#1e293b'
          }}
        >
          {term?.term || 'Unknown Term'}
        </h1>
        <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>
          Version History ({versions.length} version{versions.length !== 1 ? 's' : ''})
        </p>
      </div>

      {/* Main Content */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(280px, 350px) 1fr',
          gap: '24px',
          padding: '24px 20px',
          maxWidth: '1400px',
          margin: '0 auto'
        }}
      >
        {/* Left: Timeline */}
        <div>
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              overflow: 'hidden'
            }}
          >
            <div
              style={{
                padding: '16px',
                backgroundColor: '#f8fafc',
                borderBottom: '1px solid #e2e8f0',
                fontWeight: '600',
                fontSize: '13px',
                color: '#475569'
              }}
            >
              📅 Timeline
            </div>
            <VersionTimeline
              versions={versions}
              currentVersionNumber={term?.version_number}
              onVersionSelect={handleVersionSelect}
              sticky={true}
            />
          </div>
        </div>

        {/* Right: Details & Comparison */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Error Message */}
          {error && (
            <div
              style={{
                padding: '12px 16px',
                backgroundColor: '#fee2e2',
                border: '1px solid #fca5a5',
                borderRadius: '6px',
                color: '#991b1b',
                fontSize: '13px'
              }}
            >
              {error}
            </div>
          )}

          {/* Version Details */}
          {selectedVersion && (
            <div
              style={{
                backgroundColor: 'white',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                padding: '20px',
                overflow: 'hidden'
              }}
            >
              <h2
                style={{
                  margin: '0 0 16px 0',
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#1e293b'
                }}
              >
                {selectedVersion.label}
                {selectedVersion.number === term?.version_number && (
                  <span
                    style={{
                      marginLeft: '8px',
                      padding: '2px 6px',
                      backgroundColor: '#dcfce7',
                      color: '#166534',
                      borderRadius: '3px',
                      fontSize: '11px',
                      fontWeight: '600'
                    }}
                  >
                    CURRENT
                  </span>
                )}
              </h2>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>
                    Date
                  </div>
                  <div style={{ fontSize: '14px', color: '#1e293b', fontWeight: '500' }}>
                    {selectedVersion.dateFormatted} {selectedVersion.timeFormatted}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>
                    Contributor
                  </div>
                  <div style={{ fontSize: '14px', color: '#1e293b', fontWeight: '500' }}>
                    {selectedVersion.contributor}
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>
                  Type
                </div>
                <span
                  style={{
                    display: 'inline-block',
                    padding: '4px 8px',
                    backgroundColor: '#dbeafe',
                    color: '#0c4a6e',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: '600'
                  }}
                >
                  {formatContributionType(selectedVersion.type)}
                </span>
              </div>

              {selectedVersion.changes && (
                <div
                  style={{
                    padding: '12px',
                    backgroundColor: '#f1f5f9',
                    borderLeft: '3px solid #0284c7',
                    borderRadius: '4px',
                    fontSize: '13px',
                    color: '#475569'
                  }}
                >
                  <strong style={{ color: '#1e293b' }}>Changes:</strong>
                  <br />
                  {selectedVersion.changes}
                </div>
              )}
            </div>
          )}

          {/* Comparison Section */}
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              padding: '20px'
            }}
          >
            <h2
              style={{
                margin: '0 0 16px 0',
                fontSize: '16px',
                fontWeight: '600',
                color: '#1e293b'
              }}
            >
              🔍 Compare Versions
            </h2>

            <VersionSelector
              versions={versions}
              currentVersion={term?.version_number}
              selectedVersion={selectedSecondVersion}
              onSelect={handleSecondVersionSelect}
              label="Compare To"
              allowMultiple={false}
            />

            <button
              onClick={handleCompare}
              disabled={!selectedVersion || !selectedSecondVersion}
              style={{
                marginTop: '16px',
                padding: '10px 16px',
                backgroundColor: selectedVersion && selectedSecondVersion ? '#0284c7' : '#cbd5e1',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: selectedVersion && selectedSecondVersion ? 'pointer' : 'not-allowed',
                fontSize: '13px',
                fontWeight: '600',
                transition: 'background 0.2s ease'
              }}
            >
              Show Differences
            </button>

            {comparison && (
              <div style={{ marginTop: '20px' }}>
                <VersionComparison
                  versionA={comparison.v1}
                  versionB={comparison.v2}
                  diff={comparison.diff}
                />
              </div>
            )}
          </div>

          {/* Snapshot View */}
          {selectedVersion?.snapshot && (
            <div
              style={{
                backgroundColor: 'white',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                padding: '20px'
              }}
            >
              <h2
                style={{
                  margin: '0 0 16px 0',
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#1e293b'
                }}
              >
                📋 Full Snapshot
              </h2>

              <pre
                style={{
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  padding: '12px',
                  overflow: 'auto',
                  fontSize: '12px',
                  color: '#1e293b',
                  lineHeight: '1.4'
                }}
              >
                {JSON.stringify(selectedVersion.snapshot, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Layout */}
      <style jsx>{`
        @media (max-width: 1024px) {
          div {
            --grid-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

/**
 * Format contribution type for display
 */
function formatContributionType(type = 'edit') {
  const typeMap = {
    initial: 'Initial Documentation',
    example_added: 'Example Added',
    context_added: 'Context Added',
    harm_documented: 'Harm Documented',
    variant_added: 'Variant Added',
    related_term_added: 'Related Term Added',
    edit: 'General Edit',
    rollback: 'Rollback'
  };

  return typeMap[type] || type;
}