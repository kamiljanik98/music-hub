import * as Dialog from "@radix-ui/react-dialog";
import React, { FC } from "react";
import { IoMdClose } from "react-icons/io";

interface Props {
  isOpen: boolean;
  onChange: (open: boolean) => void;
  title: string;
  description: string;
  children: React.ReactNode;
}

const Modal: FC<Props> = ({ isOpen, onChange, title, description, children }) => {
  return (
    <Dialog.Root open={isOpen} defaultOpen={isOpen} onOpenChange={onChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-neutral-900/90 backdrop-blur-sm inset-0 fixed text-white z-50">
          <Dialog.Content
            className="
              fixed drop-shadow border border-neutral-700 top-[50%] left-[50%]
              max-h-full h-full md:h-auto md:max-h-[85vh]
              w-full md:w-[90vw] md:max-w-[450px]
              translate-x-[-50%] translate-y-[-50%]
              rounded-md bg-neutral-800 p-6
              focus:outline-none
            "
          >
            <Dialog.Title className="text-xl font-bold mb-4 text-center">{title}</Dialog.Title>
            <Dialog.Description className="text-sm mb-6 text-center leading-relaxed">
              {description}
            </Dialog.Description>
            <div>{children}</div>
            <Dialog.Close asChild>
              <button
                className="
                text-neutral-400 
                hover:text-white 
                absolute top-[10px] 
                right-[10px] 
                inline-flex 
                h-[25px] 
                w-[25px] 
                appearance-none 
                items-center 
                justify-center 
                rounded-full 
                focus:outline-none
              "
              >
                <IoMdClose />
              </button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default Modal;
