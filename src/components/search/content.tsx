"use client";

import { useOnPlay } from "@/hooks/player/use-on-play";
import { ProfileSummary, Song } from "@/types";
import { SearchRow } from "@/components/songs/search-row";
import { ProfileRow } from "../social/profile-row";

type ContentProps = {
  songs: Song[];
  users: ProfileSummary[];
  query?: string;
};

export const Content = ({ songs, users, query }: ContentProps) => {
  const onPlay = useOnPlay(songs);

  if (!query?.trim()) {
    return (
      <div className="p-6">
        <h1 className="mb-2 text-lg font-semibold text-foreground">Search</h1>

        <p className="text-sm text-muted-foreground">
          Search tracks, artists, tags
        </p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="mb-4 text-lg font-semibold text-foreground">
        {`Search results for "${query}"`}
      </h1>

      {songs.length === 0 && users.length === 0 ? (
        <p className="text-sm text-muted-foreground">No results found</p>
      ) : (
        <div className="flex flex-col gap-8">
          {users.length > 0 && (
            <section>
              <h2 className="mb-2 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                Artists · {users.length}
              </h2>

              <div className="flex flex-col gap-2.5">
                {users.map((user) => (
                  <ProfileRow key={`user-${user.id}`} user={user} />
                ))}
              </div>
            </section>
          )}

          {songs.length > 0 && (
            <section>
              <h2 className="mb-2 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                Tracks · {songs.length}
              </h2>

              <div className="flex flex-col gap-2.5">
                {songs.map((song) => (
                  <SearchRow
                    key={`song-${song.id}`}
                    song={song}
                    onPlay={onPlay}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
};
