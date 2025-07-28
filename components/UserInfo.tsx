import { useUser } from "@/hooks/useUser";
import Image from "next/image";

const UserInfo = ({ collapsed = false }) => {
  const { userDetails } = useUser();
  return (
    <div className="hidden md:block w-full mt-2">
      <div className="cursor-pointer md:p-2 md:w-full rounded-lg flex items-center gap-3">
        {userDetails?.avatar_url ? (
          <Image
            src={userDetails.avatar_url}
            alt="User Avatar"
            className="md:min-w-10 md:h-10 rounded-full border-2 border-neutral-700 shadow object-cover"
            width={40}
            height={40}
          />
        ) : (
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-neutral-700" />
        )}
        {!collapsed && (
          <div>
            <p className="text-sm font-bold text-white">
              {userDetails?.nickname || 'No name'}
            </p>
            <p className="text-xs text-neutral-400 hidden md:block">
              {userDetails?.role || 'unidentified' }
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default UserInfo;