"use client";

import React from "react";
import { LayoutGrid, BarChart3, Users, Settings } from "lucide-react";

export function DashboardSidebar() {
  return (
    <aside className="w-64 bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between text-left">
      <div className="space-y-6">
        <div className="flex items-center gap-2.5 px-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white shadow-md">
            UI
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white">Inject Studio</h2>
            <p className="text-xs text-slate-400">Enterprise Workspace</p>
          </div>
        </div>

        <nav className="space-y-1">
          <div className="flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium bg-indigo-600/10 text-indigo-400 border border-indigo-500/20">
            <div className="flex items-center gap-2.5">
              <LayoutGrid className="w-4 h-4" />
              <span>Overview</span>
            </div>
          </div>
          <div className="flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-slate-100 hover:bg-slate-800/60">
            <div className="flex items-center gap-2.5">
              <BarChart3 className="w-4 h-4" />
              <span>Pipelines</span>
            </div>
            <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-semibold">
              12
            </span>
          </div>
          <div className="flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-slate-100 hover:bg-slate-800/60">
            <div className="flex items-center gap-2.5">
              <Users className="w-4 h-4" />
              <span>Customers</span>
            </div>
          </div>
          <div className="flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-slate-100 hover:bg-slate-800/60">
            <div className="flex items-center gap-2.5">
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </div>
          </div>
        </nav>
      </div>

      <div className="pt-4 border-t border-slate-800 px-2 flex items-center justify-between text-xs text-slate-400 mt-6">
        <span>v2.4.0</span>
        <span className="text-emerald-400 flex items-center gap-1">● Online</span>
      </div>
    </aside>
  );
}
