'use client';

import { FC } from "react";
import { MyUserContextProvider } from "../hooks/useUser";

type UserProviderProps = {
  children: React.ReactNode;
}

const UserProvider: FC<UserProviderProps> = ({ children }) => {
  return (
    <MyUserContextProvider>
      {children}
    </MyUserContextProvider>
  )
}

export default UserProvider;