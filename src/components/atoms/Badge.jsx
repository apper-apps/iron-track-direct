import React from "react";
import { cn } from "@/utils/cn";

const badgeVariants = {
  default: "bg-surface text-gray-300",
  primary: "bg-primary text-white",
  success: "bg-success text-white",
  warning: "bg-warning text-white",
  error: "bg-error text-white",
  pr: "bg-gradient-to-r from-warning to-amber-500 text-white pr-glow"
};

const Badge = ({ className, variant = "default", children, ...props }) => {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-1 text-xs font-medium rounded-md",
        badgeVariants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;