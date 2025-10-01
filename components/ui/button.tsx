import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  size?: "sm" | "md" | "lg" | "icon";
  variant?: "default" | "outline";
  className?: string;
};

export const Button: React.FC<ButtonProps> = ({ size = "md", variant = "default", className = "", children, ...rest }) => {
  const sizeClass =
    size === "lg"
      ? "px-6 py-3 text-base"
      : size === "sm"
      ? "px-2 py-1 text-sm"
      : size === "icon"
      ? "p-2"
      : "px-4 py-2";
  const variantClass = variant === "outline" ? "border border-white/15 bg-transparent" : "";
  return (
    <button className={`${sizeClass} rounded-md ${variantClass} ${className}`.trim()} {...rest}>
      {children}
    </button>
  );
};

export default Button;
