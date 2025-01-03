import { ReactNode } from "react";
import { useUserContext } from "../contexts/UserContext";

export type UserGuardProps = {
  children: ReactNode;
  userId: string;
};

export const UserGuard = ({ children, userId }: UserGuardProps) => {
  const userContext = useUserContext();

  if (userContext.user?.id !== userId) return null;

  return children;
};
