import { AuthContext } from "@/hooks/use-auth-context";
import { supabase } from "@/lib/supabase";
import type { Session } from "@supabase/supabase-js";
import { PropsWithChildren, useEffect, useState } from "react";

export default function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isProfileLoading, setIsProfileLoading] = useState(false);

  const refetchProfile = async () => {
    const userId = session?.user?.id;

    if (!userId) {
      setProfile(null);
      return;
    }

    setIsProfileLoading(true);

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Error fetching profile:", error);
      setProfile(null);
    } else {
      setProfile(data);
    }

    setIsProfileLoading(false);
  };

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

    const fetchProfileData = async () => {
      const userId = session?.user?.id;

      if (!userId) {
        setProfile(null);
        return;
      }

      setIsProfileLoading(true);

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (!mounted) return;

      if (error) {
        console.error("Error fetching profile:", error);
        setProfile(null);
      } else {
        setProfile(data);
      }

      setIsProfileLoading(false);
    };

    fetchProfileData();

    // Subscribe to real-time changes on the profiles table
    const userId = session?.user?.id;
    let subscription: any;

    if (userId) {
      subscription = supabase
        .channel(`profiles:${userId}`)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "profiles",
            filter: `id=eq.${userId}`,
          },
          (payload) => {
            if (mounted) {
              setProfile(payload.new);
            }
          },
        )
        .subscribe();
    }

    return () => {
      mounted = false;
      if (subscription) {
        subscription.unsubscribe();
      }
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
        refetchProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
