import { type ButtonHTMLAttributes } from "react";
import clsx from "clsx";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "outline" | "ghost";
};

export default function Button({
  variant = "primary",
  className,
  children,
  type = "button",
  onClick,
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(
        "rounded-full px-5 py-2 text-sm font-semibold transition-all duration-300 cursor-pointer",
        {
          "bg-red-500 text-white hover:bg-red-600":
            variant === "primary",

          "border border-red-500 text-red-500 hover:bg-red-500 hover:text-white":
            variant === "outline",

          "bg-transparent text-white hover:bg-white/10":
            variant === "ghost",
        },
        className
      )}
      {...props}
      type={type}
      onClick={onClick}
    >
      {children}
    </button>
  );
}