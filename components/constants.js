/**
 * lib/constants.js
 * Centralized configuration for KESL platform
 * All enums, options, and static data
 */

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CATEGORIES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const CATEGORIES = {
  SLUR: {
    id: 'slur',
    label: 'Slur',
    description: 'Derogatory term targeting a group',
    color: '#ef4444'
  },
  CONSPIRACY: {
    id: 'conspiracy',
    label: 'Conspiracy theory',
    description: 'Unfounded claim blaming group for events',
    color: '#f59e0b'
  },
  DEHUMANIZE: {
    id: 'dehumanize',
    label: 'Dehumanization',
    description: 'Language comparing group to animals/vermin',
    color: '#ec4899'
  },
  STEREOTYPE: {
    id: 'stereotype',
    label: 'Stereotype',
    description: 'Generalization about group characteristics',
    color: '#8b5cf6'
  },
  DOG_WHISTLE: {
    id: 'dog_whistle',
    label: 'Dog whistle',
    description: 'Coded language understood by insiders',
    color: '#6366f1'
  },
  MISINFORMATION: {
    id: 'misinformation',
    label: 'Misinformation',
    description: 'False claims spread as fact',
    color: '#3b82f6'
  }
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// RISK LEVELS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const RISK_LEVELS = {
  LOW: {
    id: 'low',
    label: 'Low risk',
    description: 'Rarely leads to violence',
    severity: 1,
    color: '#10b981'
  },
  MEDIUM: {
    id: 'medium',
    label: 'Medium risk',
    description: 'Sometimes mobilizes violence',
    severity: 2,
    color: '#f59e0b'
  },
  HIGH: {
    id: 'high',
    label: 'High risk',
    description: 'Frequently mobilizes violence',
    severity: 3,
    color: '#ef4444'
  }
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// LANGUAGES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const LANGUAGES = {
  ENGLISH: {
    id: 'english',
    label: 'English',
    code: 'en'
  },
  SWAHILI: {
    id: 'swahili',
    label: 'Swahili',
    code: 'sw'
  },
  SHENG: {
    id: 'sheng',
    label: 'Sheng (Kenyan slang)',
    code: 'sheng'
  },
  MIXED: {
    id: 'mixed',
    label: 'Mixed/Code-switched',
    code: 'mixed'
  }
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// PLATFORMS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const PLATFORMS = {
  REDDIT: {
    id: 'reddit',
    label: 'Reddit',
    color: '#ff4500'
  },
  TELEGRAM: {
    id: 'telegram',
    label: 'Telegram',
    color: '#0088cc'
  },
  TWITTER: {
    id: 'twitter',
    label: 'Twitter/X',
    color: '#000000'
  },
  FACEBOOK: {
    id: 'facebook',
    label: 'Facebook',
    color: '#1877f2'
  },
  TIKTOK: {
    id: 'tiktok',
    label: 'TikTok',
    color: '#000000'
  },
  WHATSAPP: {
    id: 'whatsapp',
    label: 'WhatsApp',
    color: '#25d366'
  },
  KENYALIST: {
    id: 'kenyalist',
    label: 'KenyaList',
    color: '#4b5563'
  },
  USTEA: {
    id: 'ustea',
    label: 'uTea',
    color: '#ff6b6b'
  },
  OTHER: {
    id: 'other',
    label: 'Other platform',
    color: '#95a5a6'
  }
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// HARM TYPES (for documentation)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const HARM_TYPES = {
  NORMALIZES_CONTEMPT: {
    id: 'normalizes_contempt',
    label: 'Normalizes contempt',
    description: 'Makes hateful attitudes seem normal'
  },
  PRIMES_EXCLUSION: {
    id: 'primes_exclusion',
    label: 'Primes exclusion/eviction',
    description: 'Sets up justification for removing group'
  },
  CUES_VIOLENCE: {
    id: 'cues_violence',
    label: 'Cues/legitimizes violence',
    description: 'Suggests violence is justified or necessary'
  },
  HARASSES: {
    id: 'harasses',
    label: 'Harasses individuals',
    description: 'Targets specific people for attacks'
  },
  OTHER: {
    id: 'other',
    label: 'Other harm',
    description: 'Document other harms not listed'
  }
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MIGRATION SPEEDS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const MIGRATION_SPEEDS = {
  SLOW: {
    id: 'slow',
    label: 'Slow (months)',
    description: 'Gradually spreads over time'
  },
  MEDIUM: {
    id: 'medium',
    label: 'Medium (weeks)',
    description: 'Spreads at moderate pace'
  },
  FAST: {
    id: 'fast',
    label: 'Fast (days)',
    description: 'Rapidly spreads between platforms'
  }
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// AMPLIFICATION LEVELS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const AMPLIFICATION_LEVELS = {
  NOT_AMPLIFIED: {
    id: 'not_amplified',
    label: 'Not amplified',
    description: 'Appears but not promoted'
  },
  LIGHTLY_AMPLIFIED: {
    id: 'lightly_amplified',
    label: 'Lightly amplified',
    description: 'Some algorithmic promotion'
  },
  HEAVILY_AMPLIFIED: {
    id: 'heavily_amplified',
    label: 'Heavily amplified',
    description: 'Aggressively promoted by algorithms'
  }
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SUBMISSION STATUS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const SUBMISSION_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  SUSPENDED: 'suspended'
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CONFIDENCE LEVELS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const CONFIDENCE_LEVELS = {
  LOW: {
    id: 'low',
    label: 'Low',
    minExamples: 1,
    minPlatforms: 1,
    color: '#fca5a5'
  },
  MEDIUM: {
    id: 'medium',
    label: 'Medium',
    minExamples: 2,
    minPlatforms: 1,
    color: '#fbbf24'
  },
  HIGH: {
    id: 'high',
    label: 'High',
    minExamples: 4,
    minPlatforms: 2,
    color: '#86efac'
  }
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// DISCOURSE STAGES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const DISCOURSE_STAGES = {
  EMERGENCE: {
    id: 'emergence',
    label: 'Emergence',
    description: 'New term entering discourse'
  },
  PROLIFERATION: {
    id: 'proliferation',
    label: 'Proliferation',
    description: 'Term spreading rapidly'
  },
  NORMALIZATION: {
    id: 'normalization',
    label: 'Normalization',
    description: 'Term becoming accepted language'
  },
  MAINSTREAM: {
    id: 'mainstream',
    label: 'Mainstream',
    description: 'Term used in wider society'
  }
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// VALIDATION RULES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const VALIDATION_RULES = {
  TERM_MIN_LENGTH: 1,
  TERM_MAX_LENGTH: 50,
  
  DEFINITION_MIN_WORDS: 50,
  DEFINITION_MAX_WORDS: 200,
  
  EXAMPLE_MAX_CHARS: 100,
  EXAMPLE_MIN_CHARS: 10,
  
  CONTEXT_MIN_WORDS: 20,
  CONTEXT_MAX_WORDS: 200,
  
  VARIANT_MAX_LENGTH: 50,
  
  GLOSS_MAX_LENGTH: 100
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// COLORS (for UI theming)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const COLORS = {
  SUCCESS: '#10b981',
  WARNING: '#f59e0b',
  DANGER: '#ef4444',
  INFO: '#3b82f6',
  LIGHT_GRAY: '#e2e8f0',
  DARK_GRAY: '#475569',
  BACKGROUND: '#f8fafc'
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// HELPER FUNCTIONS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Get category by ID
 * @param {string} id - Category ID
 * @returns {object} Category object
 */
export function getCategoryById(id) {
  return Object.values(CATEGORIES).find(cat => cat.id === id);
}

/**
 * Get platform by ID
 * @param {string} id - Platform ID
 * @returns {object} Platform object
 */
export function getPlatformById(id) {
  return Object.values(PLATFORMS).find(plat => plat.id === id);
}

/**
 * Get harm type by ID
 * @param {string} id - Harm type ID
 * @returns {object} Harm type object
 */
export function getHarmTypeById(id) {
  return Object.values(HARM_TYPES).find(harm => harm.id === id);
}

/**
 * Get risk level by ID
 * @param {string} id - Risk level ID
 * @returns {object} Risk level object
 */
export function getRiskLevelById(id) {
  return Object.values(RISK_LEVELS).find(risk => risk.id === id);
}

/**
 * Get language by ID
 * @param {string} id - Language ID
 * @returns {object} Language object
 */
export function getLanguageById(id) {
  return Object.values(LANGUAGES).find(lang => lang.id === id);
}

/**
 * Get confidence level based on examples and platforms
 * @param {number} exampleCount - Number of examples
 * @param {number} platformCount - Number of unique platforms
 * @returns {object} Confidence level object
 */
export function getConfidenceLevel(exampleCount = 0, platformCount = 1) {
  if (exampleCount >= CONFIDENCE_LEVELS.HIGH.minExamples && 
      platformCount >= CONFIDENCE_LEVELS.HIGH.minPlatforms) {
    return CONFIDENCE_LEVELS.HIGH;
  }
  
  if (exampleCount >= CONFIDENCE_LEVELS.MEDIUM.minExamples) {
    return CONFIDENCE_LEVELS.MEDIUM;
  }
  
  if (exampleCount >= CONFIDENCE_LEVELS.LOW.minExamples) {
    return CONFIDENCE_LEVELS.LOW;
  }
  
  return null;
}

/**
 * Get all categories as array
 * @returns {array} Array of category objects
 */
export function getCategoriesArray() {
  return Object.values(CATEGORIES);
}

/**
 * Get all platforms as array
 * @returns {array} Array of platform objects
 */
export function getPlatformsArray() {
  return Object.values(PLATFORMS);
}

/**
 * Get all risk levels as array
 * @returns {array} Array of risk level objects
 */
export function getRiskLevelsArray() {
  return Object.values(RISK_LEVELS);
}

/**
 * Get all languages as array
 * @returns {array} Array of language objects
 */
export function getLanguagesArray() {
  return Object.values(LANGUAGES);
}

export default {
  CATEGORIES,
  RISK_LEVELS,
  LANGUAGES,
  PLATFORMS,
  HARM_TYPES,
  MIGRATION_SPEEDS,
  AMPLIFICATION_LEVELS,
  SUBMISSION_STATUS,
  CONFIDENCE_LEVELS,
  DISCOURSE_STAGES,
  VALIDATION_RULES,
  COLORS,
  // Helpers
  getCategoryById,
  getPlatformById,
  getHarmTypeById,
  getRiskLevelById,
  getLanguageById,
  getConfidenceLevel,
  getCategoriesArray,
  getPlatformsArray,
  getRiskLevelsArray,
  getLanguagesArray
};