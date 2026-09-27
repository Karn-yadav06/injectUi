"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Code2,
  Sparkles,
  ArrowRight,
  Terminal,
  Cpu,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Layers,
  Lock,
  Box,
} from "lucide-react";
import { ComponentCard } from "@/components/catalogue/ComponentCard";

export default function HomePage() {
  const [featured, setFeatured] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/components")
      .then((res) => res.json())
      .then((data) => {
        if (data.components) {
          // Show 4-6 featured items
          setFeatured(data.components.slice(0, 6));
        }
      })
      .catch((err) => console.error("Error loading featured components:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* HERO SECTION */}
      <section className="relative pt-20 pb-24 overflow-hidden border-b border-slate-800/60">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(99,102,241,0.18),rgba(255,255,255,0))]" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-8 animate-fade-in">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>React & Next.js Component Ecosystem</span>
          </div>

          {/* Hero text */}
          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight sm:leading-none mb-6">
            Build beautiful interfaces faster with{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-300 to-indigo-500">
              InjectUI.
            </span>
          </h1>

          {/* Description */}
          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
            A reusable React component library with ready-to-use components, documentation and AI integration prompts.
          </p>

          {/* Call to Actions */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/components"
              className="px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all shadow-xl shadow-indigo-600/25 flex items-center gap-2 hover:-translate-y-0.5"
            >
              Explore Components
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/login"
              className="px-6 py-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-200 font-semibold text-sm transition-all"
            >
              Get Started
            </Link>
          </div>

          {/* Terminal snippet */}
          <div className="mt-12 inline-flex items-center gap-3 px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs font-mono text-slate-400 shadow-inner">
            <Terminal className="w-4 h-4 text-indigo-400" />
            <span>npx inject-ui add button</span>
            <span className="text-slate-600">|</span>
            <span className="text-emerald-400">Zero Configuration</span>
          </div>
        </div>
      </section>

      {/* WORKFLOW SECTION */}
      <section id="workflow" className="py-20 border-b border-slate-800/60 bg-slate-950/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-2">
              Modern Developer Workflow
            </h2>
            <p className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Three ways to integrate into your stack
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 relative">
              <div className="w-10 h-10 rounded-xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4">
                <Box className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-white mb-2">1. CLI Installer</h3>
              <p className="text-sm text-slate-400 leading-relaxed mb-4">
                Download components right into your project folder safely without package lock-in or unnecessary runtime overhead.
              </p>
              <code className="text-xs text-indigo-300 font-mono bg-slate-950 px-2 py-1 rounded block border border-slate-800">
                npx inject-ui add button
              </code>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 relative">
              <div className="w-10 h-10 rounded-xl bg-violet-600/10 border border-violet-500/20 flex items-center justify-center text-violet-400 mb-4">
                <Code2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-white mb-2">2. Copy & Paste Code</h3>
              <p className="text-sm text-slate-400 leading-relaxed mb-4">
                Full ownership of your source code. Copy 100% typed React components with Tailwind CSS styling directly to your clipboard.
              </p>
              <span className="text-xs text-emerald-400 font-medium">
                TypeScript Strict Mode & ForwardRef
              </span>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 relative">
              <div className="w-10 h-10 rounded-xl bg-amber-600/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-4">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-white mb-2">3. AI Agent Prompts</h3>
              <p className="text-sm text-slate-400 leading-relaxed mb-4">
                Pre-engineered prompts tailored for AI coding assistants (Claude, Cursor, GitHub Copilot, Gemini) to integrate components seamlessly.
              </p>
              <span className="text-xs text-amber-400 font-medium">
                One-Click AI Prompt Copy
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED COMPONENTS */}
      <section className="py-20 border-b border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-400 mb-2">
                <Layers className="w-4 h-4" />
                Featured Components
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Crafted for high-performance applications
              </h2>
            </div>
            <Link
              href="/components"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-400 hover:text-indigo-300"
            >
              Browse All Components
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="h-44 rounded-2xl bg-slate-900 animate-pulse border border-slate-800" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featured.map((comp) => (
                <ComponentCard key={comp.slug} component={comp} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* FREE VS PREMIUM SECTION */}
      <section id="pricing" className="py-20 bg-slate-950/60">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-2">
              Access Tiers
            </h2>
            <p className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Free vs Premium Tier Comparison
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Free Tier */}
            <div className="p-8 rounded-2xl bg-slate-900/70 border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-4">
                  Free Community
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Essential Components</h3>
                <p className="text-sm text-slate-400 mb-6">
                  Perfect for landing pages, simple forms, and core UI building blocks.
                </p>
                <div className="text-3xl font-bold text-white mb-6">
                  $0 <span className="text-sm font-normal text-slate-500">forever</span>
                </div>
                <ul className="space-y-3 text-sm text-slate-300">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Access to core components (Button, Input, Badge, Alert, Card)</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Live interactive previews without sign-in</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Full source code copy & CLI install</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Ready-to-use AI agent prompts</span>
                  </li>
                </ul>
              </div>
              <Link
                href="/components?access=free"
                className="mt-8 block text-center py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm transition-colors"
              >
                Browse Free Components
              </Link>
            </div>

            {/* Premium Tier */}
            <div className="p-8 rounded-2xl bg-gradient-to-b from-indigo-950/40 to-slate-900 border-2 border-indigo-500/40 relative shadow-2xl flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 mb-4">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  Premium Tier
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Enterprise Components</h3>
                <p className="text-sm text-slate-300 mb-6">
                  Advanced data grids, complex sidebars, modals, tabs, and full application patterns.
                </p>
                <div className="text-3xl font-bold text-white mb-6">
                  Full Access <span className="text-sm font-normal text-slate-400">managed by Admin</span>
                </div>
                <ul className="space-y-3 text-sm text-slate-200">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span>All Free Tier components included</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span>Advanced Data Table with live search & column sorting</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span>Dashboard Sidebar navigation with nested items</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span>Modal dialogs with focus traps & backdrop blur</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span>Interactive Calendar Date Picker & Tabs</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span>Server-enforced security & prompt generation</span>
                  </li>
                </ul>
              </div>
              <Link
                href="/login"
                className="mt-8 block text-center py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all shadow-lg shadow-indigo-600/30"
              >
                Sign In to Access Premium
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
