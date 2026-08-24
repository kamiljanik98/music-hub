import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const InfoSection = () => {
  return (
    <section>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4 border-b border-border pb-4">
        <div className="flex min-w-0 flex-col gap-1">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            Why MusicHub
          </p>

          <h2 className="font-display text-3xl uppercase leading-none tracking-[0.02em] text-foreground md:text-5xl">
            Made for the 2 a.m. bounce
          </h2>
        </div>

        <Link
          href="/search?query=synthwave"
          className="inline-flex w-fit shrink-0 items-center gap-1.5 text-sm font-medium text-primary transition-opacity hover:opacity-80"
        >
          See how artists use it
          <ArrowRight className="size-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 text-sm leading-relaxed text-[var(--mh-text-lead)] md:grid-cols-2 md:gap-16 md:text-base">
        <p>
          The best version of a track is usually the one you finish at night and
          are unsure about in the morning. Most platforms want you to sit on it
          for six weeks and plan a campaign.
        </p>

        <p className="text-muted-foreground">
          MusicHub is built for the other way round. Post it, watch who plays it,
          read what they say at the exact second they say it. Keep your masters,
          keep your audience, skip the release calendar.
        </p>
      </div>
    </section>
  );
};
