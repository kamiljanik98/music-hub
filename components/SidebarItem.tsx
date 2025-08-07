import { FC } from "react";
import Link from "next/link";
import { IconType } from "react-icons/lib";
import { twMerge } from "tailwind-merge";

interface Props {
  icon: IconType;
  href: string;
  active: boolean;
  label: string;
  onClick?: () => void; 
}

const SidebarItem: FC<Props> = ({ icon: Icon, label, active, href, onClick }) => {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={twMerge(
        `
        flex flex-row h-auto items-center w-full p-4
        gap-x-4 text-md font-medium cursor-pointer rounded-lg
        hover:text-white transition text-neutral-400 hover:bg-neutral-800 
      `,
        active && "text-white",
      )}
    >
      <Icon size={26} />
      <p className="w-full truncate">{label}</p>
    </Link>
  );
};

export default SidebarItem;
