import classNames from "classnames";

export type TextInputProps = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> & {
  label: string;
  error?: string;
};

export const TextInput = ({ label, error, ...rest }: TextInputProps) => {
  return (
    <label className="form-control">
      <div className="label cursor-pointer ">
        <span className="label-text">{label}</span>
      </div>
      <input
        {...rest}
        className={classNames("input input-bordered", { "input-error": error })}
      />
      {error && (
        <div className="label ">
          <span className="label-text-alt text-error">{error}</span>
        </div>
      )}
    </label>
  );
};
