"use client";

import { useRef } from "react";
import Link from "next/link";
import { XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ACCEPTED_AUDIO } from "@/lib/constants";

type UploadHeaderProps = {
  step: 1 | 2;
  fileName: string;
  onAudioReplace: (file: File) => void;
};

export const UploadHeader = ({
  step,
  fileName,
  onAudioReplace,
}: UploadHeaderProps) => {
  const audioInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="fixed inset-x-0 top-0 z-20 border-b border-white/12 bg-[rgba(15,15,15,0.85)] px-6 py-4 mh-glass">
      <div className="mx-auto flex w-full max-w-4xl items-center justify-between">
        <p className="text-sm font-semibold text-foreground">
          {step === 1 ? "Upload" : "Track Info"}
        </p>

        <div className="flex items-center gap-3">
          {step === 2 && (
            <>
              <input
                ref={audioInputRef}
                type="file"
                accept={Object.keys(ACCEPTED_AUDIO).join(",")}
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  onAudioReplace(file);
                }}
              />

              {fileName && (
                <p className="max-w-xs truncate text-xs text-muted-foreground">
                  {fileName}
                </p>
              )}

              <Button
                type="button"
                variant="ghost"
                size="xs"
                onClick={() => audioInputRef.current?.click()}
              >
                Replace
              </Button>
            </>
          )}

          <Button asChild variant="secondary" size="icon">
            <Link href="/" aria-label="Cancel upload">
              <XIcon />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};
