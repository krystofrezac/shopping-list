import { useContext } from "react";
import { userContext } from "../contexts/UserContext";
import { env } from "../env";

export type FetchFnOptions = {
  query?: Record<string, string | number | boolean>;
  body?: Record<string, unknown>;
};

export const useFetchFn = () => {
  const userCtx = useContext(userContext);

  const fetchFn = (method: string, path: string, options?: FetchFnOptions) => {
    const pathWithoutSlash = path.replace(/^\//, "");

    const query = new URLSearchParams();
    if (options?.query) {
      Object.entries(options.query).forEach(([key, value]) =>
        query.append(key, value.toString()),
      );
    }

    return fetch(
      `${env.VITE_API_URL}/${pathWithoutSlash}?${query.toString()}`,
      {
        method: method,
        ...(options?.body ? { body: JSON.stringify(options?.body) } : {}),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          ...(userCtx?.user
            ? { Authorization: userCtx.user?.accessToken }
            : {}),
        },
      },
    );
  };
  return fetchFn;
};
