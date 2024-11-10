import { createContext, PropsWithChildren, useContext, useState } from "react";

export const AVAILABLE_USERS = [
  {
    id: "1",
    email: "pepa@zleasa.com",
  },
  {
    id: "2",
    email: "jozin@zbazin.cz",
  },
];

export type UserContext = {
  currentUserId: string;
  setCurrentUserId: (id: string) => void;
};

const userContext = createContext<UserContext | null>(null);

export const UserProvider = ({ children }: PropsWithChildren) => {
  const [currentUserId, setCurrentUserId] = useState("1");

  const value: UserContext = {
    currentUserId,
    setCurrentUserId,
  };

  return <userContext.Provider value={value}>{children}</userContext.Provider>;
};

export const useUserContext = () => {
  const context = useContext(userContext);
  if (!context) throw new Error("UserContext not available");

  return context;
};
