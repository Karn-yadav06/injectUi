"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Sparkles,
  Layers,
  Tag,
  Copy,
  Check,
  Terminal,
  Cpu,
  ArrowLeft,
  Lock,
  Code2,
  Eye,
  AlertCircle,
} from "lucide-react";
import { LivePreviewRenderer } from "@/components/ui/LivePreviewRenderer";
import { CodeViewer } from "@/components/ui/CodeViewer";

export default function ComponentDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const router = useRouter();

  const [component, setComponent] = useState<any | null>(null);
  const [isLocked, setIsLocked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");

  // Copy feedback states
  const [copyCodeStatus, setCopyCodeStatus] = useState<"idle" | "copied" | "error">("idle");
  const [copyInstallStatus, setCopyInstallStatus] = useState<"idle" | "copied" | "error">("idle");
  const [copyPromptStatus, setCopyPromptStatus] = useState<"idle" | "copied" | "error">("idle");
  const [copyErrorMessage, setCopyErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    fetch(`/api/components/${slug}`)
      .then(async (res) => {
        if (res.status === 404) {
          router.push("/components");
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (!data) return;
        if (data.success && data.component) {
          setComponent(data.component);
          setIsLocked(!!data.isLocked);
        }
      })
      .catch((err) => {
        console.error("Error fetching component details:", err);
      })
      .finally(() => setLoading(false));
  }, [slug, router]);

  const copyToClipboard = async (
    text: string,
    setStatus: (status: "idle" | "copied" | "error") => void
  ) => {
    try {
      if (!text) {
        throw new Error("Content is locked or unavailable.");
      }
      await navigator.clipboard.writeText(text);
      setStatus("copied");
      setCopyErrorMessage(null);
      setTimeout(() => setStatus("idle"), 2000);
    } catch (err: any) {
      console.error("Copy failed:", err);
      setStatus("error");
      setCopyErrorMessage(err.message || "Failed to copy to clipboard.");
      setTimeout(() => {
        setStatus("idle");
        setCopyErrorMessage(null);
      }, 3000);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-slate-400">Loading component documentation...</p>
      </div>
    );
  }

  if (!component) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-white mb-2">Component Not Found</h2>
        <p className="text-sm text-slate-400 mb-6">
          This component does not exist or may be unpublished.
        </p>
        <Link
          href="/components"
          className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold"
        >
          Return to Catalogue
        </Link>
      </div>
    );
  }

  const isPremium = component.access === "premium";

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Back to Catalogue */}
      <Link
        href="/components"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-slate-200 mb-8 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to Components
      </Link>

      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-slate-800">
        <div className="text-left space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium px-2.5 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-slate-400" />
              {component.category}
            </span>
            <span className="text-xs font-mono text-slate-500 flex items-center gap-1">
              <Tag className="w-3 h-3" />
              v{component.version}
            </span>
            {isPremium ? (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-indigo-400" />
                Premium
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Free Component
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {component.name}
          </h1>

          <p className="text-base text-slate-400 max-w-3xl leading-relaxed">
            {component.description}
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto">
          {/* Copy Install Command */}
          <button
            onClick={() =>
              copyToClipboard(
                component.installCommand || `npx inject-ui add ${component.slug}`,
                setCopyInstallStatus
              )
            }
            className={`px-3.5 py-2 rounded-xl text-xs font-medium border transition-all flex items-center gap-2 ${
              copyInstallStatus === "copied"
                ? "bg-emerald-950/60 border-emerald-700 text-emerald-400"
                : "bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700"
            }`}
          >
            {copyInstallStatus === "copied" ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Terminal className="w-3.5 h-3.5 text-indigo-400" />
                <span>Copy Install Command</span>
              </>
            )}
          </button>

          {/* Copy AI Prompt */}
          <button
            disabled={isLocked}
            onClick={() =>
              copyToClipboard(component.agentPrompt || "", setCopyPromptStatus)
            }
            className={`px-3.5 py-2 rounded-xl text-xs font-medium border transition-all flex items-center gap-2 ${
              isLocked
                ? "bg-slate-900/50 border-slate-800 text-slate-600 cursor-not-allowed"
                : copyPromptStatus === "copied"
                ? "bg-emerald-950/60 border-emerald-700 text-emerald-400"
                : "bg-indigo-950/40 border-indigo-800/60 text-indigo-300 hover:bg-indigo-900/40"
            }`}
          >
            {copyPromptStatus === "copied" ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Cpu className="w-3.5 h-3.5 text-indigo-400" />
                <span>{isLocked ? "Prompt Locked" : "Copy AI Prompt"}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {copyErrorMessage && (
        <div className="mt-4 p-3 rounded-xl bg-rose-950/50 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{copyErrorMessage}</span>
        </div>
      )}

      {/* TABS: Preview vs Code */}
      <div className="mt-8">
        <div className="flex items-center justify-between border-b border-slate-800 mb-6">
          <div className="flex gap-2 -mb-px">
            <button
              onClick={() => setActiveTab("preview")}
              className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === "preview"
                  ? "border-indigo-500 text-indigo-400"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <Eye className="w-4 h-4" />
              Live Preview
            </button>
            <button
              onClick={() => setActiveTab("code")}
              className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === "code"
                  ? "border-indigo-500 text-indigo-400"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <Code2 className="w-4 h-4" />
              Code & Source
              {isLocked && <Lock className="w-3 h-3 text-amber-400 ml-1" />}
            </button>
          </div>

          {/* Copy Code button */}
          {activeTab === "code" && !isLocked && component.sourceCode && (
            <button
              onClick={() =>
                copyToClipboard(component.sourceCode, setCopyCodeStatus)
              }
              className="mb-2 px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-1.5 transition-colors"
            >
              {copyCodeStatus === "copied" ? (
                <>
                  <Check className="w-3.5 h-3.5 text-white" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Code</span>
                </>
              )}
            </button>
          )}
        </div>

        {/* Tab Content */}
        {activeTab === "preview" ? (
          <div>
            <LivePreviewRenderer
              slug={component.slug}
              isLocked={isLocked}
              componentName={component.name}
            />
          </div>
        ) : (
          <div>
            {isLocked ? (
              <div className="py-16 px-6 rounded-2xl bg-slate-900 border border-slate-800 text-center flex flex-col items-center justify-center">
                <Lock className="w-10 h-10 text-indigo-400 mb-3" />
                <h3 className="text-lg font-bold text-white mb-1">
                  Source Code Protected
                </h3>
                <p className="text-sm text-slate-400 max-w-sm mb-6">
                  Sign in with an authorized premium account to view, copy, and install this component.
                </p>
                <Link
                  href="/login"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-medium text-xs"
                >
                  Sign In to Unlock
                </Link>
              </div>
            ) : (
              <CodeViewer
                code={component.sourceCode || "// No source code available"}
                fileName={`${component.slug}.tsx`}
              />
            )}
          </div>
        )}
      </div>

      {/* USAGE EXAMPLE */}
      {!isLocked && component.usage && (
        <div className="mt-12 text-left">
          <h2 className="text-lg font-bold text-white mb-3 tracking-tight">Usage</h2>
          <CodeViewer code={component.usage} fileName="example.tsx" />
        </div>
      )}

      {/* PROPS DOCUMENTATION */}
      <div className="mt-12 text-left">
        <h2 className="text-lg font-bold text-white mb-3 tracking-tight">
          Props & Configuration
        </h2>
        {component.props && component.props.length > 0 ? (
          <div className="border border-slate-800 rounded-xl overflow-hidden shadow-sm bg-slate-900/60">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3 font-semibold">Prop</th>
                  <th className="px-4 py-3 font-semibold">Type</th>
                  <th className="px-4 py-3 font-semibold">Default</th>
                  <th className="px-4 py-3 font-semibold">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70 text-slate-300">
                {component.props.map((p: any, idx: number) => (
                  <tr key={idx} className="hover:bg-slate-800/30">
                    <td className="px-4 py-3 font-mono font-semibold text-indigo-400">
                      {p.name}
                      {p.required && (
                        <span className="text-rose-400 ml-1 text-xs">*</span>
                      )}
                    </td>
                    <td className="px-4 py-3 font-mono text-slate-400 text-xs">
                      {p.type}
                    </td>
                    <td className="px-4 py-3 font-mono text-slate-500 text-xs">
                      {p.defaultValue || "-"}
                    </td>
                    <td className="px-4 py-3 text-slate-300">
                      {p.description || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-slate-400">No prop definitions available.</p>
        )}
      </div>

      {/* DEPENDENCIES & AI PROMPT DOCUMENTATION */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
        {/* Dependencies */}
        <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
            <Terminal className="w-4 h-4 text-indigo-400" />
            Dependencies
          </h3>
          {component.dependencies && component.dependencies.length > 0 ? (
            <ul className="space-y-2">
              {component.dependencies.map((dep: string) => (
                <li
                  key={dep}
                  className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200"
                >
                  <span>{dep}</span>
                  <span className="text-emerald-400">Required</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-400">
              Zero additional runtime dependencies. Compatible with standard Tailwind CSS.
            </p>
          )}
        </div>

        {/* AI Agent Prompt Box */}
        <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-indigo-400" />
                AI Agent Prompt
              </h3>
              {!isLocked && (
                <button
                  onClick={() =>
                    copyToClipboard(component.agentPrompt, setCopyPromptStatus)
                  }
                  className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium"
                >
                  {copyPromptStatus === "copied" ? "Copied!" : "Copy"}
                </button>
              )}
            </div>
            {isLocked ? (
              <p className="text-sm text-slate-500 italic">
                AI Agent Prompt is protected for premium users.
              </p>
            ) : (
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 max-h-40 overflow-y-auto">
                <pre className="text-xs text-slate-300 font-mono whitespace-pre-wrap leading-relaxed">
                  {component.agentPrompt}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
