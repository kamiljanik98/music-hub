"use client";

import { Button } from "@/components/ui/button";

type UploadFooterProps = {
  isLoading: boolean;
  onSubmit: () => void;
};

export const UploadFooter = ({ isLoading, onSubmit }: UploadFooterProps) => {
  return (
    <div className="fixed inset-x-0 bottom-0 z-20 border-t border-white/12 bg-[rgba(15,15,15,0.85)] px-6 py-4 backdrop-blur-[24px] backdrop-saturate-[1.4]">
      <div className="mx-auto flex w-full max-w-4xl items-center justify-between gap-6">
        <p className="max-w-sm text-xs text-muted-foreground">
          By uploading, you confirm that your sounds comply with our Terms of
          Use and you don&apos;t infringe anyone else&apos;s rights.
        </p>

        <Button type="button" size="sm" disabled={isLoading} onClick={onSubmit}>
          {isLoading ? "Uploading..." : "Upload"}
        </Button>
      </div>
    </div>
  );
};
