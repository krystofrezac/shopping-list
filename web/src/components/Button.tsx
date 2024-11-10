import classNames from "classnames"

export type ButtonVariant = "basic" | "primary"

export type ButtonProps = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  variant?: ButtonVariant
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: "btn-primary",
  basic: ""
}

export const Button = ({ children, variant = "basic" }: ButtonProps) => {
  return (
    <button
      className={classNames("btn", variantClasses[variant])}
    >
      {children}
    </button>
  )
}
