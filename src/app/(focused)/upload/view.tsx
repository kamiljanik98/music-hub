"use client";

import UploadForm from "@/components/upload/upload-form";
import { useState } from "react";

export default function UploadView() {
  const [step, setStep] = useState<1 | 2>(1);

  return (
    <div className="relative flex min-h-screen flex-col items-center bg-background text-foreground px-4">
      <div className="mt-24 w-full max-w-4xl px-5 pb-48">
        <UploadForm step={step} onStepChange={setStep} />
      </div>
    </div>
  );
}
