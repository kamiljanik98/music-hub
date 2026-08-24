import Image from "next/image";
import type { SocialLinks as SocialLinksValue } from "@/lib/validations/profile";

type SocialLinksProps = {
  links: SocialLinksValue | null;
};

const platforms = [
  { key: "youtube", label: "YouTube", icon: "/youtube-168-svgrepo-com.svg" },
  { key: "instagram", label: "Instagram", icon: "/instagram-svgrepo-com.svg" },
  { key: "tiktok", label: "TikTok", icon: "/tiktok-svgrepo-com.svg" },
  { key: "spotify", label: "Spotify", icon: "/spotify-162-svgrepo-com.svg" },
  {
    key: "soundcloud",
    label: "SoundCloud",
    icon: "/soundcloud-164-svgrepo-com.svg",
  },
] as const;

export const SocialLinks = ({ links }: SocialLinksProps) => {
  if (!links) return null;

  const present = platforms.filter(({ key }) => links[key]?.trim());

  if (!present.length) return null;

  return (
    <ul className="flex items-center gap-3">
      {present.map(({ key, label, icon }) => (
        <li key={key}>
          <a
            href={links[key]}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="flex size-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:text-foreground"
          >
            <Image
              src={icon}
              alt=""
              width={16}
              height={16}
              className="size-4 brightness-0 invert"
            />
          </a>
        </li>
      ))}
    </ul>
  );
};
