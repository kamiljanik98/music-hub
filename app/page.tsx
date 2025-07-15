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
    if (session) {
      router.push('/dashboard');
    }
  }, [session, router]);

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