import { createClient } from "@/lib/supabase/client";
import { useState } from "react";
import type { Provider } from "@supabase/supabase-js";

const POPUP_TIMEOUT_MS = 2 * 60 * 1000;

const useSocialLogin = () => {
  const [isSocialLoading, setIsLoading] = useState<boolean>(false);
  const supabase = createClient();

  const socialLogin = async (provider: Provider) => {
    setIsLoading(true);

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        skipBrowserRedirect: true,
      },
    });
    if (error) {
      setIsLoading(false);
      return { error };
    }
    if (!data.url) {
      setIsLoading(false);
      return { error: new Error("No OAuth URL returned") };
    }

    localStorage.removeItem("discord-oauth-result");
    const popup = window.open(
      data.url,
      "discord-oauth",
      "width=500,height=700",
    );

    if (!popup) {
      setIsLoading(false);
      return {
        error: new Error(
          "Pop-up blocked. Allow pop-ups for this site and try again",
        ),
      };
    }

    return new Promise<{ error: Error | null }>((resolve) => {
      const settle = (settleError: Error | null) => {
        clearInterval(checkClosed);
        clearTimeout(giveUp);
        setIsLoading(false);
        resolve({ error: settleError });
      };

      const checkClosed = setInterval(() => {
        if (!popup.closed) return;

        const raw = localStorage.getItem("discord-oauth-result");
        localStorage.removeItem("discord-oauth-result");

        if (!raw) {
          settle(new Error("Popup closed before completing sign in"));
          return;
        }

        try {
          const result = JSON.parse(raw);
          settle(result.success ? null : new Error("Discord sign in failed"));
        } catch {
          settle(new Error("Discord sign in failed"));
        }
      }, 500);

      const giveUp = setTimeout(() => {
        popup.close();
        settle(new Error("Discord sign in timed out"));
      }, POPUP_TIMEOUT_MS);
    });
  };
  return { socialLogin, isSocialLoading };
};

export default useSocialLogin;
