'use client';

import React, { useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { FaHome, FaSearch } from "react-icons/fa";
import { useUser } from "@/hooks/useUser";
import AdminGuard from "@/components/forms/AdminGuard";
import Link from "next/link";

export default function DashboardPage() {
  const { userDetails } = useUser();
  const [activeTab, setActiveTab] = useState("general");

  return (
    <div className="flex h-screen w-full bg-neutral-950 p-2 relative overflow-hidden">
      {/* Sidebar */}
      <aside className="flex flex-col justify-between w-72 h-full bg-neutral-900 backdrop-blur-md p-4 border-neutral-800 sticky top-0 shadow-lg rounded-lg">
        <div className="flex flex-col h-full flex-1">

          <nav className="flex flex-col gap-2">
            <div className="flex items-center gap-3 p-2 rounded-md hover:bg-neutral-800 transition">
              <FaHome size={18} />
              <Link href='/home' className="text-base font-medium">Home</Link>
            </div>
            <div className="flex items-center gap-3 p-2 rounded-md hover:bg-neutral-800 transition">
              <FaSearch size={18} />
              <Link href='/search' className="text-base font-medium">Search</Link>
            </div>
          </nav>

          <div className="w-full h-0.25 bg-neutral-600 mt-4 mb-4 rounded-full"></div>

          <div className="rounded-lg px-2 shadow-inner flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <span className="text-lg font-semibold">User Library</span>
              <button className="p-1 rounded cursor-pointer hover:scale-115 transition">
                <FaPlus size={16} />
              </button>
            </div>
            <div className="flex-1" />
          </div>
        </div>

        <div className="flex items-center p-2 gap-4 rounded-lg mt-4">
          {userDetails?.avatar_url ? (
            <img
              src={userDetails.avatar_url}
              alt="User Avatar"
              className="w-12 h-12 rounded-full border-2 border-neutral-700 shadow object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-neutral-800" />
          )}
          <div>
            <p className="text-base font-semibold text-white">
              {userDetails?.nickname || 'No name'}
            </p>
            <p className="text-sm text-neutral-400">
              {userDetails?.role}
            </p>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col items-start pl-2 overflow-y-auto">
        <div className="w-full h-full  flex gap-8">
          <AdminGuard>
            <div className="bg-neutral-900 rounded-xl shadow-lg p-6 h-full flex flex-col items-start">
              <h2 className="text-xl font-bold mb-4">User Management</h2>
              <p className="text-base text-white">This entire module is only visible to admins.</p>
            </div>
          </AdminGuard>
        </div>
      </main>
    </div>
  );
}
