import { Toaster } from "sonner";
import { UserProvider } from "@/components/providers/user-provider";

export default function FocusedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col">
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

      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-6">
        {children}
      </main>
    </div>
  );
}
