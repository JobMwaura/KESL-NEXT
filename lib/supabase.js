// Supabase Client Configuration with PHASE 5: Auto-Merge
// Complete version for lib/supabase.js with autoMergeModerationItem()

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
 * @param {Object} termData - Term information
 * @param {string} termData.term - The term/phrase
 * @param {string} termData.meaning - Plain English definition (50-200 words)
 * @param {string} termData.category - Category (derogatory, exclusionary, dangerous, coded)
 * @param {string} termData.risk - Risk level (low, medium, high)
 * @param {string} termData.language - Language (sheng, swahili, english, mixed)
 * @param {string} [termData.literal_gloss] - Optional etymology/literal meaning
 * @param {Array} termData.examples - Array of example objects
 * @param {Object} termData.harms - Harm types object (keys: bool)
 * @param {Object} termData.harm_details - Harm explanations object
 * @param {Array} [termData.variants] - Optional variant spellings
 * @returns {Promise<Object>} Inserted term data
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
 * Uses Levenshtein distance to find similar terms
 * @param {string} term - Term to check
 * @returns {Promise<Array>} Array of similar existing terms
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
 * Insert an example for a term
 * @param {string} termId - Term ID
 * @param {Object} example - Example object
 * @param {string} example.quote - The quoted text
 * @param {string} example.platform - Platform where found
 * @param {string} example.date_observed - Date found (YYYY-MM-DD)
 * @param {string} [example.source_url] - Optional URL to source
 * @returns {Promise<Object>} Inserted example
 */
export async function insertExample(termId, example) {
  try {
    if (!example.quote || !example.platform || !example.date_observed) {
      throw new Error('Example must include quote, platform, and date_observed');
    }

    if (example.quote.length > 100) {
      throw new Error('Quote must be 100 characters or less');
    }

    const insertData = {
      term_id: termId,
      quote: example.quote.trim(),
      platform: example.platform,
      date_observed: example.date_observed,
      source_url: example.source_url || null,
      created_at: new Date().toISOString()
    };

    console.log('Inserting example for term:', termId);

    const { data, error } = await supabase
      .from('examples')
      .insert([insertData])
      .select();

    if (error) {
      console.error('Insert example error:', error);
      throw new Error(`Failed to insert example: ${error.message}`);
    }

    console.log('Example inserted:', data[0].id);
    return data[0];

  } catch (error) {
    console.error('insertExample error:', error);
    throw error;
  }
}

/**
 * Insert harm documentation for a term
 * @param {string} termId - Term ID
 * @param {string} harmType - Type of harm (normalizes_contempt, primes_exclusion, etc)
 * @param {string} description - Description of the harm
 * @returns {Promise<Object>} Inserted harm record
 */
export async function insertHarm(termId, harmType, description) {
  try {
    if (!harmType || !description) {
      throw new Error('Harm type and description are required');
    }

    const validHarmTypes = [
      'normalizes_contempt',
      'primes_exclusion',
      'cues_violence',
      'harasses',
      'other'
    ];

    if (!validHarmTypes.includes(harmType)) {
      throw new Error(`Invalid harm type. Must be one of: ${validHarmTypes.join(', ')}`);
    }

    const insertData = {
      term_id: termId,
      harm_type: harmType,
      description: description.trim(),
      created_at: new Date().toISOString()
    };

    console.log('Inserting harm for term:', termId);

    const { data, error } = await supabase
      .from('harms')
      .insert([insertData])
      .select();

    if (error) {
      console.error('Insert harm error:', error);
      throw new Error(`Failed to insert harm: ${error.message}`);
    }

    console.log('Harm inserted:', data[0].id);
    return data[0];

  } catch (error) {
    console.error('insertHarm error:', error);
    throw error;
  }
}

/**
 * Add an example to a term (for ContributeModal)
 * Submits to moderation_queue with status: pending
 * @param {string} termId - Term ID
 * @param {Object} data - Example data
 * @param {string} data.quote - Quote text (max 100 chars)
 * @param {string} data.platform - Platform name
 * @param {string} data.date_observed - Date in YYYY-MM-DD format
 * @param {string} [data.source_url] - Optional source URL
 * @returns {Promise<Object>} Submitted contribution
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
 * Submits to moderation_queue with status: pending
 * @param {string} termId - Term ID
 * @param {Object} data - Context data
 * @param {string} data.context - Context description (min 50 chars)
 * @returns {Promise<Object>} Submitted contribution
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
 * Submits to moderation_queue with status: pending
 * @param {string} termId - Term ID
 * @param {Object} data - Harm data
 * @param {string} data.harm_type - Type of harm
 * @param {string} data.harm_description - Description of harm (min 30 chars)
 * @param {string} [data.targeted_groups] - Groups affected (optional)
 * @returns {Promise<Object>} Submitted contribution
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
 * Submits to moderation_queue with status: pending
 * @param {string} termId - Term ID
 * @param {Object} data - Relationship data
 * @param {string} data.related_term_id - ID of related term
 * @param {string} data.relation_type - Type of relation
 * @returns {Promise<Object>} Submitted contribution
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

/**
 * Calculate confidence level based on number of examples and platforms
 * Low: 1 example from 1 platform
 * Medium: 2-3 examples from 1+ platforms
 * High: 4+ examples from 2+ platforms
 */
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

/**
 * Calculate Levenshtein distance between two strings
 * Used for finding similar/variant terms
 */
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

export async function fetchApprovedTerms(filters = {}) {
  let query = supabase
    .from('terms')
    .select('*')
    .eq('status', 'approved');

  if (filters.category) {
    query = query.eq('category', filters.category);
  }
  if (filters.risk) {
    query = query.eq('risk', filters.risk);
  }
  if (filters.language) {
    query = query.eq('language', filters.language);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
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

/**
 * Fetch term with version history
 * @param {string} termId - Term ID
 * @returns {Promise<Object>} Term with versions array
 */
export async function fetchTermWithVersions(termId) {
  try {
    const { data, error } = await supabase
      .from('terms')
      .select('*')
      .eq('id', termId)
      .single();

    if (error) throw error;

    const termWithVersions = {
      ...data,
      versions: [
        {
          version: 1,
          timestamp: data.created_at,
          changes: 'Original submission'
        }
      ]
    };

    console.log('Fetched term with versions:', termId);
    return termWithVersions;

  } catch (error) {
    console.error('fetchTermWithVersions error:', error);
    throw error;
  }
}

// ============================================================================
// MODERATION FUNCTIONS
// ============================================================================

/**
 * Approve a moderation queue item
 * @param {string} itemId - Moderation queue item ID
 * @returns {Promise<Object>} Updated item
 */
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

/**
 * Reject a moderation queue item
 * @param {string} itemId - Moderation queue item ID
 * @param {string} reason - Rejection reason
 * @returns {Promise<Object>} Updated item
 */
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

/**
 * Fetch all pending moderation items with optional filtering
 * @param {Object} filters - Filter options
 * @param {string} filters.status - 'pending', 'approved', 'rejected'
 * @param {string} filters.type - 'example', 'context', 'harm', 'relation'
 * @returns {Promise<Array>} Moderation items
 */
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

/**
 * Get moderation statistics
 * @returns {Promise<Object>} Stats with pending, approved, rejected counts
 */
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

/**
 * ═════════════════════════════════════════════════════════════════════════════
 * PHASE 5: AUTO-MERGE FUNCTION
 * ═════════════════════════════════════════════════════════════════════════════
 * Automatically merge an approved contribution into the term data
 * Called when admin clicks "Approve" button in admin dashboard
 * 
 * This function:
 * 1. Fetches the contribution from moderation_queue
 * 2. Fetches the term from terms table
 * 3. Merges contribution data based on type:
 *    - Example: adds to term.examples[]
 *    - Context: adds to term.contexts[]
 *    - Harm: adds to term.harms and term.harm_details
 *    - Relation: adds to term.related_terms[]
 * 4. Updates term in database with new data
 * 5. Sets updated_at timestamp
 * ═════════════════════════════════════════════════════════════════════════════
 */

/**
 * Auto-merge an approved contribution into the term
 * @param {string} itemId - Moderation queue item ID
 * @returns {Promise<Object>} Updated term with merged data
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
        // MERGE EXAMPLE: Add to examples array
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
        // MERGE CONTEXT: Add to contexts array
        updatedTerm.contexts = updatedTerm.contexts || [];
        updatedTerm.contexts.push({
          text: item.data.context,
          submitted_at: new Date().toISOString()
        });
        console.log('✓ Merged context. Total contexts now:', updatedTerm.contexts.length);
        break;

      case 'harm':
        // MERGE HARM: Add to harms object and harm_details
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
        // MERGE RELATION: Add to related_terms array
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

    console.log('✓✓✓ AUTO-MERGE COMPLETE ✓✓✓');
    console.log('✓ Term updated:', item.term_id);
    console.log('✓ Contribution merged into term data');
    console.log('✓ Updated_at timestamp set');
    console.log('');
    
    return result;

  } catch (error) {
    console.error('❌ autoMergeModerationItem error:', error.message);
    throw error;
  }
}

// ============================================================================
// VERSIONING & HISTORY FUNCTIONS
// ============================================================================

/**
 * Create a version entry for term changes (for future versioning)
 * @param {string} termId - Term ID
 * @param {Object} changes - What changed
 * @returns {Promise<Object>} Version record
 */
export async function createVersion(termId, changes) {
  try {
    console.log('Version created for term:', termId, changes);
    return { termId, changes, timestamp: new Date().toISOString() };

  } catch (error) {
    console.error('createVersion error:', error);
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
        status: 'pending'
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
    .createSignedUrl(path, 3600); // 1 hour expiry

  if (error) throw error;
  return data.signedUrl;
}