import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function POST(request) {
  try {
    let term_id, contribution_type, content, image;

    // Try to parse as FormData
    try {
      const formData = await request.formData();
      term_id = formData.get('term_id');
      contribution_type = formData.get('contribution_type');
      content = formData.get('content');
      image = formData.get('image');
    } catch (e) {
      console.warn('FormData parse failed, trying JSON:', e.message);
      // Fallback to JSON
      const body = await request.json();
      term_id = body.term_id;
      contribution_type = body.contribution_type;
      content = body.content;
    }

    if (!term_id || !contribution_type || !content) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const validTypes = ['context', 'example', 'harm', 'relation'];
    if (!validTypes.includes(contribution_type)) {
      return new Response(
        JSON.stringify({ error: `Invalid type: ${contribution_type}` }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Prepare contribution data
    const contributionData = {
      term_id,
      contribution_type,
      content,
      status: 'pending',
      created_at: new Date().toISOString()
    };

    // Handle image if present
    if (image && image.size > 0) {
      try {
        const buffer = await image.arrayBuffer();
        const fileName = `contributions/${term_id}/${contribution_type}/${Date.now()}-${image.name}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('contributions')
          .upload(fileName, buffer, {
            contentType: image.type
          });

        if (!uploadError && uploadData) {
          contributionData.image_url = uploadData.path;
        } else {
          console.warn('Image upload skipped:', uploadError?.message);
        }
      } catch (imgErr) {
        console.warn('Image processing skipped:', imgErr.message);
      }
    }

    // Insert into database
    const { data, error } = await supabase
      .from('community_contributions')
      .insert([contributionData])
      .select();

    if (error) {
      console.error('DB error:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to save contribution', details: error.message }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Contribution submitted',
        data: data[0]
      }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('API Error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Server error',
        message: error.message 
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const termId = searchParams.get('term_id');
    const type = searchParams.get('type');

    if (!termId) {
      return new Response(
        JSON.stringify({ error: 'term_id required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    let query = supabase
      .from('community_contributions')
      .select('*')
      .eq('term_id', termId)
      .eq('status', 'approved');

    if (type) {
      query = query.eq('contribution_type', type);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      return new Response(
        JSON.stringify({ error: 'Failed to fetch' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ contributions: data || [] }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('GET Error:', error);
    return new Response(
      JSON.stringify({ error: 'Server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
