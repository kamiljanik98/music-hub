import { Toaster } from "sonner";
import Navbar from "@/components/common/navbar";
import AuthModal from "@/components/auth/auth-dialog";
import { Bar } from "@/components/player/bar";
import { UserProvider } from "@/components/providers/user-provider";
import Footer from "@/components/common/footer";

export default function PagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col pb-[116px]">
      <Navbar />

      <div className="relative z-10 mx-auto flex w-full max-w-[var(--mh-content-max)] flex-1 flex-col px-4 pt-8">
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

        <AuthModal />

        <main className="flex w-full flex-1 justify-center">
          <div className="w-full">{children}</div>
        </main>
      </div>

      <Footer />
      <Bar />
    </div>
  );
}
