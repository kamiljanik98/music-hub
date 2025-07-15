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
    <Auth
      supabaseClient={supabaseClient}
      appearance={{ theme: ThemeSupa }}
      providers={["google", "github"]}
      theme="dark"
    />
  );
}