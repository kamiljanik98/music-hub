'use client';

import { FC } from "react";
import { usePlayer} from "@/hooks/audio/usePlayer";
import { MyPlayerContextProvider } from "@/hooks/audio/usePlayer";

type PlayerProviderProps = {
  children: React.ReactNode;
}


export const PlayerProvider: FC<PlayerProviderProps> = ({ children }) => {
  return (
    <MyPlayerContextProvider>
      {children}
    </MyPlayerContextProvider>
  );
};

export default PlayerProvider;
