"use client";

import { ImageIcon } from "lucide-react";
import { useEffect, useMemo } from "react";

function ImagePreview({
  file,
  isDragActive,
}: {
  file: File | null;
  isDragActive: boolean;
}) {
  const url = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);

  useEffect(() => {
    if (!url) return;
    return () => URL.revokeObjectURL(url);
  }, [url]);

  if (!url) {
    return (
      <div className="flex flex-col items-center gap-2 text-muted-foreground">
        <ImageIcon size={32} />
        <span className="text-sm">
          {isDragActive
            ? "Drop image here"
            : "Drag image here or click to select"}
        </span>
      </div>
    );
  }
  return (
    <img src={url} alt="Cover preview" className="h-full w-full object-cover" />
  );
}

export default ImagePreview;
