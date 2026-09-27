"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, SlidersHorizontal, Sparkles, Layers, RefreshCw, X } from "lucide-react";
import { ComponentCard } from "@/components/catalogue/ComponentCard";

const CATEGORIES = ["All", "Inputs", "Feedback", "Layout", "Data", "Navigation", "General"];
const ACCESS_OPTIONS = [
  { label: "All Access", value: "all" },
  { label: "Free Only", value: "free" },
  { label: "Premium Only", value: "premium" },
];

function CatalogueContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [components, setComponents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "All");
  const [selectedAccess, setSelectedAccess] = useState(searchParams.get("access") || "all");

  const fetchComponents = React.useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.set("search", search.trim());
      if (selectedCategory && selectedCategory !== "All") params.set("category", selectedCategory);
      if (selectedAccess && selectedAccess !== "all") params.set("access", selectedAccess);

      const res = await fetch(`/api/components?${params.toString()}`);
      const data = await res.json();
      if (data.success && data.components) {
        setComponents(data.components);
      } else {
        setComponents([]);
      }
    } catch (err) {
      console.error("Failed to load components:", err);
      setComponents([]);
    } finally {
      setLoading(false);
    }
  }, [search, selectedCategory, selectedAccess]);

  useEffect(() => {
    fetchComponents();
  }, [fetchComponents]);


  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchComponents();
  };

  const clearFilters = () => {
    setSearch("");
    setSelectedCategory("All");
    setSelectedAccess("all");
    router.push("/components");
    // Trigger fetch after reset
    setTimeout(() => {
      fetch("/api/components")
        .then((r) => r.json())
        .then((d) => setComponents(d.components || []));
    }, 50);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-10 text-left">
        <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-2">
          <Layers className="w-4 h-4" />
          Component Catalogue
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Explore Ready-to-Use Components
        </h1>
        <p className="mt-2 text-slate-400 text-sm sm:text-base max-w-2xl">
          Discover modular, accessible, and responsive components crafted for modern Next.js and React web applications.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 mb-8 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Search form */}
          <form onSubmit={handleSearchSubmit} className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search components by name, description, or slug..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-20 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
            />
            {search && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  fetchComponents();
                }}
                className="absolute right-12 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 px-2.5 py-1 text-xs font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 transition-colors"
            >
              Search
            </button>
          </form>

          {/* Access Filter buttons */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-950 border border-slate-800 rounded-xl self-start md:self-auto">
            {ACCESS_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setSelectedAccess(opt.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  selectedAccess === opt.value
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Categories scrollable rail */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar border-t border-slate-800/60">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 mr-2 shrink-0">
            Category:
          </span>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors shrink-0 ${
                selectedCategory === cat
                  ? "bg-slate-800 text-indigo-400 border border-indigo-500/40"
                  : "bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid or States */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-48 rounded-2xl bg-slate-900/60 border border-slate-800 animate-pulse"
            />
          ))}
        </div>
      ) : components.length === 0 ? (
        <div className="text-center py-20 rounded-2xl bg-slate-900/40 border border-slate-800/80 p-8">
          <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center mx-auto mb-4 text-slate-400">
            <SlidersHorizontal className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-1">No components found</h3>
          <p className="text-sm text-slate-400 max-w-sm mx-auto mb-6">
            We couldn&apos;t find any components matching your current search criteria or category filter.
          </p>
          <button
            onClick={clearFilters}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {components.map((comp) => (
            <ComponentCard key={comp.slug} component={comp} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function CataloguePage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-20 text-center text-slate-400">
          Loading component catalogue...
        </div>
      }
    >
      <CatalogueContent />
    </Suspense>
  );
}
