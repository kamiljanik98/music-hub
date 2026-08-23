import { Camera, Video, Music2 } from "lucide-react";
import type { SocialLinks as SocialLinksValue } from "@/lib/validations/profile";

type SocialLinksProps = {
  links: SocialLinksValue | null;
};

const platforms = [
  { key: "instagram", label: "Instagram", Icon: Camera },
  { key: "twitch", label: "Twitch", Icon: Video },
  { key: "spotify", label: "Spotify", Icon: Music2 },
] as const;

export const SocialLinks = ({ links }: SocialLinksProps) => {
  if (!links) return null;

  const present = platforms.filter(({ key }) => links[key]?.trim());

  if (!present.length) return null;

  return (
    <ul className="flex items-center gap-3">
      {present.map(({ key, label, Icon }) => (
        <li key={key}>
          <a
            href={links[key]}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="flex size-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:text-foreground"
          >
            <Icon className="size-4" />
          </a>
        </li>
      ))}
    </ul>
  );
};
