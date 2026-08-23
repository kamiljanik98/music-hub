"use client";

import { useState } from "react";

const CLAMP_THRESHOLD = 160;

type ProfileBioProps = {
  bio: string;
};

export const ProfileBio = ({ bio }: ProfileBioProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const isClampable = bio.length > CLAMP_THRESHOLD;

  return (
    <div className="max-w-2xl">
      <p
        className={`whitespace-pre-line text-sm leading-6 text-muted-foreground ${
          isClampable && !isExpanded ? "line-clamp-2" : ""
        }`}
      >
        {bio}
      </p>

      {isClampable && (
        <button
          type="button"
          onClick={() => setIsExpanded((value) => !value)}
          className="mt-3 text-sm font-semibold text-foreground hover:underline"
        >
          {isExpanded ? "Show less" : "Show more"}
        </button>
      )}
    </div>
  );
};
