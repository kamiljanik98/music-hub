"use client";

import { useRef } from "react";
import Link from "next/link";
import { XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ACCEPTED_AUDIO } from "@/lib/constants";
import { truncate } from "@/lib/format/truncate";

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
    <div className="fixed inset-x-0 top-0 z-20 border-b border-white/12 bg-[rgba(15,15,15,0.85)] px-4 py-4 sm:px-6 mh-glass">
      <div className="relative mx-auto flex w-full max-w-4xl items-center justify-between gap-3">
        <p className="shrink-0 text-sm font-semibold text-foreground">
          {step === 1 ? "Upload" : "Track Info"}
        </p>

        {step === 2 && fileName && (
          <p className="absolute left-1/2 max-w-[40%] -translate-x-1/2 truncate text-center text-xs text-muted-foreground">
            {truncate(fileName, 15)}
          </p>
        )}

        <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3">
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
                  e.currentTarget.value = "";
                }}
              />

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
