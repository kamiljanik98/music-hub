import { useRef } from "react";
import { useSessionContext } from "@supabase/auth-helpers-react";

export default function UploadModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { supabaseClient } = useSessionContext();

  const handleUpload = async () => {
    const file = fileInputRef.current?.files?.[0];
    if (!file) return;
    await supabaseClient.storage.from("audio").upload(file.name, file);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-black p-4 rounded">
        <input type="file" ref={fileInputRef} />
        <button onClick={handleUpload}>Upload</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}