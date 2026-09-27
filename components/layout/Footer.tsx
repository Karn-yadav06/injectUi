import React from "react";
import Link from "next/link";
import { Code2, Heart, Terminal } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950/60 text-slate-400 text-sm mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-3 md:col-span-2">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                <Code2 className="w-4 h-4" />
              </div>
              <span className="font-bold text-lg text-white">
                Inject<span className="text-indigo-500">UI</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm max-w-sm">
              Modern React & Next.js component library platform. Reusable components with live previews, install commands, and AI agent prompts.
            </p>
            <div className="flex items-center gap-2 text-xs text-indigo-400 bg-indigo-950/40 border border-indigo-900/60 px-3 py-1.5 rounded-lg w-fit">
              <Terminal className="w-3.5 h-3.5" />
              <span>npx inject-ui add &lt;component&gt;</span>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">
              Catalogue
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/components" className="hover:text-white transition-colors">
                  All Components
                </Link>
              </li>
              <li>
                <Link href="/components?category=Inputs" className="hover:text-white transition-colors">
                  Inputs & Forms
                </Link>
              </li>
              <li>
                <Link href="/components?category=Feedback" className="hover:text-white transition-colors">
                  Feedback & Modals
                </Link>
              </li>
              <li>
                <Link href="/components?category=Data" className="hover:text-white transition-colors">
                  Data Tables & Grids
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">
              Platform
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/login" className="hover:text-white transition-colors">
                  Account Sign In
                </Link>
              </li>
              <li>
                <Link href="/#pricing" className="hover:text-white transition-colors">
                  Free vs Premium
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-white transition-colors">
                  Admin Dashboard
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} InjectUI Platform. Build Faster. Ship Better.
          </div>
          <div className="flex items-center gap-1">
            Engineered with Next.js, React, TypeScript, Tailwind & MongoDB
          </div>
        </div>
      </div>
    </footer>
  );
}
