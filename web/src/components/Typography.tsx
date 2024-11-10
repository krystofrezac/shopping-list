export type H1Props = {
  children: string;
};

export const H1 = ({ children }: H1Props) => (
  <h1 className="text-3xl">{children}</h1>
);
