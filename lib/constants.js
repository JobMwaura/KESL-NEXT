// lib/constants.js
// Shared constants, enums, and configuration for KESL
// Used by: submission form, admin, lexicon pages, validation

/**
 * Speech Categories
 * Based on research framework: derogatory → exclusionary → dangerous (escalation)
 */
export const CATEGORIES = {
  DEROGATORY: {
    id: 'derogatory',
    label: 'Derogatory',
    description: 'Violates civility norms. Uses contemptuous language targeting a group.',
    examples: ['Njaruo', 'Tugege', 'Mabooni'],
    color: '#fca5a5'
  },
  EXCLUSIONARY: {
    id: 'exclusionary',
    label: 'Exclusionary',
    description: 'Frames a group as not belonging. Questions citizenship or membership.',
    examples: ['Somalliphobia', 'Mwanafrika Kamili', 'Integration Failure'],
    color: '#fdba74'
  },
  DANGEROUS: {
    id: 'dangerous',
    label: 'Dangerous',
    description: 'Directly calls for, legitimizes, or incites violence.',
    examples: ['Terrorist Sympathizer', 'Kalenjin Incitement'],
    color: '#f87171'
  },
  CODED: {
    id: 'coded',
    label: 'Coded',
    description: 'Uses euphemistic language that implies exclusion/danger without stating it.',
    examples: ['Kikuyu Hegemony', 'Demographic Change', 'Ushindi wa Wote'],
    color: '#e9d5ff'
  }
};

export const CATEGORY_OPTIONS = Object.values(CATEGORIES).map(cat => ({
  value: cat.id,
  label: cat.label,
  description: cat.description
}));

/**
 * Risk Levels
 * Assessed based on: documented harm, targeting specificity, violence association
 */
export const RISK_LEVELS = {
  LOW: {
    id: 'low',
    label: 'Low',
    description: 'Mild derogatory language, low targeting specificity, no violence documentation',
    color: '#86efac',
    icon: '🟢'
  },
  MEDIUM: {
    id: 'medium',
    label: 'Medium',
    description: 'Clear contempt/exclusion, moderate targeting, some violence association',
    color: '#fbbf24',
    icon: '🟡'
  },
  HIGH: {
    id: 'high',
    label: 'High',
    description: 'Explicit exclusion/incitement, specific targeting, documented violence use',
    color: '#f87171',
    icon: '🔴'
  }
};

export const RISK_OPTIONS = Object.values(RISK_LEVELS).map(risk => ({
  value: risk.id,
  label: risk.label,
  description: risk.description
}));

/**
 * Languages
 * Based on Kenya's linguistic landscape and KESL scope
 */
export const LANGUAGES = {
  SHENG: {
    id: 'sheng',
    label: 'Sheng',
    description: 'Nairobi youth slang, dynamic coinage, platform: KenyaTalk, social media',
    region: 'Urban (primarily Nairobi)'
  },
  SWAHILI: {
    id: 'swahili',
    label: 'Swahili',
    description: 'National language, used across platforms and regions',
    region: 'Nationwide'
  },
  ENGLISH: {
    id: 'english',
    label: 'English',
    description: 'Official language, used on professional and international platforms',
    region: 'Nationwide'
  },
  MIXED: {
    id: 'mixed',
    label: 'Mixed',
    description: 'Code-switching between Sheng/Swahili/English (common in digital spaces)',
    region: 'Varies'
  }
};

export const LANGUAGE_OPTIONS = Object.values(LANGUAGES).map(lang => ({
  value: lang.id,
  label: lang.label,
  description: lang.description
}));

/**
 * Platforms
 * Where extreme speech appears in Kenya's digital ecosystem
 */
export const PLATFORMS = {
  REDDIT: {
    id: 'reddit',
    label: 'Reddit (r/Kenya)',
    type: 'large',
    anonymity: 'medium',
    moderation: 'high',
    reach: 'moderate',
    description: 'International platform, English-dominant, identified users'
  },
  TWITTER: {
    id: 'twitter',
    label: 'X (Twitter)',
    type: 'large',
    anonymity: 'low',
    moderation: 'high',
    reach: 'high',
    description: 'Public platform, identified users, institutional responses visible'
  },
  FACEBOOK: {
    id: 'facebook',
    label: 'Facebook',
    type: 'large',
    anonymity: 'low',
    moderation: 'medium',
    reach: 'high',
    description: 'Identified users, groups, moderate community enforcement'
  },
  KENYATALK: {
    id: 'kenyatalk',
    label: 'KenyaTalk',
    type: 'small',
    anonymity: 'medium',
    moderation: 'none',
    reach: 'moderate',
    description: 'Forum-based, Sheng/English, pseudonymous, unmoderated'
  },
  KENYALIST: {
    id: 'kenyalist',
    label: 'KenyanList',
    type: 'small',
    anonymity: 'medium',
    moderation: 'none',
    reach: 'small',
    description: 'Email-based forum, pseudonymous, older community'
  },
  TELEGRAM: {
    id: 'telegram',
    label: 'Telegram',
    type: 'small',
    anonymity: 'high',
    moderation: 'none',
    reach: 'high',
    description: 'Encrypted, fully anonymous channels, no moderation'
  },
  WHATSAPP: {
    id: 'whatsapp',
    label: 'WhatsApp',
    type: 'small',
    anonymity: 'high',
    moderation: 'none',
    reach: 'high',
    description: 'Encrypted groups, anonymous forwarding, peer-to-peer'
  },
  TIKTOK: {
    id: 'tiktok',
    label: 'TikTok',
    type: 'large',
    anonymity: 'medium',
    moderation: 'medium',
    reach: 'very_high',
    description: 'Short-form video, algorithm-driven reach, younger audience'
  },
  YOUTUBE: {
    id: 'youtube',
    label: 'YouTube',
    type: 'large',
    anonymity: 'medium',
    moderation: 'medium',
    reach: 'very_high',
    description: 'Video platform, comments, channel-based community'
  },
  DISCORD: {
    id: 'discord',
    label: 'Discord',
    type: 'small',
    anonymity: 'high',
    moderation: 'none',
    reach: 'moderate',
    description: 'Gaming/community servers, fully anonymous, server-dependent moderation'
  },
  OTHER: {
    id: 'other',
    label: 'Other',
    type: 'unknown',
    anonymity: 'unknown',
    moderation: 'unknown',
    reach: 'unknown',
    description: 'Specify in notes'
  }
};

export const PLATFORM_OPTIONS = Object.values(PLATFORMS)
  .filter(p => p.id !== 'other')
  .map(p => ({
    value: p.id,
    label: p.label,
    type: p.type
  }));

/**
 * Harm Types
 * Based on research: normalized contempt → primed exclusion → violence
 */
export const HARM_TYPES = {
  NORMALIZES_CONTEMPT: {
    id: 'normalizes_contempt',
    label: 'Normalizes contempt',
    shortLabel: 'Contempt',
    description: 'Portrays a group with contempt, treating negative stereotypes as normal or factual',
    prompt: 'Who does this speech normalize contempt toward? How is the group portrayed?',
    icon: '😔'
  },
  PRIMES_EXCLUSION: {
    id: 'primes_exclusion',
    label: 'Primes exclusion/eviction',
    shortLabel: 'Exclusion',
    description: 'Suggests a group should be excluded from opportunities, places, or political participation',
    prompt: 'From what is this group excluded? (land, jobs, neighborhoods, politics, citizenship)',
    icon: '🚫'
  },
  CUES_VIOLENCE: {
    id: 'cues_violence',
    label: 'Cues/legitimizes violence',
    shortLabel: 'Violence',
    description: 'Uses language that has preceded or accompanied physical violence against a group',
    prompt: 'What type of violence? (ethnic clashes, mob action, evictions, targeted attacks)',
    icon: '⚠️'
  },
  HARASSES: {
    id: 'harasses',
    label: 'Harasses individuals',
    shortLabel: 'Harassment',
    description: 'Targets specific individuals or small groups for sustained abuse',
    prompt: 'Describe the targeting and harassment pattern',
    icon: '📍'
  },
  OTHER: {
    id: 'other',
    label: 'Other harm',
    shortLabel: 'Other',
    description: 'Other form of harm not captured above',
    prompt: 'Describe the harm',
    icon: '❓'
  }
};

export const HARM_OPTIONS = Object.values(HARM_TYPES).map(harm => ({
  value: harm.id,
  label: harm.label,
  shortLabel: harm.shortLabel,
  description: harm.description,
  prompt: harm.prompt
}));

/**
 * Migration Speed Categories
 */
export const MIGRATION_SPEEDS = {
  FAST: {
    id: 'fast',
    label: 'Fast',
    description: '1-2 days between platforms',
    icon: '⚡'
  },
  MEDIUM: {
    id: 'medium',
    label: 'Medium',
    description: '3-5 days between platforms',
    icon: '→'
  },
  SLOW: {
    id: 'slow',
    label: 'Slow',
    description: '1+ weeks between platforms',
    icon: '🐢'
  }
};

/**
 * Amplification Levels
 */
export const AMPLIFICATION_LEVELS = {
  LOW: {
    id: 'low',
    label: 'Low',
    multiplier: '1-2x',
    description: 'Minimal amplification across platforms'
  },
  MEDIUM: {
    id: 'medium',
    label: 'Medium',
    multiplier: '2-5x',
    description: 'Moderate amplification'
  },
  HIGH: {
    id: 'high',
    label: 'High',
    multiplier: '5x+',
    description: 'Significant amplification across platforms'
  }
};

/**
 * Submission Status
 */
export const SUBMISSION_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  FLAGGED: 'flagged'
};

/**
 * Confidence Levels
 * Based on number and diversity of examples
 */
export const CONFIDENCE_LEVELS = {
  LOW: {
    id: 'low',
    label: 'Low',
    minExamples: 1,
    minPlatforms: 1,
    icon: '⚪',
    description: '1 example'
  },
  MEDIUM: {
    id: 'medium',
    label: 'Medium',
    minExamples: 2,
    minPlatforms: 1,
    icon: '🟡',
    description: '2-3 examples'
  },
  HIGH: {
    id: 'high',
    label: 'High',
    minExamples: 4,
    minPlatforms: 2,
    icon: '🟢',
    description: '4+ examples from multiple platforms'
  }
};

/**
 * Discourse Stages (in migration pathway)
 */
export const DISCOURSE_STAGES = {
  RECOGNITION: {
    id: 'recognition',
    label: 'Recognition',
    description: 'Institutional awareness, legal discussion',
    stage: 1
  },
  DEBATE: {
    id: 'debate',
    label: 'Debate',
    description: 'Policy vs. politics discussion, some personal criticism',
    stage: 2
  },
  DEGRADATION: {
    id: 'degradation',
    label: 'Degradation',
    description: 'Personal attacks dominate, legal awareness drops',
    stage: 3
  },
  MOBILIZATION: {
    id: 'mobilization',
    label: 'Mobilization',
    description: 'Actionable planning, ethnic rally, full dehumanization',
    stage: 4
  }
};

/**
 * Validation Rules
 */
export const VALIDATION_RULES = {
  DEFINITION_MIN_WORDS: 50,
  DEFINITION_WARN_WORDS: 120,
  DEFINITION_MAX_WORDS: 200,
  EXAMPLE_MIN_CHARS: 20,
  EXAMPLE_MAX_CHARS: 100,
  EXAMPLE_WARN_CHARS: 80,
  VARIANT_SIMILARITY_THRESHOLD: 0.8,
  MIN_EXAMPLES: 1,
  MIN_HARM_TYPES: 1
};

/**
 * Color Palette (for UI consistency)
 */
export const COLORS = {
  PRIMARY: '#2d5a7b',
  SUCCESS: '#10b981',
  WARNING: '#f59e0b',
  DANGER: '#ef4444',
  INFO: '#3b82f6',
  LIGHT_GRAY: '#e2e8f0',
  DARK_GRAY: '#475569',
  BACKGROUND: '#f8fafc'
};

/**
 * Helper: Get category by ID
 */
export function getCategoryById(id) {
  return Object.values(CATEGORIES).find(cat => cat.id === id);
}

/**
 * Helper: Get platform by ID
 */
export function getPlatformById(id) {
  return PLATFORMS[Object.keys(PLATFORMS).find(key => PLATFORMS[key].id === id)];
}

/**
 * Helper: Get harm type by ID
 */
export function getHarmTypeById(id) {
  return Object.values(HARM_TYPES).find(harm => harm.id === id);
}

/**
 * Helper: Get risk level by ID
 */
export function getRiskLevelById(id) {
  return Object.values(RISK_LEVELS).find(risk => risk.id === id);
}

/**
 * Helper: Get language by ID
 */
export function getLanguageById(id) {
  return Object.values(LANGUAGES).find(lang => lang.id === id);
}

/**
 * Helper: Get confidence level config
 */
export function getConfidenceLevel(exampleCount, platformCount = 1) {
  if (exampleCount < CONFIDENCE_LEVELS.LOW.minExamples) {
    return null;
  }
  if (exampleCount >= CONFIDENCE_LEVELS.HIGH.minExamples && platformCount >= CONFIDENCE_LEVELS.HIGH.minPlatforms) {
    return CONFIDENCE_LEVELS.HIGH;
  }
  if (exampleCount >= CONFIDENCE_LEVELS.MEDIUM.minExamples) {
    return CONFIDENCE_LEVELS.MEDIUM;
  }
  return CONFIDENCE_LEVELS.LOW;
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
  getConfidenceLevel
};