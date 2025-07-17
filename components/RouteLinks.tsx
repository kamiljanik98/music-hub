import Link from "next/link"
import { FaHome, FaSearch } from "react-icons/fa"
import { usePathname } from "next/navigation"
import Button from "./common/Button";
import { FaGear } from "react-icons/fa6";

const RouteLinks = ({ collapsed = false }) => {
  const pathname = usePathname();
  return (
    <div className="flex flex-row md:flex-col items-center gap-2 md:gap-2 w-full justify-end md:justify-start">
      <Link
        href='/dashboard'
        className={`w-fit md:w-full h-fit text-base font-semibold flex items-center px-3 md:px-5 py-2 md:py-3 gap-2 rounded-md transition
          hover:bg-neutral-800
          ${pathname === "/dashboard" ? "bg-neutral-800" : "text-white"}
        `}
      >
        <FaHome size={16} className="size-6 md:size-4"/>
        {!collapsed && <p className="hidden md:block">Dashboard</p>}
      </Link>
      <Link
        href='/search'
        className={`w-fit md:w-full h-fit text-base font-semibold flex items-center gap-2 px-3 md:px-5 py-2 md:py-3 rounded-md transition
          hover:bg-neutral-800
          ${pathname === "/search" ? "bg-neutral-800 text-green-400" : "text-white"}
        `}
      >
        <FaSearch className="size-6 md:size-4" size={16} />
        {!collapsed && <p className="hidden md:block">Search</p>}
      </Link>
      <Link
        href='/settings' 
        className={`w-fit md:w-full h-fit text-base font-semibold flex items-center gap-2 px-3 md:px-5 py-2 md:py-3 rounded-md transition
          hover:bg-neutral-800
          ${pathname === "/search" ? "bg-neutral-800 text-green-400" : "text-white"}
        `}
      >
        <FaGear size={14} className="size-6 md:size-4" /> {!collapsed && <span className="hidden sm:inline">Settings</span>}
      </Link>
    </div>
  )
}

export default RouteLinks;