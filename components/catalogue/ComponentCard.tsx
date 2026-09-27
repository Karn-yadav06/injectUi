import React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, Layers, Tag } from "lucide-react";

export interface ComponentCardProps {
  component: {
    _id: string;
    name: string;
    slug: string;
    description: string;
    category: string;
    version: string;
    access: "free" | "premium";
    published?: boolean;
  };
}

export function ComponentCard({ component }: ComponentCardProps) {
  const isPremium = component.access === "premium";

  return (
    <div className="group relative flex flex-col justify-between p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-200">
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700/60 flex items-center gap-1">
              <Layers className="w-3 h-3 text-slate-400" />
              {component.category}
            </span>
            <span className="text-[10px] font-mono text-slate-500 flex items-center gap-0.5">
              <Tag className="w-2.5 h-2.5" />
              v{component.version}
            </span>
          </div>

          {/* Access Badge */}
          {isPremium ? (
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-indigo-400" />
              Premium
            </span>
          ) : (
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              Free
            </span>
          )}
        </div>

        {/* Component Title & Description */}
        <h3 className="text-lg font-semibold text-white group-hover:text-indigo-400 transition-colors tracking-tight">
          {component.name}
        </h3>
        <p className="mt-2 text-sm text-slate-400 line-clamp-2 leading-relaxed">
          {component.description}
        </p>
      </div>

      {/* Action CTA */}
      <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between">
        <span className="text-xs text-slate-500 font-mono">
          components/ui/{component.slug}
        </span>
        <Link
          href={`/components/${component.slug}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400 group-hover:text-indigo-300 group-hover:translate-x-0.5 transition-all"
        >
          View Component
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
