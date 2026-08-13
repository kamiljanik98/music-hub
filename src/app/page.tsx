import { Shelf } from "@/components/songs/shelf";
import Link from "next/link";
import { Button } from "@/components/ui/button";

function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function generateWaveform(bars: number, seed = 42) {
  const rand = mulberry32(seed);
  const raw = Array.from({ length: bars }, () => rand());

  const smoothed = raw.map((_, i) => {
    const window = raw.slice(Math.max(0, i - 2), i + 3);
    return window.reduce((a, b) => a + b, 0) / window.length;
  });

  return smoothed.map((v, i) => {
    const edge = Math.min(i, bars - 1 - i) / (bars * 0.15);
    const envelope = Math.min(1, 0.35 + edge);
    return Math.round(16 + v * 70 * envelope);
  });
}

const WAVEFORM = generateWaveform(56);

function Banner() {
  return (
    <section className="px-6 py-20 md:py-28">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 md:flex-row md:items-center md:gap-16">
        <div className="flex-1">
          <h1 className="max-w-xl text-5xl leading-[1.05] font-semibold tracking-tight text-foreground sm:text-6xl">
            Your sound,
            <br />
            out there.
          </h1>
          <p className="mt-6 max-w-md text-sm text-muted-foreground">
            Upload tracks and stems, follow producers you like, and find
            listeners for what you make.
          </p>
          <div className="mt-8 flex items-center gap-3">
            <Button asChild>
              <Link href="/upload">Upload a track</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/search">Browse tracks</Link>
            </Button>
          </div>
        </div>

        <div
          aria-hidden
          className="flex h-32 flex-1 items-end gap-[3px] md:h-40"
        >
          {WAVEFORM.map((h, i) => (
            <span
              key={i}
              style={{
                height: `${h}%`,
                animationDelay: `${((i * 37) % 90) / 100}s`,
                animationDuration: `${1.4 + ((i * 17) % 60) / 100}s`,
              }}
              className="mh-waveform-bar w-full max-w-4 flex-1 origin-bottom rounded-t-sm bg-muted-foreground opacity-40"
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes mh-waveform-pulse {
          0%, 100% { transform: scaleY(0.55); }
          50% { transform: scaleY(1); }
        }
        .mh-waveform-bar {
          animation-name: mh-waveform-pulse;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .mh-waveform-bar { animation: none; }
        }
      `}</style>
    </section>
  );
}

export default async function HomePage() {
  return (
    <div>
      <Banner />
      <section className="mx-auto max-w-6xl px-6 py-10">
        <h2 className="mb-6 text-lg font-semibold text-neutral-100">
          Discover this week
        </h2>
        <Shelf />
      </section>
    </div>
  );
}
