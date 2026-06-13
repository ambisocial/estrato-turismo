import { cache } from 'react';
import { getSupabase } from './supabase';

// Embedded author relationship (explicit FK to disambiguate the two author columns).
const AUTHOR_EMBED =
  'primary_author:editorial_team!articles_primary_author_id_fkey(id,name,slug,role,avatar_url)';
const CARD_FIELDS =
  'id,slug,title,excerpt,category,subcategory,cluster,published_at,word_count';

/** portal_config as a flat key -> value map. Cached per request. */
export const getConfig = cache(async () => {
  const sb = getSupabase();
  const { data, error } = await sb.from('portal_config').select('key,value');
  if (error) throw error;
  const map = {};
  (data || []).forEach((row) => {
    map[row.key] = row.value;
  });
  return map;
});

/** Top-level categories for the main navigation, ordered. Cached per request. */
export const getTopCategories = cache(async () => {
  const sb = getSupabase();
  const { data, error } = await sb
    .from('categories')
    .select('slug,name,parent_slug,order_index')
    .eq('active', true)
    .is('parent_slug', null)
    .order('order_index', { ascending: true });
  if (error) throw error;
  return data || [];
});

export async function getLatestArticles(limit = 12) {
  const sb = getSupabase();
  const { data, error } = await sb
    .from('articles')
    .select(`${CARD_FIELDS},${AUTHOR_EMBED}`)
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data || [];
}

export async function getArticleBySlug(slug) {
  const sb = getSupabase();
  const { data, error } = await sb
    .from('articles')
    .select(
      `*,primary_author:editorial_team!articles_primary_author_id_fkey(id,name,slug,role,bio,avatar_url),reviewer:editorial_team!articles_reviewed_by_author_id_fkey(id,name,slug,role)`
    )
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function getCategoryBySlug(slug) {
  const sb = getSupabase();
  const { data, error } = await sb
    .from('categories')
    .select('slug,name,parent_slug')
    .eq('slug', slug)
    .eq('active', true)
    .maybeSingle();
  if (error) throw error;
  return data;
}

/**
 * articles.category holds the TOP-LEVEL category name and articles.subcategory
 * the leaf name, so we match the right column based on the category's depth.
 */
export async function getArticlesByCategory(category, limit = 30) {
  const sb = getSupabase();
  const field = category.parent_slug ? 'subcategory' : 'category';
  const { data, error } = await sb
    .from('articles')
    .select(`${CARD_FIELDS},${AUTHOR_EMBED}`)
    .eq('status', 'published')
    .eq(field, category.name)
    .order('published_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data || [];
}

export async function getAuthorBySlug(slug) {
  const sb = getSupabase();
  const { data, error } = await sb
    .from('editorial_team')
    .select('id,name,slug,role,bio,avatar_url,categories')
    .eq('slug', slug)
    .eq('active', true)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function getArticlesByAuthorId(id, limit = 20) {
  const sb = getSupabase();
  const { data, error } = await sb
    .from('articles')
    .select(CARD_FIELDS)
    .eq('status', 'published')
    .eq('primary_author_id', id)
    .order('published_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data || [];
}
