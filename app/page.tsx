'use client';

import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function HomePage() {
  const { supabaseClient, session } = useSessionContext();
  const router = useRouter();

  useEffect(() => {
    if (session?.user) {
      supabaseClient
        .from('profiles')
        .upsert({
          id: session.user.id,
          email: session.user.email,
          nickname: session.user.email?.split('@')[0] || '',
          role: 'user',
        })
        .then(({ error }) => {
          if (error) {
            console.error('Failed to upsert profile:', error);
          } else {
            router.push('/dashboard');
          }
        });
    }
  }, [session, supabaseClient, router]);
  

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="w-full max-w-sm">
        <Auth
          supabaseClient={supabaseClient}
          appearance={{ theme: ThemeSupa }}
          providers={["google"]}
          theme="dark"
        />
      </div>
    </div>
  );
}