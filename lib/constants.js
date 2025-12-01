/**
 * lib/constants.js
 * Centralized configuration for KESL platform
 * All enums, options, and static data
 * UPDATED: Phase 6 - Version tracking colors and contribution types
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

// Convenience array for select components
export const CATEGORY_OPTIONS = Object.values(CATEGORIES).map(cat => ({
  value: cat.id,
  label: cat.label,
  description: cat.description,
  color: cat.color
}));

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// RISK LEVELS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const RISK_LEVELS = {
  LOW: {
    id: 'low',
    label: 'Low risk',
    description: 'Rarely leads to violence',
    severity: 1,
    color: '#10b981',
    icon: '🟢'
  },
  MEDIUM: {
    id: 'medium',
    label: 'Medium risk',
    description: 'Sometimes mobilizes violence',
    severity: 2,
    color: '#f59e0b',
    icon: '🟡'
  },
  HIGH: {
    id: 'high',
    label: 'High risk',
    description: 'Frequently mobilizes violence',
    severity: 3,
    color: '#ef4444',
    icon: '🔴'
  }
};

// Convenience array for select components
export const RISK_OPTIONS = Object.values(RISK_LEVELS).map(risk => ({
  value: risk.id,
  label: risk.label,
  description: risk.description,
  severity: risk.severity
}));

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

// Convenience array for select components
export const LANGUAGE_OPTIONS = Object.values(LANGUAGES).map(lang => ({
  value: lang.id,
  label: lang.label,
  description: lang.description
}));

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

// Convenience array for select components (excludes "other" to keep free-text optional)
export const PLATFORM_OPTIONS = Object.values(PLATFORMS)
  .filter(platform => platform.id !== 'other')
  .map(platform => ({
    value: platform.id,
    label: platform.label
  }));

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// HARM TYPES (for documentation)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const HARM_TYPES = {
  NORMALIZES_CONTEMPT: {
    id: 'normalizes_contempt',
    label: 'Normalizes contempt',
    description: 'Makes hateful attitudes seem normal',
    prompt: 'Who does this speech normalize contempt toward? How is the group portrayed?'
  },
  PRIMES_EXCLUSION: {
    id: 'primes_exclusion',
    label: 'Primes exclusion/eviction',
    description: 'Sets up justification for removing group',
    prompt: 'From what is this group excluded? (land, jobs, neighborhoods, politics, citizenship)'
  },
  CUES_VIOLENCE: {
    id: 'cues_violence',
    label: 'Cues/legitimizes violence',
    description: 'Suggests violence is justified or necessary',
    prompt: 'What type of violence? (ethnic clashes, mob action, evictions, targeted attacks)'
  },
  HARASSES: {
    id: 'harasses',
    label: 'Harasses individuals',
    description: 'Targets specific people for attacks',
    prompt: 'Describe the targeting and harassment pattern'
  },
  OTHER: {
    id: 'other',
    label: 'Other harm',
    description: 'Document other harms not listed',
    prompt: 'Describe the harm'
  }
};

// Convenience array for form rendering
export const HARM_OPTIONS = Object.values(HARM_TYPES).map(harm => ({
  value: harm.id,
  label: harm.label,
  description: harm.description,
  prompt: harm.prompt
}));

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// PHASE 6: CONTRIBUTION TYPES (for version tracking)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const CONTRIBUTION_TYPES = {
  INITIAL: {
    id: 'initial',
    label: 'Initial',
    description: 'Original term submission',
    icon: '📝',
    color: '#3b82f6'
  },
  EXAMPLE_ADDED: {
    id: 'example_added',
    label: 'Example',
    description: 'Example added',
    icon: '💬',
    color: '#0284c7'
  },
  CONTEXT_ADDED: {
    id: 'context_added',
    label: 'Context',
    description: 'Context added',
    icon: '📚',
    color: '#06b6d4'
  },
  HARM_DOCUMENTED: {
    id: 'harm_documented',
    label: 'Harm',
    description: 'Harm documented',
    icon: '⚠️',
    color: '#ef4444'
  },
  VARIANT_ADDED: {
    id: 'variant_added',
    label: 'Variant',
    description: 'Variant added',
    icon: '🔤',
    color: '#8b5cf6'
  },
  RELATED_TERM_ADDED: {
    id: 'related_term_added',
    label: 'Related',
    description: 'Related term added',
    icon: '🔗',
    color: '#6366f1'
  },
  EDIT: {
    id: 'edit',
    label: 'Edit',
    description: 'General edit',
    icon: '✏️',
    color: '#64748b'
  },
  ROLLBACK: {
    id: 'rollback',
    label: 'Rollback',
    description: 'Rolled back to previous version',
    icon: '↩️',
    color: '#f59e0b'
  }
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// PHASE 6: DIFF COLORS (for version comparison)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const DIFF_COLORS = {
  ADDED: {
    id: 'added',
    label: 'Added',
    background: '#dcfce7',
    text: '#166534',
    border: '#10b981',
    icon: '+'
  },
  REMOVED: {
    id: 'removed',
    label: 'Removed',
    background: '#fee2e2',
    text: '#991b1b',
    border: '#ef4444',
    icon: '−'
  },
  MODIFIED: {
    id: 'modified',
    label: 'Modified',
    background: '#dbeafe',
    text: '#0c4a6e',
    border: '#0284c7',
    icon: '~'
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

export function getCategoryById(id) {
  return Object.values(CATEGORIES).find(cat => cat.id === id);
}

export function getPlatformById(id) {
  return Object.values(PLATFORMS).find(plat => plat.id === id);
}

export function getHarmTypeById(id) {
  return Object.values(HARM_TYPES).find(harm => harm.id === id);
}

export function getRiskLevelById(id) {
  return Object.values(RISK_LEVELS).find(risk => risk.id === id);
}

export function getLanguageById(id) {
  return Object.values(LANGUAGES).find(lang => lang.id === id);
}

// PHASE 6: Get contribution type by ID
export function getContributionTypeById(id) {
  return Object.values(CONTRIBUTION_TYPES).find(type => type.id === id);
}

// PHASE 6: Get diff color by type
export function getDiffColorByType(type) {
  return Object.values(DIFF_COLORS).find(color => color.id === type);
}

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

export function getCategoriesArray() {
  return Object.values(CATEGORIES);
}

export function getPlatformsArray() {
  return Object.values(PLATFORMS);
}

export function getRiskLevelsArray() {
  return Object.values(RISK_LEVELS);
}

export function getLanguagesArray() {
  return Object.values(LANGUAGES);
}

// PHASE 6: Get contribution types array
export function getContributionTypesArray() {
  return Object.values(CONTRIBUTION_TYPES);
}

export default {
  CATEGORIES,
  CATEGORY_OPTIONS,
  RISK_LEVELS,
  RISK_OPTIONS,
  LANGUAGES,
  LANGUAGE_OPTIONS,
  PLATFORMS,
  PLATFORM_OPTIONS,
  HARM_TYPES,
  HARM_OPTIONS,
  CONTRIBUTION_TYPES,
  DIFF_COLORS,
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
  getContributionTypeById,
  getDiffColorByType,
  getConfidenceLevel,
  getCategoriesArray,
  getPlatformsArray,
  getRiskLevelsArray,
  getLanguagesArray,
  getContributionTypesArray
};
