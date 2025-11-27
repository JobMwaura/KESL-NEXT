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

    // Prepare term data for insertion using ACTUAL KESL column names
    const termData = {
      term: body.term,
      literal_gloss: body.literal_gloss || null,
      meaning: body.meaning,
      category: body.category,
      risk: body.risk,  // ✅ CORRECT: 'risk' not 'risk_level'
      language: body.language,
      status: 'pending', // New submissions need moderation
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
    const status = searchParams.get('status') || 'approved';

    let query = supabase
      .from('terms')
      .select('*')
      .eq('status', status)
      .order('created_at', { ascending: false });

    if (category) {
      query = query.eq('category', category);
    }

    if (language) {
      query = query.eq('language', language);
    }

    if (risk) {
      query = query.eq('risk', risk);  // ✅ CORRECT: 'risk' not 'risk_level'
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