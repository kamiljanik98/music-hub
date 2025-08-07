"use client";

import { useState } from "react";
import UploadModal from "../UploadModal";
import Button from "./Button";
import { FaPlus } from "react-icons/fa";
import { useUser } from "@/hooks/useUser";

const UploadButton = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const { userDetails } = useUser();
  const isGuest = userDetails?.role === "guest";

  return (
    <div className="flex flex-col w-fit md:w-full md:bg-neutral-800 md:p-4 rounded-lg items-start md:items-center">
      <div className="flex items-center justify-between w-full relative group">
        <p className="font-semibold md:block hidden">Upload</p>
        <Button
          onClick={() => {
            if (!isGuest) setModalOpen(true);
          }}
          disabled={isGuest}
          className={`w-fit cursor-pointer hover:scale-110 transition bg-green-500 text-white p-2 rounded-full ${
            isGuest ? "opacity-50 cursor-not-allowed hover:scale-100" : ""
          }`}
        >
          <FaPlus className="size-6 md:size-4" size={14} />
        </Button>

        {isGuest && (
          <span className="absolute left-[-16] bottom-[-56] mb-2 hidden group-hover:block text-yellow-500 text-xs rounded p-1 whitespace-nowrap z-10">
            Upload is disabled for guest users.
          </span>
        )}
      </div>

      {!isGuest && <UploadModal open={modalOpen} onClose={() => setModalOpen(false)} />}
    </div>
  );
};

export default UploadButton;
