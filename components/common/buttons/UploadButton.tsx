'use client';

import { useState } from 'react';
import UploadModal from '../../UploadModal';
import Button from '../Button';
import { FaPlus } from 'react-icons/fa';

const UploadButton = () => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="flex w-fit md:w-full md:bg-neutral-800 md:p-4 rounded-lg items-center justify-between">
      <p className="font-semibold md:block hidden">Upload</p>
      <Button
        onClick={() => setModalOpen(true)}
        className="w-fit cursor-pointer hover:scale-110 transition bg-green-500 text-white p-2 rounded-full"
      >
        <FaPlus className="size-6 md:size-4" size={14} />
      </Button>
      <UploadModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
};

export default UploadButton;
