import { UploadCloud } from "lucide-react";

function AudioDropContent({
  file,
  isDragActive,
}: {
  file: File | null;
  isDragActive: boolean;
}) {
  if (file instanceof File) {
    return (
      <div className="flex flex-col items-center gap-2">
        <UploadCloud size={48} className="text-muted-foreground" />
        <span className="text-sm">{file.name}</span>
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center gap-4">
      <UploadCloud size={48} className="text-muted-foreground" />
      <p className="text-sm font-semibold">
        {isDragActive
          ? "Drop your file here"
          : "Drag and drop audio files to get started."}
      </p>
      {!isDragActive && (
        <span className="rounded-full border border-border px-5 py-2 text-sm hover:bg-muted transition-colors">
          Choose files
        </span>
      )}
    </div>
  );
}

export default AudioDropContent;
