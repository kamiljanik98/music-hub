"use client";

import { useRouter } from "next/navigation";

export default function SearchPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen w-full flex-col justify-center items-center gap-4">
      <p className="text-center">Page under development....</p>
      <button
        onClick={() => router.push("/dashboard")}
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
      >
        Back to Dashboard
      </button>
    </div>
  );
}
