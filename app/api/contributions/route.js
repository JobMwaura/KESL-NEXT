import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL');
}

const supabaseKey = supabaseServiceRoleKey || supabaseAnonKey;

if (!supabaseKey) {
  throw new Error('Missing Supabase credentials');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request) {
  try {
    const body = await request.json();

    // Validate required fields
    const requiredFields = ['term', 'meaning', 'category', 'risk', 'language'];
    const missingFields = requiredFields.filter(field => !body[field]);

    if (missingFields.length > 0) {
      return new Response(
        JSON.stringify({ 
          error: 'Missing required fields',
          missing: missingFields
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validate category
    const validCategories = ['Derogatory', 'Exclusionary', 'Dangerous', 'Coded'];
    if (!validCategories.includes(body.category)) {
      return new Response(
        JSON.stringify({ 
          error: `Invalid category. Must be one of: ${validCategories.join(', ')}`
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validate risk level
    const validRisks = ['Low', 'Medium', 'High', 'Very High'];
    if (!validRisks.includes(body.risk)) {
      return new Response(
        JSON.stringify({ 
          error: `Invalid risk level. Must be one of: ${validRisks.join(', ')}`
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validate language
    const validLanguages = ['Swahili', 'English', 'Sheng', 'Mixed'];
    if (!validLanguages.includes(body.language)) {
      return new Response(
        JSON.stringify({ 
          error: `Invalid language. Must be one of: ${validLanguages.join(', ')}`
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validate at least one example
    if (!body.examples || body.examples.length === 0) {
      return new Response(
        JSON.stringify({ 
          error: 'At least one example is required'
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const hasValidExample = body.examples.some(ex => ex.quote && ex.platform);
    if (!hasValidExample) {
      return new Response(
        JSON.stringify({ 
          error: 'At least one example must have both quote and platform'
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Prepare term data for insertion
    const termData = {
      term: body.term,
      literal_gloss: body.literal_gloss || null,
      meaning: body.meaning,
      category: body.category,
      risk_level: body.risk,
      language: body.language,
      registers: body.registers || null,
      linguistic_markers: body.linguisticMarkers || null,
      target_group: body.targetGroup || null,
      actor_positioning: body.actorPositioning || null,
      speech_function: body.speechFunction || null,
      harm_potential: body.harmPotential || null,
      platform_dynamics: body.platformDynamics || null,
      power_relations: body.powerRelations || null,
      identity_politics: body.identityPolitics || null,
      key_theme: body.keyTheme || null,
      content_migration: body.contentMigration || null,
      offline_consequences: body.offlineConsequences || null,
      amplification_patterns: body.amplificationPatterns || null,
      tags: body.tags || null,
      sources: body.sources || null,
      status: 'pending', // New submissions need moderation
      submitted_at: new Date().toISOString(),
      examples: body.examples // Store examples as JSON
    };

    // Insert the term
    const { data: termInsert, error: termError } = await supabase
      .from('terms')
      .insert([termData])
      .select();

    if (termError) {
      console.error('Supabase insert error:', termError);
      return new Response(
        JSON.stringify({ 
          error: 'Failed to save term to database',
          details: termError.message 
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const newTerm = termInsert[0];

    // Insert examples as separate records linked to the term
    if (body.examples && body.examples.length > 0) {
      const examplesData = body.examples.map(ex => ({
        term_id: newTerm.id,
        quote: ex.quote,
        platform: ex.platform,
        date: ex.date || null,
        url: ex.url || null,
        context: ex.context || null,
        status: 'pending'
      }));

      const { error: examplesError } = await supabase
        .from('term_examples')
        .insert(examplesData);

      if (examplesError) {
        console.error('Examples insert error:', examplesError);
        // Don't fail the whole submission if examples fail
        console.warn('Warning: Examples were not saved, but term was created');
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Term submitted for review. It will appear in the lexicon after moderation.',
        data: {
          term_id: newTerm.id,
          term: newTerm.term,
          status: newTerm.status
        }
      }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('API error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        message: error.message 
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// GET endpoint to fetch terms (with filters)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const language = searchParams.get('language');
    const risk = searchParams.get('risk');

    let query = supabase
      .from('terms')
      .select('*')
      .eq('status', 'approved') // Only show approved terms publicly
      .order('created_at', { ascending: false });

    if (category) {
      query = query.eq('category', category);
    }

    if (language) {
      query = query.eq('language', language);
    }

    if (risk) {
      query = query.eq('risk_level', risk);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Supabase fetch error:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch terms' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        count: data.length,
        data 
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('API error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}