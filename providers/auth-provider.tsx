import { getUserByOauthID } from '@/api/profiles';
import { AuthContext } from '@/hooks/use-auth-context';
import { supabase } from '@/lib/supabase';
import type { Session } from '@supabase/supabase-js';
import { PropsWithChildren, useEffect, useState } from 'react';

export default function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isProfileLoading, setIsProfileLoading] = useState(false);

  useEffect(() => {
    let mounted = true;

    const initialize = async () => {
      setIsAuthLoading(true);

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!mounted) return;
      setSession(session);
      setIsAuthLoading(false);
    };

    initialize();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      setSession(session);
      setIsAuthLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    let mounted = true;

    const fetchProfile = async () => {
      const oauthId = session?.user?.id;

      if (!oauthId) {
        setProfile(null);
        return;
      }

      setIsProfileLoading(true);

      try {
        const data = await getUserByOauthID(oauthId);
        
        if (!mounted) return;
        setProfile(data);
      } catch (error) {
        if (!mounted) return;
        console.error('Error fetching profile:', error);
        setProfile(null);
      } finally {
        if (!mounted) return;
        setIsProfileLoading(false);
      }
    };

    fetchProfile();

    return () => {
      mounted = false;
    };
  }, [session?.user?.id]);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!session,
        isLoading: isAuthLoading,
        isProfileLoading,
        profile,
        session,
        user: session?.user ?? null,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}