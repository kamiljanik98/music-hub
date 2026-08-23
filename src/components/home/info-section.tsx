import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const InfoSection = () => {
  return (
    <section className="mx-auto grid w-full max-w-[var(--mh-content-max)] grid-cols-1 gap-6 md:grid-cols-2 md:gap-16">
      <h2 className="font-display text-3xl uppercase leading-[1.05] tracking-[0.02em] text-foreground md:text-4xl">
        Made for the
        <br />2 a.m. bounce
      </h2>

      <div className="flex flex-col gap-4 text-sm leading-relaxed text-[var(--mh-text-lead)] md:text-base">
        <p>
          The best version of a track is usually the one you finish at night and
          are unsure about in the morning. Most platforms want you to sit on it
          for six weeks and plan a campaign.
        </p>

        <p className="text-muted-foreground">
          MusicHub is built for the other way round. Post it, watch who plays
          it, read what they say at the exact second they say it. Keep your
          masters, keep your audience, skip the release calendar.
        </p>

        <Link
          href="/search"
          className="mt-2 inline-flex w-fit items-center gap-1.5 text-sm font-medium text-primary transition-opacity hover:opacity-80"
        >
          See how artists use it
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </section>
  );
};
