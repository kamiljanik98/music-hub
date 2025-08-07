"use client";

import Button from "./Button";
import { FaSignOutAlt } from "react-icons/fa";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";

const LogoutButton = ({ label = "Logout" }: { label?: string }) => {
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
      <p className="block md:hidden text-md font-medium">{label}</p>
    </Button>
  );
};

export default LogoutButton;
