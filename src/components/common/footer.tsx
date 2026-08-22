const LINKS = [
  "Legal",
  "Privacy",
  "Cookie Manager",
  "Cookie Policy",
  "About us",
  "Topics",
  "Copyright",
  "Feedback",
];

const Footer = () => {
  return (
    <footer className="mt-10 flex w-full flex-col items-center border-t border-border pt-6 pb-4 text-[11px] text-muted-foreground">
      <nav className="flex flex-wrap items-center justify-center gap-x-3">
        {LINKS.map((label, i) => (
          <span key={label} className="flex items-center gap-x-3">
            <a href="#" className="transition-colors hover:text-primary">
              {label}
            </a>
            {i < LINKS.length - 1 && <span aria-hidden>-</span>}
          </span>
        ))}
      </nav>
      <a href="#" className="mt-2 transition-colors hover:text-primary">
        Language: <span className="text-foreground">English (US)</span>
      </a>
    </footer>
  );
};

export default Footer;
