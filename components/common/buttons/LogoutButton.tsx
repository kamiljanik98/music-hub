"use client";

import Button from "../Button";
import { FaSignOutAlt } from "react-icons/fa";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";

const LogoutButton = () => {
  const { supabaseClient } = useSessionContext();
  const router = useRouter();

  const handleSignOut = async () => {
    await supabaseClient.auth.signOut();
    router.push("/");
  };

  return (
    <Button
      onClick={handleSignOut}
      className="hover:bg-red-500 text-lg text-white font-semibold flex items-center gap-2 p-3 rounded-lg cursor-pointer transition"
    >
      <FaSignOutAlt size={20} /> Logout
    </Button>
  );
};

export default LogoutButton;
