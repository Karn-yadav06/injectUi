"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Layers,
  CheckCircle2,
  FileEdit,
  Sparkles,
  Users,
  UserCheck,
  PlusCircle,
  ArrowRight,
  TrendingUp,
} from "lucide-react";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalComponents: 0,
    published: 0,
    drafts: 0,
    premiumComponents: 0,
    customers: 0,
    premiumCustomers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.stats) {
          setStats(data.stats);
        }
      })
      .catch((err) => console.error("Error fetching admin stats:", err))
      .finally(() => setLoading(false));
  }, []);

  const cards = [
    {
      title: "Total Components",
      value: stats.totalComponents,
      icon: Layers,
      color: "text-indigo-400",
      bg: "bg-indigo-500/10 border-indigo-500/20",
    },
    {
      title: "Published",
      value: stats.published,
      icon: CheckCircle2,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10 border-emerald-500/20",
    },
    {
      title: "Drafts",
      value: stats.drafts,
      icon: FileEdit,
      color: "text-amber-400",
      bg: "bg-amber-500/10 border-amber-500/20",
    },
    {
      title: "Premium Components",
      value: stats.premiumComponents,
      icon: Sparkles,
      color: "text-purple-400",
      bg: "bg-purple-500/10 border-purple-500/20",
    },
    {
      title: "Customers",
      value: stats.customers,
      icon: Users,
      color: "text-sky-400",
      bg: "bg-sky-500/10 border-sky-500/20",
    },
    {
      title: "Premium Customers",
      value: stats.premiumCustomers,
      icon: UserCheck,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10 border-emerald-500/20",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Admin Overview Dashboard
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Real-time metrics, publishing pipeline, and customer subscription access
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/components"
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs flex items-center gap-2 transition-all shadow-md shadow-indigo-600/20"
          >
            <PlusCircle className="w-4 h-4" />
            Manage Components
          </Link>
          <Link
            href="/admin/customers"
            className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-200 font-medium text-xs flex items-center gap-2 transition-all"
          >
            <Users className="w-4 h-4" />
            Manage Customers
          </Link>
        </div>
      </div>

      {/* 6 Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between shadow-sm"
            >
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  {card.title}
                </p>
                <h3 className="text-3xl font-extrabold text-white mt-1">
                  {loading ? "..." : card.value}
                </h3>
              </div>
              <div
                className={`w-12 h-12 rounded-xl border flex items-center justify-center ${card.bg} ${card.color}`}
              >
                <Icon className="w-6 h-6" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Action Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Layers className="w-4 h-4" />
              Component Catalogue Management
            </div>
            <h3 className="text-lg font-bold text-white mb-2">
              Create, Edit, and Publish Components
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed mb-6">
              Create new component drafts with full source code, prop definitions, and AI prompts. Validate them, publish to make them live instantly on the public catalogue, or unpublish anytime.
            </p>
          </div>
          <Link
            href="/admin/components"
            className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-400 hover:text-indigo-300"
          >
            Go to Component Manager
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Users className="w-4 h-4" />
              Customer Premium Subscriptions
            </div>
            <h3 className="text-lg font-bold text-white mb-2">
              Grant & Revoke Premium Access
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed mb-6">
              Review customer accounts and toggle their premium tier. Access permissions take effect immediately via live database-backed authorization verification.
            </p>
          </div>
          <Link
            href="/admin/customers"
            className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400 hover:text-emerald-300"
          >
            Go to Customer Manager
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
