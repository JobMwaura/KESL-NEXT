'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function UnderstandingExtremeSpeech() {
  const [activeTab, setActiveTab] = useState('definition');

  const tabs = [
    { id: 'definition', label: 'Core Definition', icon: '📖' },
    { id: 'why-extreme', label: 'Why "Extreme Speech"?', icon: '❓' },
    { id: 'categories', label: 'Key Categories', icon: '🏷️' },
    { id: 'kenya-context', label: 'Our Approach in Kenya', icon: '🇰🇪' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-navy to-blue-700 text-white py-16">
        <div className="max-w-4xl mx-auto px-6">
          <Link href="/" className="text-blue-200 hover:text-white mb-4 flex items-center gap-2">
            ← Back to Home
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Understanding Extreme Speech</h1>
          <p className="text-xl text-blue-100">
            A critical conceptual framework for analyzing harmful online discourse
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        
        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-3 mb-12 border-b border-gray-200 pb-4">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span className="text-xl">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-lg p-10">

          {/* Definition Tab */}
          {activeTab === 'definition' && (
            <div className="space-y-8 animate-fadeIn">
              <div>
                <h2 className="text-3xl font-bold text-navy mb-6">Core Definition</h2>
                
                <div className="bg-blue-50 border-l-4 border-blue-600 p-6 mb-8 rounded">
                  <p className="text-lg text-gray-800 italic mb-4">
                    "Extreme speech is a critical conceptual framework that aims to uncover vitriolic online cultures through comparative and ethnographic excavations of digital practices."
                  </p>
                  <p className="text-sm text-gray-600">
                    — Udupa, S. (2023). Extreme speech. In C. Strippel, S. Paasch-Colberg, M. Emmer, & J. Trebbe (Eds.), <em>Challenges and perspectives of hate speech research</em> (pp. 233–248). Digital Communication Research. https://doi.org/10.48541/dcr.v12.14
                  </p>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-navy mb-3">Key Principle</h3>
                    <p className="text-gray-700 leading-relaxed">
                      Extreme speech is <span className="font-semibold">not just another definition</span> or a term replaceable with "extremist speech." Rather, it is a conceptual framework developed to foreground <strong>historical awareness</strong>, <strong>critical deconstruction of existing categories</strong>, and a <strong>grounded understanding of evolving practices</strong> in online communities.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-navy mb-3">Core Goal</h3>
                    <p className="text-gray-700 leading-relaxed">
                      To holistically analyze the contours and consequences of contemporary digital hate cultures by examining both <strong>proximate contexts</strong> (media affordances, situated speech cultures) and <strong>deep contextualization</strong> (grave historical continuities and technopolitical formations on a planetary scale).
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Why Extreme Speech Tab */}
          {activeTab === 'why-extreme' && (
            <div className="space-y-8 animate-fadeIn">
              <div>
                <h2 className="text-3xl font-bold text-navy mb-6">Why "Extreme Speech" Instead of "Hate Speech"?</h2>
                
                <div className="space-y-6">
                  <div className="border-l-4 border-orange-500 pl-6">
                    <h3 className="text-xl font-bold text-orange-700 mb-3">The Problem with "Hate Speech"</h3>
                    <p className="text-gray-700 mb-3">
                      Traditional "hate speech" discourse has significant limitations:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                      <li><strong>Predefined effects:</strong> It assumes hate speech is inherently negative and damaging</li>
                      <li><strong>Legal focus:</strong> Emphasizes culpability rather than understanding social dynamics</li>
                      <li><strong>Universalizing:</strong> Imposes Western legal-normative definitions across diverse contexts</li>
                      <li><strong>Misuse potential:</strong> Can be weaponized by regimes to suppress dissent or target minoritized groups</li>
                      <li><strong>Closing dialogue:</strong> Functions as an accusation that closes off avenues for change</li>
                    </ul>
                  </div>

                  <div className="bg-green-50 border-l-4 border-green-600 pl-6">
                    <h3 className="text-xl font-bold text-green-700 mb-3">What "Extreme Speech" Offers</h3>
                    <ul className="space-y-3 text-gray-700">
                      <li>✓ <strong>Ambiguity recognition:</strong> Acknowledges that speech can be simultaneously subversive and harmful</li>
                      <li>✓ <strong>Cultural sensitivity:</strong> Considers cultural variations in speech norms and meanings</li>
                      <li>✓ <strong>Historical depth:</strong> Analyzes connections to colonial histories and power structures</li>
                      <li>✓ <strong>Ethnographic approach:</strong> Centers lived experiences and emic (insider) categories</li>
                      <li>✓ <strong>Grounded understanding:</strong> Emerges from understanding communities, not imposing frameworks</li>
                    </ul>
                  </div>

                  <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded">
                    <p className="text-gray-800">
                      <span className="font-semibold">In Kenya's context:</span> As scholar Katiambo (2021) argues, "the polysemy of extreme speech is removed when incivility becomes known as hate speech, blocking us from ever knowing its alternative possibilities." Understanding the ambivalence is critical.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Categories Tab */}
          {activeTab === 'categories' && (
            <div className="space-y-8 animate-fadeIn">
              <div>
                <h2 className="text-3xl font-bold text-navy mb-6">Three Key Categories of Extreme Speech</h2>
                
                <div className="space-y-6">
                  {/* Derogatory */}
                  <div className="border-2 border-purple-200 rounded-lg p-6 bg-purple-50">
                    <h3 className="text-xl font-bold text-purple-700 mb-3">1. Derogatory Extreme Speech</h3>
                    <p className="text-gray-800 mb-3">
                      <span className="font-semibold">Definition:</span> Expressions that do not conform to accepted norms of civility within specific local or national contexts and are targeted at any group (but not explicitly excluding vulnerable/historically disadvantaged groups).
                    </p>
                    <p className="text-gray-700 text-sm">
                      <span className="font-semibold">Examples:</span> Derogatory jokes, insults, sobriquets
                    </p>
                    <p className="text-gray-700 text-sm mt-2">
                      <span className="font-semibold">Characteristic:</span> Ambivalent—can challenge power structures OR perpetuate harm depending on context
                    </p>
                  </div>

                  {/* Exclusionary */}
                  <div className="border-2 border-red-200 rounded-lg p-6 bg-red-50">
                    <h3 className="text-xl font-bold text-red-700 mb-3">2. Exclusionary Extreme Speech</h3>
                    <p className="text-gray-800 mb-3">
                      <span className="font-semibold">Definition:</span> Expressions that call for or imply excluding disadvantaged and vulnerable groups on the basis of their group belonging.
                    </p>
                    <p className="text-gray-700 text-sm">
                      <span className="font-semibold">Target groups include:</span> Gender, caste, ethnicity, national origin, racialized categories
                    </p>
                    <p className="text-gray-700 text-sm mt-2">
                      <span className="font-semibold">Characteristic:</span> Explicitly harms marginalized populations
                    </p>
                  </div>

                  {/* Dangerous */}
                  <div className="border-2 border-red-600 rounded-lg p-6 bg-red-50">
                    <h3 className="text-xl font-bold text-red-700 mb-3">3. Dangerous Speech</h3>
                    <p className="text-gray-800 mb-3">
                      <span className="font-semibold">Definition:</span> Expressions that have reasonable chances to trigger or catalyze harm and violence against target groups.
                    </p>
                    <p className="text-gray-700 text-sm">
                      <span className="font-semibold">Characteristic:</span> Most severe category—immediate risk of real-world violence
                    </p>
                    <p className="text-gray-700 text-sm mt-2">
                      Source: Benesch, S. (2013). <em>Dangerous Speech: A Proposal to Prevent Group Violence</em>
                    </p>
                  </div>

                  <div className="bg-yellow-50 border-l-4 border-yellow-600 p-6 rounded mt-8">
                    <h3 className="font-bold text-yellow-900 mb-2">Key Insight</h3>
                    <p className="text-gray-800">
                      These categories help us move beyond simple "is this hate speech?" questions and instead ask: <strong>"What are the contextual, historical, and power dynamics at play? Who benefits? Who is harmed?"</strong>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Kenya Context Tab */}
          {activeTab === 'kenya-context' && (
            <div className="space-y-8 animate-fadeIn">
              <div>
                <h2 className="text-3xl font-bold text-navy mb-6">KESL's Approach in Kenya</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-navy mb-4">Why This Framework Matters for Kenya</h3>
                    <p className="text-gray-700 leading-relaxed mb-4">
                      Kenya's digital landscape—particularly across platforms like Twitter, WhatsApp, Telegram, Facebook, and local Kenyan platforms—features complex forms of online speech that resist simple "hate speech" categorization:
                    </p>
                    <ul className="space-y-3 text-gray-700">
                      <li><strong>🗣️ Political contestation:</strong> Speech that challenges power may appear "extreme" by civility standards but serves democratic function</li>
                      <li><strong>🌍 Platform dynamics:</strong> Transnational speech flows across platforms, with different norms on each</li>
                      <li><strong>📱 Ethnic dimensions:</strong> Extreme speech often targets ethnic minorities and marginalized communities</li>
                      <li><strong>⚖️ State weaponization:</strong> Risk of "hate speech" accusations being used against dissent and civil society</li>
                      <li><strong>💬 Cultural context:</strong> Kenyan speech cultures have their own norms, histories, and meanings</li>
                    </ul>
                  </div>

                  <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded">
                    <h3 className="font-bold text-blue-900 mb-3">KESL's Mission</h3>
                    <p className="text-gray-800 mb-3">
                      The Kenya Extreme Speech Lexicon documents extreme speech patterns across Kenyan digital platforms through:
                    </p>
                    <ul className="space-y-2 text-gray-700">
                      <li>✓ <strong>Community contributions:</strong> Enabling Kenyans to document patterns they observe in their communities</li>
                      <li>✓ <strong>Contextual documentation:</strong> Capturing the historical, social, and political context of speech</li>
                      <li>✓ <strong>Intersectional analysis:</strong> Understanding how extreme speech targets specific groups (ethnic minorities, women, LGBTQ+, etc.)</li>
                      <li>✓ <strong>Rights-centered approach:</strong> Generating evidence for advocacy and platform accountability</li>
                      <li>✓ <strong>Decolonial thinking:</strong> Rejecting Western definitions and centering Kenyan epistemologies</li>
                    </ul>
                  </div>

                  <div className="border-2 border-green-200 rounded-lg p-6 bg-green-50">
                    <h3 className="font-bold text-green-700 mb-3">Research Focus Areas</h3>
                    <p className="text-gray-700 mb-4">
                      The KESL documents extreme speech across six key research dimensions:
                    </p>
                    <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
                      <div>
                        <strong>🌐 Platform Mapping:</strong> Identify and analyze extreme speech patterns across Kenya's smaller digital platforms
                      </div>
                      <div>
                        <strong>📊 Content Migration:</strong> Track how harmful content moves from mainstream to niche platforms and offline
                      </div>
                      <div>
                        <strong>👥 Community Impact:</strong> Document systematic targeting of ethnic minorities and marginalized groups
                      </div>
                      <div>
                        <strong>⚖️ Policy Analysis:</strong> Examine legal gaps and moderation failures on small platforms
                      </div>
                      <div>
                        <strong>🎯 Systemic Patterns:</strong> Identify organized campaigns and systematic targeting strategies
                      </div>
                      <div>
                        <strong>🛡️ Rights Protection:</strong> Generate evidence for digital rights advocacy and accountability
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Citations Section */}
        <div className="mt-12 bg-gray-50 rounded-lg p-8">
          <h3 className="text-2xl font-bold text-navy mb-6">Key Sources</h3>
          <div className="space-y-4 text-sm text-gray-700 border-l-4 border-gray-300 pl-6">
            <p>
              <strong>Udupa, S. (2023).</strong> Extreme speech. In C. Strippel, S. Paasch-Colberg, M. Emmer, & J. Trebbe (Eds.), <em>Challenges and perspectives of hate speech research</em> (pp. 233–248). Digital Communication Research. https://doi.org/10.48541/dcr.v12.14
            </p>
            <p>
              <strong>Katiambo, D. (2021).</strong> It is incivility, not hate speech: Application of Laclau and Mouffe's discourse theory to analysis of non-anthropocentric agency. In S. Udupa, I. Gagliardone, & P. Hervik (Eds.), <em>Digital hate: The global conjuncture of extreme speech</em>. Indiana University Press.
            </p>
            <p>
              <strong>Udupa, S., Gagliardone, I., & Hervik, P. (2021).</strong> <em>Digital hate: The global conjuncture of extreme speech</em>. Indiana University Press.
            </p>
            <p>
              <strong>Benesch, S. (2013).</strong> Dangerous Speech: A Proposal to Prevent Group Violence. Dangerous Speech Project. https://dangerousspeech.org/
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Link href="/lexicon">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-colors">
              Explore the KESL Lexicon →
            </button>
          </Link>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
}