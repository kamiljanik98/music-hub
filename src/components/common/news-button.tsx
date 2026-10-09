"use client";

import { useState } from "react";
import { CodeXml, X } from "lucide-react";

const updates = [
  {
    id: 1,
    category: "NEW",
    date: "09 OCT",
    title: "Waveform player",
    description: "Clickable audio waveforms make navigating tracks easier.",
  },
];

export function NewsButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-5 right-5 z-50 hidden md:block">
      {isOpen && (
        <section
          aria-label="Music Hub updates and community"
          className="absolute bottom-14 right-0 flex w-[min(440px,calc(100vw-2rem))] flex-col overflow-hidden rounded-xl border border-border bg-background shadow-2xl shadow-black/20"
        >
          <header className="flex items-start justify-between border-b border-border px-6 py-5">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                MUSIC HUB / UPDATES
              </p>
              <h2 className="mt-1 text-xl font-semibold tracking-tight">
                What’s new
              </h2>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close updates"
              className="cursor-pointer rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <X className="size-5" />
            </button>
          </header>

          <div className="max-h-[min(380px,45vh)] overflow-y-auto">
            {updates.map((update, index) => (
              <article
                key={update.id}
                className={`px-6 py-5 ${
                  index !== updates.length - 1 ? "border-b border-border" : ""
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <span
                    className={`text-[10px] font-semibold tracking-[0.12em] ${
                      update.category === "NEW"
                        ? "text-primary"
                        : "text-muted-foreground"
                    }`}
                  >
                    {update.category}
                  </span>

                  <span className="text-[10px] font-medium tracking-wide text-muted-foreground">
                    {update.date}
                  </span>
                </div>

                <h3 className="mt-2 text-sm font-semibold">{update.title}</h3>

                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {update.description}
                </p>
              </article>
            ))}
          </div>

          <div className="border-t border-border px-6 py-5">
            <p className="text-sm font-semibold">Support Music Hub</p>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              Like the project? Help it grow by contributing on GitHub or
              supporting its development on Patreon.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-3">
              <a
                href="https://www.patreon.com/YOUR_USERNAME"
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-w-0 items-center justify-center gap-2 rounded-lg bg-primary px-3 py-3 text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90"
              >
                <span>Support on Patreon</span>
              </a>

              <a
                href="https://github.com/kamiljanik98/music-hub"
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-w-0 items-center justify-between gap-2 rounded-lg border border-border px-5 py-3 text-sm font-bold transition-colors hover:bg-muted"
              >
                <span>GitHub</span>
                <CodeXml className="size-4 shrink-0" />
              </a>
            </div>
          </div>
        </section>
      )}
      <button
        onClick={() => setIsOpen((open) => !open)}
        aria-label={isOpen ? "Close updates" : "Open updates"}
        aria-expanded={isOpen}
        className="flex h-11 items-center gap-2 rounded-full border border-border bg-background px-4 text-sm font-medium text-foreground shadow-lg shadow-black/10 transition-colors hover:bg-muted"
      >
        {isOpen ? (
          <X className="size-4 text-muted-foreground" />
        ) : (
          <span className="size-2 rounded-full bg-primary" />
        )}

        <span>{isOpen ? "Close panel" : "What’s new"}</span>
      </button>
    </div>
  );
}
