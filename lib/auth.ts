import { supabase } from './supabase';

export interface AuthUser {
  id: string;
  email: string;
  username?: string;
}

export const authService = {
  async signUp(email: string, password: string, username: string) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
          },
        },
      });

      if (error) throw error;

      // Create user profile
      if (data.user) {
        const { error: profileError } = await supabase
          .from('users')
          .insert({
            id: data.user.id,
            email,
            username,
          });

        if (profileError) {
          console.error('Profile creation error:', profileError);
          throw profileError;
        }
      }

      return data;
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  },

  async signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  },

  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  },

  async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error) {
        console.error('Get user error:', error);
        return null;
      }
      
      if (!user) return null;

      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('username')
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.error('Profile fetch error:', profileError);
        // Return user without profile data if profile fetch fails
        return {
          id: user.id,
          email: user.email!,
          username: undefined,
        };
      }
      return {
        id: user.id,
        email: user.email!,
        username: profile?.username,
      };
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  },
};