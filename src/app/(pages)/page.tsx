import { Shelf } from "./components/shelf";
import { PromoBanner } from "./components/promo-banner";
import { getPromoPlaylist } from "@/actions/playlists/get-promo-playlist";
import { HeroHeadline } from "./components/hero-headline";
import { BannerCta } from "./components/banner-cta";
import { InfoSection } from "./components/info-section";
import { SocialProof } from "./components/social-proof";
import { createClient } from "@/lib/supabase/server";
import type { ProfileSummary } from "@/types";

function Banner({ artists }: { artists: ProfileSummary[] }) {
  return (
    <section className="flex min-h-[calc(100vh-9rem)] flex-col items-center justify-center gap-8 pt-10 text-center md:gap-12 md:pt-14">
      <div className="flex items-center gap-2.5 rounded-[var(--mh-radius-pill)] border border-border bg-card px-[18px] py-2">
        <span className="mh-pulse-dot size-2 rounded-full bg-primary" />
        <span className="text-sm text-[#e5e5e5]">
          Fresh tracks land here every day
        </span>
      </div>

      <HeroHeadline />

      <p className="max-w-[520px] text-base leading-relaxed text-muted-foreground md:text-lg">
        Rough mixes, live sets and finished records, posted by the artists the
        day they finish them.
      </p>

      <BannerCta />

      <SocialProof
        artists={artists}
        label="92,000 artists and a few million ears already here"
      />

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
  const supabase = await createClient();

  const [{ data: promo }, { data: artists }] = await Promise.all([
    getPromoPlaylist(),
    supabase
      .from("profiles")
      .select("id, nickname, avatar_url")
      .not("avatar_url", "is", null)
      .limit(3),
  ]);

  return (
    <div className="flex flex-col gap-24 pb-24 md:gap-42 md:pb-32">
      <Banner artists={artists ?? []} />

      {promo && promo.tracks.length > 0 && (
        <section className="mx-auto w-full max-w-[var(--mh-content-max)]">
          <PromoBanner playlist={promo.playlist} tracks={promo.tracks} />
        </section>
      )}

      <InfoSection />

      <section className="mx-auto w-full max-w-[var(--mh-content-max)]">
        <Shelf title="Discover this week" />
      </section>
    </div>
  );
}
