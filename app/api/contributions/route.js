import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL');
}

// Use service role key if available, otherwise use anon key
const supabaseKey = supabaseServiceRoleKey || supabaseAnonKey;

if (!supabaseKey) {
  throw new Error('Missing Supabase credentials');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request) {
  try {
    // Handle FormData (from the form submission)
    const formDataBody = await request.formData();
    const term_id = formDataBody.get('term_id');
    const contribution_type = formDataBody.get('contribution_type');
    const content = formDataBody.get('content');
    const image = formDataBody.get('image');

    // Validate input
    if (!term_id || !contribution_type || !content) {
      return new Response(
        JSON.stringify({ 
          error: 'Missing required fields: term_id, contribution_type, content'
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const validTypes = ['context', 'example', 'harm', 'relation'];
    if (!validTypes.includes(contribution_type)) {
      return new Response(
        JSON.stringify({ error: `Invalid contribution type. Must be one of: ${validTypes.join(', ')}` }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Prepare contribution data
    const contributionData = {
      term_id: term_id,
      contribution_type: contribution_type,
      content: content,
      status: 'pending',
      created_at: new Date().toISOString()
    };

    // Handle image if present
    let imageUrl = null;
    if (image && image.size > 0) {
      try {
        const fileName = `contributions/${term_id}/${contribution_type}/${Date.now()}-${image.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('contributions')
          .upload(fileName, image);

        if (uploadError) {
          console.warn('Image upload failed:', uploadError);
          // Don't fail the contribution if image upload fails
        } else {
          imageUrl = uploadData.path;
          contributionData.image_url = imageUrl;
        }
      } catch (imageErr) {
        console.warn('Image processing error:', imageErr);
        // Continue without image
      }
    }

    // Insert contribution
    const { data, error } = await supabase
      .from('community_contributions')
      .insert([contributionData])
      .select();

    if (error) {
      console.error('Supabase insert error:', error);
      return new Response(
        JSON.stringify({ 
          error: 'Failed to save contribution to database',
          details: error.message 
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Contribution submitted for review',
        data: data[0]
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

// GET endpoint to fetch approved contributions for a term
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const termId = searchParams.get('term_id');
    const type = searchParams.get('type');

    if (!termId) {
      return new Response(
        JSON.stringify({ error: 'term_id is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    let query = supabase
      .from('community_contributions')
      .select('*')
      .eq('term_id', termId)
      .eq('status', 'approved')
      .order('created_at', { ascending: false });

    if (type) {
      query = query.eq('contribution_type', type);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Supabase fetch error:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch contributions' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ data }),
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