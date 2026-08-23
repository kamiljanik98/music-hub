"use client";

import UploadForm from "@/components/upload/upload-form";
import { useState } from "react";

export default function UploadView() {
  const [step, setStep] = useState<1 | 2>(1);

  return (
    <div className="flex w-full flex-1 flex-col">
      <UploadForm step={step} onStepChange={setStep} />
    </div>
  );
}
