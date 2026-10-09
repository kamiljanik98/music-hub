import Link from "next/link";

interface ComingSoonPageProps {
  searchParams: Promise<{
    page?: string;
  }>;
}

const pages: Record<string, string> = {
  terms: "Terms of Service",
  privacy: "Privacy Policy",
  cookies: "Cookie Policy",
  copyright: "Copyright",
  feedback: "Feedback",
};

export default async function ComingSoonPage({
  searchParams,
}: ComingSoonPageProps) {
  const { page } = await searchParams;
  const title = page ? pages[page] : undefined;

  return (
    <main className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="w-full max-w-md border border-border p-8 text-center">
        <p className="mb-4 font-mono text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
          MUSICHUB / UNDER CONSTRUCTION
        </p>

        <h1 className="mb-3 text-2xl font-semibold tracking-tight">
          {title ?? "Page under construction"}
        </h1>

        <p className="text-sm text-muted-foreground">
          This page is currently being built. Please check back later.
        </p>

        <Link
          href="/"
          className="mt-6 inline-block font-mono text-xs text-foreground transition-colors hover:text-muted-foreground"
        >
          ← Back to home
        </Link>
      </div>
    </main>
  );
}
