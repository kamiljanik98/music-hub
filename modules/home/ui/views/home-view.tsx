"use client";

import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Image from "next/image";
import HomeOnboardPanel from "../components/home-onboard-panel";

export default function HomeView() {
  const { supabaseClient, session, isLoading } = useSessionContext();
  const router = useRouter();

  useEffect(() => {
    if (session?.user) {
      supabaseClient
        .from("profiles")
        .upsert({
          id: session.user.id,
          email: session.user.email,
          nickname: session.user.email?.split("@")[0] || "",
        })
        .then(({ error }) => {
          if (error) {
            console.error(error.message);
          } else {
            router.push("/dashboard");
          }
        });
    }
  }, [session, supabaseClient, router]);

  if (isLoading) return null;

  if (!session) {
    return (
      <div className="flex h-screen w-full bg-neutral-950 text-white flex-col lg:flex-row">
        <div className="hidden lg:flex lg:w-1/2">
          <HomeOnboardPanel />
        </div>

        <div className="flex items-center justify-center p-6 w-full lg:w-1/2 overflow-auto min-h-screen max-h-screen">
          <div className="w-full max-w-sm bg-neutral-900 p-8 rounded-2xl">
            <Auth
              supabaseClient={supabaseClient}
              appearance={{
                theme: ThemeSupa,
                variables: {
                  default: {
                    colors: {
                      brand: "#22c55e",
                      brandAccent: "#16a34a",
                    },
                  },
                },
              }}
              providers={[]}
              theme="dark"
            />
            <div className="mt-8 flex items-center justify-center gap-2">
              <Image src="/logo.svg" width={20} height={20} alt="Logo" />
              <p className="font-semibold text-sm text-neutral-400">Music Hub</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <div>Redirecting to dashboard...</div>;
}
