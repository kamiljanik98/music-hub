'use client';

import { FaPlus } from "react-icons/fa6";
import { FaHome, FaSearch } from "react-icons/fa";
import { useUser } from "@/hooks/useUser";
import AdminGuard from "@/components/forms/AdminGuard";

export default function DashboardPage() {
  const { userDetails } = useUser();

  return (
    <div className="flex h-screen w-full bg-neutral-950">
      {/* Sidebar */}
      <aside className="flex flex-col justify-between w-72 h-full bg-neutral-900 p-4 border-r border-neutral-800 sticky top-0 shadow-lg">
        <div>
          {/* User Info */}
          <div className="flex flex-col items-center mb-8">
            {userDetails?.avatar_url ? (
              <img
                src={userDetails.avatar_url}
                alt="User Avatar"
                className="w-16 h-16 rounded-full mb-2 border-2 border-neutral-700 shadow"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-neutral-800 mb-2" />
            )}
            <span className="text-lg font-semibold text-white">
              {userDetails?.nickname || userDetails?.email || 'No name'}
            </span>
          </div>

          {/* Navigation */}
          <nav className="flex flex-col gap-2 mb-8">
            <a href="/dashboard" className="flex items-center gap-3 px-4 py-2 rounded-md hover:bg-neutral-800 transition">
              <FaHome size={18} />
              <span className="font-medium">Home</span>
            </a>
            <a href="#" className="flex items-center gap-3 px-4 py-2 rounded-md hover:bg-neutral-800 transition">
              <FaSearch size={18} />
              <span className="font-medium">Search</span>
            </a>
          </nav>

          {/* User Library */}
          <div className="bg-neutral-800 rounded-lg p-4 shadow-inner">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-md">User Library</span>
              <button className="p-1 rounded hover:bg-neutral-700 transition">
                <FaPlus size={16} />
              </button>
            </div>
            {/* Optionally, list user's playlists or files here */}
          </div>
        </div>
        <div className="text-xs text-neutral-500 text-center mt-8">Music Hub © 2024</div>
      </aside>

      {/* Main Content */}
      <AdminGuard>
        <main className="flex-1 flex flex-col items-center justify-start p-8 overflow-y-auto">
          <div className="w-full max-w-2xl bg-neutral-900 rounded-xl shadow-lg p-8 mt-8">
            Page Content
          </div>
        </main>
      </AdminGuard>
    </div>
  );
}
