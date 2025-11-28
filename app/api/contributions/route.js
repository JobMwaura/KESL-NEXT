import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function POST(request) {
  try {
    // Handle FormData (sent from the client form)
    const formData = await request.formData();
    const term_id = formData.get('term_id');
    const contribution_type = formData.get('contribution_type');
    const content = formData.get('content');

    console.log('Received contribution:', { term_id, contribution_type, content });

    // Validate required fields
    if (!term_id || !contribution_type || !content) {
      return Response.json(
        { error: 'Missing required fields: term_id, contribution_type, content' },
        { status: 400 }
      );
    }

    const validTypes = ['context', 'example', 'harm', 'relation'];
    if (!validTypes.includes(contribution_type)) {
      return Response.json(
        { error: `Invalid contribution type. Must be one of: ${validTypes.join(', ')}` },
        { status: 400 }
      );
    }

    // Insert into Supabase
    const { data, error } = await supabase
      .from('community_contributions')
      .insert([
        {
          term_id: term_id,
          contribution_type: contribution_type,
          content: content,
          status: 'pending',
          created_at: new Date().toISOString()
        }
      ])
      .select();

    if (error) {
      console.error('Supabase error:', error);
      return Response.json(
        { error: 'Failed to save contribution', details: error.message },
        { status: 500 }
      );
    }

    return Response.json(
      {
        success: true,
        message: 'Contribution submitted successfully',
        data: data[0]
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('API error:', error);
    return Response.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const termId = searchParams.get('term_id');
    const type = searchParams.get('type');

    if (!termId) {
      return Response.json(
        { error: 'term_id is required' },
        { status: 400 }
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
      console.error('Supabase error:', error);
      return Response.json(
        { error: 'Failed to fetch contributions' },
        { status: 500 }
      );
    }

    return Response.json({ data }, { status: 200 });
  } catch (error) {
    console.error('API error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}