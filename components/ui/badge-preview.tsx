"use client";

import React from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "danger" | "purple";
  pill?: boolean;
}

export function Badge({ className = "", variant = "default", pill = false, children, ...props }: BadgeProps) {
  const variants = {
    default: "bg-slate-800 text-slate-200 border-slate-700",
    success: "bg-emerald-950/60 text-emerald-400 border-emerald-800/80",
    warning: "bg-amber-950/60 text-amber-400 border-amber-800/80",
    danger: "bg-rose-950/60 text-rose-400 border-rose-800/80",
    purple: "bg-indigo-950/60 text-indigo-400 border-indigo-800/80",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium border ${
        pill ? "rounded-full" : "rounded-md"
      } ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
