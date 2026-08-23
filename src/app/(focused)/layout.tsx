import { Toaster } from "sonner";
import { UserProvider } from "@/components/providers/user-provider";

export default function FocusedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative z-10 flex min-h-screen flex-col">
      <div
        aria-hidden
        className="mh-atmosphere-a pointer-events-none absolute top-1/2 left-1/2 -z-10 h-[560px] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full"
      />

      <UserProvider />

      <Toaster
        position="top-center"
        toastOptions={{
          classNames: {
            success: "!bg-neutral-950 !border-green-800 !text-green-300",
            error: "!bg-red-950 !border-red-800 !text-red-300",
          },
        }}
      />

      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-6 pt-32 pb-24">
        {children}
      </main>
    </div>
  );
}
