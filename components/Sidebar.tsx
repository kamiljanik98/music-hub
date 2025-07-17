'use client';

import Link from "next/link";
import Block from "./common/Block";
import { FaPlus, FaSearch } from "react-icons/fa";
import { FaHome } from "react-icons/fa";
import { useUser } from "@/hooks/useUser";
import Button from "./common/Button";
import { FaGear } from "react-icons/fa6";
import { FaSignOutAlt, FaBars, FaTimes } from "react-icons/fa";
import { useState } from "react";

const Sidebar = () => {
  const { userDetails } = useUser();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="bg-neutral-900 rounded-lg shadow-lg p-4 md:p-4 h-auto md:h-full w-full md:w-56 flex flex-row md:flex-col items-center md:items-start justify-between md:justify-start gap-2 md:gap-4 relative">
      {/* Logo/App Name (hidden on small screens) */}
      <div className="flex items-center justify-between w-full md:block">
        <span className="text-xl font-extrabold text-white tracking-tight mx-0.5 hidden md:block">Music-Hub</span>
        {/* Burger menu for mobile */}
        <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
          <FaBars size={20} className="text-white size-6" />
        </button>
      </div>
      {/* User info and settings/logout: desktop always, mobile in burger */}
      <div className="hidden md:block w-full mt-2">
        <Block className="bg-neutral-800 md:p-2 md:w-full rounded-lg flex items-center gap-3">
          {userDetails?.avatar_url ? (
            <img
              src={userDetails.avatar_url}
              alt="User Avatar"
              className="md:min-w-10 md:h-10 rounded-full border-2 border-neutral-700 shadow object-cover"
            />
          ) : (
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-neutral-700" />
          )}
          <div>
            <p className="text-sm font-bold text-white">
              {userDetails?.nickname || 'No name'}
            </p>
            <p className="text-xs text-neutral-400 hidden md:block">
              {userDetails?.role || 'unidentified' }
            </p>
          </div>
        </Block>
        
      </div>
      {/* Upload and nav icons always visible */}
      <div className="flex w-fit md:w-full md:bg-neutral-800 md:p-4 rounded-lg items-center justify-between">
        <p className="font-semibold md:block hidden">Upload</p> 
        <Button className="w-fit cursor-pointer hover:scale-110 transition bg-green-500 text-white p-2 rounded-full"><FaPlus className="size-6 md:size-4" size={14} /></Button>
      </div>
      <div className="flex flex-row md:flex-col items-center gap-2 md:gap-2 w-full justify-end md:justify-start">
        <Link href='/home' className="w-fit md:w-full h-fit text-base font-semibold flex items-center px-3 md:px-5 py-2 md:py-3 gap-2 rounded-md hover:bg-neutral-800 transition">
          <FaHome size={16} className="size-6 md:size-4"/>
          <p className="hidden md:block">Home</p>
        </Link>
        <Link href='/search' className="w-fit md:w-full h-fit text-base font-semibold flex items-center gap-2 px-3 md:px-5 py-2 md:py-3 rounded-md hover:bg-neutral-800 transition">
          <FaSearch className="size-6 md:size-4" size={16} />
          <p className="hidden md:block">Search</p>
        </Link>
      </div>
      
      {/* Mobile burger menu dropdown: now full screen with exit button */}
      {menuOpen && (
        <div className="fixed inset-0 w-full h-full bg-neutral-900/95 z-50 flex flex-col items-center justify-center p-8 gap-4 md:hidden">
          {/* Exit button */}
          <button
            className="absolute top-4 right-4 text-white text-3xl p-2 rounded-full hover:bg-neutral-800 focus:outline-none"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
          >
            <FaTimes />
          </button>
          <Block className="bg-neutral-800 p-4 w-4/5 rounded-lg flex items-center gap-4">
            {userDetails?.avatar_url ? (
              <img
                src={userDetails.avatar_url}
                alt="User Avatar"
                className="w-12 h-12 rounded-full border-2 border-neutral-700 shadow object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-neutral-700" />
            )}
            <div>
              <p className="text-lg font-bold text-white">
                {userDetails?.nickname || 'No name'}
              </p>
              <p className="text-sm text-neutral-400">
                {userDetails?.role || 'unidentified' }
              </p>
            </div>
          </Block>
          <Button className="bg-neutral-800 hover:bg-neutral-700 text-white font-medium flex items-center gap-3 p-4 rounded-lg transition w-4/5 text-lg justify-center">
            <FaGear size={18} /> Settings
          </Button>
          <Button className="bg-neutral-800 hover:bg-red-700 text-white font-medium flex items-center gap-3 p-4 rounded-lg transition w-4/5 text-lg justify-center">
            <FaSignOutAlt size={18} /> Logout
          </Button>
        </div>
      )}

      <div className="w-full sm:hidden md:flex hidden flex flex-col gap-2 mt-0 md:mt-auto">
          <Button className="bg-neutral-800 hover:bg-neutral-700 text-white font-medium flex items-center gap-2 p-3 rounded-lg transition">
            <FaGear size={14} /> <span className="hidden sm:inline">Settings</span>
          </Button>
          <Button className="bg-neutral-800 hover:bg-red-700 text-white font-medium flex items-center gap-2 p-3 rounded-lg transition">
            <FaSignOutAlt size={14} /> <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
    </div>
  )
}

export default Sidebar;