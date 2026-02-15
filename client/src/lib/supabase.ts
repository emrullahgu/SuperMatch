import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

// Database Types
export interface UserProfile {
  id: string;
  email: string;
  username?: string;
  display_name?: string;
  avatar_url?: string;
  gender?: 'male' | 'female' | 'other';
  age?: number;
  country?: string;
  interests: string[];
  bio?: string;
  is_premium: boolean;
  premium_expires_at?: string;
  reputation: number;
  total_matches: number;
  created_at: string;
  updated_at: string;
}

export interface Match {
  id: string;
  user1_id: string;
  user2_id: string;
  started_at: string;
  ended_at?: string;
  duration?: number;
  reported_by?: string;
  report_reason?: string;
  rating_user1?: number;
  rating_user2?: number;
}

export interface Report {
  id: string;
  reporter_id: string;
  reported_user_id: string;
  match_id: string;
  reason: string;
  description?: string;
  screenshot_url?: string;
  status: 'pending' | 'reviewed' | 'action_taken' | 'dismissed';
  created_at: string;
}

export interface PremiumSubscription {
  id: string;
  user_id: string;
  stripe_subscription_id: string;
  stripe_customer_id: string;
  status: 'active' | 'canceled' | 'past_due' | 'unpaid';
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
  created_at: string;
}
