import React from "react";
import { useUser } from "@/hooks/useUser"

const AdminGuard = ({ children }: { children: React.ReactNode }) => {
  const { userDetails } = useUser();

  if (userDetails && userDetails.role !== "admin") {
    return <div>Not authorized</div>;
  }
  return <>{children}</>;
};

export default AdminGuard;