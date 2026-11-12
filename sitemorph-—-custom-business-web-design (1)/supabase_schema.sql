-- ============================================================================
-- SITEMORPH SUPABASE DATABASE SETUP SCRIPT
-- Project ID: uplukxjquzwrgxlgfzav
-- Run this in your Supabase Dashboard -> SQL Editor -> New Query -> Run
-- ============================================================================

-- 1. Create the `bookings` table for all appointment & consultation requests
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  business_name TEXT NOT NULL,
  website_type TEXT,
  preferred_plan TEXT,
  budget TEXT DEFAULT 'Not specified',
  message TEXT NOT NULL,
  preferred_call_time TEXT DEFAULT 'Anytime',
  reference_link TEXT,
  source TEXT NOT NULL,
  status TEXT DEFAULT 'new'
);

-- 2. Optional fallback table `appointments` (identical structure if preferred)
CREATE TABLE IF NOT EXISTS public.appointments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  business_name TEXT NOT NULL,
  website_type TEXT,
  preferred_plan TEXT,
  budget TEXT DEFAULT 'Not specified',
  message TEXT NOT NULL,
  preferred_call_time TEXT DEFAULT 'Anytime',
  reference_link TEXT,
  source TEXT NOT NULL,
  status TEXT DEFAULT 'new'
);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- 4. Allow public / anonymous users to insert booking requests from the website form
CREATE POLICY "Allow public insert to bookings"
  ON public.bookings
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public insert to appointments"
  ON public.appointments
  FOR INSERT
  WITH CHECK (true);

-- 5. Allow authenticated users (you in your dashboard) to view and update bookings
CREATE POLICY "Allow authenticated read to bookings"
  ON public.bookings
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated update to bookings"
  ON public.bookings
  FOR UPDATE
  TO authenticated
  USING (true);
