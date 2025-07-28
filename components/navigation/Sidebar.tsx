'use client';

import { FaBars, FaTimes } from "react-icons/fa";
import { useState } from "react";
import UploadButton from "../common/buttons/UploadButton";
import LogoutButton from "../common/buttons/LogoutButton";
import Menu from "./Menu";

const Sidebar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  
  return (
    <div className="bg-neutral-900 rounded-lg shadow-lg p-4 md:p-4 h-auto md:h-full w-full md:w-56 flex flex-row md:flex-col items-center md:items-start justify-between md:justify-start gap-2 md:gap-4 relative">
      <div className="flex items-center justify-between w-full md:block">
        <span className="text-xl font-extrabold text-white tracking-tight mx-0.5 hidden md:block">Music-Hub</span>
        <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
          <FaBars size={20} className="text-white size-6" />
        </button>
      </div>
      <Menu />
      <UploadButton />
      {menuOpen && (
        <div className="fixed inset-0 w-full h-full bg-neutral-900/95 z-50 flex flex-col items-center justify-center p-8 gap-4 md:hidden">
          <button
            className="absolute top-4 right-4 text-white text-3xl p-2 rounded-full hover:bg-neutral-800 focus:outline-none"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
          >
            <FaTimes />
          </button>
          <Menu collapsed />
        </div>
      )}
      <div className="w-full sm:hidden md:flex hidden flex-col gap-2 mt-0 md:mt-auto">
        <LogoutButton />
      </div>
    </div>
  )
}

export default Sidebar;