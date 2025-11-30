// lib/validation.js
// Validation utilities for KESL submission form
// Used by: submit form, contribute modal, admin review

/**
 * Validate definition length and quality
 * @param {string} text - Definition text
 * @returns {object} { valid: boolean, wordCount: number, message: string, level: 'good'|'warning'|'error' }
 */
export function validateDefinition(text) {
  if (!text || typeof text !== 'string') {
    return { valid: false, wordCount: 0, message: 'Definition required', level: 'error' };
  }

  const trimmed = text.trim();
  const words = trimmed.split(/\s+/).filter(w => w.length > 0);
  const wordCount = words.length;

  if (wordCount < 50) {
    return {
      valid: false,
      wordCount,
      message: `Too short (${wordCount}/50 words minimum)`,
      level: 'error'
    };
  }

  if (wordCount === 50) {
    return {
      valid: true,
      wordCount,
      message: 'Good length ✓',
      level: 'good'
    };
  }

  if (wordCount < 120) {
    return {
      valid: true,
      wordCount,
      message: 'Good length ✓',
      level: 'good'
    };
  }

  if (wordCount < 200) {
    return {
      valid: true,
      wordCount,
      message: `Getting long (${wordCount}/200 max). Trim if possible`,
      level: 'warning'
    };
  }

  if (wordCount === 200) {
    return {
      valid: true,
      wordCount,
      message: 'At maximum length',
      level: 'warning'
    };
  }

  return {
    valid: false,
    wordCount,
    message: `Too long (${wordCount}/200 words maximum)`,
    level: 'error'
  };
}

/**
 * Validate example quote (must be ≤100 chars, redacted, etc.)
 * @param {string} quote - Example quote
 * @returns {object} { valid: boolean, charCount: number, hasAtHandle: boolean, hasHashtag: boolean, hasMentionedName: boolean, message: string }
 */
export function validateExample(quote) {
  if (!quote || typeof quote !== 'string') {
    return {
      valid: false,
      charCount: 0,
      hasAtHandle: false,
      hasHashtag: false,
      hasMentionedName: false,
      message: 'Example required',
      warnings: []
    };
  }

  const trimmed = quote.trim();
  const charCount = trimmed.length;
  const warnings = [];

  // Check for @handles
  const hasAtHandle = /@[\w]+/.test(trimmed);
  if (hasAtHandle) {
    warnings.push('Contains @mentions - should be redacted as [@redacted]');
  }

  // Check for #names/#hashtags
  const hasHashtag = /#[\w]+/.test(trimmed);
  if (hasHashtag) {
    warnings.push('Contains #hashtags - should be redacted as [#redacted]');
  }

  // Check for obvious names (capitalized words)
  const words = trimmed.split(/\s+/);
  const capitalizedWords = words.filter(w => /^[A-Z][a-z]+$/.test(w)).length;
  const hasMentionedName = capitalizedWords > 2; // More than 2 proper nouns
  if (hasMentionedName) {
    warnings.push('Contains names - ensure they are redacted or anonymized');
  }

  if (charCount < 20) {
    return {
      valid: false,
      charCount,
      hasAtHandle,
      hasHashtag,
      hasMentionedName,
      message: `Too short (${charCount}/20 chars minimum)`,
      warnings
    };
  }

  if (charCount <= 100) {
    return {
      valid: true,
      charCount,
      hasAtHandle,
      hasHashtag,
      hasMentionedName,
      message: charCount > 80 ? 'Getting close to limit' : 'Good length ✓',
      warnings
    };
  }

  return {
    valid: false,
    charCount,
    hasAtHandle,
    hasHashtag,
    hasMentionedName,
    message: `Too long (${charCount}/100 characters maximum)`,
    warnings
  };
}

/**
 * Auto-redact @ and # in examples
 * @param {string} text - Original text
 * @returns {string} Redacted text
 */
export function autoRedactExample(text) {
  let redacted = text;
  
  // Redact @mentions
  redacted = redacted.replace(/@[\w]+/g, '[@redacted]');
  
  // Redact #hashtags
  redacted = redacted.replace(/#[\w]+/g, '[#redacted]');
  
  return redacted;
}

/**
 * Check if term might be a variant of existing terms
 * @param {string} term - Submitted term
 * @param {array} existingTerms - Array of existing term objects
 * @returns {object} { isVariant: boolean, matches: array }
 */
export function checkVariantMatch(term, existingTerms = []) {
  const normalized = term.toLowerCase().trim();
  const matches = [];

  existingTerms.forEach(existing => {
    // Exact match (shouldn't happen but check anyway)
    if (existing.term.toLowerCase() === normalized) {
      matches.push({
        type: 'exact',
        term: existing.term,
        id: existing.id,
        confidence: 1.0
      });
      return;
    }

    // Check variants field
    if (existing.variants && Array.isArray(existing.variants)) {
      if (existing.variants.map(v => v.toLowerCase()).includes(normalized)) {
        matches.push({
          type: 'variant',
          term: existing.term,
          variant: term,
          id: existing.id,
          confidence: 0.95
        });
        return;
      }
    }

    // Levenshtein distance (simple similarity check)
    const distance = levenshteinDistance(normalized, existing.term.toLowerCase());
    const maxLen = Math.max(normalized.length, existing.term.toLowerCase().length);
    const similarity = 1 - (distance / maxLen);

    if (similarity > 0.8) {
      matches.push({
        type: 'similar',
        term: existing.term,
        id: existing.id,
        similarity,
        confidence: similarity
      });
    }
  });

  return {
    isVariant: matches.length > 0,
    matches: matches.sort((a, b) => b.confidence - a.confidence)
  };
}

/**
 * Levenshtein distance - simple string similarity metric
 */
function levenshteinDistance(str1, str2) {
  const matrix = [];

  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
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

  return matrix[str2.length][str1.length];
}

/**
 * Calculate confidence level based on number of examples and sources
 * @param {array} examples - Array of example objects
 * @returns {object} { level: 'low'|'medium'|'high', count: number, message: string }
 */
export function calculateConfidence(examples = []) {
  if (!Array.isArray(examples)) {
    return { level: 'low', count: 0, message: '0 examples' };
  }

  const count = examples.length;
  const uniquePlatforms = new Set(examples.map(ex => ex.platform)).size;

  if (count === 0) {
    return { level: 'low', count: 0, message: 'No examples' };
  }

  if (count === 1) {
    return { level: 'low', count: 1, message: '1 example (low confidence)' };
  }

  if (count >= 2 && count <= 3) {
    return {
      level: 'medium',
      count,
      uniquePlatforms,
      message: `${count} examples from ${uniquePlatforms} platform(s) (medium confidence)`
    };
  }

  if (count >= 4 && uniquePlatforms >= 2) {
    return {
      level: 'high',
      count,
      uniquePlatforms,
      message: `${count} examples from ${uniquePlatforms} platforms (high confidence)`
    };
  }

  return {
    level: 'medium',
    count,
    uniquePlatforms,
    message: `${count} example(s) (medium confidence)`
  };
}

/**
 * Validate harm checkboxes
 * @param {object} harms - Object with boolean keys: normalizes_contempt, primes_exclusion, cues_violence, harasses, other
 * @param {object} harmDetails - Object with text details for each harm
 * @returns {object} { valid: boolean, checked: number, message: string, details: object }
 */
export function validateHarms(harms = {}, harmDetails = {}) {
  const harmTypes = ['normalizes_contempt', 'primes_exclusion', 'cues_violence', 'harasses', 'other'];
  
  const checked = harmTypes.filter(type => harms[type]).length;
  const hasDetails = harmTypes.filter(type => 
    harms[type] && harmDetails[type] && harmDetails[type].trim().length > 0
  ).length;

  if (checked === 0) {
    return {
      valid: false,
      checked: 0,
      message: 'Select at least one harm type',
      details: {}
    };
  }

  if (checked > 0 && hasDetails === 0) {
    return {
      valid: false,
      checked,
      message: 'Provide details for selected harms',
      details: {},
      warning: 'You selected harm types but didn\'t fill in context'
    };
  }

  const details = {};
  harmTypes.forEach(type => {
    if (harms[type]) {
      details[type] = harmDetails[type] || '';
    }
  });

  return {
    valid: true,
    checked,
    hasDetails,
    message: `${checked} harm type${checked !== 1 ? 's' : ''} documented`,
    details
  };
}

/**
 * Validate entire submission (wizard Step 5)
 * @param {object} submission - Full submission data
 * @returns {object} { valid: boolean, errors: array, warnings: array }
 */
export function validateSubmission(submission) {
  const errors = [];
  const warnings = [];

  // Step 1: Term basics
  if (!submission.term || !submission.term.trim()) {
    errors.push('Term is required');
  }

  if (!submission.language) {
    errors.push('Language is required');
  }

  if (!submission.category) {
    errors.push('Category is required');
  }

  if (!submission.risk) {
    errors.push('Risk level is required');
  }

  // Step 2: Definition
  const defValidation = validateDefinition(submission.definition);
  if (!defValidation.valid) {
    errors.push(`Definition: ${defValidation.message}`);
  }

  // Step 3: Example
  if (!submission.examples || submission.examples.length === 0) {
    errors.push('At least one example is required');
  } else {
    submission.examples.forEach((ex, i) => {
      const exValidation = validateExample(ex.quote);
      if (!exValidation.valid) {
        errors.push(`Example ${i + 1}: ${exValidation.message}`);
      }
      if (exValidation.warnings.length > 0) {
        warnings.push(`Example ${i + 1}: ${exValidation.warnings.join('; ')}`);
      }
      if (!ex.platform) {
        errors.push(`Example ${i + 1}: Platform required`);
      }
      if (!ex.date_observed) {
        errors.push(`Example ${i + 1}: Date required`);
      }
    });
  }

  // Step 4: Harms
  if (!submission.harms || Object.values(submission.harms).every(v => !v)) {
    warnings.push('No harm types selected - is this term actually harmful?');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    summary: {
      hasErrors: errors.length > 0,
      hasWarnings: warnings.length > 0,
      errorCount: errors.length,
      warningCount: warnings.length
    }
  };
}

/**
 * Format validation message for display
 * @param {object} validation - Result from any validation function
 * @returns {string} Human-readable message
 */
export function formatValidationMessage(validation) {
  if (validation.level === 'error') {
    return `❌ ${validation.message}`;
  }
  if (validation.level === 'warning') {
    return `⚠️ ${validation.message}`;
  }
  return `✓ ${validation.message}`;
}

// Export all validators as a grouped object for convenience
export const validators = {
  definition: validateDefinition,
  example: validateExample,
  harms: validateHarms,
  variant: checkVariantMatch,
  confidence: calculateConfidence,
  submission: validateSubmission,
  formatMessage: formatValidationMessage
};

export default validators;