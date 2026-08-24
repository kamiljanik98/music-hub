"use client";

import UploadForm from "./upload-form";
import { useState } from "react";

export default function UploadView() {
  const [step, setStep] = useState<1 | 2>(1);

  return (
    <div className="flex flex-1 flex-col">
      <UploadForm step={step} onStepChange={setStep} />
    </div>
  );
}
