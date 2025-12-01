// Supabase Client Configuration with PHASE 5: Auto-Merge + PHASE 6: Version Tracking
// Complete version for lib/supabase.js
// UPDATED: Fixed fetchApprovedTerms for case-insensitive filtering

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Supabase credentials not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local'
  );
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);

// ============================================================================
// TERM SUBMISSION FUNCTIONS (Enhanced)
// ============================================================================

/**
 * Insert a complete term with examples and harms
 */
export async function insertTerm(termData) {
  try {
    const confidence = calculateConfidence(termData.examples);

    const insertData = {
      term: termData.term.trim(),
      variants: termData.variants || [],
      meaning: termData.meaning.trim(),
      literal_gloss: termData.literal_gloss || null,
      category: termData.category.toLowerCase(),
      risk: termData.risk.toLowerCase(),
      language: termData.language.toLowerCase(),
      examples: termData.examples || [],
      harms: termData.harms || {},
      harm_details: termData.harm_details || {},
      confidence_level: confidence,
      status: 'pending',
      version_number: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    console.log('Inserting term:', {
      term: insertData.term,
      examples: insertData.examples.length,
      harms: Object.keys(insertData.harms).length,
      confidence: confidence
    });

    const { data, error } = await supabase
      .from('terms')
      .insert([insertData])
      .select();

    if (error) {
      console.error('Insert error:', error);
      throw new Error(`Failed to insert term: ${error.message}`);
    }

    console.log('Term inserted successfully:', data[0].id);
    return data[0];

  } catch (error) {
    console.error('insertTerm error:', error);
    throw error;
  }
}

/**
 * Check if a term variant already exists
 */
export async function checkVariantMatch(term) {
  try {
    if (!term || term.trim().length < 2) {
      return [];
    }

    const { data, error } = await supabase
      .from('terms')
      .select('id, term, variants, status')
      .eq('status', 'approved');

    if (error) {
      console.error('Variant check error:', error);
      return [];
    }

    if (!data || data.length === 0) {
      return [];
    }

    const similarity = 0.8;
    const matches = [];

    data.forEach(existingTerm => {
      const distance = levenshteinDistance(
        term.toLowerCase(),
        existingTerm.term.toLowerCase()
      );

      const maxLen = Math.max(term.length, existingTerm.term.length);
      const ratio = 1 - distance / maxLen;

      if (ratio >= similarity) {
        matches.push({
          id: existingTerm.id,
          term: existingTerm.term,
          variants: existingTerm.variants || [],
          similarity: (ratio * 100).toFixed(1)
        });
      }
    });

    if (matches.length > 0) {
      console.log('Found variant matches:', matches.length);
    }

    return matches;

  } catch (error) {
    console.error('checkVariantMatch error:', error);
    return [];
  }
}

/**
 * Add an example to a term (for ContributeModal)
 */
export async function addExample(termId, data) {
  try {
    if (!data.quote || !data.platform || !data.date_observed) {
      throw new Error('Quote, platform, and date are required');
    }
    if (data.quote.length > 100) {
      throw new Error('Quote must be 100 characters or less');
    }

    const contributionData = {
      term_id: termId,
      type: 'example',
      status: 'pending',
      data: {
        quote: data.quote.trim(),
        platform: data.platform.trim(),
        date_observed: data.date_observed,
        source_url: data.source_url || null
      },
      created_at: new Date().toISOString()
    };

    console.log('Submitting example contribution for term:', termId);

    const { data: result, error } = await supabase
      .from('moderation_queue')
      .insert([contributionData])
      .select();

    if (error) {
      console.error('Submit example error:', error);
      throw new Error(`Failed to submit example: ${error.message}`);
    }

    console.log('Example submitted for review:', result[0].id);
    return result[0];

  } catch (error) {
    console.error('addExample error:', error);
    throw error;
  }
}

/**
 * Add context to a term (for ContributeModal)
 */
export async function addContext(termId, data) {
  try {
    if (!data.context || data.context.length < 50) {
      throw new Error('Context must be at least 50 characters');
    }

    const contributionData = {
      term_id: termId,
      type: 'context',
      status: 'pending',
      data: {
        context: data.context.trim()
      },
      created_at: new Date().toISOString()
    };

    console.log('Submitting context contribution for term:', termId);

    const { data: result, error } = await supabase
      .from('moderation_queue')
      .insert([contributionData])
      .select();

    if (error) {
      console.error('Submit context error:', error);
      throw new Error(`Failed to submit context: ${error.message}`);
    }

    console.log('Context submitted for review:', result[0].id);
    return result[0];

  } catch (error) {
    console.error('addContext error:', error);
    throw error;
  }
}

/**
 * Add harm documentation to a term (for ContributeModal)
 */
export async function addHarm(termId, data) {
  try {
    const validTypes = ['normalizes_contempt', 'primes_exclusion', 'cues_violence', 'harasses', 'other'];
    if (!validTypes.includes(data.harm_type)) {
      throw new Error(`Invalid harm type. Must be one of: ${validTypes.join(', ')}`);
    }
    if (!data.harm_description || data.harm_description.length < 30) {
      throw new Error('Harm description must be at least 30 characters');
    }

    const contributionData = {
      term_id: termId,
      type: 'harm',
      status: 'pending',
      data: {
        harm_type: data.harm_type,
        harm_description: data.harm_description.trim(),
        targeted_groups: data.targeted_groups || null
      },
      created_at: new Date().toISOString()
    };

    console.log('Submitting harm contribution for term:', termId);

    const { data: result, error } = await supabase
      .from('moderation_queue')
      .insert([contributionData])
      .select();

    if (error) {
      console.error('Submit harm error:', error);
      throw new Error(`Failed to submit harm: ${error.message}`);
    }

    console.log('Harm submitted for review:', result[0].id);
    return result[0];

  } catch (error) {
    console.error('addHarm error:', error);
    throw error;
  }
}

/**
 * Add a related term relationship (for ContributeModal)
 */
export async function addRelatedTerm(termId, data) {
  try {
    const validTypes = ['variant_of', 'similar_to', 'evolved_from', 'evolved_to', 'related'];
    if (!validTypes.includes(data.relation_type)) {
      throw new Error(`Invalid relation type. Must be one of: ${validTypes.join(', ')}`);
    }
    if (!data.related_term_id) {
      throw new Error('Related term ID is required');
    }

    const contributionData = {
      term_id: termId,
      type: 'relation',
      status: 'pending',
      data: {
        related_term_id: data.related_term_id.trim(),
        relation_type: data.relation_type
      },
      created_at: new Date().toISOString()
    };

    console.log('Submitting relation contribution for term:', termId);

    const { data: result, error } = await supabase
      .from('moderation_queue')
      .insert([contributionData])
      .select();

    if (error) {
      console.error('Submit relation error:', error);
      throw new Error(`Failed to submit relation: ${error.message}`);
    }

    console.log('Relation submitted for review:', result[0].id);
    return result[0];

  } catch (error) {
    console.error('addRelatedTerm error:', error);
    throw error;
  }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export function calculateConfidence(examples) {
  if (!examples || examples.length === 0) return 'low';

  const platformCount = new Set(examples.map(ex => ex.platform)).size;
  const exampleCount = examples.length;

  if (exampleCount >= 4 && platformCount >= 2) {
    return 'high';
  } else if (exampleCount >= 2) {
    return 'medium';
  } else {
    return 'low';
  }
}

function levenshteinDistance(a, b) {
  const matrix = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

// ============================================================================
// FETCH & READ FUNCTIONS
// ============================================================================

/**
 * UPDATED: Case-insensitive filtering for risk levels
 * Handles capitalized risk levels like 'High', 'Medium', 'Low'
 */
export async function fetchApprovedTerms(filters = {}) {
  try {
    let query = supabase
      .from('terms')
      .select('*')
      .eq('status', 'approved')
      .order('created_at', { ascending: false });

    if (filters.category) {
      // Case-insensitive category filter
      query = query.ilike('category', `%${filters.category}%`);
    }
    
    if (filters.risk) {
      // Case-insensitive risk filter to handle 'High', 'Medium', 'Low'
      query = query.ilike('risk', `%${filters.risk}%`);
    }
    
    if (filters.language) {
      // Case-insensitive language filter
      query = query.ilike('language', `%${filters.language}%`);
    }

    const { data, error } = await query;
    
    if (error) {
      console.error('fetchApprovedTerms error:', error);
      throw error;
    }
    
    console.log(`✓ Fetched ${data?.length || 0} approved terms`);
    return data || [];
    
  } catch (error) {
    console.error('❌ Error in fetchApprovedTerms:', error);
    throw error;
  }
}

export async function fetchTermById(id) {
  const { data, error } = await supabase
    .from('terms')
    .select('*')
    .eq('id', id)
    .eq('status', 'approved')
    .single();

  if (error) throw error;
  return data;
}

export async function fetchPendingTerms() {
  const { data, error } = await supabase
    .from('terms')
    .select('*')
    .eq('status', 'pending');

  if (error) throw error;
  return data;
}

// ============================================================================
// MODERATION FUNCTIONS
// ============================================================================

export async function approveModerationItem(itemId) {
  try {
    const { data: item, error: fetchError } = await supabase
      .from('moderation_queue')
      .select('*')
      .eq('id', itemId)
      .single();

    if (fetchError) throw fetchError;

    const { error: updateError } = await supabase
      .from('moderation_queue')
      .update({
        status: 'approved',
        approved_at: new Date().toISOString()
      })
      .eq('id', itemId);

    if (updateError) throw updateError;

    console.log('Contribution approved:', itemId);
    return item;

  } catch (error) {
    console.error('approveModerationItem error:', error);
    throw error;
  }
}

export async function rejectModerationItem(itemId, reason) {
  try {
    const { data, error } = await supabase
      .from('moderation_queue')
      .update({
        status: 'rejected',
        rejection_reason: reason,
        approved_at: new Date().toISOString()
      })
      .eq('id', itemId)
      .select()
      .single();

    if (error) throw error;

    console.log('Contribution rejected:', itemId);
    return data;

  } catch (error) {
    console.error('rejectModerationItem error:', error);
    throw error;
  }
}

export async function fetchModerationQueue(filters = {}) {
  try {
    let query = supabase
      .from('moderation_queue')
      .select('*');

    if (filters.status) {
      query = query.eq('status', filters.status);
    }

    if (filters.type) {
      query = query.eq('type', filters.type);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;

    console.log('Fetched moderation items:', data.length);
    return data || [];

  } catch (error) {
    console.error('fetchModerationQueue error:', error);
    throw error;
  }
}

export async function getModerationStats() {
  try {
    const { data, error } = await supabase
      .from('moderation_queue')
      .select('status');

    if (error) throw error;

    const stats = {
      pending: data.filter(d => d.status === 'pending').length,
      approved: data.filter(d => d.status === 'approved').length,
      rejected: data.filter(d => d.status === 'rejected').length,
      total: data.length
    };

    console.log('Moderation stats:', stats);
    return stats;

  } catch (error) {
    console.error('getModerationStats error:', error);
    throw error;
  }
}

// ============================================================================
// PHASE 6: VERSION TRACKING FUNCTIONS
// ============================================================================

/**
 * Create a new version record when contribution is approved
 * Called from autoMergeModerationItem() during approval
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

    console.log('✓ Version created:', { termId, version: nextVersionNumber, type: contributionType });
    return { data, error: null };

  } catch (err) {
    console.error('Error in createVersion:', err);
    return { data: null, error: err };
  }
}

// ============================================================================
// PHASE 5: AUTO-MERGE FUNCTION
// ============================================================================

/**
 * Auto-merge an approved contribution into the term
 * This function now creates a new version (PHASE 6) after merging
 */
export async function autoMergeModerationItem(itemId) {
  try {
    console.log('🔄 PHASE 5: Starting auto-merge for contribution:', itemId);

    // 1. Fetch the moderation item
    const { data: item, error: fetchError } = await supabase
      .from('moderation_queue')
      .select('*')
      .eq('id', itemId)
      .single();

    if (fetchError) throw fetchError;
    if (!item) throw new Error('Moderation item not found');

    console.log('✓ Fetched contribution:', {
      id: item.id,
      type: item.type,
      term_id: item.term_id,
      status: item.status
    });

    // 2. Fetch the term
    const { data: term, error: termError } = await supabase
      .from('terms')
      .select('*')
      .eq('id', item.term_id)
      .single();

    if (termError) throw termError;
    if (!term) throw new Error('Term not found');

    console.log('✓ Fetched term:', term.term);

    // 3. Prepare merged data based on contribution type
    let updatedTerm = { ...term };

    switch (item.type) {
      case 'example':
        updatedTerm.examples = updatedTerm.examples || [];
        updatedTerm.examples.push({
          quote: item.data.quote,
          platform: item.data.platform,
          date_observed: item.data.date_observed,
          source_url: item.data.source_url || null,
          submitted_at: new Date().toISOString()
        });
        console.log('✓ Merged example. Total examples now:', updatedTerm.examples.length);
        break;

      case 'context':
        updatedTerm.contexts = updatedTerm.contexts || [];
        updatedTerm.contexts.push({
          text: item.data.context,
          submitted_at: new Date().toISOString()
        });
        console.log('✓ Merged context. Total contexts now:', updatedTerm.contexts.length);
        break;

      case 'harm':
        updatedTerm.harms = updatedTerm.harms || {};
        updatedTerm.harms[item.data.harm_type] = true;
        
        updatedTerm.harm_details = updatedTerm.harm_details || {};
        updatedTerm.harm_details[item.data.harm_type] = {
          description: item.data.harm_description,
          targeted_groups: item.data.targeted_groups || null,
          submitted_at: new Date().toISOString()
        };
        console.log('✓ Merged harm type:', item.data.harm_type);
        break;

      case 'relation':
        updatedTerm.related_terms = updatedTerm.related_terms || [];
        updatedTerm.related_terms.push({
          term_id: item.data.related_term_id,
          relation_type: item.data.relation_type,
          submitted_at: new Date().toISOString()
        });
        console.log('✓ Merged relation type:', item.data.relation_type);
        break;

      default:
        throw new Error(`Unknown contribution type: ${item.type}`);
    }

    // 4. Update timestamp
    updatedTerm.updated_at = new Date().toISOString();

    // 5. Save updated term to database
    const { data: result, error: updateError } = await supabase
      .from('terms')
      .update(updatedTerm)
      .eq('id', item.term_id)
      .select()
      .single();

    if (updateError) throw updateError;

    // PHASE 6: Create version record after successful merge
    console.log('Creating version record for the merged contribution...');
    await createVersion(
      item.term_id,
      result,
      item.type,
      `${item.type.charAt(0).toUpperCase() + item.type.slice(1)} added`,
      null,
      'Community Contribution'
    );

    console.log('✓✓✓ AUTO-MERGE & VERSIONING COMPLETE ✓✓✓');
    console.log('✓ Term updated with merged data');
    console.log('✓ Version record created');
    console.log('');
    
    return result;

  } catch (error) {
    console.error('❌ autoMergeModerationItem error:', error.message);
    throw error;
  }
}

// ============================================================================
// SUBMISSION & UPDATE FUNCTIONS
// ============================================================================

export async function submitTerm(termData) {
  const { data, error } = await supabase
    .from('terms')
    .insert([
      {
        ...termData,
        status: 'pending',
        version_number: 1
      }
    ])
    .select();

  if (error) throw error;
  return data[0];
}

export async function updateTermStatus(termId, status, notes = '') {
  const { data, error } = await supabase
    .from('terms')
    .update({
      status,
      updated_at: new Date().toISOString()
    })
    .eq('id', termId)
    .select();

  if (error) throw error;
  return data[0];
}

// ============================================================================
// VOTING & COMMENTS
// ============================================================================

export async function addVote(termId, userId, value) {
  const { data, error } = await supabase
    .from('votes')
    .upsert(
      {
        user_id: userId,
        term_id: termId,
        value
      },
      { onConflict: 'user_id,term_id' }
    );

  if (error) throw error;
  return data;
}

export async function addComment(termId, userId, body) {
  const { data, error } = await supabase
    .from('comments')
    .insert([
      {
        term_id: termId,
        user_id: userId,
        body,
        created_at: new Date().toISOString()
      }
    ])
    .select();

  if (error) throw error;
  return data[0];
}

// ============================================================================
// STORAGE & FILE FUNCTIONS
// ============================================================================

export async function uploadEvidence(file, termId) {
  const fileName = `evidence/${termId}/${Date.now()}-${file.name}`;

  const { data, error } = await supabase.storage
    .from('evidence')
    .upload(fileName, file);

  if (error) throw error;
  return {
    path: data.path,
    fullPath: data.fullPath
  };
}

export async function getSignedUrl(path) {
  const { data, error } = await supabase.storage
    .from('evidence')
    .createSignedUrl(path, 3600);

  if (error) throw error;
  return data.signedUrl;
}
// Add to lib/supabase.js

export async function fetchTermContributions(termId, type = null) {
  try {
    if (!termId) {
      throw new Error('Term ID is required');
    }

    const query = new URLSearchParams({
      term_id: termId,
      ...(type && { type })
    });

    const response = await fetch(`/api/contributions?${query.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch contributions: ${response.statusText}`);
    }

    const data = await response.json();
    return data.contributions || [];
  } catch (error) {
    console.error('Error fetching contributions:', error);
    throw error;
  }
}