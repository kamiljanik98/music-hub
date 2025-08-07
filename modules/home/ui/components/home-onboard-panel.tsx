"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { twMerge } from "tailwind-merge";
import OnboardSlide from "@/components/OnboardSlide";
import { ONBOARDING_DATA } from "@/constants/onboarding-data";

const AUTO_ADVANCE_INTERVAL = 6000;
const FADE_DURATION = 500;

export default function HomeOnboardPanel() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      triggerSlideChange((prev) => (prev + 1) % ONBOARDING_DATA.length);
    }, AUTO_ADVANCE_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  const triggerSlideChange = (newIndexOrFn: number | ((prev: number) => number)) => {
    setVisible(false);
    setTimeout(() => {
      setIndex((prev) => (typeof newIndexOrFn === "function" ? newIndexOrFn(prev) : newIndexOrFn));
      setVisible(true);
    }, FADE_DURATION);
  };

  const currentSlide = ONBOARDING_DATA[index];

  return (
    <div
      className={twMerge(
        "hidden md:flex",
        "bg-green-600 text-white p-6 md:p-12 select-none",
        "w-full max-w-md mx-auto my-6 md:rounded-r-3xl",
        "flex flex-col justify-between min-h-[320px]",
        "md:h-full md:max-w-none md:mx-0 md:my-0",
      )}
    >
      <div className="flex items-center gap-2 mb-6">
        <Image src="/logo.svg" width={40} height={40} alt="Logo" priority unoptimized />
        <h2 className="text-2xl font-semibold">Music Hub</h2>
      </div>

      <OnboardSlide
        key={index}
        title={currentSlide.title}
        description={currentSlide.description}
        subpoints={currentSlide.subpoints}
        visible={visible}
      />

      <div className="flex items-center justify-between mt-8">
        <div className="flex gap-3">
          {ONBOARDING_DATA.map((_, i) => (
            <button
              key={i}
              onClick={() => triggerSlideChange(i)}
              aria-label={`Slide ${i + 1}`}
              className={twMerge(
                "w-4 h-4 rounded-full transition duration-300 cursor-pointer",
                i === index ? "bg-white" : "bg-white/40 hover:bg-white/70",
              )}
            />
          ))}
        </div>
        <p className="text-sm opacity-80 select-text">
          © {new Date().getFullYear()} Music Hub. All rights reserved.
        </p>
      </div>
    </div>
  );
}
