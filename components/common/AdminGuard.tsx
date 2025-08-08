import React from 'react';
import { useUser } from '@/hooks/useUser';

const AdminGuard = ({ children }: { children: React.ReactNode }) => {
  const { userDetails } = useUser();

  if (userDetails && userDetails.role !== 'admin') {
    return (
      <div className="flex w-full bg-neutral-900 p-4 rounded-lg h-full items-center justify-center">
        <span className="text-white text-lg font-semibold">Not authorized</span>
      </div>
    );
  }
  return <>{children}</>;
};

export default AdminGuard;
