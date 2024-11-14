export type HeadingProps = {
  children: string;
};

export const H1 = ({ children }: HeadingProps) => (
  <h1 className="text-3xl">{children}</h1>
);
