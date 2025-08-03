'use client';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types_db';
import React, { FC, useState } from 'react';
import { SessionContextProvider } from '@supabase/auth-helpers-react';

type SupabaseProviderProps = {
  children: React.ReactNode;
};

const SupabaseProvider: FC<SupabaseProviderProps> = ({ children }) => {
  const [supabaseClient] = useState(() => createClientComponentClient<Database>());

  return (
    <SessionContextProvider supabaseClient={supabaseClient}>{children}</SessionContextProvider>
  );
};

export default SupabaseProvider;
