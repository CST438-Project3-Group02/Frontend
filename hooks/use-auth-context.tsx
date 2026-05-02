import type { Session, User } from "@supabase/supabase-js";
import { createContext, useContext } from "react";

type AuthData = {
  isLoggedIn: boolean;
  isLoading: boolean;
  isProfileLoading: boolean;
  profile: any | null;
  session: Session | null;
  user: User | null;
  refetchProfile?: () => Promise<void>;
};

export const AuthContext = createContext<AuthData>({
  isLoggedIn: false,
  isLoading: true,
  isProfileLoading: true,
  profile: null,
  session: null,
  user: null,
});

export const useAuthContext = () => useContext(AuthContext);
