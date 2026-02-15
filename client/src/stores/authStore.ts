import { create } from 'zustand';
import { supabase, UserProfile } from '@/lib/supabase';
import { User, Session } from '@supabase/supabase-js';

interface AuthStore {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  loading: boolean;
  
  signUp: (email: string, password: string, metadata?: any) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithGithub: () => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  checkPremium: () => boolean;
  loadProfile: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  profile: null,
  session: null,
  loading: true,

  signUp: async (email: string, password: string, metadata?: any) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
        },
      });

      if (error) throw error;

      // Create user profile
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            email: data.user.email,
            username: metadata?.username,
            display_name: metadata?.display_name,
            gender: metadata?.gender,
            age: metadata?.age,
            interests: metadata?.interests || [],
            is_premium: false,
            reputation: 100,
            total_matches: 0,
          });

        if (profileError) console.error('Profile creation error:', profileError);
      }

      set({ user: data.user, session: data.session });
    } catch (error: any) {
      console.error('Sign up error:', error);
      throw error;
    }
  },

  signIn: async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      set({ user: data.user, session: data.session });
      await get().loadProfile();
    } catch (error: any) {
      console.error('Sign in error:', error);
      throw error;
    }
  },

  signInWithGoogle: async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
    } catch (error: any) {
      console.error('Google sign in error:', error);
      throw error;
    }
  },

  signInWithGithub: async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
    } catch (error: any) {
      console.error('Github sign in error:', error);
      throw error;
    }
  },

  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      set({ user: null, profile: null, session: null });
    } catch (error: any) {
      console.error('Sign out error:', error);
      throw error;
    }
  },

  updateProfile: async (updates: Partial<UserProfile>) => {
    try {
      const { user } = get();
      if (!user) throw new Error('No user logged in');

      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;

      set({ profile: data });
    } catch (error: any) {
      console.error('Update profile error:', error);
      throw error;
    }
  },

  checkPremium: () => {
    const { profile } = get();
    if (!profile || !profile.is_premium) return false;

    if (profile.premium_expires_at) {
      return new Date(profile.premium_expires_at) > new Date();
    }

    return false;
  },

  loadProfile: async () => {
    try {
      const { user } = get();
      if (!user) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      set({ profile: data });
    } catch (error: any) {
      console.error('Load profile error:', error);
    } finally {
      set({ loading: false });
    }
  },
}));

// Initialize auth state
supabase.auth.getSession().then(({ data: { session } }) => {
  useAuthStore.setState({
    user: session?.user ?? null,
    session: session ?? null,
    loading: false,
  });

  if (session?.user) {
    useAuthStore.getState().loadProfile();
  }
});

// Listen for auth changes
supabase.auth.onAuthStateChange((_event, session) => {
  useAuthStore.setState({
    user: session?.user ?? null,
    session: session ?? null,
  });

  if (session?.user) {
    useAuthStore.getState().loadProfile();
  } else {
    useAuthStore.setState({ profile: null });
  }
});
