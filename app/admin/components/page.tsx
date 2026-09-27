"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Layers,
  Plus,
  CheckCircle2,
  FileEdit,
  Trash2,
  Sparkles,
  Eye,
  X,
  Upload,
  Download,
  AlertCircle,
  ExternalLink,
} from "lucide-react";

export default function AdminComponentsPage() {
  const [components, setComponents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingComponent, setEditingComponent] = useState<any | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    category: "Inputs",
    version: "1.0.0",
    access: "free",
    usage: "",
    sourceCode: "",
    dependencies: "lucide-react",
    installCommand: "",
    agentPrompt: "",
    published: false,
    propsString: "[]",
  });

  const fetchComponents = async () => {
    try {
      const res = await fetch("/api/admin/components");
      const data = await res.json();
      if (data.success && data.components) {
        setComponents(data.components);
      }
    } catch (err) {
      console.error("Error loading components:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComponents();
  }, []);

  const openCreateModal = () => {
    setEditingComponent(null);
    setFormData({
      name: "",
      slug: "",
      description: "",
      category: "Inputs",
      version: "1.0.0",
      access: "free",
      usage: `import { Example } from "@/components/ui/example";\n\nexport default function Demo() {\n  return <Example />;\n}`,
      sourceCode: `'use client';\n\nimport React from "react";\n\nexport function Example() {\n  return <div className="p-4 rounded-lg bg-indigo-600 text-white">Interactive Component</div>;\n}`,
      dependencies: "lucide-react",
      installCommand: "",
      agentPrompt: "Add this component to the project with TypeScript support.",
      published: false,
      propsString: "[]",
    });
    setFormError(null);
    setModalOpen(true);
  };

  const openEditModal = (comp: any) => {
    setEditingComponent(comp);
    setFormData({
      name: comp.name,
      slug: comp.slug,
      description: comp.description,
      category: comp.category,
      version: comp.version,
      access: comp.access,
      usage: comp.usage || "",
      sourceCode: comp.sourceCode || "",
      dependencies: Array.isArray(comp.dependencies)
        ? comp.dependencies.join(", ")
        : comp.dependencies || "",
      installCommand: comp.installCommand || "",
      agentPrompt: comp.agentPrompt || "",
      published: comp.published,
      propsString: JSON.stringify(comp.props || [], null, 2),
    });
    setFormError(null);
    setModalOpen(true);
  };

  const handleSlugAutoFill = (nameVal: string) => {
    if (!editingComponent) {
      const generatedSlug = nameVal
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      setFormData((prev) => ({
        ...prev,
        name: nameVal,
        slug: generatedSlug,
        installCommand: `npx inject-ui add ${generatedSlug}`,
      }));
    } else {
      setFormData((prev) => ({ ...prev, name: nameVal }));
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    let parsedProps = [];
    try {
      parsedProps = JSON.parse(formData.propsString || "[]");
    } catch {
      setFormError("Props must be valid JSON array (e.g. [])");
      return;
    }

    const payload = {
      ...formData,
      props: parsedProps,
      dependencies: formData.dependencies
        .split(",")
        .map((d) => d.trim())
        .filter(Boolean),
      installCommand:
        formData.installCommand || `npx inject-ui add ${formData.slug}`,
    };

    try {
      const url = editingComponent
        ? `/api/admin/components/${editingComponent._id}`
        : "/api/admin/components";
      const method = editingComponent ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        if (data.errors && Array.isArray(data.errors)) {
          setFormError(data.errors.map((err: any) => err.message).join(" • "));
        } else {
          setFormError(data.message || "Failed to save component.");
        }
        return;
      }

      setModalOpen(false);
      await fetchComponents();
    } catch {
      setFormError("A network error occurred while saving component.");
    }
  };

  // Publish toggle
  const togglePublish = async (comp: any) => {
    setActionLoading(comp._id);
    try {
      const endpoint = comp.published ? "unpublish" : "publish";
      const res = await fetch(`/api/admin/components/${comp._id}/${endpoint}`, {
        method: "POST",
      });
      const data = await res.json();
      if (data.success) {
        await fetchComponents();
      } else {
        alert(data.message || "Action failed");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading(null);
    }
  };

  // Delete component
  const deleteComponent = async (comp: any) => {
    if (!confirm(`Are you sure you want to delete "${comp.name}"?`)) return;
    setActionLoading(comp._id);
    try {
      const res = await fetch(`/api/admin/components/${comp._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        await fetchComponents();
      } else {
        alert(data.message || "Delete failed");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Component Management
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Author, inspect, update, publish, and delete components in the system
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Create Component
        </button>
      </div>

      {/* Table */}
      <div className="border border-slate-800 bg-slate-900 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-950/70 text-slate-400 border-b border-slate-800 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Component</th>
                <th className="px-5 py-3.5">Category</th>
                <th className="px-5 py-3.5">Access</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5">Version</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-slate-500">
                    Loading components...
                  </td>
                </tr>
              ) : components.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-slate-500">
                    No components found. Click &quot;Create Component&quot; to get started.
                  </td>
                </tr>
              ) : (
                components.map((comp) => (
                  <tr key={comp._id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-5 py-4 font-medium text-white">
                      <div className="flex items-center gap-2">
                        <span>{comp.name}</span>
                        <Link
                          href={`/components/${comp.slug}`}
                          target="_blank"
                          title="Preview in catalogue"
                          className="text-slate-500 hover:text-indigo-400"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                      <div className="text-xs text-slate-500 font-mono">
                        {comp.slug}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-xs">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        {comp.category}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-xs">
                      {comp.access === "premium" ? (
                        <span className="px-2 py-0.5 rounded-full font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1 w-fit">
                          <Sparkles className="w-3 h-3 text-indigo-400" />
                          Premium
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full font-medium bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 w-fit">
                          Free
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-xs">
                      {comp.published ? (
                        <span className="inline-flex items-center gap-1.5 text-emerald-400 font-semibold">
                          <CheckCircle2 className="w-4 h-4" />
                          Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-amber-400 font-semibold">
                          <FileEdit className="w-4 h-4" />
                          Draft
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4 font-mono text-xs text-slate-400">
                      v{comp.version}
                    </td>
                    <td className="px-5 py-4 text-right space-x-2">
                      <button
                        onClick={() => togglePublish(comp)}
                        disabled={actionLoading === comp._id}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                          comp.published
                            ? "bg-slate-800 text-amber-300 hover:bg-slate-700"
                            : "bg-emerald-950/70 text-emerald-300 border border-emerald-800/80 hover:bg-emerald-900/80"
                        }`}
                      >
                        {comp.published ? "Unpublish" : "Publish"}
                      </button>

                      <button
                        onClick={() => openEditModal(comp)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => deleteComponent(comp)}
                        disabled={actionLoading === comp._id}
                        className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-rose-400 hover:bg-rose-950/40 transition-colors"
                        title="Delete component"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE / EDIT MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 my-8 max-h-[90vh] overflow-y-auto text-left">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
              <div>
                <h3 className="text-xl font-bold text-white tracking-tight">
                  {editingComponent ? "Edit Component" : "Create New Component"}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Components will be saved to MongoDB and immediately update catalogue states.
                </p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="mb-6 p-3.5 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Component Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Hero Banner"
                    value={formData.name}
                    onChange={(e) => handleSlugAutoFill(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Slug (URL Identifier) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. hero-banner"
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        slug: e.target.value.toLowerCase().trim(),
                        installCommand: `npx inject-ui add ${e.target.value.toLowerCase().trim()}`,
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Description *
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="Short explanation of what the component does and its use cases..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {["Inputs", "Feedback", "Layout", "Data", "Navigation", "General"].map(
                      (cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      )
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Access Level *
                  </label>
                  <select
                    value={formData.access}
                    onChange={(e) =>
                      setFormData({ ...formData, access: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="free">Free</option>
                    <option value="premium">Premium</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Version *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.version}
                    onChange={(e) =>
                      setFormData({ ...formData, version: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Install Command *
                </label>
                <input
                  type="text"
                  required
                  value={formData.installCommand}
                  onChange={(e) =>
                    setFormData({ ...formData, installCommand: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Dependencies (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. lucide-react, clsx"
                  value={formData.dependencies}
                  onChange={(e) =>
                    setFormData({ ...formData, dependencies: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Source Code (React Component) *
                </label>
                <textarea
                  required
                  rows={6}
                  value={formData.sourceCode}
                  onChange={(e) =>
                    setFormData({ ...formData, sourceCode: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Usage Example *
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.usage}
                  onChange={(e) =>
                    setFormData({ ...formData, usage: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  AI Agent Prompt *
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.agentPrompt}
                  onChange={(e) =>
                    setFormData({ ...formData, agentPrompt: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Props JSON Definition (Array)
                </label>
                <textarea
                  rows={2}
                  value={formData.propsString}
                  onChange={(e) =>
                    setFormData({ ...formData, propsString: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="publishedCheckbox"
                  checked={formData.published}
                  onChange={(e) =>
                    setFormData({ ...formData, published: e.target.checked })
                  }
                  className="w-4 h-4 rounded bg-slate-950 border-slate-800 text-indigo-600 focus:ring-indigo-500"
                />
                <label
                  htmlFor="publishedCheckbox"
                  className="text-xs font-semibold text-slate-200 cursor-pointer"
                >
                  Publish immediately to public catalogue
                </label>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20"
                >
                  {editingComponent ? "Save Changes" : "Create Component"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
