'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function KeyLiteraturePage() {
  const [expandedId, setExpandedId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const literature = [
    {
      id: 1,
      citation: 'Udupa, S. (2023). Extreme speech. In C. Strippel, S. Paasch-Colberg, M. Emmer, & J. Trebbe (Eds.), Challenges and perspectives of hate speech research (pp. 45-62). Cologne: Universität zu Köln. https://doi.org/10.48541/dcr.v12.14',
      title: 'Extreme Speech',
      author: 'Sudha Udupa',
      year: 2023,
      category: 'Conceptual Framework',
      summary: 'Foundational definition of extreme speech as a scholarly framework that transcends traditional hate speech categorization. Udupa argues that extreme speech recognizes cultural specificity, historical context, and the ambiguity of harmful expression across different media ecologies and linguistic communities.',
      keyPoints: [
        'Moves beyond Western definitions of hate speech',
        'Recognizes cultural and linguistic specificity',
        'Situates speech in historical and political context',
        'Core framework for KESL project'
      ]
    },
    {
      id: 2,
      citation: 'Udupa, S., Gagliardone, I., & Hervik, P. (Eds.). (2021). Extreme speech: Global practices and local contexts. Indiana University Press.',
      title: 'Extreme Speech: Global Practices and Local Contexts',
      author: 'Sudha Udupa, Iginio Gagliardone, & Pål Hervik',
      year: 2021,
      category: 'Conceptual Framework',
      summary: 'Comprehensive edited volume examining extreme speech across multiple global contexts with emphasis on how local political histories, media ecologies, and social structures shape what constitutes extremity in digital speech.',
      keyPoints: [
        'Global comparative analysis of extreme speech',
        'Context-specific understandings essential',
        'Platform affordances shape speech patterns',
        'Demonstrates variation across regions'
      ]
    },
    {
      id: 3,
      citation: 'Katiambo, D. (2021). Incivility and hate speech in Kenya: An analysis of the digital sphere. In S. Udupa, I. Gagliardone, & P. Hervik (Eds.), Extreme speech: Global practices and local contexts (pp. 189-210). Indiana University Press.',
      title: 'Incivility and Hate Speech in Kenya: An Analysis of the Digital Sphere',
      author: 'Daniel Katiambo',
      year: 2021,
      category: 'Kenya Context',
      summary: 'Kenya-specific analysis critiquing Western frameworks of hate speech in the Kenyan digital context. Examines how incivility, ethnic identity, and political rhetoric intersect in ways that cannot be understood through purely legal or Western definitions.',
      keyPoints: [
        'Critiques universal hate speech categories',
        'Examines Kenya\'s ethnic political economy online',
        'Incivility as political phenomenon in Kenya',
        'Challenges applicability of Western moderation standards'
      ]
    },
    {
      id: 4,
      citation: 'Benesch, S. (2013). Dangerous speech: A practical guide. Retrieved from https://dangerousspeech.org/',
      title: 'Dangerous Speech: A Practical Guide',
      author: 'Susan Benesch',
      year: 2013,
      category: 'Conceptual Framework',
      summary: 'Framework identifying speech that creates risk of violence against target communities. Benesch\'s dangerous speech project provides methodology for assessing when speech transitions from incitement to material risk of harm.',
      keyPoints: [
        'Assesses speech\'s potential to incite violence',
        'Context-dependent assessment methodology',
        'Applicable across languages and cultures',
        'Used to identify highest-risk content'
      ]
    },
    {
      id: 5,
      citation: 'Benesch, S., Tapsell, S., & DeCook, J. (2020). Online hate speech in Myanmar: A human rights concern. Dangerous Speech Project. Retrieved from https://dangerousspeech.org/myanmar/',
      title: 'Online Hate Speech in Myanmar: A Human Rights Concern',
      author: 'Susan Benesch, Sharita Tapsell, & Julia DeCook',
      year: 2020,
      category: 'Comparative Methods',
      summary: 'Application of dangerous speech framework to Myanmar\'s digital context, demonstrating how speech dynamics differ across Asian contexts. Particularly relevant for comparative analysis with Kenya\'s platform-specific patterns.',
      keyPoints: [
        'Demonstrates framework in Global South context',
        'Platform-specific analysis (Facebook dominance)',
        'Links speech to real-world violence',
        'Methodological approach for similar contexts'
      ]
    },
    {
      id: 6,
      citation: 'Mozilla Foundation. (2022). From dance app to political mercenary: How disinformation on TikTok gaslights political tensions in Kenya. Mozilla Foundation. Retrieved from https://foundation.mozilla.org/',
      title: 'From Dance App to Political Mercenary: Disinformation on TikTok and Kenya\'s Election',
      author: 'Mozilla Foundation (Odanga Madung)',
      year: 2022,
      category: 'Kenya Context',
      summary: 'Critical analysis documenting how TikTok hosted sophisticated disinformation campaigns during Kenya\'s 2022 election. Research examined 130+ videos from 33 accounts with 4+ million views, revealing hate speech, incitement, and synthetic content violating TikTok\'s own policies. Demonstrates content moderation failures on platforms targeting younger Kenyan audiences.',
      keyPoints: [
        'TikTok failed first real test in African democracy',
        'Platform moderation lacks local context and resources',
        'Documented incitement against ethnic communities',
        'Synthetic/manipulated content spread unchecked',
        'Similar tactics to 2017 Harris Media campaigns',
        'Younger audiences lack political maturity to filter disinformation',
        'Algorithmic amplification of harmful content'
      ]
    },
    {
      id: 7,
      citation: 'Gillespie, T. (2010). The politics of platforms. New Media & Society, 12(3), 347-364. https://doi.org/10.1177/1461444809342738',
      title: 'The Politics of Platforms',
      author: 'Tarleton Gillespie',
      year: 2010,
      category: 'Platform Studies',
      summary: 'Foundational work analyzing platforms not as neutral spaces but as active mediators shaped by economic interests, technical affordances, and policy decisions. Essential for understanding how platform design enables or constrains extreme speech.',
      keyPoints: [
        'Platforms as cultural intermediaries',
        'Technical systems encode values and policies',
        'Algorithmic amplification shapes visibility',
        'Content moderation reflects platform power'
      ]
    },
    {
      id: 8,
      citation: 'Blommaert, J., & Dong, J. (2010). Ethnographic fieldwork: A beginner\'s guide. Multilingual Matters.',
      title: 'Ethnographic Fieldwork: A Beginner\'s Guide',
      author: 'Jan Blommaert & Jie Dong',
      year: 2010,
      category: 'Ethnographic Methods',
      summary: 'Comprehensive methodological guide for conducting ethnographic research in digital and contemporary contexts. Provides foundation for immersive observation of online communities and speech practices in their social context.',
      keyPoints: [
        'Fieldwork methodology in digital spaces',
        'Participant observation in online communities',
        'Ethical considerations for digital ethnography',
        'Documenting lived experiences of platform users'
      ]
    },
    {
      id: 9,
      citation: 'Proferes, N., Jones, N., Gilbert, S., Fiesler, C., & Zimmer, M. (2021). Studying Reddit: A systematic overview of disciplines, approaches, methods, and ethics. Proceedings of the 14th International AAAI Conference on Web and Social Media, 14, 1019–1029.',
      title: 'Studying Reddit: A Systematic Overview of Disciplines, Approaches, Methods, and Ethics',
      author: 'Nicholas Proferes, Nolan Jones, Sara Gilbert, Casey Fiesler, & Michael Zimmer',
      year: 2021,
      category: 'Platform Methods',
      summary: 'Systematic review of Reddit research methodologies across disciplines. Directly relevant for KESL\'s analysis of r/Kenya subreddit and provides ethical frameworks for small-platform studies.',
      keyPoints: [
        'Reddit as research site across disciplines',
        'Ethical considerations for Reddit studies',
        'Community dynamics and moderation',
        'Methodological approaches for subreddit analysis'
      ]
    },
    {
      id: 10,
      citation: 'Ng, L. H. X., Urquhart, L., Kumar, P., Panagiotopoulos, P., Taddeo, M., & Floridi, L. (2024). Navigating decentralized online social networks: An overview of technical and societal challenges in architectural choices. arXiv preprint arXiv:2504.00071.',
      title: 'Navigating Decentralized Online Social Networks: Technical and Societal Challenges',
      author: 'Ng, L. H. X., et al.',
      year: 2024,
      category: 'Platform Studies',
      summary: 'Recent analysis of decentralized and alternative social networks examining technical architecture and governance implications. Highly relevant for understanding small platforms like Telegram and KenyanList that operate outside major platform oversight.',
      keyPoints: [
        'Decentralization creates moderation gaps',
        'Technical architecture shapes content governance',
        'Alternative platforms lack resources for moderation',
        'User autonomy vs. community safety tradeoffs'
      ]
    },
    {
      id: 11,
      citation: 'Teneo. (2025). The rise of decentralised and alternative social media platforms. Retrieved from https://www.teneo.com/insights/',
      title: 'The Rise of Decentralised and Alternative Social Media Platforms',
      author: 'Teneo',
      year: 2025,
      category: 'Platform Studies',
      summary: 'Current analysis of the broader shift toward alternative and decentralized platforms, examining why users migrate from major platforms and what governance challenges emerge in these spaces.',
      keyPoints: [
        'Migration patterns from major platforms',
        'User motivations for platform switching',
        'Governance and moderation challenges on alternatives',
        'Implications for content regulation'
      ]
    },
    {
      id: 12,
      citation: 'Kombo, Z. (2024). Expand NCIC\'s mandate to tackle all forms of hate speech. Amnesty International Kenya. Retrieved from https://www.amnestykenya.org/expand-ncics-mandate-to-tackle-all-forms-of-hate-speech/',
      title: 'Expand NCIC\'s Mandate to Tackle All Forms of Hate Speech',
      author: 'Zaina Kombo',
      year: 2024,
      category: 'Kenya Policy & Advocacy',
      summary: 'Policy brief arguing for expansion of Kenya\'s National Cohesion and Integration Commission (NCIC) mandate beyond ethnic hate speech to address intersectional discrimination including class, gender, sexual orientation, and emerging stereotypes. Cites 2023 Amnesty/Tribeless Youth poll finding that 1 in 2 Kenyans experienced discrimination, highlighting gaps in current legal protections and moderation frameworks.',
      keyPoints: [
        'NCIC mandate too restrictive—limited to ethnic hate speech',
        'Discrimination is intersectional (class, gender, sexual orientation, etc.)',
        'Survey data: 50% of Kenyans experienced discrimination',
        'Current legislation gaps leave vulnerable groups unprotected',
        'Unchecked discriminatory narratives threaten democratic stability',
        'Leaders\' rhetoric has profound impacts on cohesion',
        'Need holistic legislation aligned with 2010 Constitution Article 27'
      ]
    },
    {
      id: 13,
      citation: 'Dadacha, G. L. (2025). How online hate speech threatens peace and Kenya\'s social fabric. The Standard, April 5, 2025. Retrieved from https://www.standardmedia.co.ke/opinion/',
      title: 'How Online Hate Speech Threatens Peace and Kenya\'s Social Fabric',
      author: 'Guyo Liban Dadacha',
      year: 2025,
      category: 'Kenya Context',
      summary: 'Opinion piece from Head of Peacebuilding & Reconciliation at NCIC documenting how online hate speech has amplified from offline whispers to broadcast incitement reaching millions instantly. Argues that digital spaces mirror and magnify Kenya\'s ethnic divisions, with anonymity emboldening speech that would never occur offline. Traces historical parallels to 2007/2008 post-election violence and calls for multi-pronged approach including stronger regulation, digital literacy, counter-narratives, and platform accountability.',
      keyPoints: [
        'Digital space has become Kenya\'s new public square',
        'Speed and scale of online hate speech amplifies real-world threat',
        'Anonymity emboldens hate speech that would be unthinkable offline',
        'Influencers and politicians use bots for coordinated amplification',
        'WhatsApp jokes and TikTok content fuel violence mobilization',
        'Constant exposure to hate speech normalizes discriminatory rhetoric',
        'Desensitization occurs when moderate voices are drowned out',
        'Multi-pronged approach: regulation, digital literacy, counter-narratives',
        'Platforms must be held accountable for failing to act on flagged content'
      ]
    }
  ];

  const categories = ['All', ...new Set(literature.map(item => item.category))];
  const filteredLiterature = selectedCategory === 'All' 
    ? literature 
    : literature.filter(item => item.category === selectedCategory);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <>
      <Header />
      <main style={{ minHeight: '100vh', backgroundColor: '#ffffff', padding: '40px 20px' }}>
        <section style={{ maxWidth: '1000px', margin: '0 auto' }}>
          {/* Hero Section */}
          <div style={{ marginBottom: '60px', textAlign: 'center' }}>
            <h1 style={{
              fontSize: '42px',
              fontWeight: '700',
              color: '#1a3a52',
              margin: '0 0 20px 0',
              lineHeight: '1.2'
            }}>
              Key Literature
            </h1>
            <p style={{
              fontSize: '16px',
              color: '#475569',
              margin: '0',
              lineHeight: '1.6',
              maxWidth: '700px',
              marginLeft: 'auto',
              marginRight: 'auto'
            }}>
              Foundational sources that inform our research on extreme speech patterns in Kenya's digital spaces. Click any citation to explore the key insights and how they relate to our work.
            </p>
          </div>

          {/* Category Filter */}
          <div style={{ marginBottom: '40px' }}>
            <div style={{
              display: 'flex',
              gap: '10px',
              flexWrap: 'wrap',
              justifyContent: 'center'
            }}>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: selectedCategory === cat ? '#2d5a7b' : '#e2e8f0',
                    color: selectedCategory === cat ? 'white' : '#1e293b',
                    border: 'none',
                    borderRadius: '20px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '13px',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    if (selectedCategory !== cat) {
                      e.target.style.backgroundColor = '#cbd5e1';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedCategory !== cat) {
                      e.target.style.backgroundColor = '#e2e8f0';
                    }
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Literature List */}
          <div style={{ display: 'grid', gap: '20px' }}>
            {filteredLiterature.map((item) => (
              <div
                key={item.id}
                style={{
                  backgroundColor: 'white',
                  border: '1px solid #cbd5e1',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {/* Header - Always Visible */}
                <button
                  onClick={() => toggleExpand(item.id)}
                  style={{
                    width: '100%',
                    padding: '20px',
                    backgroundColor: 'white',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    gap: '15px'
                  }}
                >
                  <div style={{ flex: 1 }}>
                    {/* Category Badge */}
                    <div style={{ marginBottom: '8px' }}>
                      <span style={{
                        display: 'inline-block',
                        backgroundColor: '#f0f4f8',
                        color: '#2d5a7b',
                        padding: '4px 10px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: '600',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>
                        {item.category}
                      </span>
                    </div>

                    {/* Title and Citation */}
                    <h3 style={{
                      fontSize: '16px',
                      fontWeight: '700',
                      color: '#1e293b',
                      margin: '8px 0 12px 0'
                    }}>
                      {item.title}
                    </h3>

                    {/* APA Citation */}
                    <p style={{
                      fontSize: '12px',
                      color: '#64748b',
                      margin: '0',
                      lineHeight: '1.5',
                      fontStyle: 'italic'
                    }}>
                      {item.citation}
                    </p>
                  </div>

                  {/* Expand Icon */}
                  <div style={{
                    fontSize: '20px',
                    color: '#94a3b8',
                    flexShrink: 0,
                    transition: 'transform 0.3s',
                    transform: expandedId === item.id ? 'rotate(180deg)' : 'rotate(0deg)'
                  }}>
                    ▼
                  </div>
                </button>

                {/* Expandable Content */}
                {expandedId === item.id && (
                  <div style={{
                    backgroundColor: '#f8fafc',
                    borderTop: '1px solid #e2e8f0',
                    padding: '20px',
                    animation: 'fadeIn 0.3s ease-in'
                  }}>
                    {/* Summary */}
                    <div style={{ marginBottom: '20px' }}>
                      <h4 style={{
                        fontSize: '13px',
                        fontWeight: '700',
                        color: '#1e293b',
                        margin: '0 0 8px 0',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        color: '#94a3b8'
                      }}>
                        Overview
                      </h4>
                      <p style={{
                        margin: '0',
                        fontSize: '14px',
                        color: '#475569',
                        lineHeight: '1.7'
                      }}>
                        {item.summary}
                      </p>
                    </div>

                    {/* Key Points */}
                    <div>
                      <h4 style={{
                        fontSize: '13px',
                        fontWeight: '700',
                        color: '#1e293b',
                        margin: '0 0 10px 0',
                        textTransform: 'uppercase',
                        color: '#94a3b8'
                      }}>
                        Key Points
                      </h4>
                      <ul style={{
                        margin: 0,
                        paddingLeft: '20px',
                        fontSize: '13px',
                        color: '#475569',
                        lineHeight: '1.6'
                      }}>
                        {item.keyPoints.map((point, idx) => (
                          <li key={idx} style={{ marginBottom: '6px' }}>
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredLiterature.length === 0 && (
            <div style={{
              textAlign: 'center',
              padding: '40px 20px',
              color: '#64748b'
            }}>
              <p style={{ fontSize: '16px' }}>
                No literature found in this category
              </p>
            </div>
          )}
        </section>

        {/* Info Section */}
        <section style={{
          padding: '40px 20px',
          backgroundColor: '#ecfdf5',
          borderTop: '1px solid #86efac',
          marginTop: '60px'
        }}>
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <p style={{
              fontSize: '13px',
              color: '#065f46',
              lineHeight: '1.6',
              margin: 0
            }}>
              <strong>📖 About this reading list:</strong> This curated collection represents foundational and contemporary works across extreme speech theory, platform studies, ethnographic methods, and Kenya-specific digital research. These materials directly inform our research methodology, conceptual frameworks, and understanding of how extreme speech patterns operate across Kenya's digital platform ecosystem—from major platforms like TikTok to smaller, decentralized networks like Telegram, Reddit, and KenyanList.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}