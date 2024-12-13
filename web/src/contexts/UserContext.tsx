import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { useRegisterMutation } from "../api/useRegisterMutation";
import { useLoginMutation } from "../api/useLoginMutation";
import { useQueryClient } from "@tanstack/react-query";

export const AVAILABLE_USERS = [
  {
    id: "1",
    email: "pepa@zlesa.com",
    password: "a",
  },
  {
    id: "2",
    email: "jozin@zbazin.cz",
    password: "a",
  },
];

export type UserContext = {
  user?: {
    id: string;
    accessToken: string;
    fakeId: string;
  };
  changeUser: (email: string) => void;
};

export const userContext = createContext<UserContext | null>(null);

export const UserProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<
    { accessToken: string; id: string; fakeId: string } | undefined
  >(undefined);

  const queryClient = useQueryClient();
  const { mutate: registerUser } = useRegisterMutation();
  const { mutate: loginUser } = useLoginMutation();

  const changeUser = (fakeId: string) => {
    /*
      Simulating register and login so I don't have to implement login/register forms
    */
    const user = AVAILABLE_USERS.find((user) => user.id === fakeId);
    if (user) {
      registerUser(
        {
          email: user.email,
          password: user.password,
        },
        {
          onSettled: () => {
            loginUser(
              {
                email: user.email,
                password: user.password,
              },
              {
                onSuccess: (res) => {
                  queryClient.clear();
                  setUser({
                    accessToken: res.accessToken,
                    id: res.userId,
                    fakeId,
                  });
                },
              },
            );
          },
        },
      );
    }
  };

  useEffect(() => {
    changeUser("1");
  }, []);

  const value: UserContext = {
    user,
    changeUser,
  };

  return <userContext.Provider value={value}>{children}</userContext.Provider>;
};

export const useUserContext = () => {
  const context = useContext(userContext);
  if (!context) throw new Error("UserContext not available");

  return context;
};
