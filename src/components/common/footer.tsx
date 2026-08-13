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
    <footer className="flex w-full flex-col items-center py-4 text-[11px] text-muted-foreground">
      <nav className="flex flex-wrap items-center justify-center gap-x-3">
        {LINKS.map((label, i) => (
          <span key={label} className="flex items-center gap-x-3">
            <a href="#" className="hover:text-foreground hover:underline">
              {label}
            </a>
            {i < LINKS.length - 1 && <span aria-hidden>-</span>}
          </span>
        ))}
      </nav>
      <a href="#" className="mt-2 hover:text-foreground hover:underline">
        Language: <span className="text-foreground">English (US)</span>
      </a>
    </footer>
  );
};

export default Footer;
