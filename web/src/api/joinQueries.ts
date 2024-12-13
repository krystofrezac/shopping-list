type QueryBase<TError> = {
  data: unknown;
  isPending: boolean;
  error: TError;
};

export const joinQueries = <
  TError,
  TQueries extends Record<string, QueryBase<TError>>,
>(
  queries: TQueries,
) => {
  type Data =
    | undefined
    | {
        [queryName in keyof TQueries]: Exclude<
          TQueries[queryName]["data"],
          undefined
        >;
      };

  const queriesEntries = Object.entries(queries);

  const data = queriesEntries.reduce((acc, [queryName, query]) => {
    if (acc === undefined) return undefined;
    if (!query.data) return undefined;

    return { ...acc, [queryName]: query.data };
  }, {} as Data);

  const isPending = queriesEntries.some(
    ([_queryName, query]) => query.isPending,
  );
  const error = queriesEntries.reduce<TError | undefined>(
    (acc, [_queryName, query]) => (query.error ? query.error : acc),
    undefined,
  );

  return { data, isPending, error };
};

export type JoinedQueriesRenderContentData<
  TJoinedQueries extends ReturnType<typeof joinQueries>,
  TDefinedData = Exclude<TJoinedQueries["data"], undefined>,
> = {
  [queryName in keyof TDefinedData]: TDefinedData[queryName];
};
