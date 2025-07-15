'use client';

import { User, useSessionContext, useUser as useSupaUser } from "@supabase/auth-helpers-react";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

type UserDetails = {
  id: string;
  full_name: string;
  avatar_url: string;
  email: string;
}

type UserContextType = {
  accessToken: string | null;
  user: User,
  userDetails: UserDetails | null;
}
export const UserContext = createContext<UserContextType | undefined>(undefined);

export const MyUserContextProvider = (props: any) => {
  const [userDetails, setUserDetails] = useState<any>(null)
  const user = useSupaUser();
  const { session, supabaseClient } = useSessionContext();
  const accessToken = session?.access_token ?? null

  const getUserDetails = async () => supabaseClient
    .from('profiles')
    .select('*')
    .eq('id', user?.id)
    .single();

    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
      if (!user && pathname.startsWith('/dashboard')) {
        router.push('/');
      }
    }, [user,pathname]);

    useEffect(() => {
      if (user && !userDetails) {
        getUserDetails().then((result: any) => {
          setUserDetails(result.data);
        });
      } else {
        setUserDetails(null);
      }
    }, [user]);

    const value = {
      accessToken,
      user,
      userDetails
    }

    return <UserContext.Provider value={value} {...props} />
}

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used withi a UserProvider');
  }
}