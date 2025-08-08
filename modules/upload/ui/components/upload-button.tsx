"use client";

import Button from "@/components/common/Button";
import { FaPlus } from "react-icons/fa";
import { useUser } from "@/hooks/useUser";
import useUploadModal from "@/hooks/useUploadModal";

const UploadButton = () => {
  const uploadModal = useUploadModal();
  const { userDetails } = useUser();
  const isGuest = userDetails?.role === "guest";

  const handleClick = () => {
    if (!isGuest) {
      uploadModal.onOpen();
    }
  };

  return (
    <div className="flex flex-col w-fit w-full bg-neutral-800 p-4 rounded-lg items-start md:items-center">
      <div className="flex items-center justify-between w-full relative group">
        <span>
          <p className="font-semibold block ">Upload Files</p>
          <p className="font-light text-[12px] block text-neutral-400">Max file size is 20MB</p>
        </span>
        <Button
          onClick={handleClick}
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
    </div>
  );
};

export default UploadButton;
