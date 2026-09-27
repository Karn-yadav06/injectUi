"use client";

import React from "react";
import { Info, CheckCircle2, AlertTriangle, AlertCircle } from "lucide-react";

export interface AlertProps {
  type?: "info" | "success" | "warning" | "error";
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function Alert({ type = "info", title, children, className = "" }: AlertProps) {
  const configs = {
    info: {
      border: "border-sky-500/20 bg-sky-500/10 text-sky-300",
      icon: <Info className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />,
    },
    success: {
      border: "border-emerald-500/20 bg-emerald-500/10 text-emerald-300",
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />,
    },
    warning: {
      border: "border-amber-500/20 bg-amber-500/10 text-amber-300",
      icon: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />,
    },
    error: {
      border: "border-rose-500/20 bg-rose-500/10 text-rose-300",
      icon: <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />,
    },
  };

  const current = configs[type];

  return (
    <div className={`flex gap-3 p-4 rounded-xl border text-sm text-left ${current.border} ${className}`}>
      {current.icon}
      <div>
        {title && <h4 className="font-semibold text-white mb-0.5">{title}</h4>}
        <div className="opacity-90">{children}</div>
      </div>
    </div>
  );
}
