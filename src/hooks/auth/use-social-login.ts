"use client";

import { createClient } from "@/lib/supabase/client";
import { useState } from "react";
import type { Provider } from "@supabase/supabase-js";

const useSocialLogin = () => {
  const [isSocialLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  const socialLogin = async (provider: Provider) => {
    setIsLoading(true);

    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setIsLoading(false);
      return { error };
    }

    return { error: null };
  };

  return { socialLogin, isSocialLoading };
};

export default useSocialLogin;
