/**
 * lib/supabase-phase-6.js
 * Version history tracking functions for KESL
 * Handles creating, retrieving, comparing, and rolling back term versions
 */

import { supabase } from './supabase';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CREATE VERSION
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Create a new version record when contribution is approved
 * Called from approveTerm() in lib/supabase.js
 * 
 * @param {string} termId - Term UUID
 * @param {object} currentTerm - Current complete term data
 * @param {string} contributionType - Type of contribution (e.g., 'harm_documented')
 * @param {string} changesSummary - Human-readable summary of changes
 * @param {string} contributorId - Auth UUID of who approved
 * @param {string} contributorName - Display name
 * @returns {Promise<{data, error}>}
 */
export async function createVersion(
  termId,
  currentTerm,
  contributionType = 'edit',
  changesSummary = 'Term updated',
  contributorId = null,
  contributorName = 'Admin'
) {
  try {
    // Get current version number to increment
    const { data: lastVersion } = await supabase
      .from('term_versions')
      .select('version_number')
      .eq('term_id', termId)
      .order('version_number', { ascending: false })
      .limit(1)
      .single();

    const nextVersionNumber = (lastVersion?.version_number || 0) + 1;
    const versionLabel = `v${nextVersionNumber}`;

    // Create version record
    const { data, error } = await supabase
      .from('term_versions')
      .insert({
        term_id: termId,
        version_number: nextVersionNumber,
        version_label: versionLabel,
        changes_summary: changesSummary,
        contribution_type: contributionType,
        contributed_by: contributorId,
        contributor_name: contributorName,
        term_snapshot: currentTerm,
        created_at: new Date().toISOString()
      })
      .select();

    if (error) {
      console.error('Error creating version:', error);
      return { data: null, error };
    }

    // Update terms table with new version number
    await supabase
      .from('terms')
      .update({
        version_number: nextVersionNumber,
        version_created_at: new Date().toISOString()
      })
      .eq('id', termId);

    return { data, error: null };
  } catch (err) {
    console.error('Error in createVersion:', err);
    return { data: null, error: err };
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// FETCH TERM WITH VERSIONS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Fetch term with complete version history
 * @param {string} termId - Term UUID
 * @returns {Promise<{term, versions, error}>}
 */
export async function getTermWithVersions(termId) {
  try {
    // Get current term
    const { data: term, error: termError } = await supabase
      .from('terms')
      .select('*')
      .eq('id', termId)
      .single();

    if (termError) {
      console.error('Error fetching term:', termError);
      return { term: null, versions: [], error: termError };
    }

    // Get all versions
    const { data: versions, error: versionsError } = await supabase
      .from('term_versions')
      .select('*')
      .eq('term_id', termId)
      .order('version_number', { ascending: true });

    if (versionsError) {
      console.error('Error fetching versions:', versionsError);
      return { term, versions: [], error: versionsError };
    }

    return { term, versions: versions || [], error: null };
  } catch (err) {
    console.error('Error in getTermWithVersions:', err);
    return { term: null, versions: [], error: err };
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// COMPARE VERSIONS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Compare two versions and return field-level differences
 * @param {string} termId - Term UUID
 * @param {number} v1Number - First version number (e.g., 1)
 * @param {number} v2Number - Second version number (e.g., 2)
 * @returns {Promise<{v1, v2, diff, error}>}
 */
export async function compareVersions(termId, v1Number, v2Number) {
  try {
    // Get both versions
    const { data: versions, error: versionError } = await supabase
      .from('term_versions')
      .select('*')
      .eq('term_id', termId)
      .in('version_number', [v1Number, v2Number])
      .order('version_number', { ascending: true });

    if (versionError) {
      return { v1: null, v2: null, diff: null, error: versionError };
    }

    if (!versions || versions.length < 2) {
      return {
        v1: versions?.[0] || null,
        v2: null,
        diff: null,
        error: 'Both versions not found'
      };
    }

    const v1 = versions[0];
    const v2 = versions[1];
    const diff = computeDiff(v1.term_snapshot, v2.term_snapshot);

    return { v1, v2, diff, error: null };
  } catch (err) {
    console.error('Error in compareVersions:', err);
    return { v1: null, v2: null, diff: null, error: err };
  }
}

/**
 * Compute differences between two term snapshots
 * Returns object with field-level changes
 * @param {object} oldSnapshot - Previous term snapshot
 * @param {object} newSnapshot - New term snapshot
 * @returns {object} Diff object
 */
function computeDiff(oldSnapshot = {}, newSnapshot = {}) {
  const diff = {
    added: {},
    removed: {},
    modified: {}
  };

  const allKeys = new Set([
    ...Object.keys(oldSnapshot),
    ...Object.keys(newSnapshot)
  ]);

  allKeys.forEach(key => {
    const oldValue = oldSnapshot[key];
    const newValue = newSnapshot[key];

    if (oldValue === undefined && newValue !== undefined) {
      // Added
      diff.added[key] = newValue;
    } else if (oldValue !== undefined && newValue === undefined) {
      // Removed
      diff.removed[key] = oldValue;
    } else if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
      // Modified
      diff.modified[key] = { old: oldValue, new: newValue };
    }
  });

  return diff;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ROLLBACK VERSION (ADMIN ONLY)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Rollback term to a previous version (creates new version)
 * ADMIN ONLY
 * 
 * @param {string} termId - Term UUID
 * @param {number} versionNumber - Version to rollback to
 * @param {string} adminId - Admin auth UUID
 * @returns {Promise<{data, error}>}
 */
export async function rollbackToVersion(
  termId,
  versionNumber,
  adminId = null
) {
  try {
    // Get the version to rollback to
    const { data: rollbackVersion, error: fetchError } = await supabase
      .from('term_versions')
      .select('*')
      .eq('term_id', termId)
      .eq('version_number', versionNumber)
      .single();

    if (fetchError || !rollbackVersion) {
      return { data: null, error: 'Version not found' };
    }

    // Get current version number
    const { data: latestVersion } = await supabase
      .from('term_versions')
      .select('version_number')
      .eq('term_id', termId)
      .order('version_number', { ascending: false })
      .limit(1)
      .single();

    const nextVersionNumber = (latestVersion?.version_number || 0) + 1;

    // Create new version with rollback snapshot
    const { data, error } = await supabase
      .from('term_versions')
      .insert({
        term_id: termId,
        version_number: nextVersionNumber,
        version_label: `v${nextVersionNumber}`,
        changes_summary: `Rollback to v${versionNumber}`,
        contribution_type: 'rollback',
        contributed_by: adminId,
        contributor_name: 'Admin Rollback',
        term_snapshot: rollbackVersion.term_snapshot,
        created_at: new Date().toISOString()
      })
      .select();

    if (error) {
      console.error('Error rolling back version:', error);
      return { data: null, error };
    }

    // Update terms table with rollback snapshot
    const { error: updateError } = await supabase
      .from('terms')
      .update({
        ...rollbackVersion.term_snapshot,
        version_number: nextVersionNumber,
        version_created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', termId);

    if (updateError) {
      console.error('Error updating term:', updateError);
      return { data: null, error: updateError };
    }

    return { data, error: null };
  } catch (err) {
    console.error('Error in rollbackToVersion:', err);
    return { data: null, error: err };
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// GET SINGLE VERSION
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Get a specific version by number
 * @param {string} termId - Term UUID
 * @param {number} versionNumber - Version number to fetch
 * @returns {Promise<{data, error}>}
 */
export async function getVersion(termId, versionNumber) {
  try {
    const { data, error } = await supabase
      .from('term_versions')
      .select('*')
      .eq('term_id', termId)
      .eq('version_number', versionNumber)
      .single();

    return { data, error };
  } catch (err) {
    console.error('Error in getVersion:', err);
    return { data: null, error: err };
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// GET VERSION COUNT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Get total number of versions for a term
 * @param {string} termId - Term UUID
 * @returns {Promise<{count, error}>}
 */
export async function getVersionCount(termId) {
  try {
    const { count, error } = await supabase
      .from('term_versions')
      .select('*', { count: 'exact', head: true })
      .eq('term_id', termId);

    return { count: count || 0, error };
  } catch (err) {
    console.error('Error in getVersionCount:', err);
    return { count: 0, error: err };
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// HELPER: Format version info for display
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Format version object for display
 * @param {object} version - Version record from database
 * @returns {object} Formatted version
 */
export function formatVersionForDisplay(version) {
  if (!version) return null;

  return {
    id: version.id,
    number: version.version_number,
    label: version.version_label || `v${version.version_number}`,
    date: new Date(version.created_at),
    dateFormatted: new Date(version.created_at).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }),
    timeFormatted: new Date(version.created_at).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    }),
    contributor: version.contributor_name || 'Unknown',
    type: version.contribution_type || 'edit',
    changes: version.changes_summary || 'Term updated',
    snapshot: version.term_snapshot
  };
}

/**
 * Get formatted versions list
 * @param {array} versions - Array of version records
 * @returns {array} Formatted versions
 */
export function formatVersionsList(versions = []) {
  return versions.map(formatVersionForDisplay);
}

export default {
  createVersion,
  getTermWithVersions,
  compareVersions,
  rollbackToVersion,
  getVersion,
  getVersionCount,
  formatVersionForDisplay,
  formatVersionsList
};