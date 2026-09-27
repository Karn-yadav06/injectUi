"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/context/AuthContext";
import {
  User,
  ShieldCheck,
  Sparkles,
  LogOut,
  Layers,
  CheckCircle2,
  XCircle,
  ArrowRight,
} from "lucide-react";

export default function AccountPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-left">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Customer Account
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Manage your subscription status and authenticated component permissions
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* User Profile Card */}
        <div className="md:col-span-2 space-y-6">
          <div className="p-6 sm:p-8 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
            {/* Account Type and Email */}
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Account Type
                </span>
                <h3 className="text-2xl font-bold text-white mt-1">
                  {user.isAdmin
                    ? "Administrator Account"
                    : user.premium
                    ? "Premium Account"
                    : "Free Account"}
                </h3>
              </div>
              {user.premium || user.isAdmin ? (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  PRO TIER
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
                  FREE TIER
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-800/80">
              <div>
                <span className="text-xs text-slate-500 font-medium uppercase tracking-wider block mb-1">
                  Email
                </span>
                <span className="text-sm font-semibold text-slate-200">
                  {user.email}
                </span>
              </div>
              <div>
                <span className="text-xs text-slate-500 font-medium uppercase tracking-wider block mb-1">
                  Premium Status
                </span>
                {user.premium || user.isAdmin ? (
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                    Premium Access: Active
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-400">
                    <XCircle className="w-4 h-4 text-slate-500" />
                    Premium Access: No
                  </span>
                )}
              </div>
            </div>

            {/* Logout CTA */}
            <div className="pt-6 border-t border-slate-800/80 flex items-center justify-between">
              <button
                onClick={() => logout()}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-rose-950/60 hover:text-rose-300 text-slate-300 text-xs font-semibold border border-slate-700 transition-colors flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>

              <Link
                href="/components"
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors flex items-center gap-1.5"
              >
                Browse Catalogue
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* If free user, show upgrade notice */}
          {!user.premium && !user.isAdmin && (
            <div className="p-6 rounded-2xl bg-indigo-950/20 border border-indigo-900/40 text-left">
              <h4 className="text-sm font-bold text-white mb-1 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                Want access to Premium components?
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Premium access grants immediate unlock to enterprise Data Tables, Modals, Sidebars, and advanced agent integration prompts. An administrator can activate premium on your account.
              </p>
            </div>
          )}
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Quick Shortcuts
            </h4>
            <div className="space-y-2">
              <Link
                href="/components"
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-xs text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-indigo-400" />
                  Component Catalogue
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              {user.isAdmin && (
                <Link
                  href="/admin"
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-amber-950/30 border border-amber-800/50 text-xs text-amber-300 hover:bg-amber-900/40 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-amber-400" />
                    Admin Control Panel
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
