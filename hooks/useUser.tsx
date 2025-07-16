'use client';

import { useSessionContext } from "@supabase/auth-helpers-react";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

export type UserDetails = {
  id: string;
  nickname: string;
  avatar_url: string;
  role: string;
  email: string;
  created_at: string;
  updated_at: string;
};

type UserContextType = {
  accessToken: string | null;
  userDetails: UserDetails | null;
};

export const UserContext = createContext<UserContextType | undefined>(undefined);

export const MyUserContextProvider = (props: any) => {
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const { session, supabaseClient } = useSessionContext();
  const accessToken = session?.access_token ?? null;
  const userId = session?.user?.id ?? null;

  const getUserDetails = async () => {
    if (!userId) return { data: null };
    return supabaseClient
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
  };

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!userId && pathname.startsWith('/dashboard')) {
      router.push('/');
    }
  }, [userId, pathname]);

  useEffect(() => {
    if (userId && !userDetails) {
      getUserDetails().then((result: any) => {
        setUserDetails(result.data);
      });
    } else if (!userId) {
      setUserDetails(null);
    }
  }, [userId]);

  const value = {
    accessToken,
    userDetails,
  };

  return <UserContext.Provider value={value} {...props} />;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};