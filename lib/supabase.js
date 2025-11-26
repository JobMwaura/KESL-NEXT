'use client';

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Supabase credentials not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local'
  );
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);

// Fetch all approved terms
export async function fetchApprovedTerms(filters = {}) {
  let query = supabase
    .from('terms')
    .select('*')
    .eq('status', 'approved')
    .order('created_at', { ascending: false });

  if (filters.category) {
    query = query.eq('category', filters.category);
  }
  if (filters.risk) {
    query = query.eq('risk', filters.risk);
  }
  if (filters.language) {
    query = query.eq('language', filters.language);
  }

  const { data, error } = await query;
  if (error) {
    console.error('Error fetching terms:', error);
    throw error;
  }
  return data || [];
}

// Fetch single term by ID
export async function fetchTermById(id) {
  const { data, error } = await supabase
    .from('terms')
    .select(`
      *,
      examples(*),
      votes(*),
      comments(*)
    `)
    .eq('id', id)
    .eq('status', 'approved')
    .single();

  if (error) {
    console.error('Error fetching term:', error);
    throw error;
  }
  return data;
}

// Search terms by keyword
export async function searchTerms(query) {
  const { data, error } = await supabase
    .from('terms')
    .select('*')
    .eq('status', 'approved')
    .or(`term.ilike.%${query}%,meaning.ilike.%${query}%,tags.cs.{${query}}`);

  if (error) {
    console.error('Error searching terms:', error);
    throw error;
  }
  return data || [];
}

// Fetch pending terms (admin/curator only)
export async function fetchPendingTerms() {
  const { data, error } = await supabase
    .from('terms')
    .select('*')
    .eq('status', 'pending')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching pending terms:', error);
    throw error;
  }
  return data || [];
}

// Submit new term
export async function submitTerm(termData, userId) {
  const { data, error } = await supabase
    .from('terms')
    .insert([
      {
        ...termData,
        created_by: userId,
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ])
    .select();

  if (error) {
    console.error('Error submitting term:', error);
    throw error;
  }
  return data[0];
}

// Update term status (approve/reject)
export async function updateTermStatus(termId, status, notes = '') {
  const { data, error } = await supabase
    .from('terms')
    .update({
      status,
      updated_at: new Date().toISOString()
    })
    .eq('id', termId)
    .select();

  if (error) {
    console.error('Error updating term status:', error);
    throw error;
  }
  return data[0];
}

// Add or update vote
export async function addVote(termId, userId, value) {
  const { data, error } = await supabase
    .from('votes')
    .upsert(
      {
        user_id: userId,
        term_id: termId,
        value,
        created_at: new Date().toISOString()
      },
      { onConflict: 'user_id,term_id' }
    )
    .select();

  if (error) {
    console.error('Error adding vote:', error);
    throw error;
  }
  return data;
}

// Add comment to term
export async function addComment(termId, userId, body) {
  const { data, error } = await supabase
    .from('comments')
    .insert([
      {
        term_id: termId,
        user_id: userId,
        body,
        created_at: new Date().toISOString(),
        is_hidden: false
      }
    ])
    .select();

  if (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
  return data[0];
}

// Fetch comments for a term
export async function fetchComments(termId) {
  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .eq('term_id', termId)
    .eq('is_hidden', false)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching comments:', error);
    throw error;
  }
  return data || [];
}

// Fetch votes for a term
export async function fetchVotes(termId) {
  const { data, error } = await supabase
    .from('votes')
    .select('*')
    .eq('term_id', termId);

  if (error) {
    console.error('Error fetching votes:', error);
    throw error;
  }
  return data || [];
}

// Add flag to term
export async function flagTerm(termId, userId, reason, note = '') {
  const { data, error } = await supabase
    .from('flags')
    .insert([
      {
        term_id: termId,
        user_id: userId,
        reason,
        note,
        created_at: new Date().toISOString(),
        resolved: false
      }
    ])
    .select();

  if (error) {
    console.error('Error flagging term:', error);
    throw error;
  }
  return data[0];
}

// Upload evidence file
export async function uploadEvidence(file, termId) {
  const fileName = `evidence/${termId}/${Date.now()}-${file.name}`;

  const { data, error } = await supabase.storage
    .from('evidence')
    .upload(fileName, file);

  if (error) {
    console.error('Error uploading evidence:', error);
    throw error;
  }
  return {
    path: data.path,
    fullPath: data.fullPath
  };
}

// Get signed URL for evidence file
export async function getSignedUrl(path) {
  const { data, error } = await supabase.storage
    .from('evidence')
    .createSignedUrl(path, 3600); // 1 hour expiry

  if (error) {
    console.error('Error getting signed URL:', error);
    throw error;
  }
  return data.signedUrl;
}

// Get user profile
export async function getUserProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching profile:', error);
    throw error;
  }
  return data;
}

// Create user profile
export async function createUserProfile(userId, role = 'contributor') {
  const { data, error } = await supabase
    .from('profiles')
    .insert([
      {
        id: userId,
        role,
        created_at: new Date().toISOString()
      }
    ])
    .select();

  if (error) {
    console.error('Error creating profile:', error);
    throw error;
  }
  return data[0];
}