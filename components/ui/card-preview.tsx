"use client";

import React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  footer?: React.ReactNode;
}

export function Card({ title, description, footer, children, className = "", ...props }: CardProps) {
  return (
    <div
      className={`bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm text-left ${className}`}
      {...props}
    >
      {(title || description) && (
        <div className="mb-4">
          {title && <h3 className="text-base font-semibold text-white tracking-tight">{title}</h3>}
          {description && <p className="text-sm text-slate-400 mt-1">{description}</p>}
        </div>
      )}
      <div className="text-slate-300 text-sm">{children}</div>
      {footer && <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-end">{footer}</div>}
    </div>
  );
}
