import { createClient } from '@supabase/supabase-js';

// Supabase credentials provided by the user
const env =
  typeof import.meta !== 'undefined' && import.meta.env
    ? import.meta.env
    : typeof process !== 'undefined' && process.env
    ? (process.env as Record<string, string | undefined>)
    : {};

export const SUPABASE_URL =
  env.VITE_SUPABASE_URL || 'https://uplukxjquzwrgxlgfzav.supabase.co';

export const SUPABASE_ANON_KEY =
  env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_GG_DbFbS6SvqpflF2Y-nfQ_9kL34A13';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export interface BookingSubmission {
  fullName: string;
  phone: string;
  email: string;
  businessName: string;
  websiteType?: string;
  preferredPlan?: string;
  budget?: string;
  message: string;
  preferredCallTime?: string;
  referenceLink?: string;
  source: 'website_consultation' | 'design_services';
  submittedAt?: string;
}

/**
 * Saves appointment / booking details to Supabase.
 * Automatically tries 'bookings' table first, with fallback to 'appointments'.
 * Also stores a copy in localStorage as a resilient offline backup.
 */
export async function saveBookingToSupabase(payload: BookingSubmission): Promise<{
  success: boolean;
  error?: string;
  data?: unknown;
}> {
  // Store local backup immediately in browser so no lead is ever lost
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const existing = JSON.parse(window.localStorage.getItem('sitemorph_local_bookings') || '[]');
      existing.unshift({ ...payload, savedLocallyAt: new Date().toISOString() });
      window.localStorage.setItem('sitemorph_local_bookings', JSON.stringify(existing.slice(0, 100)));
    } catch (err) {
      console.warn('[SiteMorph Local Backup Error]:', err);
    }
  }

  // Row object formatted for Supabase table
  const row = {
    full_name: payload.fullName,
    phone: payload.phone,
    email: payload.email,
    business_name: payload.businessName,
    website_type: payload.websiteType || null,
    preferred_plan: payload.preferredPlan || null,
    budget: payload.budget || 'Not specified',
    message: payload.message,
    preferred_call_time: payload.preferredCallTime || 'Anytime',
    reference_link: payload.referenceLink || null,
    source: payload.source,
    status: 'new',
    created_at: payload.submittedAt || new Date().toISOString(),
  };

  try {
    // Attempt 1: Insert into 'bookings' table (without .select() to avoid RLS 42501 read check)
    const { error } = await supabase.from('bookings').insert([row]);

    if (!error) {
      console.log('[Supabase] Successfully saved booking to "bookings"');
      return { success: true };
    }

    // If 'bookings' does not exist, try 'appointments' table
    if (error.message?.includes('Could not find the table') || error.code === '42P01') {
      console.warn('[Supabase] "bookings" table not found, trying "appointments"...');
      const fallback = await supabase.from('appointments').insert([row]);
      if (!fallback.error) {
        console.log('[Supabase] Successfully saved booking to "appointments"');
        return { success: true };
      }
      console.error('[Supabase Error in appointments]:', fallback.error);
      return { success: false, error: fallback.error.message };
    }

    console.error('[Supabase Insert Error]:', error);
    return { success: false, error: error.message };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown network error';
    console.error('[Supabase Exception]:', message);
    return { success: false, error: message };
  }
}
