import { Toaster } from "sonner";
import Navbar from "@/components/common/navbar";
import AuthDialog from "@/components/auth/auth-dialog";
import { Bar } from "@/components/player/bar";
import { UserProvider } from "@/components/providers/user-provider";
import Footer from "@/components/common/footer";
import { NewsButton } from "@/components/common/news-button";

export default function PagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Toaster
        position="top-center"
        toastOptions={{
          classNames: {
            success: "!bg-neutral-950 !border-green-800 !text-green-300",
            error: "!bg-red-950 !border-red-800 !text-red-300",
          },
        }}
      />

      <Navbar />

      <div className="relative z-10 mx-auto flex w-full max-w-[var(--mh-content-max)] flex-1 flex-col px-4 pt-8">
        <UserProvider />

        <AuthDialog />

        <main className="flex-1">{children}</main>
      </div>
      <NewsButton />
      <Bar />

      <Footer />
    </div>
  );
}
