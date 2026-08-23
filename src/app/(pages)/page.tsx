import { Shelf } from "@/components/songs/shelf";
import { HeroHeadline } from "@/components/home/hero-headline";
import Link from "next/link";
import { Button } from "@/components/ui/button";

function Banner() {
  return (
    <section className="mx-auto flex max-w-[var(--mh-content-max)] flex-col items-center gap-8 pt-12 pb-28 text-center md:pt-20 md:pb-[160px]">
      <div className="flex items-center gap-2.5 rounded-[var(--mh-radius-pill)] border border-border bg-card px-[18px] py-2">
        <span className="mh-pulse-dot size-2 rounded-full bg-primary" />
        <span className="text-sm text-[#e5e5e5]">
          Fresh tracks land here every day
        </span>
      </div>

      <HeroHeadline />

      <p className="max-w-[600px] text-xl leading-relaxed text-muted-foreground">
        Rough mixes, live sets and finished records, posted by the artists the
        day they finish them.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
        <Button asChild size="lg">
          <Link href="/search">Start listening free</Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/upload">I make music</Link>
        </Button>
      </div>

      <style>{`
        @keyframes mh-pulse {
          0%, 100% { opacity: 0.55; }
          50% { opacity: 1; }
        }
        .mh-pulse-dot {
          animation: mh-pulse 2.6s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .mh-pulse-dot { animation: none; }
        }
      `}</style>
    </section>
  );
}

export default async function HomePage() {
  return (
    <div>
      <Banner />
      <section className="mx-auto max-w-[var(--mh-content-max)] py-10">
        <Shelf title="Discover this week" />
      </section>
    </div>
  );
}
