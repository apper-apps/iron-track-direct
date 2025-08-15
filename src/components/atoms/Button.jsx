import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const buttonVariants = {
  default: "bg-primary hover:bg-red-700 text-white",
  secondary: "bg-surface hover:bg-gray-600 text-gray-100",
  success: "bg-success hover:bg-green-600 text-white",
  warning: "bg-warning hover:bg-amber-600 text-white",
  outline: "border border-surface hover:bg-surface text-gray-300",
  ghost: "hover:bg-surface text-gray-300"
};

const buttonSizes = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-6 py-3 text-lg"
};

const Button = forwardRef(({ 
  className, 
  variant = "default", 
  size = "md", 
  children, 
  disabled,
  ...props 
}, ref) => {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 btn-hover disabled:opacity-50 disabled:cursor-not-allowed",
        buttonVariants[variant],
        buttonSizes[size],
        className
      )}
      disabled={disabled}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;