const Footer = () => {
  return (
    <footer className="mt-16">
      <div className="mx-auto flex w-full max-w-[var(--mh-content-max)] flex-col gap-4 border-t border-border px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-display text-lg tracking-tight text-foreground">
              MUSICHUB
            </span>

            <span className="h-1 w-1 rounded-full bg-muted-foreground/50" />

            <span className="font-mono text-[9px] tracking-[0.2em] text-muted-foreground uppercase">
              SYSTEM / 2026
            </span>
          </div>

          <div className="flex items-center gap-2 font-mono text-[9px] tracking-[0.14em] text-muted-foreground uppercase">
            <span className="size-1.5 rounded-full bg-emerald-500" />
            <span>Operational</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-x-5 gap-y-2 font-mono text-[9px] tracking-wide text-muted-foreground">
          <nav className="flex flex-wrap gap-x-5 gap-y-2">
            <a
              href="/terms"
              className="transition-colors hover:text-foreground"
            >
              Terms
            </a>
            <a
              href="/privacy"
              className="transition-colors hover:text-foreground"
            >
              Privacy
            </a>
            <a
              href="/cookies"
              className="transition-colors hover:text-foreground"
            >
              Cookies
            </a>
            <a
              href="/copyright"
              className="transition-colors hover:text-foreground"
            >
              Copyright
            </a>
            <a
              href="/feedback"
              className="transition-colors hover:text-foreground"
            >
              Feedback
            </a>
          </nav>

          <span className="text-muted-foreground/60">
            © {new Date().getFullYear()} MUSICHUB
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
