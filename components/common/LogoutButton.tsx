"use client";

import Button from "./Button";
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
      className="
        hover:bg-red-500/75 
        flex items-center gap-4 
        md:w-fit w-full 
        p-3 rounded-md cursor-pointer
      "
    >
      <FaSignOutAlt size={20} className="m-0" />
    </Button>
  );
};

export default LogoutButton;
