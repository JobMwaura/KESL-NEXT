// Kenya Extreme Speech Lexicon - Initial Data
// This file will eventually be replaced by Supabase queries
// For now, it serves as the data structure template and seed data

export const categories = ['Derogatory', 'Exclusionary', 'Dangerous', 'Coded'];
export const platforms = ['Reddit', 'Telegram', 'KenyaList', 'KenyaTalk', 'Twitter', 'Facebook', 'WhatsApp', 'TikTok', 'YouTube'];
export const riskLevels = ['Low', 'Medium', 'High'];

export const lexiconTerms = [
  {
    id: '1',
    term: 'Njaruo',
    language: 'Sheng',
    literal_gloss: 'Derogatory reference',
    meaning: 'Derogatory label used to describe individuals from Luo ethnic background, often used in dismissive or contemptuous contexts',
    category: 'Derogatory',
    risk: 'Medium',
    tags: ['ethnic', 'election', 'political'],
    migration: ['TV', 'X', 'Telegram', 'KenyaList'],
    examples: [
      {
        id: 'ex1',
        short_quote: 'Used in context of ethnic stereotyping and contempt (details redacted)',
        platform: 'KenyaTalk',
        context: 'Relates to economic stereotyping and ethnic contempt',
        date: '2025-09-09',
        source_ref: 'Week 7: KT – ethnic discourse thread'
      },
      {
        id: 'ex2',
        short_quote: 'Appears in election-related discussions (redacted)',
        platform: 'Telegram',
        context: 'During 2022 election cycle tensions',
        date: '2022-08-15',
        source_ref: 'Research memo'
      }
    ],
    votes: 24,
    comments_count: 8,
    created_at: '2025-06-01',
    status: 'approved'
  },
  {
    id: '2',
    term: 'Somalliphobia',
    language: 'English',
    literal_gloss: 'Fear/suspicion of Somalis',
    meaning: 'Systematic targeting, suspicion, and exclusionary attitudes toward Somali communities in Kenya, including conspiracy theories about loyalty and security threats',
    category: 'Exclusionary',
    risk: 'High',
    tags: ['ethnic', 'security', 'conspiracy', 'terrorism'],
    migration: ['Reddit', 'X', 'Telegram', 'KenyaList'],
    examples: [
      {
        id: 'ex3',
        short_quote: 'Assumes Somalis have ties to terrorism (redacted)',
        platform: 'Reddit',
        context: 'AMA thread questioning community loyalty',
        date: '2025-05-10',
        source_ref: 'r/Kenya – Somali community discussion'
      },
      {
        id: 'ex4',
        short_quote: 'Questions citizenship and belonging (redacted)',
        platform: 'KenyaList',
        context: 'General discussion about integration',
        date: '2025-04-20',
        source_ref: 'KL Forum post'
      },
      {
        id: 'ex5',
        short_quote: 'Conspiracy theory about wealth and tax evasion (redacted)',
        platform: 'Telegram',
        context: 'Business community discussion',
        date: '2025-03-15',
        source_ref: 'Private Telegram group'
      }
    ],
    votes: 45,
    comments_count: 12,
    created_at: '2025-06-05',
    status: 'approved'
  },
  {
    id: '3',
    term: 'Questionable Loyalty',
    language: 'English',
    literal_gloss: 'Doubt about patriotism',
    meaning: 'Coded language suggesting that members of certain ethnic communities (especially Somalis) cannot be trusted as loyal Kenyans; implies conditional citizenship',
    category: 'Dangerous',
    risk: 'High',
    tags: ['citizenship', 'ethnic', 'political'],
    migration: ['Reddit', 'WhatsApp', 'X'],
    examples: [
      {
        id: 'ex6',
        short_quote: 'If Somalia invaded, would they join them? (redacted)',
        platform: 'Reddit',
        context: 'Question implying disloyalty based on ethnicity',
        date: '2025-02-14',
        source_ref: 'r/Kenya – AMA thread'
      }
    ],
    votes: 38,
    comments_count: 15,
    created_at: '2025-06-10',
    status: 'approved'
  },
  {
    id: '4',
    term: 'Kikuyu Hegemony',
    language: 'English',
    literal_gloss: 'Kikuyu ethnic dominance',
    meaning: 'Coded language used to describe perceived ethnic dominance of Kikuyu people in economic and political spheres; often used in exclusionary or divisive contexts',
    category: 'Coded',
    risk: 'Medium',
    tags: ['ethnic', 'political', 'economic', 'election'],
    migration: ['X', 'Telegram', 'KenyaList'],
    examples: [
      {
        id: 'ex7',
        short_quote: 'Discussion of economic control and political power (redacted)',
        platform: 'Twitter',
        context: 'Election cycle political discourse',
        date: '2025-08-20',
        source_ref: 'Political discussion thread'
      },
      {
        id: 'ex8',
        short_quote: 'References to land and business monopolies (redacted)',
        platform: 'Telegram',
        context: 'Economic grievance discussion',
        date: '2025-07-10',
        source_ref: 'Telegram channel'
      }
    ],
    votes: 31,
    comments_count: 9,
    created_at: '2025-06-12',
    status: 'approved'
  },
  {
    id: '5',
    term: 'Mwanafrika Kamili',
    language: 'Swahili',
    literal_gloss: 'Complete/true African',
    meaning: 'Phrase used to question citizenship and belonging of specific communities, suggesting that some residents are not "true" Africans or Kenyans',
    category: 'Exclusionary',
    risk: 'Medium',
    tags: ['citizenship', 'identity', 'exclusion'],
    migration: ['Facebook', 'WhatsApp'],
    examples: [
      {
        id: 'ex9',
        short_quote: 'When did you become Kenyan? (redacted)',
        platform: 'Facebook',
        context: 'University setting, questioning student identity',
        date: '2025-05-05',
        source_ref: 'Facebook discussion'
      }
    ],
    votes: 19,
    comments_count: 5,
    created_at: '2025-06-15',
    status: 'approved'
  },
  {
    id: '6',
    term: 'Mabooni',
    language: 'Sheng',
    literal_gloss: 'Derogatory label',
    meaning: 'Derogatory term used to describe individuals from specific ethnic backgrounds or to demean behaviors associated with particular communities',
    category: 'Derogatory',
    risk: 'Medium',
    tags: ['ethnic', 'derogatory'],
    migration: ['Twitter', 'TikTok'],
    examples: [
      {
        id: 'ex10',
        short_quote: 'Used in social media to mock behaviors (redacted)',
        platform: 'TikTok',
        context: 'Comments on ethnic-coded video',
        date: '2025-07-01',
        source_ref: 'TikTok comments section'
      }
    ],
    votes: 12,
    comments_count: 4,
    created_at: '2025-06-18',
    status: 'approved'
  },
  {
    id: '7',
    term: 'Integration Failure',
    language: 'English',
    literal_gloss: 'Lack of cultural assimilation',
    meaning: 'Coded language implying that certain communities (especially Somalis) refuse to integrate into broader Kenyan society, used to justify exclusion',
    category: 'Exclusionary',
    risk: 'Medium',
    tags: ['integration', 'cultural', 'exclusion'],
    migration: ['Reddit', 'Facebook'],
    examples: [
      {
        id: 'ex11',
        short_quote: 'Why do they always stay separate? (redacted)',
        platform: 'Reddit',
        context: 'Discussion of community cohesion',
        date: '2025-06-20',
        source_ref: 'r/Kenya discussion'
      }
    ],
    votes: 28,
    comments_count: 11,
    created_at: '2025-06-20',
    status: 'approved'
  },
  {
    id: '8',
    term: 'Terrorist Sympathizer',
    language: 'English',
    literal_gloss: 'Support for terrorism',
    meaning: 'Accusation used to target Somali communities and others, implying association with Al-Shabaab or other militant groups based on ethnicity',
    category: 'Dangerous',
    risk: 'High',
    tags: ['security', 'terrorism', 'ethnic', 'conspiracy'],
    migration: ['Twitter', 'Telegram'],
    examples: [
      {
        id: 'ex12',
        short_quote: 'Assume they know where terrorists hide (redacted)',
        platform: 'Telegram',
        context: 'Security discussion channeling stereotypes',
        date: '2025-05-30',
        source_ref: 'Telegram security channel'
      }
    ],
    votes: 42,
    comments_count: 18,
    created_at: '2025-06-22',
    status: 'approved'
  },
  {
    id: '9',
    term: 'Ushindi wa Wote',
    language: 'Swahili',
    literal_gloss: 'Victory for all',
    meaning: 'Political slogan that has been used divisively along ethnic lines during elections to mobilize support and create in-group/out-group dynamics',
    category: 'Coded',
    risk: 'Medium',
    tags: ['political', 'election', 'ethnic'],
    migration: ['X', 'Facebook', 'Telegram'],
    examples: [
      {
        id: 'ex13',
        short_quote: 'Used in campaign with ethnic undertones (redacted)',
        platform: 'Facebook',
        context: '2022 election campaign',
        date: '2022-07-15',
        source_ref: 'Election campaign post'
      }
    ],
    votes: 16,
    comments_count: 6,
    created_at: '2025-06-25',
    status: 'approved'
  },
  {
    id: '10',
    term: 'Demographic Change',
    language: 'English',
    literal_gloss: 'Population shift',
    meaning: 'Coded language used in conspiratorial contexts to suggest that certain ethnic groups are deliberately changing regional demographics; often paired with replacement theory',
    category: 'Coded',
    risk: 'Medium',
    tags: ['conspiracy', 'demographic', 'ethnic'],
    migration: ['KenyaList', 'Telegram'],
    examples: [
      {
        id: 'ex14',
        short_quote: 'References to bussing in voters or settlers (redacted)',
        platform: 'KenyaList',
        context: 'Election integrity discussion',
        date: '2025-09-01',
        source_ref: 'KL forum thread'
      }
    ],
    votes: 22,
    comments_count: 7,
    created_at: '2025-06-28',
    status: 'approved'
  }
];

// Helper functions for data access
export function getTermById(id) {
  return lexiconTerms.find(term => term.id === id);
}

export function getTermsByCategory(category) {
  return lexiconTerms.filter(term => term.category === category && term.status === 'approved');
}

export function getTermsByPlatform(platform) {
  return lexiconTerms.filter(term => 
    term.migration.includes(platform) && term.status === 'approved'
  );
}

export function getTermsByRisk(risk) {
  return lexiconTerms.filter(term => term.risk === risk && term.status === 'approved');
}

export function getTermsByTag(tag) {
  return lexiconTerms.filter(term => 
    term.tags.includes(tag) && term.status === 'approved'
  );
}

export function searchTerms(query) {
  const lowerQuery = query.toLowerCase();
  return lexiconTerms.filter(term => 
    (term.term.toLowerCase().includes(lowerQuery) ||
     term.meaning.toLowerCase().includes(lowerQuery) ||
     term.tags.some(tag => tag.toLowerCase().includes(lowerQuery))) &&
    term.status === 'approved'
  );
}

export function getPendingTerms() {
  return lexiconTerms.filter(term => term.status === 'pending');
}