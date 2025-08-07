"use client";

import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Image from "next/image";
import OnboardingPanel from "@/components/OnboardingPanel";

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
            console.error("Failed to upsert profile:", error);
          } else {
            router.push("/dashboard");
          }
        });
    }
  }, [session, supabaseClient, router]);

  if (isLoading) return null;

  if (!session) {
    return (
      <div className="flex h-screen w-full bg-neutral-950 text-white flex-col md:flex-row justify-between">
        {/* Onboarding Panel: 40% width on mobile, 50%+ on md+ */}
        <div className="md:block hidden w-full  max-h-screen overflow-auto">
          <OnboardingPanel />
        </div>

        {/* Auth Panel: 60% width on mobile, 50% on md+ */}
        <div className="flex items-center justify-center p-6 max-h-screen min-h-screen w-full overflow-auto">
          <div className="w-full max-w-sm bg-neutral-900 p-8 rounded-2xl shadow-xl">
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
