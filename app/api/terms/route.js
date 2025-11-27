import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase credentials');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function POST(request) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.term || !body.meaning || !body.category || !body.risk || !body.language) {
      return new Response(
        JSON.stringify({ 
          error: 'Missing required fields',
          required: ['term', 'meaning', 'category', 'risk', 'language']
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Only insert fields that exist in your table schema
    // Omit: id (auto-generated), created_by (uuid), created_at (auto timestamp), updated_at (auto timestamp)
    const termData = {
      term: body.term.trim(),
      meaning: body.meaning.trim(),
      category: body.category,
      risk: body.risk,
      language: body.language,
      literal_gloss: body.literal_gloss || null,
      status: 'pending',
      // Optional fields (set to null if not provided)
      migration: body.migration || null,
      tags: body.tags || [],
      context_history: body.context_history || null,
      harm_description: body.harm_description || null,
      related_terms: body.related_terms || [],
      rejection_reason: null,
      reviewed_at: null,
      reviewed_by: null,
      submission_ip: null
    };

    console.log('Inserting term:', termData);

    // Insert into terms table
    const { data, error } = await supabase
      .from('terms')
      .insert([termData])
      .select();

    if (error) {
      console.error('Supabase error:', error);
      return new Response(
        JSON.stringify({ 
          error: 'Failed to save term to database',
          details: error.message,
          code: error.code
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    console.log('Term inserted successfully:', data);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Term submitted for review! It will appear in the lexicon after moderation.',
        data: {
          id: data[0].id,
          term: data[0].term,
          status: data[0].status
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

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'approved';
    const category = searchParams.get('category');
    const language = searchParams.get('language');
    const risk = searchParams.get('risk');

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
      query = query.eq('risk', risk);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Fetch error:', error);
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